<?php

namespace App\Services;

use App\Helpers\SettingsHelper;
use Illuminate\Support\Facades\Cache;

class OrganizationConfigService
{
    private const CACHE_KEY = 'organization_config';
    private const CACHE_DURATION = 3600; // 1 hour

    /**
     * Get organization name
     */
    public function getName(): string
    {
        return Cache::remember(self::CACHE_KEY . '_name', self::CACHE_DURATION, function () {
            return SettingsHelper::get('organization_name', 'TWAOR');
        });
    }

    /**
     * Get organization email
     */
    public function getEmail(): ?string
    {
        return Cache::remember(self::CACHE_KEY . '_email', self::CACHE_DURATION, function () {
            return SettingsHelper::get('organization_email');
        });
    }

    /**
     * Get organization phone
     */
    public function getPhone(): ?string
    {
        return Cache::remember(self::CACHE_KEY . '_phone', self::CACHE_DURATION, function () {
            return SettingsHelper::get('organization_phone');
        });
    }

    /**
     * Get organization address
     */
    public function getAddress(): ?string
    {
        return Cache::remember(self::CACHE_KEY . '_address', self::CACHE_DURATION, function () {
            return SettingsHelper::get('organization_address');
        });
    }

    /**
     * Get all organization info
     */
    public function getAll(): array
    {
        return [
            'name' => $this->getName(),
            'email' => $this->getEmail(),
            'phone' => $this->getPhone(),
            'address' => $this->getAddress(),
        ];
    }

    /**
     * Clear cache
     */
    public static function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY . '_name');
        Cache::forget(self::CACHE_KEY . '_email');
        Cache::forget(self::CACHE_KEY . '_phone');
        Cache::forget(self::CACHE_KEY . '_address');
    }
}
