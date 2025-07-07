<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;

class SessionConfigService
{
    /**
     * Cache key for session settings
     */
    const CACHE_KEY = 'session_settings';

    /**
     * Cache duration in minutes
     */
    const CACHE_DURATION = 60;

    /**
     * Get session timeout in minutes from database settings
     * 
     * @return int Session timeout in minutes
     */
    public function getSessionTimeout(): int
    {
        return Cache::remember(self::CACHE_KEY . '_timeout', self::CACHE_DURATION, function () {
            $setting = Setting::where('key', 'session_timeout_minutes')->first();
            
            if ($setting && is_numeric($setting->value)) {
                $timeout = (int) $setting->value;
                // Validate range (15-1440 minutes)
                if ($timeout >= 15 && $timeout <= 1440) {
                    return $timeout;
                }
            }
            
            // Fallback to config default
            return Config::get('session.lifetime', 120);
        });
    }

    /**
     * Apply session timeout to current session configuration
     * 
     * @return void
     */
    public function applySessionTimeout(): void
    {
        $timeout = $this->getSessionTimeout();
        Config::set('session.lifetime', $timeout);
    }

    /**
     * Clear session settings cache
     * 
     * @return void
     */
    public function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY . '_timeout');
    }

    /**
     * Get all session-related settings
     * 
     * @return array
     */
    public function getAllSessionSettings(): array
    {
        return Cache::remember(self::CACHE_KEY . '_all', self::CACHE_DURATION, function () {
            $settings = Setting::whereIn('key', [
                'session_timeout_minutes',
                'require_email_verification',
                'enable_two_factor_auth'
            ])->get()->keyBy('key');

            return [
                'timeout_minutes' => $this->getSessionTimeout(),
                'require_email_verification' => isset($settings['require_email_verification']) 
                    ? $settings['require_email_verification']->value === '1' 
                    : true,
                'enable_two_factor_auth' => isset($settings['enable_two_factor_auth']) 
                    ? $settings['enable_two_factor_auth']->value === '1' 
                    : false,
            ];
        });
    }

    /**
     * Clear all session-related cache
     * 
     * @return void
     */
    public function clearAllCache(): void
    {
        Cache::forget(self::CACHE_KEY . '_timeout');
        Cache::forget(self::CACHE_KEY . '_all');
    }
}
