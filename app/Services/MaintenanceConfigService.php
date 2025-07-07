<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Artisan;

class MaintenanceConfigService
{
    /**
     * Cache key for maintenance settings
     */
    const CACHE_KEY = 'maintenance_settings';

    /**
     * Cache duration in minutes
     */
    const CACHE_DURATION = 5; // Shorter cache for maintenance mode

    /**
     * Get maintenance mode status from database settings
     * 
     * @return bool
     */
    public function isMaintenanceModeEnabled(): bool
    {
        return Cache::remember(self::CACHE_KEY . '_enabled', self::CACHE_DURATION, function () {
            $setting = Setting::where('key', 'maintenance_mode')->first();
            return $setting ? $setting->value === '1' : false;
        });
    }

    /**
     * Apply maintenance mode configuration
     * 
     * @return void
     */
    public function applyMaintenanceMode(): void
    {
        try {
            $isEnabled = $this->isMaintenanceModeEnabled();
            $isCurrentlyDown = $this->isApplicationDown();

            // If maintenance mode should be enabled but isn't
            if ($isEnabled && !$isCurrentlyDown) {
                $this->enableMaintenanceMode();
            }
            // If maintenance mode should be disabled but is currently enabled
            elseif (!$isEnabled && $isCurrentlyDown) {
                $this->disableMaintenanceMode();
            }
            
        } catch (\Exception $e) {
            \Log::warning('Failed to apply maintenance mode: ' . $e->getMessage());
        }
    }

    /**
     * Enable maintenance mode
     * 
     * @return void
     */
    public function enableMaintenanceMode(): void
    {
        try {
            // Use Laravel's maintenance mode with custom message
            Artisan::call('down', [
                '--message' => 'System is currently under maintenance. Please check back later.',
                '--retry' => 60,
                '--allow' => ['127.0.0.1'], // Allow localhost access
            ]);
            
            \Log::info('Maintenance mode enabled via database setting');
        } catch (\Exception $e) {
            \Log::error('Failed to enable maintenance mode: ' . $e->getMessage());
        }
    }

    /**
     * Disable maintenance mode
     * 
     * @return void
     */
    public function disableMaintenanceMode(): void
    {
        try {
            Artisan::call('up');
            \Log::info('Maintenance mode disabled via database setting');
        } catch (\Exception $e) {
            \Log::error('Failed to disable maintenance mode: ' . $e->getMessage());
        }
    }

    /**
     * Check if application is currently in maintenance mode
     * 
     * @return bool
     */
    public function isApplicationDown(): bool
    {
        return app()->isDownForMaintenance();
    }

    /**
     * Toggle maintenance mode based on database setting
     * 
     * @param bool $enabled
     * @return void
     */
    public function setMaintenanceMode(bool $enabled): void
    {
        // Update database setting
        Setting::updateOrCreate(
            ['key' => 'maintenance_mode'],
            ['value' => $enabled ? '1' : '0']
        );

        // Clear cache to ensure immediate effect
        $this->clearCache();

        // Apply the change
        if ($enabled) {
            $this->enableMaintenanceMode();
        } else {
            $this->disableMaintenanceMode();
        }
    }

    /**
     * Clear maintenance settings cache
     * 
     * @return void
     */
    public function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY . '_enabled');
    }
}
