<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Cache;

class AuthConfigService
{
    /**
     * Cache key for auth settings
     */
    const CACHE_KEY = 'auth_settings';

    /**
     * Cache duration in minutes
     */
    const CACHE_DURATION = 60;

    /**
     * Get max login attempts from database settings
     * 
     * @return int Max login attempts
     */
    public function getMaxLoginAttempts(): int
    {
        return Cache::remember(self::CACHE_KEY . '_max_attempts', self::CACHE_DURATION, function () {
            $setting = Setting::where('key', 'max_login_attempts')->first();
            
            if ($setting && is_numeric($setting->value)) {
                $attempts = (int) $setting->value;
                // Validate range (3-10 attempts)
                if ($attempts >= 3 && $attempts <= 10) {
                    return $attempts;
                }
            }
            
            // Fallback to default
            return 5;
        });
    }

    /**
     * Get email verification requirement setting
     * 
     * @return bool
     */
    public function requireEmailVerification(): bool
    {
        return Cache::remember(self::CACHE_KEY . '_email_verification', self::CACHE_DURATION, function () {
            $setting = Setting::where('key', 'require_email_verification')->first();
            return $setting ? $setting->value === '1' : true;
        });
    }

    /**
     * Get two-factor authentication setting
     * 
     * @return bool
     */
    public function isTwoFactorEnabled(): bool
    {
        return Cache::remember(self::CACHE_KEY . '_two_factor', self::CACHE_DURATION, function () {
            $setting = Setting::where('key', 'enable_two_factor_auth')->first();
            return $setting ? $setting->value === '1' : false;
        });
    }

    /**
     * Get admin assignment permission setting
     * 
     * @return bool
     */
    public function allowAdminAssignment(): bool
    {
        return Cache::remember(self::CACHE_KEY . '_admin_assignment', self::CACHE_DURATION, function () {
            $setting = Setting::where('key', 'allow_admin_assignment')->first();
            return $setting ? $setting->value === '1' : true;
        });
    }

    /**
     * Get all authentication-related settings
     * 
     * @return array
     */
    public function getAllAuthSettings(): array
    {
        return Cache::remember(self::CACHE_KEY . '_all', self::CACHE_DURATION, function () {
            return [
                'max_login_attempts' => $this->getMaxLoginAttempts(),
                'require_email_verification' => $this->requireEmailVerification(),
                'enable_two_factor_auth' => $this->isTwoFactorEnabled(),
                'allow_admin_assignment' => $this->allowAdminAssignment(),
            ];
        });
    }

    /**
     * Clear authentication settings cache
     * 
     * @return void
     */
    public function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY . '_max_attempts');
        Cache::forget(self::CACHE_KEY . '_email_verification');
        Cache::forget(self::CACHE_KEY . '_two_factor');
        Cache::forget(self::CACHE_KEY . '_admin_assignment');
        Cache::forget(self::CACHE_KEY . '_all');
    }
}
