<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Setting;
use App\Models\User;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Enable system-wide 2FA
        Setting::updateOrCreate(
            ['key' => 'enable_two_factor_auth'],
            [
                'value' => '1',
                'description' => 'Enable two-factor authentication system-wide'
            ]
        );

        // Enable OTP for all existing users
        $affectedUsers = User::where('otp_enabled', false)->count();
        User::where('otp_enabled', false)->update(['otp_enabled' => true]);

        // Log the change
        \Log::info('OTP enabled for all users in production', [
            'enabled_at' => now(),
            'affected_users' => $affectedUsers,
            'total_users' => User::count()
        ]);

        echo "✅ OTP enabled for {$affectedUsers} users\n";
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Disable system-wide 2FA
        Setting::where('key', 'enable_two_factor_auth')->update(['value' => '0']);
        
        // Disable OTP for all users
        User::where('otp_enabled', true)->update(['otp_enabled' => false]);

        \Log::info('OTP disabled for all users');
        
        echo "✅ OTP disabled for all users\n";
    }
};
