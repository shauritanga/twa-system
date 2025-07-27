<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Setting;
use App\Models\User;
use App\Models\Role;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Enable system-wide OTP
        Setting::updateOrCreate(
            ['key' => 'enable_two_factor_auth'],
            [
                'value' => '1',
                'description' => 'Enable two-factor authentication system-wide'
            ]
        );

        // Enable OTP for admin users first
        $adminRole = Role::where('name', 'admin')->first();
        if ($adminRole) {
            User::where('role_id', $adminRole->id)
                ->where('email', '!=', 'emergency@tabatawelfare.org') // Skip emergency admin
                ->update(['otp_enabled' => true]);
        }

        // Create OTP grace period setting (optional - allows gradual rollout)
        Setting::updateOrCreate(
            ['key' => 'otp_grace_period_days'],
            [
                'value' => '7',
                'description' => 'Days to allow login without OTP for existing users'
            ]
        );

        // Log the change
        \Log::info('OTP enabled in production', [
            'enabled_at' => now(),
            'admin_users_affected' => User::where('role_id', $adminRole->id ?? 0)->count()
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Disable system-wide OTP
        Setting::where('key', 'enable_two_factor_auth')->update(['value' => '0']);
        
        // Disable OTP for all users
        User::where('otp_enabled', true)->update(['otp_enabled' => false]);
        
        // Remove grace period setting
        Setting::where('key', 'otp_grace_period_days')->delete();

        \Log::info('OTP disabled in production');
    }
};
