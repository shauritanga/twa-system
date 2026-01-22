#!/bin/bash

# Deployment script using PHP 8.3 binary (for CLI/Web version mismatch)

echo "🚀 TWA System Deployment with PHP 8.3"
echo "======================================"

# Common PHP 8.3 binary locations
PHP83_PATHS=(
    "/usr/local/bin/php83"
    "/usr/bin/php83"
    "/opt/cpanel/ea-php83/root/usr/bin/php"
    "/usr/local/php83/bin/php"
    "/usr/local/lsws/lsphp83/bin/php"
    "/opt/alt/php83/usr/bin/php"
    "/usr/local/bin/ea-php83"
)

PHP83=""
COMPOSER_PATH="/usr/local/bin/composer"

# Find PHP 8.3 binary
echo "🔍 Looking for PHP 8.3 binary..."
for path in "${PHP83_PATHS[@]}"; do
    if [ -f "$path" ]; then
        VERSION=$($path -v 2>/dev/null | head -n 1)
        if [[ $VERSION == *"8.3"* ]]; then
            PHP83=$path
            echo "✅ Found PHP 8.3: $path"
            break
        fi
    fi
done

if [ -z "$PHP83" ]; then
    echo "❌ PHP 8.3 binary not found!"
    echo "📞 Contact hosting support or run: ./fix-cli-php.sh"
    exit 1
fi

# Find Composer
if [ ! -f "$COMPOSER_PATH" ]; then
    COMPOSER_PATH=$(which composer 2>/dev/null)
    if [ -z "$COMPOSER_PATH" ]; then
        echo "❌ Composer not found!"
        exit 1
    fi
fi

echo "📦 Using Composer: $COMPOSER_PATH"
echo "🐘 Using PHP: $PHP83"

# Check if we're in the right directory
if [ ! -f "composer.json" ]; then
    echo "❌ composer.json not found. Make sure you're in the project root."
    exit 1
fi

# Install PHP dependencies
echo ""
echo "📦 Installing PHP dependencies..."
$PHP83 $COMPOSER_PATH install --optimize-autoloader --no-dev --no-interaction

if [ $? -ne 0 ]; then
    echo "❌ Composer install failed!"
    exit 1
fi

# Generate application key if not exists
echo ""
echo "🔑 Checking application key..."
if ! grep -q "APP_KEY=base64:" .env 2>/dev/null; then
    echo "🔑 Generating application key..."
    $PHP83 artisan key:generate --force
fi

# Set proper permissions
echo ""
echo "🔒 Setting file permissions..."
chmod -R 775 storage
chmod -R 775 bootstrap/cache

# Clear and cache configuration
echo ""
echo "⚡ Optimizing application..."
$PHP83 artisan config:clear
$PHP83 artisan cache:clear
$PHP83 artisan route:clear
$PHP83 artisan view:clear

# Run database migrations
echo ""
echo "🗄️ Running database migrations..."
$PHP83 artisan migrate --force

# Seed default data
echo ""
echo "🌱 Seeding default data..."
$PHP83 artisan db:seed --class=DefaultSettingsSeeder --force
$PHP83 artisan db:seed --class=DefaultAccountsSeeder --force
$PHP83 artisan db:seed --class=RoleSeeder --force
$PHP83 artisan db:seed --class=PermissionSeeder --force

# Create storage link
echo ""
echo "🔗 Creating storage link..."
$PHP83 artisan storage:link

# Cache optimized configuration
echo ""
echo "🚀 Final optimization..."
$PHP83 artisan config:cache
$PHP83 artisan route:cache
$PHP83 artisan view:cache

echo ""
echo "✅ Deployment completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Verify your .env file is configured correctly"
echo "2. Create admin user: $PHP83 artisan db:seed --class=AdminUserSeeder"
echo "3. Test the application in your browser"
echo "4. Configure SSL certificate"
echo ""
echo "💡 For future commands, use: $PHP83 artisan [command]"
echo ""
echo "🎉 Your TWA system is ready!"