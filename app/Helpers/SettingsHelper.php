<?php

namespace App\Helpers;

use App\Models\Setting;
use Illuminate\Support\Facades\Cache;

class SettingsHelper
{
    /**
     * Get all settings as a key-value array
     */
    public static function all(): array
    {
        return Cache::remember('app_settings', 3600, function () {
            return Setting::all()->pluck('value', 'key')->toArray();
        });
    }

    /**
     * Get a specific setting value
     */
    public static function get(string $key, $default = null)
    {
        $settings = self::all();
        return $settings[$key] ?? $default;
    }

    /**
     * Set a setting value
     */
    public static function set(string $key, $value, ?string $description = null): void
    {
        Setting::updateOrCreate(
            ['key' => $key],
            [
                'value' => $value,
                'description' => $description,
            ]
        );

        // Clear cache
        Cache::forget('app_settings');
    }

    /**
     * Check if a setting exists
     */
    public static function has(string $key): bool
    {
        $settings = self::all();
        return isset($settings[$key]);
    }

    /**
     * Delete a setting
     */
    public static function forget(string $key): void
    {
        Setting::where('key', $key)->delete();
        Cache::forget('app_settings');
    }

    /**
     * Get setting as boolean
     */
    public static function getBool(string $key, bool $default = false): bool
    {
        $value = self::get($key);
        
        if ($value === null) {
            return $default;
        }

        return in_array(strtolower($value), ['1', 'true', 'yes', 'on'], true);
    }

    /**
     * Get setting as integer
     */
    public static function getInt(string $key, int $default = 0): int
    {
        return (int) self::get($key, $default);
    }

    /**
     * Get setting as float
     */
    public static function getFloat(string $key, float $default = 0.0): float
    {
        return (float) self::get($key, $default);
    }

    /**
     * Clear settings cache
     */
    public static function clearCache(): void
    {
        Cache::forget('app_settings');
    }
}
