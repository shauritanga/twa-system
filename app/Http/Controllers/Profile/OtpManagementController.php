<?php

namespace App\Http\Controllers\Profile;

use App\Http\Controllers\Controller;
use App\Services\OtpService;
use App\Services\AuthConfigService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class OtpManagementController extends Controller
{
    public function __construct(
        private OtpService $otpService,
        private AuthConfigService $authConfigService
    ) {}

    /**
     * Enable OTP for the authenticated user.
     */
    public function enable(Request $request): RedirectResponse
    {
        // Check if OTP is enabled system-wide
        if (!$this->authConfigService->isTwoFactorEnabled()) {
            return back()->withErrors([
                'otp' => 'Two-factor authentication is not enabled on this system.',
            ]);
        }

        $request->validate([
            'password' => ['required', 'string'],
        ]);

        $user = Auth::user();

        // Verify current password
        if (!Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['The provided password is incorrect.'],
            ]);
        }

        // Check if OTP is already enabled
        if ($user->hasOtpEnabled()) {
            return back()->withErrors([
                'otp' => 'Two-factor authentication is already enabled for your account.',
            ]);
        }

        // Enable OTP
        $success = $this->otpService->enableOtp($user);

        if (!$success) {
            return back()->withErrors([
                'otp' => 'Failed to enable two-factor authentication. Please try again.',
            ]);
        }

        return back()->with('status', 'Two-factor authentication has been enabled for your account.');
    }

    /**
     * Disable OTP for the authenticated user.
     */
    public function disable(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'string'],
        ]);

        $user = Auth::user();

        // Verify current password
        if (!Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['The provided password is incorrect.'],
            ]);
        }

        // Check if OTP is enabled
        if (!$user->hasOtpEnabled()) {
            return back()->withErrors([
                'otp' => 'Two-factor authentication is not enabled for your account.',
            ]);
        }

        // Disable OTP
        $success = $this->otpService->disableOtp($user);

        if (!$success) {
            return back()->withErrors([
                'otp' => 'Failed to disable two-factor authentication. Please try again.',
            ]);
        }

        return back()->with('status', 'Two-factor authentication has been disabled for your account.');
    }

    /**
     * Test OTP by sending a code to the user's email.
     */
    public function test(Request $request): RedirectResponse
    {
        $user = Auth::user();

        // Check if OTP is enabled for the user
        if (!$user->hasOtpEnabled()) {
            return back()->withErrors([
                'otp' => 'Two-factor authentication is not enabled for your account.',
            ]);
        }

        // Generate and send test OTP
        $success = $this->otpService->generateAndSendOtp(
            $user,
            $request->ip(),
            $request->userAgent()
        );

        if (!$success) {
            return back()->withErrors([
                'otp' => 'Failed to send test verification code. Please try again later.',
            ]);
        }

        return back()->with('status', 'A test verification code has been sent to your email address.');
    }
}
