#!/bin/bash

# Script to restore original composer.json and clean up PHP 8.1 attempt

echo "🔄 Restoring Original Configuration"
echo "=================================="

# Restore original composer.json if backup exists
if [ -f "composer.json.backup" ]; then
    echo "📦 Restoring original composer.json..."
    cp composer.json.backup composer.json
    rm composer.json.backup
    echo "✅ Original composer.json restored"
else
    echo "⚠️  No backup found, using git to restore..."
    git checkout composer.json
fi

# Remove composer.lock to allow fresh install
if [ -f "composer.lock" ]; then
    echo "🗑️ Removing composer.lock..."
    rm composer.lock
fi

# Clean vendor directory
if [ -d "vendor" ]; then
    echo "🧹 Cleaning vendor directory..."
    rm -rf vendor
fi

echo ""
echo "✅ Cleanup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Upgrade your server to PHP 8.2+ (see UPGRADE_PHP_GUIDE.md)"
echo "2. Run: composer install --optimize-autoloader --no-dev"
echo "3. Continue with normal deployment"
echo ""
echo "🎯 Your system is ready for PHP 8.2+ deployment!"