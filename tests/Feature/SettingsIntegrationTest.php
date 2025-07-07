<?php

namespace Tests\Feature;

use App\Models\Setting;
use App\Models\User;
use App\Models\Role;
use App\Services\SessionConfigService;
use App\Services\AuthConfigService;
use App\Services\SystemConfigService;
use App\Services\MaintenanceConfigService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class SettingsIntegrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create admin role and user for testing
        $adminRole = Role::create(['name' => 'admin']);
        $this->adminUser = User::factory()->create([
            'role_id' => $adminRole->id,
            'email' => 'admin@test.com'
        ]);
    }

    /** @test */
    public function session_config_service_retrieves_timeout_from_database()
    {
        // Create a session timeout setting
        Setting::create([
            'key' => 'session_timeout_minutes',
            'value' => '240'
        ]);

        $service = new SessionConfigService();
        $timeout = $service->getSessionTimeout();

        $this->assertEquals(240, $timeout);
    }

    /** @test */
    public function session_config_service_falls_back_to_default_when_no_setting()
    {
        $service = new SessionConfigService();
        $timeout = $service->getSessionTimeout();

        // Should return default config value (120)
        $this->assertEquals(120, $timeout);
    }

    /** @test */
    public function auth_config_service_retrieves_max_attempts_from_database()
    {
        // Create a max login attempts setting
        Setting::create([
            'key' => 'max_login_attempts',
            'value' => '8'
        ]);

        $service = new AuthConfigService();
        $maxAttempts = $service->getMaxLoginAttempts();

        $this->assertEquals(8, $maxAttempts);
    }

    /** @test */
    public function auth_config_service_validates_max_attempts_range()
    {
        // Create an invalid setting (outside 3-10 range)
        Setting::create([
            'key' => 'max_login_attempts',
            'value' => '15'
        ]);

        $service = new AuthConfigService();
        $maxAttempts = $service->getMaxLoginAttempts();

        // Should return default value (5) when outside valid range
        $this->assertEquals(5, $maxAttempts);
    }

    /** @test */
    public function system_config_service_retrieves_timezone_from_database()
    {
        // Clear cache first
        Cache::flush();

        // Create a timezone setting
        Setting::create([
            'key' => 'system_timezone',
            'value' => 'Africa/Dar_es_Salaam'
        ]);

        $service = new SystemConfigService();
        $timezone = $service->getSystemTimezone();

        $this->assertEquals('Africa/Dar_es_Salaam', $timezone);
    }

    /** @test */
    public function maintenance_config_service_detects_maintenance_mode()
    {
        // Clear cache first
        Cache::flush();

        // Create maintenance mode setting
        Setting::create([
            'key' => 'maintenance_mode',
            'value' => '1'
        ]);

        $service = new MaintenanceConfigService();
        $isEnabled = $service->isMaintenanceModeEnabled();

        $this->assertTrue($isEnabled);
    }

    /** @test */
    public function settings_cache_is_cleared_when_updated()
    {
        // Create initial setting
        Setting::create([
            'key' => 'session_timeout_minutes',
            'value' => '120'
        ]);

        $service = new SessionConfigService();
        
        // First call should cache the value
        $timeout1 = $service->getSessionTimeout();
        $this->assertEquals(120, $timeout1);

        // Update the setting directly in database
        Setting::where('key', 'session_timeout_minutes')->update(['value' => '240']);

        // Clear cache manually (simulating what controller does)
        $service->clearCache();

        // Should return new value
        $timeout2 = $service->getSessionTimeout();
        $this->assertEquals(240, $timeout2);
    }

    /** @test */
    public function admin_can_update_settings_via_controller()
    {
        $this->withoutMiddleware();
        $this->actingAs($this->adminUser);

        $response = $this->post(route('admin.settings.update'), [
            'session_timeout_minutes' => 180,
            'max_login_attempts' => 7,
            'system_timezone' => 'Africa/Nairobi',
            'maintenance_mode' => true,
        ]);

        $response->assertRedirect();
        
        // Verify settings were saved to database
        $this->assertDatabaseHas('settings', [
            'key' => 'session_timeout_minutes',
            'value' => '180'
        ]);
        
        $this->assertDatabaseHas('settings', [
            'key' => 'max_login_attempts',
            'value' => '7'
        ]);
        
        $this->assertDatabaseHas('settings', [
            'key' => 'system_timezone',
            'value' => 'Africa/Nairobi'
        ]);
        
        $this->assertDatabaseHas('settings', [
            'key' => 'maintenance_mode',
            'value' => '1'
        ]);
    }
}
