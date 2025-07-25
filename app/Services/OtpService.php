<?php

namespace App\Services;

use App\Models\User;
use App\Models\OtpCode;
use App\Mail\OtpCodeMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Carbon\Carbon;

class OtpService
{
    /**
     * OTP code length
     */
    const OTP_LENGTH = 6;

    /**
     * OTP expiration time in minutes
     */
    const OTP_EXPIRATION_MINUTES = 5;

    /**
     * Maximum OTP generation attempts per user per time window
     */
    const MAX_GENERATION_ATTEMPTS = 3;

    /**
     * Maximum OTP verification attempts per user per time window
     */
    const MAX_VERIFICATION_ATTEMPTS = 5;

    /**
     * Rate limiting time window in minutes
     */
    const RATE_LIMIT_WINDOW = 15;

    /**
     * Generate a new OTP code for the user.
     *
     * @param User $user
     * @param string|null $ipAddress
     * @param string|null $userAgent
     * @return string|null Returns the OTP code or null if rate limited
     */
    public function generateOtp(User $user, ?string $ipAddress = null, ?string $userAgent = null): ?string
    {
        // Check rate limiting for OTP generation
        if ($this->isGenerationRateLimited($user)) {
            Log::warning('OTP generation rate limited', [
                'user_id' => $user->id,
                'ip_address' => $ipAddress,
            ]);
            return null;
        }

        // Invalidate any existing valid OTP codes for this user
        $this->invalidateExistingOtpCodes($user);

        // Generate a new 6-digit OTP code
        $code = $this->generateSecureOtpCode();

        // Create the OTP code record
        $otpCode = OtpCode::create([
            'user_id' => $user->id,
            'code' => $code,
            'expires_at' => now()->addMinutes(self::OTP_EXPIRATION_MINUTES),
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
        ]);

        // Increment generation attempt counter
        $this->incrementGenerationAttempts($user);

        // Log OTP generation
        $user->logActivity('otp_generated', 'OTP code generated', [
            'otp_id' => $otpCode->id,
            'expires_at' => $otpCode->expires_at,
            'ip_address' => $ipAddress,
        ]);

        return $code;
    }

