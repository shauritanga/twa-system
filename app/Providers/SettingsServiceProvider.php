<?php

namespace App\Providers;

use App\Services\AuthConfigService;
use App\Services\SessionConfigService;
use App\Services\SystemConfigService;
use App\Services\MaintenanceConfigService;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Config;

class SettingsServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Register configuration services as singletons
        $this->app->singleton(SessionConfigService::class, function ($app) {
            return new SessionConfigService();
        });

        $this->app->singleton(AuthConfigService::class, function ($app) {
            return new AuthConfigService();
        });

        $this->app->singleton(SystemConfigService::class, function ($app) {
            return new SystemConfigService();
        });

        $this->app->singleton(MaintenanceConfigService::class, function ($app) {
            return new MaintenanceConfigService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Apply dynamic configurations during application boot
        $this->applyDynamicConfigurations();
    }

    /**
     * Apply dynamic configurations from database settings
     * 
     * @return void
     */
    protected function applyDynamicConfigurations(): void
    {
        try {
            // Only apply configurations if database is available
            if ($this->isDatabaseAvailable()) {
                $this->applySessionConfiguration();
                $this->applySystemConfiguration();
                $this->applyMaintenanceConfiguration();
            }
        } catch (\Exception $e) {
            // Log error but don't break the application
            \Log::warning('Failed to apply dynamic configurations: ' . $e->getMessage());
        }
    }

    /**
     * Apply session configuration from database
     * 
     * @return void
     */
    protected function applySessionConfiguration(): void
    {
        $sessionService = $this->app->make(SessionConfigService::class);
        $sessionService->applySessionTimeout();
    }

    /**
     * Apply system configuration from database
     * 
     * @return void
     */
    protected function applySystemConfiguration(): void
    {
        $systemService = $this->app->make(SystemConfigService::class);
        $systemService->applySystemConfiguration();
    }

    /**
     * Apply maintenance configuration from database
     * 
     * @return void
     */
    protected function applyMaintenanceConfiguration(): void
    {
        $maintenanceService = $this->app->make(MaintenanceConfigService::class);
        $maintenanceService->applyMaintenanceMode();
    }

    /**
     * Check if database is available
     * 
     * @return bool
     */
    protected function isDatabaseAvailable(): bool
    {
        try {
            \DB::connection()->getPdo();
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }
}
