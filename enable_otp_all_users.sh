#!/bin/bash

echo "🔒 Enabling OTP for ALL users in production..."

# Step 1: Test email system
echo "📧 Testing email system..."
php artisan tinker --execute="
try {
    use Illuminate\Support\Facades\Mail;
    use App\Mail\OtpMail;
    Mail::to('shauritangaathanas@gmail.com')->send(new OtpMail('TEST123'));
    echo '✅ Email system working';
} catch (Exception \$e) {
    echo '❌ Email error: ' . \$e->getMessage();
    exit(1);
}
"

if [ $? -ne 0 ]; then
    echo "❌ Email system not working. Cannot enable OTP for all users."
    exit 1
fi

# Step 2: Create emergency admin
echo "🆘 Ensuring emergency admin exists..."
php artisan tinker --execute="
use App\Models\{User, Role};
use Illuminate\Support\Facades\Hash;
\$adminRole = Role::where('name', 'admin')->first();
\$emergency = User::firstOrCreate(['email' => 'emergency@tabatawelfare.org'], [
    'name' => 'Emergency Admin',
    'password' => Hash::make('Emergency@2025!'),
    'role_id' => \$adminRole->id,
    'email_verified_at' => now(),
    'otp_enabled' => false
]);
echo 'Emergency admin ready: ' . \$emergency->email;
"

# Step 3: Show impact analysis
echo "📊 Analyzing user impact..."
php artisan tinker --execute="
use App\Models\User;
\$total = User::count();
\$withOtp = User::where('otp_enabled', true)->count();
\$withoutOtp = User::where('otp_enabled', false)->count();
echo 'Total users: ' . \$total . \"\n\";
echo 'Already have OTP: ' . \$withOtp . \"\n\";
echo 'Will get OTP enabled: ' . \$withoutOtp . \"\n\";
"

# Step 4: Confirm action
echo ""
read -p "Enable OTP for ALL users? This will require OTP for every login. (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Step 5: Enable OTP for all users
    echo "🔒 Enabling OTP for all users..."
    php artisan migrate --path=database/migrations/2025_01_25_190000_enable_otp_all_users.php
    
    # Step 6: Clear caches
    echo "🧹 Clearing caches..."
    php artisan cache:clear
    php artisan config:clear
    
    # Step 7: Verify
    echo "🔍 Verifying setup..."
    php artisan tinker --execute="
    use App\Models\{User, Setting};
    use App\Services\AuthConfigService;
    \$auth = new AuthConfigService();
    \$total = User::count();
    \$otpUsers = User::where('otp_enabled', true)->count();
    echo 'System 2FA: ' . (\$auth->isTwoFactorEnabled() ? 'ENABLED' : 'DISABLED') . \"\n\";
    echo 'Users with OTP: ' . \$otpUsers . '/' . \$total . \"\n\";
    echo 'All users require OTP: ' . ((\$otpUsers == \$total && \$auth->isTwoFactorEnabled()) ? 'YES' : 'NO') . \"\n\";
    "
    
    echo ""
    echo "🎉 OTP enabled for ALL users!"
    echo ""
    echo "⚠️  IMPORTANT:"
    echo "- ALL users will now need OTP to login"
    echo "- Emergency admin: emergency@tabatawelfare.org (Password: Emergency@2025!)"
    echo "- Users will receive OTP codes via email"
    echo ""
    echo "🆘 Emergency disable command:"
    echo "php artisan tinker --execute=\"App\\Models\\Setting::where('key', 'enable_two_factor_auth')->update(['value' => '0']);\""
    
else
    echo "❌ Operation cancelled."
fi
