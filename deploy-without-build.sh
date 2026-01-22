#!/bin/bash

# Deployment script for cPanel without building assets
# Run this on your server after uploading files

echo "🚀 Starting TWA System Deployment (No Build Required)"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "composer.json" ]; then
    echo "❌ Error: composer.json not found. Make sure you're in the project root."
    exit 1
fi

# Install PHP dependencies only
echo "📦 Installing PHP dependencies..."
composer install --optimize-autoloader --no-dev --no-interaction

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
echo "🎉 Your TWA system is ready!"