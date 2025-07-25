<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\OtpService;
use App\Services\AuthConfigService;
use App\Services\SessionTimeoutService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class OtpController extends Controller
{
    public function __construct(
        private OtpService $otpService,
        private AuthConfigService $authConfigService,
        private SessionTimeoutService $sessionTimeoutService
    ) {}

    /**
     * Show the OTP challenge form.
     */
    public function challenge(): Response
    {
        // Check if OTP is enabled system-wide
        if (!$this->authConfigService->isTwoFactorEnabled()) {
            return redirect()->route('login');
        }

        // Check if user is in OTP verification state
        if (!Session::has('otp_user_id')) {
            return redirect()->route('login');
        }

        return Inertia::render('Auth/OtpChallenge', [
            'email' => Session::get('otp_user_email'),
            'canResend' => true,
        ]);
    }

    /**
     * Verify the OTP code.
     */
    public function verify(Request $request): RedirectResponse
    {
        $request->validate([
            'code' => ['required', 'string', 'size:6', 'regex:/^[0-9]{6}$/'],
        ]);

        // Check if user is in OTP verification state
        if (!Session::has('otp_user_id')) {
            return redirect()->route('login')->withErrors([
                'code' => 'Session expired. Please login again.',
            ]);
        }

        $userId = Session::get('otp_user_id');
        $user = \App\Models\User::find($userId);

        if (!$user) {
            return redirect()->route('login')->withErrors([
                'code' => 'User not found. Please login again.',
            ]);
        }

        // Verify OTP code
        $isValid = $this->otpService->verifyOtp(
            $user,
            $request->code,
            $request->ip()
        );

        if (!$isValid) {
            return back()->withErrors([
                'code' => 'Invalid or expired verification code. Please try again.',
            ]);
        }

        // Clear OTP session data
        Session::forget(['otp_user_id', 'otp_user_email']);

        // Log the user in
        Auth::login($user, Session::get('remember_user', false));
        Session::forget('remember_user');

        // Update last login
        $user->update(['last_login' => now()]);

        // Initialize session timeout
        $this->sessionTimeoutService->initializeSession();

        // Redirect based on user role
        return $this->redirectBasedOnRole($user);
    }

    /**
     * Resend OTP code.
     */
    public function resend(Request $request): RedirectResponse
    {
        // Check if user is in OTP verification state
        if (!Session::has('otp_user_id')) {
            return redirect()->route('login')->withErrors([
                'code' => 'Session expired. Please login again.',
            ]);
        }

        $userId = Session::get('otp_user_id');
        $user = \App\Models\User::find($userId);

        if (!$user) {
            return redirect()->route('login')->withErrors([
                'code' => 'User not found. Please login again.',
            ]);
        }

        // Generate and send new OTP
        $success = $this->otpService->generateAndSendOtp(
            $user,
            $request->ip(),
            $request->userAgent()
        );

        if (!$success) {
            return back()->withErrors([
                'code' => 'Unable to send verification code. Please try again later or contact support.',
            ]);
        }

        return back()->with('status', 'A new verification code has been sent to your email.');
    }

    /**
     * Redirect user based on their role.
     */
    private function redirectBasedOnRole(\App\Models\User $user): RedirectResponse
    {
        if ($user->role && $user->role->name === 'admin') {
            return redirect()->intended('/admin/dashboard');
        }

        return redirect()->intended('/member/dashboard');
    }
}
