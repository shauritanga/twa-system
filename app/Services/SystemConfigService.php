<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;

class SystemConfigService
{
    /**
     * Cache key for system settings
     */
    const CACHE_KEY = 'system_settings';

    /**
     * Cache duration in minutes
     */
    const CACHE_DURATION = 60;

    /**
     * Get system timezone from database settings
     * 
     * @return string
     */
    public function getSystemTimezone(): string
    {
        return Cache::remember(self::CACHE_KEY . '_timezone', self::CACHE_DURATION, function () {
            $setting = Setting::where('key', 'system_timezone')->first();
            return $setting ? $setting->value : Config::get('app.timezone', 'UTC');
        });
    }

    /**
     * Get date format from database settings
     * 
     * @return string
     */
    public function getDateFormat(): string
    {
        return Cache::remember(self::CACHE_KEY . '_date_format', self::CACHE_DURATION, function () {
            $setting = Setting::where('key', 'date_format')->first();
            return $setting ? $setting->value : 'Y-m-d';
        });
    }

    /**
     * Get currency symbol from database settings
     * 
     * @return string
     */
    public function getCurrencySymbol(): string
    {
        return Cache::remember(self::CACHE_KEY . '_currency', self::CACHE_DURATION, function () {
            $setting = Setting::where('key', 'currency_symbol')->first();
            return $setting ? $setting->value : 'TZS';
        });
    }

    /**
     * Apply system configuration to Laravel config
     * 
     * @return void
     */
    public function applySystemConfiguration(): void
    {
        try {
            // Apply timezone
            $timezone = $this->getSystemTimezone();
            Config::set('app.timezone', $timezone);
            date_default_timezone_set($timezone);

            // Store other settings for application use
            Config::set('app.date_format', $this->getDateFormat());
            Config::set('app.currency_symbol', $this->getCurrencySymbol());
            
        } catch (\Exception $e) {
            \Log::warning('Failed to apply system configuration: ' . $e->getMessage());
        }
    }

    /**
     * Get all system-related settings
     * 
     * @return array
     */
    public function getAllSystemSettings(): array
    {
        return Cache::remember(self::CACHE_KEY . '_all', self::CACHE_DURATION, function () {
            return [
                'timezone' => $this->getSystemTimezone(),
                'date_format' => $this->getDateFormat(),
                'currency_symbol' => $this->getCurrencySymbol(),
            ];
        });
    }

    /**
     * Clear system settings cache
     * 
     * @return void
     */
    public function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY . '_timezone');
        Cache::forget(self::CACHE_KEY . '_date_format');
        Cache::forget(self::CACHE_KEY . '_currency');
        Cache::forget(self::CACHE_KEY . '_all');
    }
}
