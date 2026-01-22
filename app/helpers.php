<?php

use App\Helpers\SettingsHelper;

if (!function_exists('setting')) {
    /**
     * Get a setting value
     *
     * @param string|null $key
     * @param mixed $default
     * @return mixed
     */
    function setting(?string $key = null, $default = null)
    {
        if ($key === null) {
            return SettingsHelper::all();
        }

        return SettingsHelper::get($key, $default);
    }
}

if (!function_exists('setting_bool')) {
    /**
     * Get a setting value as boolean
     *
     * @param string $key
     * @param bool $default
     * @return bool
     */
    function setting_bool(string $key, bool $default = false): bool
    {
        return SettingsHelper::getBool($key, $default);
    }
}

if (!function_exists('setting_int')) {
    /**
     * Get a setting value as integer
     *
     * @param string $key
     * @param int $default
     * @return int
     */
    function setting_int(string $key, int $default = 0): int
    {
        return SettingsHelper::getInt($key, $default);
    }
}

if (!function_exists('setting_float')) {
    /**
     * Get a setting value as float
     *
     * @param string $key
     * @param float $default
     * @return float
     */
    function setting_float(string $key, float $default = 0.0): float
    {
        return SettingsHelper::getFloat($key, $default);
    }
}