    /**
     * Send OTP code via email.
     *
     * @param User $user
     * @param string $code
     * @return bool
     */
    public function sendOtpViaEmail(User $user, string $code): bool
    {
        try {
            Mail::to($user->email)->send(new OtpCodeMail($user, $code));

            // Log successful email send
            $user->logActivity('otp_email_sent', 'OTP code sent via email', [
                'email' => $user->email,
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send OTP email', [
                'user_id' => $user->id,
                'email' => $user->email,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Generate and send OTP code.
     *
     * @param User $user
     * @param string|null $ipAddress
     * @param string|null $userAgent
     * @return bool
     */
    public function generateAndSendOtp(User $user, ?string $ipAddress = null, ?string $userAgent = null): bool
    {
        $code = $this->generateOtp($user, $ipAddress, $userAgent);

        if (!$code) {
            return false; // Rate limited
        }

        return $this->sendOtpViaEmail($user, $code);
    }

    /**
     * Verify OTP code.
     *
     * @param User $user
     * @param string $code
     * @param string|null $ipAddress
     * @return bool
     */
    public function verifyOtp(User $user, string $code, ?string $ipAddress = null): bool
    {
        // Check rate limiting for OTP verification
        if ($this->isVerificationRateLimited($user)) {
            Log::warning('OTP verification rate limited', [
                'user_id' => $user->id,
                'ip_address' => $ipAddress,
            ]);
            return false;
        }

        // Find valid OTP code
        $otpCode = $user->otpCodes()
                       ->valid()
                       ->where('code', $code)
                       ->first();

        // Increment verification attempt counter
        $this->incrementVerificationAttempts($user);

        if (!$otpCode) {
            // Log failed verification
            $user->logActivity('otp_verification_failed', 'Invalid OTP code provided', [
                'provided_code' => $code,
                'ip_address' => $ipAddress,
            ]);
            return false;
        }

        // Mark OTP as used
        $otpCode->markAsUsed();

        // Update user's OTP verification timestamp
        $user->update(['otp_verified_at' => now()]);

        // Clear rate limiting counters
        $this->clearRateLimitCounters($user);

        // Log successful verification
        $user->logActivity('otp_verification_success', 'OTP code verified successfully', [
            'otp_id' => $otpCode->id,
            'ip_address' => $ipAddress,
        ]);

        return true;
    }

    /**
     * Enable OTP for a user.
     *
     * @param User $user
     * @return bool
     */
    public function enableOtp(User $user): bool
    {
        try {
            $user->enableOtp();

            $user->logActivity('otp_enabled', 'Two-factor authentication enabled');

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to enable OTP', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Disable OTP for a user.
     *
     * @param User $user
     * @return bool
     */
    public function disableOtp(User $user): bool
    {
        try {
            $user->disableOtp();

            $user->logActivity('otp_disabled', 'Two-factor authentication disabled');

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to disable OTP', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Generate a secure OTP code.
     *
     * @return string
     */
    private function generateSecureOtpCode(): string
    {
        // Generate a cryptographically secure random number
        $code = '';
        for ($i = 0; $i < self::OTP_LENGTH; $i++) {
            $code .= random_int(0, 9);
        }

        return $code;
    }

    /**
     * Invalidate existing valid OTP codes for a user.
     *
     * @param User $user
     * @return void
     */
    private function invalidateExistingOtpCodes(User $user): void
    {
        $user->otpCodes()
             ->valid()
             ->update(['used_at' => now()]);
    }

    /**
     * Check if OTP generation is rate limited for a user.
     *
     * @param User $user
     * @return bool
     */
    private function isGenerationRateLimited(User $user): bool
    {
        $key = "otp_generation_attempts:{$user->id}";
        $attempts = Cache::get($key, 0);

        return $attempts >= self::MAX_GENERATION_ATTEMPTS;
    }

    /**
     * Check if OTP verification is rate limited for a user.
     *
     * @param User $user
     * @return bool
     */
    private function isVerificationRateLimited(User $user): bool
    {
        $key = "otp_verification_attempts:{$user->id}";
        $attempts = Cache::get($key, 0);

        return $attempts >= self::MAX_VERIFICATION_ATTEMPTS;
    }

    /**
     * Increment OTP generation attempts counter.
     *
     * @param User $user
     * @return void
     */
    private function incrementGenerationAttempts(User $user): void
    {
        $key = "otp_generation_attempts:{$user->id}";
        $attempts = Cache::get($key, 0) + 1;
        Cache::put($key, $attempts, now()->addMinutes(self::RATE_LIMIT_WINDOW));
    }

    /**
     * Increment OTP verification attempts counter.
     *
     * @param User $user
     * @return void
     */
    private function incrementVerificationAttempts(User $user): void
    {
        $key = "otp_verification_attempts:{$user->id}";
        $attempts = Cache::get($key, 0) + 1;
        Cache::put($key, $attempts, now()->addMinutes(self::RATE_LIMIT_WINDOW));
    }

    /**
     * Clear rate limiting counters for a user.
     *
     * @param User $user
     * @return void
     */
    private function clearRateLimitCounters(User $user): void
    {
        Cache::forget("otp_generation_attempts:{$user->id}");
        Cache::forget("otp_verification_attempts:{$user->id}");
    }

    /**
     * Clean up expired OTP codes.
     *
     * @return int Number of deleted codes
     */
    public function cleanupExpiredCodes(): int
    {
        return OtpCode::expired()->delete();
    }

    /**
     * Get OTP statistics.
     *
     * @return array
     */
    public function getStatistics(): array
    {
        return [
            'total_users_with_otp' => User::where('otp_enabled', true)->count(),
            'total_otp_codes_generated' => OtpCode::count(),
            'total_otp_codes_used' => OtpCode::used()->count(),
            'total_otp_codes_expired' => OtpCode::expired()->count(),
            'total_valid_otp_codes' => OtpCode::valid()->count(),
        ];
    }
}
