#!/bin/bash

# Production OTP Enablement Script
# Run this script on your production server

echo "🚀 Starting OTP enablement for production..."

# Step 1: Backup database
echo "📦 Creating database backup..."
BACKUP_FILE="backup_before_otp_$(date +%Y%m%d_%H%M%S).sql"
mysqldump -u $DB_USERNAME -p$DB_PASSWORD $DB_DATABASE > $BACKUP_FILE
echo "✅ Database backed up to: $BACKUP_FILE"

# Step 2: Test email system
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
    echo "❌ Email system not working. Aborting OTP enablement."
    exit 1
fi

# Step 3: Create emergency admin
echo "🆘 Creating emergency admin access..."
php artisan tinker --execute="
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;
\$adminRole = Role::where('name', 'admin')->first();
\$emergencyAdmin = User::firstOrCreate(
    ['email' => 'emergency@tabatawelfare.org'],
    [
        'name' => 'Emergency Admin',
        'password' => Hash::make('Emergency@2025!'),
        'role_id' => \$adminRole->id,
        'email_verified_at' => now(),
        'otp_enabled' => false
    ]
);
echo 'Emergency admin ready: ' . \$emergencyAdmin->email;
"

# Step 4: Enable OTP for your admin account first
echo "👤 Enabling OTP for main admin..."
php artisan tinker --execute="
use App\Models\User;
\$user = User::where('email', 'shauritangaathanas@gmail.com')->first();
if (\$user) {
    \$user->enableOtp();
    echo 'OTP enabled for: ' . \$user->email;
} else {
    echo 'Main admin user not found';
}
"

# Step 5: Run the migration to enable system-wide OTP
echo "⚙️ Running OTP enablement migration..."
php artisan migrate --path=database/migrations/2025_01_25_180000_enable_otp_production.php

# Step 6: Clear caches
echo "🧹 Clearing caches..."
php artisan cache:clear
php artisan config:clear

# Step 7: Verify setup
echo "🔍 Verifying OTP setup..."
php artisan tinker --execute="
use App\Models\Setting;
use App\Models\User;
use App\Services\AuthConfigService;
\$authService = new AuthConfigService();
\$user = User::where('email', 'shauritangaathanas@gmail.com')->first();
echo 'System OTP enabled: ' . (\$authService->isTwoFactorEnabled() ? 'YES' : 'NO') . \"\n\";
echo 'Main admin OTP enabled: ' . (\$user && \$user->hasOtpEnabled() ? 'YES' : 'NO') . \"\n\";
echo 'Emergency admin exists: ' . (User::where('email', 'emergency@tabatawelfare.org')->exists() ? 'YES' : 'NO') . \"\n\";
"

echo ""
echo "🎉 OTP enablement completed!"
echo ""
echo "📋 Important Information:"
echo "✅ Database backup: $BACKUP_FILE"
echo "✅ Emergency admin: emergency@tabatawelfare.org (Password: Emergency@2025!)"
echo "✅ Your admin OTP: Enabled"
echo "✅ System-wide OTP: Enabled"
echo ""
echo "⚠️  Next Steps:"
echo "1. Test login with your account (shauritangaathanas@gmail.com)"
echo "2. You should receive OTP via email"
echo "3. If issues occur, use emergency admin to disable OTP"
echo "4. Gradually enable OTP for other users"
echo ""
echo "🔧 Emergency Disable Command:"
echo "php artisan tinker --execute=\"App\\Models\\Setting::where('key', 'enable_two_factor_auth')->update(['value' => '0']);\""
