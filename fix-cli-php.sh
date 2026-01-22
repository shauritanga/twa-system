#!/bin/bash

# Script to fix CLI PHP version mismatch on shared hosting

echo "🔧 Fixing CLI PHP Version Mismatch"
echo "=================================="

echo "📋 Current PHP versions:"
echo "Web PHP: Check via browser phpinfo()"
echo "CLI PHP: $(php -v | head -n 1)"

echo ""
echo "🔍 Looking for PHP 8.3 binary..."

# Common PHP 8.3 binary locations on shared hosting
PHP83_PATHS=(
    "/usr/local/bin/php83"
    "/usr/bin/php83"
    "/opt/cpanel/ea-php83/root/usr/bin/php"
    "/usr/local/php83/bin/php"
    "/usr/local/lsws/lsphp83/bin/php"
    "/opt/alt/php83/usr/bin/php"
    "/usr/local/bin/ea-php83"
)

PHP83_BINARY=""

for path in "${PHP83_PATHS[@]}"; do
    if [ -f "$path" ]; then
        VERSION=$($path -v 2>/dev/null | head -n 1)
        if [[ $VERSION == *"8.3"* ]]; then
            PHP83_BINARY=$path
            echo "✅ Found PHP 8.3: $path"
            echo "   Version: $VERSION"
            break
        fi
    fi
done

if [ -z "$PHP83_BINARY" ]; then
    echo "❌ PHP 8.3 binary not found in common locations"
    echo ""
    echo "🔍 Searching for all PHP binaries..."
    find /usr -name "php*" -type f -executable 2>/dev/null | grep -E "php[0-9]" | head -10
    echo ""
    echo "📞 Contact your hosting provider with this information:"
    echo "   - Web interface shows PHP 8.3 selected"
    echo "   - CLI still shows PHP 8.1.33"
    echo "   - Need CLI PHP 8.3 binary path"
    echo ""
    echo "🔧 Manual solutions to try:"
    echo "1. Add to ~/.bashrc: alias php='/path/to/php83'"
    echo "2. Use full path: /path/to/php83 artisan migrate"
    echo "3. Contact hosting support for CLI PHP upgrade"
    exit 1
fi

echo ""
echo "🚀 Testing PHP 8.3 with Composer..."

# Test if composer works with PHP 8.3
if [ -f "composer.json" ]; then
    echo "📦 Testing composer install with PHP 8.3..."
    $PHP83_BINARY /usr/local/bin/composer --version 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo "✅ Composer works with PHP 8.3!"
        echo ""
        echo "🎯 Ready to deploy! Use these commands:"
        echo ""
        echo "# Install dependencies with PHP 8.3"
        echo "$PHP83_BINARY /usr/local/bin/composer install --optimize-autoloader --no-dev"
        echo ""
        echo "# Run Laravel commands with PHP 8.3"
        echo "$PHP83_BINARY artisan key:generate"
        echo "$PHP83_BINARY artisan migrate --force"
        echo "$PHP83_BINARY artisan db:seed --class=DefaultSettingsSeeder"
        echo ""
        echo "💡 Tip: Create an alias for easier use:"
        echo "echo 'alias php83=\"$PHP83_BINARY\"' >> ~/.bashrc"
        echo "source ~/.bashrc"
        echo "# Then use: php83 artisan migrate"
        
    else
        echo "⚠️ Composer may need adjustment for PHP 8.3"
    fi
else
    echo "⚠️ No composer.json found. Make sure you're in the project directory."
fi

echo ""
echo "📋 Summary:"
echo "- Web PHP: 8.3 (configured in cPanel)"
echo "- CLI PHP: 8.1.33 (needs manual path)"
echo "- PHP 8.3 Binary: $PHP83_BINARY"
echo ""
echo "🎉 You can now deploy using the PHP 8.3 binary path!"