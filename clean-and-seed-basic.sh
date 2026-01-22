#!/bin/bash

# Script to clean database and seed only essential data (roles and admin user)

echo "🧹 Clean Database and Seed Basic Data"
echo "====================================="

# Find PHP 8.3 binary
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
for path in "${PHP83_PATHS[@]}"; do
    if [ -f "$path" ]; then
        VERSION=$($path -v 2>/dev/null | head -n 1)
        if [[ $VERSION == *"8.3"* ]]; then
            PHP83=$path
            break
        fi
    fi
done

if [ -z "$PHP83" ]; then
    PHP83="php"
fi

echo "🐘 Using PHP: $PHP83"

# Warning message
echo ""
echo "⚠️  WARNING: This will delete ALL data in your database!"
echo "This includes:"
echo "- All members"
echo "- All contributions" 
echo "- All financial records"
echo "- All settings"
echo "- Everything except the database structure"
echo ""
read -p "Are you sure you want to continue? Type 'yes' to proceed: " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Operation cancelled"
    exit 1
fi

echo ""
echo "🔄 Running fresh migration (this will delete all data)..."
$PHP83 artisan migrate:fresh --force

if [ $? -ne 0 ]; then
    echo "❌ Migration failed!"
    exit 1
fi

echo ""
echo "✅ Database cleaned and migrated successfully!"

echo ""
echo "👥 Seeding roles..."
$PHP83 artisan db:seed --class=RoleSeeder --force

echo ""
echo "🔐 Seeding permissions..."
$PHP83 artisan db:seed --class=PermissionSeeder --force

echo ""
echo "👤 Creating admin user..."
$PHP83 artisan db:seed --class=AdminUserSeeder --force

echo ""
echo "✅ Basic seeding completed successfully!"
echo ""
echo "🎉 Your system is ready with clean data!"
echo ""
echo "📋 What was created:"
echo "✅ 3 Roles: admin, secretary, member"
echo "✅ 13 Permissions with proper role assignments"
echo "✅ Admin user account"
echo ""
echo "🔑 Login Credentials:"
echo "📧 Email: shauritangaathanas@gmail.com"
echo "🔒 Password: password"
echo ""
echo "🚀 You can now login and start fresh!"