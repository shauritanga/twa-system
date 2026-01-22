<?php

namespace App\Services;

use App\Helpers\SettingsHelper;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\Rules\Password;

class PasswordConfigService
{
    private const CACHE_KEY = 'password_config';
    private const CACHE_DURATION = 3600; // 1 hour

    /**
     * Get minimum password length
     */
    public function getMinLength(): int
    {
        return Cache::remember(self::CACHE_KEY . '_min_length', self::CACHE_DURATION, function () {
            return SettingsHelper::getInt('password_min_length', 8);
        });
    }

    /**
     * Check if special character is required
     */
    public function requiresSpecialChar(): bool
    {
        return Cache::remember(self::CACHE_KEY . '_special_char', self::CACHE_DURATION, function () {
            return SettingsHelper::getBool('require_password_special_char', true);
        });
    }

    /**
     * Get password validation rules
     */
    public function getValidationRules(): Password
    {
        $rules = Password::min($this->getMinLength())
            ->letters()
            ->numbers()
            ->mixedCase();

        if ($this->requiresSpecialChar()) {
            $rules->symbols();
        }

        return $rules;
    }

    /**
     * Get password requirements as array for display
     */
    public function getRequirements(): array
    {
        return [
            'min_length' => $this->getMinLength(),
            'requires_letters' => true,
            'requires_numbers' => true,
            'requires_mixed_case' => true,
            'requires_special_char' => $this->requiresSpecialChar(),
        ];
    }

    /**
     * Clear cache
     */
    public static function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY . '_min_length');
        Cache::forget(self::CACHE_KEY . '_special_char');
    }
}
