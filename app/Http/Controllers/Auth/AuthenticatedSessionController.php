<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\AuthConfigService;
use App\Services\OtpService;
use App\Services\SessionTimeoutService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    public function __construct(
        private AuthConfigService $authConfigService,
        private OtpService $otpService,
        private SessionTimeoutService $sessionTimeoutService
    ) {}
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        // First, validate credentials without logging in
        $credentials = $request->only('email', 'password');

        if (!Auth::attempt($credentials, false)) {
            return back()->withErrors([
                'email' => 'The provided credentials do not match our records.',
            ]);
        }

        $user = Auth::user();

        // Log out immediately - we'll log in again after OTP verification
        Auth::logout();

        // Check if OTP is enabled system-wide and for this user
        if ($this->authConfigService->isTwoFactorEnabled() && $user->hasOtpEnabled()) {
            // Generate and send OTP
            $otpSent = $this->otpService->generateAndSendOtp(
                $user,
                $request->ip(),
                $request->userAgent()
            );

            if (!$otpSent) {
                return back()->withErrors([
                    'email' => 'Unable to send verification code. Please try again later.',
                ]);
            }

            // Store user info in session for OTP verification
            Session::put([
                'otp_user_id' => $user->id,
                'otp_user_email' => $user->email,
                'remember_user' => $request->boolean('remember'),
            ]);

            // Redirect to OTP challenge
            return redirect()->route('otp.challenge');
        }

        // If OTP is not required, proceed with normal login
        Auth::login($user, $request->boolean('remember'));
        $request->session()->regenerate();

        // Update last login timestamp
        $user->update(['last_login' => now()]);

        // Initialize session timeout
        $this->sessionTimeoutService->initializeSession();

        // Log login activity
        $user->logActivity('login', 'User logged in successfully');

        return $this->redirectBasedOnRole($user);
    }

    /**
     * Redirect user based on their role.
     */
    private function redirectBasedOnRole(\App\Models\User $user): RedirectResponse
    {
        if ($user->role && $user->role->name === 'admin') {
            return redirect()->intended(route('admin.dashboard', absolute: false));
        }

        return redirect()->intended(route('member.dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        // Log logout activity before logging out
        if (Auth::check()) {
            Auth::user()->logActivity('logout', 'User logged out');
        }

        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        // Redirect to main website homepage with success message
        // Use the named route to ensure proper redirect
        return redirect()->route('marketing.index')->with('status', 'You have been successfully logged out.');
    }
}
