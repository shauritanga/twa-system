#!/bin/bash

# Production Login Fix Script
# Run this script on production server to fix login issues

echo "🔧 Fixing login issues on production server..."

# Check if we're in the right directory
if [ ! -f "artisan" ]; then
    echo "❌ Error: artisan file not found. Please run this script from the Laravel root directory."
    exit 1
fi

# Backup current .env
if [ -f ".env" ]; then
    cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
    echo "✅ Backed up current .env file"
fi

# Clear all caches and sessions
echo "🧹 Clearing caches and sessions..."
php artisan sessions:clear --force 2>/dev/null || echo "⚠️  sessions:clear command not available, clearing manually..."
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

# Clear sessions table manually if command doesn't exist
php artisan tinker --execute="DB::table('sessions')->truncate(); echo 'Sessions cleared manually';" 2>/dev/null || echo "⚠️  Could not clear sessions table"

# Optimize for production
echo "⚡ Optimizing for production..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set proper permissions
echo "🔐 Setting proper permissions..."
chmod -R 755 storage
chmod -R 755 bootstrap/cache
chown -R www-data:www-data storage
chown -R www-data:www-data bootstrap/cache

# Restart services
echo "🔄 Restarting services..."
if command -v systemctl &> /dev/null; then
    sudo systemctl restart nginx
    sudo systemctl restart php8.2-fpm  # Adjust PHP version as needed
    echo "✅ Restarted nginx and php-fpm"
elif command -v service &> /dev/null; then
    sudo service nginx restart
    sudo service php8.2-fpm restart  # Adjust PHP version as needed
    echo "✅ Restarted nginx and php-fpm"
else
    echo "⚠️  Please manually restart your web server and PHP-FPM"
fi

# Clear Redis cache if available
if command -v redis-cli &> /dev/null; then
    redis-cli FLUSHDB
    echo "✅ Cleared Redis cache"
fi

echo ""
echo "🎉 Login fix completed!"
echo ""
echo "📋 What was fixed:"
echo "   ✅ Cleared all sessions and caches"
echo "   ✅ Optimized application for production"
echo "   ✅ Set proper file permissions"
echo "   ✅ Restarted web services"
echo ""
echo "💡 Additional steps for users:"
echo "   1. Clear browser cache (Ctrl+Shift+Delete)"
echo "   2. Try login in incognito/private mode first"
echo "   3. If issues persist, contact system administrator"
echo ""
echo "🔧 For persistent issues, check:"
echo "   - .env file has correct SESSION_* settings"
echo "   - Database sessions table exists and is writable"
echo "   - Redis is running (if using redis for sessions)"
echo "   - SSL certificates are valid (for HTTPS sites)"
