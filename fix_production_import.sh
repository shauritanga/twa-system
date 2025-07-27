#!/bin/bash

echo "🔧 Fixing Production Import Issues..."

# Step 1: Diagnose current settings
echo "📊 Current PHP Settings:"
php -i | grep -E "(upload_max_filesize|post_max_size|max_execution_time|memory_limit)"

# Step 2: Create .user.ini for shared hosting
echo "📝 Creating .user.ini with increased limits..."
cat > .user.ini << EOF
upload_max_filesize = 50M
post_max_size = 50M
max_execution_time = 300
memory_limit = 512M
max_input_vars = 3000
EOF

# Step 3: Create .htaccess rules for Apache
echo "📝 Updating .htaccess..."
if [ -f .htaccess ]; then
    # Backup existing .htaccess
    cp .htaccess .htaccess.backup
fi

cat >> .htaccess << EOF

# Import file upload limits
php_value upload_max_filesize 50M
php_value post_max_size 50M
php_value max_execution_time 300
php_value memory_limit 512M
php_value max_input_vars 3000
EOF

# Step 4: Fix storage permissions
echo "🔒 Fixing storage permissions..."
chmod -R 775 storage/
chmod -R 775 bootstrap/cache/

# Step 5: Clear caches
echo "🧹 Clearing caches..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Step 6: Test the fix
echo "🧪 Testing import functionality..."
php artisan tinker --execute="
echo 'Testing import system...' . \"\n\";
echo 'Upload max: ' . ini_get('upload_max_filesize') . \"\n\";
echo 'Post max: ' . ini_get('post_max_size') . \"\n\";
echo 'Memory: ' . ini_get('memory_limit') . \"\n\";
echo 'Storage writable: ' . (is_writable(storage_path()) ? 'YES' : 'NO') . \"\n\";
try {
    \Maatwebsite\Excel\Facades\Excel::getReaders();
    echo 'Excel package: WORKING' . \"\n\";
} catch (Exception \$e) {
    echo 'Excel error: ' . \$e->getMessage() . \"\n\";
}
"

echo ""
echo "✅ Production import fix completed!"
echo ""
echo "📋 What was done:"
echo "- Created .user.ini with increased PHP limits"
echo "- Updated .htaccess with upload limits"
echo "- Fixed storage permissions"
echo "- Cleared Laravel caches"
echo ""
echo "🧪 Next steps:"
echo "1. Wait 5-10 minutes for changes to take effect"
echo "2. Try importing a small CSV file"
echo "3. Check storage/logs/laravel.log for any errors"
echo ""
echo "🆘 If still not working:"
echo "- Contact your hosting provider about PHP limits"
echo "- Check web server error logs"
echo "- Verify Laravel Excel package is installed"
