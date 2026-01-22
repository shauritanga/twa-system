#!/bin/bash

# Deployment script for PHP 8.1 servers
# This script handles the PHP version compatibility issue

echo "🚀 Starting TWA System Deployment for PHP 8.1"
echo "=============================================="

# Check PHP version
PHP_VERSION=$(php -r "echo PHP_VERSION;")
echo "📋 Detected PHP version: $PHP_VERSION"

if [[ "$PHP_VERSION" < "8.1" ]]; then
    echo "❌ Error: PHP 8.1 or higher is required. Current version: $PHP_VERSION"
    echo "Please contact your hosting provider to upgrade PHP."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "composer.json" ]; then
    echo "❌ Error: composer.json not found. Make sure you're in the project root."
    exit 1
fi

# Backup original composer.json
echo "💾 Backing up original composer.json..."
cp composer.json composer.json.backup

# Use PHP 8.1 compatible composer.json
echo "🔄 Using PHP 8.1 compatible dependencies..."
cp composer.php81.json composer.json

# Remove composer.lock to allow fresh dependency resolution
if [ -f "composer.lock" ]; then
    echo "🗑️ Removing composer.lock for fresh dependency resolution..."
    rm composer.lock
fi

# Install PHP dependencies with PHP 8.1 compatible versions
echo "📦 Installing PHP dependencies (PHP 8.1 compatible)..."
composer install --optimize-autoloader --no-dev --no-interaction

# Check if installation was successful
if [ $? -ne 0 ]; then
    echo "❌ Composer install failed. Restoring original composer.json..."
    cp composer.json.backup composer.json
    exit 1
fi

# Generate application key if not exists
if ! grep -q "APP_KEY=base64:" .env 2>/dev/null; then
    echo "🔑 Generating application key..."
    php artisan key:generate --force
fi

# Set proper permissions
echo "🔒 Setting file permissions..."
chmod -R 775 storage
chmod -R 775 bootstrap/cache

# Clear and cache configuration
echo "⚡ Optimizing application..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Run database migrations
echo "🗄️ Running database migrations..."
php artisan migrate --force

# Seed default data
echo "🌱 Seeding default data..."
php artisan db:seed --class=DefaultSettingsSeeder --force
php artisan db:seed --class=DefaultAccountsSeeder --force
php artisan db:seed --class=RoleSeeder --force
php artisan db:seed --class=PermissionSeeder --force

# Create storage link
echo "🔗 Creating storage link..."
php artisan storage:link

# Cache optimized configuration
echo "🚀 Final optimization..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo ""
echo "✅ Deployment completed successfully!"
echo "📋 Next steps:"
echo "   1. Verify your .env file is configured correctly"
echo "   2. Create admin user: php artisan db:seed --class=AdminUserSeeder"
echo "   3. Test the application in your browser"
echo "   4. Configure SSL certificate"
echo ""
echo "⚠️  Note: This deployment uses Laravel 10.x (compatible with PHP 8.1)"
echo "🎉 Your TWA system is ready!"