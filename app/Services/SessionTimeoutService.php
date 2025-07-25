<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class SessionTimeoutService
{
    /**
     * Session key for storing last activity timestamp
     */
    const LAST_ACTIVITY_KEY = 'last_activity_timestamp';

    /**
     * Session key for storing timeout warning shown status
     */
    const TIMEOUT_WARNING_SHOWN_KEY = 'timeout_warning_shown';

    /**
     * Get session timeout in minutes from settings
     *
     * @return int
     */
    public function getTimeoutMinutes(): int
    {
        $setting = Setting::where('key', 'session_timeout_minutes')->first();
        return $setting ? (int) $setting->value : 15; // Default 15 minutes
    }

    /**
     * Get session timeout in seconds
     *
     * @return int
     */
    public function getTimeoutSeconds(): int
    {
        return $this->getTimeoutMinutes() * 60;
    }

    /**
     * Update last activity timestamp
     *
     * @return void
     */
    public function updateLastActivity(): void
    {
        Session::put(self::LAST_ACTIVITY_KEY, now()->timestamp);
        Session::forget(self::TIMEOUT_WARNING_SHOWN_KEY);
    }

    /**
     * Get last activity timestamp
     *
     * @return Carbon|null
     */
    public function getLastActivity(): ?Carbon
    {
        $timestamp = Session::get(self::LAST_ACTIVITY_KEY);
        return $timestamp ? Carbon::createFromTimestamp($timestamp) : null;
    }

    /**
     * Check if session has timed out
     *
     * @return bool
     */
    public function hasTimedOut(): bool
    {
        $lastActivity = $this->getLastActivity();
        
        if (!$lastActivity) {
            // No last activity recorded, consider it timed out
            return true;
        }

        $timeoutMinutes = $this->getTimeoutMinutes();
        $timeSinceLastActivity = now()->diffInMinutes($lastActivity);

        return $timeSinceLastActivity >= $timeoutMinutes;
    }

    /**
     * Get remaining time before timeout in seconds
     *
     * @return int
     */
    public function getRemainingSeconds(): int
    {
        $lastActivity = $this->getLastActivity();
        
        if (!$lastActivity) {
            return 0;
        }

        $timeoutSeconds = $this->getTimeoutSeconds();
        $elapsedSeconds = now()->diffInSeconds($lastActivity);
        $remainingSeconds = $timeoutSeconds - $elapsedSeconds;

        return max(0, $remainingSeconds);
    }

    /**
     * Check if user should be warned about upcoming timeout
     * Warning shown when 2 minutes remain
     *
     * @return bool
     */
    public function shouldShowWarning(): bool
    {
        $remainingSeconds = $this->getRemainingSeconds();
        $warningShown = Session::get(self::TIMEOUT_WARNING_SHOWN_KEY, false);
        
        // Show warning when 2 minutes (120 seconds) remain and warning hasn't been shown
        return $remainingSeconds <= 120 && $remainingSeconds > 0 && !$warningShown;
    }

    /**
     * Mark timeout warning as shown
     *
     * @return void
     */
    public function markWarningShown(): void
    {
        Session::put(self::TIMEOUT_WARNING_SHOWN_KEY, true);
    }

    /**
     * Logout user due to session timeout
     *
     * @return void
     */
    public function logoutDueToTimeout(): void
    {
        if (Auth::check()) {
            $user = Auth::user();
            
            // Log timeout activity
            $user->logActivity('session_timeout', 'User logged out due to session timeout', [
                'last_activity' => $this->getLastActivity()?->toDateTimeString(),
                'timeout_minutes' => $this->getTimeoutMinutes(),
            ]);

            Log::info('User session timed out', [
                'user_id' => $user->id,
                'user_email' => $user->email,
                'last_activity' => $this->getLastActivity()?->toDateTimeString(),
                'timeout_minutes' => $this->getTimeoutMinutes(),
            ]);
        }

        // Clear session and logout
        Auth::logout();
        Session::invalidate();
        Session::regenerateToken();
    }

    /**
     * Initialize session timeout for a user
     *
     * @return void
     */
    public function initializeSession(): void
    {
        $this->updateLastActivity();
    }

    /**
     * Get session timeout configuration for frontend
     *
     * @return array
     */
    public function getConfigForFrontend(): array
    {
        return [
            'timeout_minutes' => $this->getTimeoutMinutes(),
            'timeout_seconds' => $this->getTimeoutSeconds(),
            'remaining_seconds' => $this->getRemainingSeconds(),
            'last_activity' => $this->getLastActivity()?->toISOString(),
            'should_show_warning' => $this->shouldShowWarning(),
        ];
    }

    /**
     * Extend session (reset timeout)
     *
     * @return array
     */
    public function extendSession(): array
    {
        $this->updateLastActivity();
        
        return [
            'success' => true,
            'message' => 'Session extended successfully',
            'new_remaining_seconds' => $this->getRemainingSeconds(),
            'timeout_minutes' => $this->getTimeoutMinutes(),
        ];
    }

    /**
     * Check if session timeout is enabled
     *
     * @return bool
     */
    public function isEnabled(): bool
    {
        return $this->getTimeoutMinutes() > 0;
    }

    /**
     * Get human readable time remaining
     *
     * @return string
     */
    public function getHumanReadableTimeRemaining(): string
    {
        $seconds = $this->getRemainingSeconds();
        
        if ($seconds <= 0) {
            return 'Session expired';
        }

        $minutes = floor($seconds / 60);
        $remainingSeconds = $seconds % 60;

        if ($minutes > 0) {
            return $minutes . ' minute' . ($minutes > 1 ? 's' : '') . 
                   ($remainingSeconds > 0 ? ' and ' . $remainingSeconds . ' second' . ($remainingSeconds > 1 ? 's' : '') : '');
        }

        return $remainingSeconds . ' second' . ($remainingSeconds > 1 ? 's' : '');
    }

    /**
     * Clean up expired sessions (for scheduled task)
     *
     * @return int Number of sessions cleaned up
     */
    public function cleanupExpiredSessions(): int
    {
        // This would typically clean up database session records
        // For now, we'll just return 0 as Laravel handles file-based session cleanup
        return 0;
    }
}
