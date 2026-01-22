# Simple cPanel Deployment Guide - PHP 8.2+ Required

## ⚠️ IMPORTANT: PHP 8.2+ Required

**Your server MUST have PHP 8.2 or higher.** If you have PHP 8.1, please upgrade first using the **UPGRADE_PHP_GUIDE.md**.

## 🚀 Super Simple Deployment (Build Assets Included in Git)

Since the production build assets are now included in the Git repository, deployment is much simpler!

## ✅ Quick Steps

### 1. Download Code
```bash
# Via SSH
git clone https://github.com/shauritanga/twa-system.git .

# Or download ZIP from GitHub and extract to your domain folder
```

### 2. Create Database
- **cPanel → MySQL Databases**
- Create database: `yourusername_twa`
- Create user: `yourusername_twauser`
- Add user to database with ALL PRIVILEGES

### 3. Configure Environment
```bash
# Copy environment file
cp .env.production.example .env

# Edit .env with your database credentials
# Set APP_URL to your domain
# Configure email settings
```

### 4. Install PHP Dependencies Only
```bash
# No npm install or npm run build needed!
composer install --optimize-autoloader --no-dev
```

### 5. Setup Application
```bash
# Generate app key
php artisan key:generate

# Run migrations
php artisan migrate --force

# Seed default data
php artisan db:seed --class=DefaultSettingsSeeder
php artisan db:seed --class=DefaultAccountsSeeder
php artisan db:seed --class=RoleSeeder
php artisan db:seed --class=PermissionSeeder
php artisan db:seed --class=AdminUserSeeder

# Create storage link
php artisan storage:link

# Set permissions
chmod -R 775 storage bootstrap/cache

# Optimize for production
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 6. Point Domain to Public Folder
- **cPanel → Subdomains/Addon Domains**
- Set document root to: `/public_html/public`

### 7. Configure SSL
- **cPanel → SSL/TLS**
- Enable "Force HTTPS Redirect"

## 🎉 That's It!

**No more memory issues!** 
**No more npm run build failures!**
**No more Node.js requirements on server!**

## Why This Works Better

### Before (Complex):
1. ❌ Upload code
2. ❌ Install Node.js dependencies (500MB+)
3. ❌ Run npm run build (needs 1-2GB RAM)
4. ❌ Often fails on shared hosting
5. ❌ Install PHP dependencies

### Now (Simple):
1. ✅ Upload code (includes pre-built assets)
2. ✅ Install PHP dependencies only
3. ✅ Configure and run
4. ✅ Works on any hosting environment

## 📋 Complete Example .env

```env
APP_NAME="Tabata Welfare Association"
APP_ENV=production
APP_KEY=base64:your_generated_key_here
APP_DEBUG=false
APP_TIMEZONE=Africa/Dar_es_Salaam
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=yourusername_twa
DB_USERNAME=yourusername_twauser
DB_PASSWORD=your_database_password

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD="your_app_password"
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your_email@gmail.com
MAIL_FROM_NAME="${APP_NAME}"

SESSION_DRIVER=database
SESSION_LIFETIME=120
CACHE_DRIVER=file
```

## 🔄 Future Updates

When you make changes and want to update the server:

```bash
# On server
git pull origin main
composer install --optimize-autoloader --no-dev
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

**That's it!** No building required since assets are already in the repository.

## 🎯 Benefits of This Approach

- ✅ **No memory issues** on shared hosting
- ✅ **Faster deployment** (no build time)
- ✅ **More reliable** (no build failures)
- ✅ **Works everywhere** (no Node.js requirement on server)
- ✅ **Simpler maintenance** (just git pull + composer)
- ✅ **Consistent assets** (same build for everyone)

Your TWA system is now ready for hassle-free deployment! 🚀