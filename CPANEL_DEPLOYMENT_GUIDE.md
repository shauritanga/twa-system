# Complete cPanel Deployment Guide for TWA System

## Overview
This guide provides step-by-step instructions to deploy the TWA (Tabata Welfare Association) system on a cPanel hosting environment.

## Prerequisites
- cPanel hosting account with PHP 8.1+ support
- MySQL database access
- SSH access (optional but recommended)
- Domain name configured

## 📋 Pre-Deployment Checklist

### 1. Hosting Requirements
- ✅ PHP 8.1 or higher
- ✅ MySQL 5.7+ or MariaDB 10.3+
- ✅ Composer support
- ✅ Node.js support (for asset compilation)
- ✅ SSL certificate
- ✅ At least 512MB PHP memory limit
- ✅ File upload limit of at least 64MB

### 2. Required PHP Extensions
Ensure these extensions are enabled in cPanel:
- ✅ BCMath
- ✅ Ctype
- ✅ Fileinfo
- ✅ JSON
- ✅ Mbstring
- ✅ OpenSSL
- ✅ PDO
- ✅ Tokenizer
- ✅ XML
- ✅ GD or Imagick
- ✅ Zip

## 🚀 Deployment Steps

### Step 1: Download Code from GitHub

#### Option A: Using cPanel File Manager
1. Login to your cPanel
2. Open **File Manager**
3. Navigate to `public_html` (or your domain's document root)
4. Click **+ File** → **Create New File**
5. Name it `deploy.php` and add this content:

```php
<?php
// Simple deployment script
$repo_url = 'https://github.com/shauritanga/twa-system.git';
$target_dir = '/home/yourusername/public_html/twa-temp';

// Download and extract
exec("git clone $repo_url $target_dir", $output, $return_var);

if ($return_var === 0) {
    echo "Repository cloned successfully!";
} else {
    echo "Error cloning repository: " . implode("\n", $output);
}
?>
```

6. Run the script by visiting `yourdomain.com/deploy.php`
7. Move files from `twa-temp` to your main directory

#### Option B: Using SSH (Recommended)
```bash
# Connect to your server via SSH
ssh username@yourserver.com

# Navigate to your domain directory
cd public_html

# Clone the repository
git clone https://github.com/shauritanga/twa-system.git .

# Or if directory is not empty, clone to temp and move
git clone https://github.com/shauritanga/twa-system.git twa-temp
mv twa-temp/* .
mv twa-temp/.* . 2>/dev/null
rm -rf twa-temp
```

### Step 2: Create Database

1. **Login to cPanel**
2. **Open MySQL Databases**
3. **Create Database:**
   - Database Name: `yourusername_twa`
   - Click **Create Database**

4. **Create Database User:**
   - Username: `yourusername_twauser`
   - Password: Generate strong password
   - Click **Create User**

5. **Add User to Database:**
   - Select user and database
   - Grant **ALL PRIVILEGES**
   - Click **Make Changes**

6. **Note down these details:**
   - Database Name: `yourusername_twa`
   - Username: `yourusername_twauser`
   - Password: [your generated password]
   - Host: `localhost`

### Step 3: Configure Environment

1. **Copy Environment File:**
   ```bash
   cp .env.production.example .env
   ```

2. **Edit .env file** (use cPanel File Manager or SSH):
   ```env
   APP_NAME="Tabata Welfare Association"
   APP_ENV=production
   APP_KEY=
   APP_DEBUG=false
   APP_TIMEZONE=Africa/Dar_es_Salaam
   APP_URL=https://yourdomain.com

   LOG_CHANNEL=stack
   LOG_DEPRECATIONS_CHANNEL=null
   LOG_LEVEL=error

   DB_CONNECTION=mysql
   DB_HOST=localhost
   DB_PORT=3306
   DB_DATABASE=yourusername_twa
   DB_USERNAME=yourusername_twauser
   DB_PASSWORD=your_database_password

   BROADCAST_DRIVER=log
   CACHE_DRIVER=file
   FILESYSTEM_DISK=local
   QUEUE_CONNECTION=sync
   SESSION_DRIVER=database
   SESSION_LIFETIME=120

   MAIL_MAILER=smtp
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USERNAME=your_email@gmail.com
   MAIL_PASSWORD="your_app_password"
   MAIL_ENCRYPTION=tls
   MAIL_FROM_ADDRESS=your_email@gmail.com
   MAIL_FROM_NAME="${APP_NAME}"
   ```

### Step 4: Install Dependencies

#### Option A: Using SSH (Recommended)
```bash
# Install Composer dependencies
composer install --optimize-autoloader --no-dev

# Install Node.js dependencies
npm install

# Build assets for production
npm run build
```

#### Option B: Using cPanel Terminal (if available)
1. Open **Terminal** in cPanel
2. Navigate to your project directory
3. Run the same commands as above

#### Option C: Manual Upload (if no SSH/Terminal)
1. Run these commands locally:
   ```bash
   composer install --optimize-autoloader --no-dev
   npm install
   npm run build
   ```
2. Upload the `vendor` folder and `public/build` folder via File Manager

### Step 5: Set Permissions

Using SSH or cPanel File Manager, set these permissions:

```bash
# Storage and cache directories
chmod -R 775 storage
chmod -R 775 bootstrap/cache

# Make sure web server can write to these
chown -R username:username storage
chown -R username:username bootstrap/cache

# Set proper permissions for uploaded files
chmod -R 755 public/storage
```

### Step 6: Generate Application Key

```bash
php artisan key:generate
```

Or manually add to .env:
```env
APP_KEY=base64:your_generated_key_here
```

### Step 7: Run Database Migrations

```bash
# Run migrations
php artisan migrate --force

# Seed default data
php artisan db:seed --class=DefaultSettingsSeeder
php artisan db:seed --class=DefaultAccountsSeeder
php artisan db:seed --class=RoleSeeder
php artisan db:seed --class=PermissionSeeder
php artisan db:seed --class=AdminUserSeeder
```

### Step 8: Create Storage Link

```bash
php artisan storage:link
```

### Step 9: Configure Web Server

#### For Apache (.htaccess)
Create/update `.htaccess` in your document root:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # Handle Angular and Vue.js HTML5 mode
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ /public/index.php [L]
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
</IfModule>
```

#### Document Root Configuration
**Important:** Your domain's document root should point to the `public` folder, not the project root.

1. **In cPanel → Subdomains/Addon Domains:**
   - Set document root to: `/public_html/public` (not `/public_html`)

2. **Or create a redirect in main directory:**
   Create `index.php` in your main directory:
   ```php
   <?php
   header('Location: /public/');
   exit;
   ?>
   ```

### Step 10: Configure Cron Jobs

1. **Open cPanel → Cron Jobs**
2. **Add these cron jobs:**

```bash
# Laravel Scheduler (runs every minute)
* * * * * cd /home/username/public_html && php artisan schedule:run >> /dev/null 2>&1

# Clear cache daily
0 2 * * * cd /home/username/public_html && php artisan cache:clear

# Backup database daily
0 3 * * * cd /home/username/public_html && php artisan backup:run --only-db
```

### Step 11: SSL Certificate

1. **In cPanel → SSL/TLS:**
2. **Enable "Force HTTPS Redirect"**
3. **Install SSL certificate** (Let's Encrypt is usually free)

### Step 12: Final Configuration

1. **Clear all caches:**
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   php artisan optimize
   ```

2. **Test the application:**
   - Visit your domain
   - Try logging in with admin credentials
   - Test key functionality

## 🔧 Post-Deployment Configuration

### 1. Create Admin User
```bash
php artisan make:command CreateAdminUser
# Or use the existing seeder
php artisan db:seed --class=AdminUserSeeder
```

### 2. Configure Email Settings
1. **Gmail Setup:**
   - Enable 2FA on Gmail
   - Generate App Password
   - Use App Password in MAIL_PASSWORD

2. **Test email:**
   ```bash
   php artisan tinker
   Mail::raw('Test email', function($msg) {
       $msg->to('test@example.com')->subject('Test');
   });
   ```

### 3. File Upload Configuration

Update `php.ini` or `.htaccess`:
```ini
upload_max_filesize = 64M
post_max_size = 64M
max_execution_time = 300
memory_limit = 512M
```

### 4. Security Hardening

1. **Hide sensitive files:**
   ```apache
   # In .htaccess
   <Files ".env">
       Order allow,deny
       Deny from all
   </Files>
   
   <Files "composer.json">
       Order allow,deny
       Deny from all
   </Files>
   ```

2. **Set proper file permissions:**
   ```bash
   find . -type f -exec chmod 644 {} \;
   find . -type d -exec chmod 755 {} \;
   chmod -R 775 storage bootstrap/cache
   ```

## 🚨 Troubleshooting

### Common Issues and Solutions

#### 1. "500 Internal Server Error"
- Check error logs in cPanel → Error Logs
- Verify .env configuration
- Check file permissions
- Ensure PHP version compatibility

#### 2. "Class not found" errors
```bash
composer dump-autoload
php artisan config:clear
php artisan cache:clear
```

#### 3. Database connection issues
- Verify database credentials in .env
- Check if database user has proper privileges
- Ensure database exists

#### 4. Asset loading issues
- Verify APP_URL in .env matches your domain
- Check if public/build directory exists
- Run `npm run build` again

#### 5. Permission denied errors
```bash
chmod -R 775 storage
chmod -R 775 bootstrap/cache
chown -R username:username storage bootstrap/cache
```

#### 6. Email not working
- Check SMTP credentials
- Verify firewall allows SMTP ports
- Test with different email provider

## 📊 Performance Optimization

### 1. Enable OPcache
Add to php.ini:
```ini
opcache.enable=1
opcache.memory_consumption=128
opcache.interned_strings_buffer=8
opcache.max_accelerated_files=4000
opcache.revalidate_freq=2
```

### 2. Configure Redis (if available)
```env
CACHE_DRIVER=redis
SESSION_DRIVER=redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

### 3. Enable Gzip Compression
Add to .htaccess:
```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
```

## 🔐 Security Checklist

- ✅ SSL certificate installed and forced
- ✅ Strong database passwords
- ✅ .env file protected
- ✅ Debug mode disabled in production
- ✅ Error reporting configured properly
- ✅ File upload restrictions in place
- ✅ Regular backups configured
- ✅ Security headers configured
- ✅ Admin user with strong password
- ✅ Unnecessary files removed from public access

## 📱 Testing Checklist

After deployment, test these features:

### Authentication
- ✅ Login with admin credentials
- ✅ Password reset functionality
- ✅ Remember me functionality
- ✅ OTP verification (if enabled)

### Core Features
- ✅ Member registration and management
- ✅ Contribution recording
- ✅ Financial reports generation
- ✅ Document upload and download
- ✅ Email notifications

### Admin Portal
- ✅ Dashboard loads with correct data
- ✅ All menu items accessible
- ✅ Forms submit correctly
- ✅ File uploads work
- ✅ Export functionality

## 📞 Support and Maintenance

### Regular Maintenance Tasks
1. **Weekly:**
   - Check error logs
   - Verify backups
   - Monitor disk space

2. **Monthly:**
   - Update dependencies (test first)
   - Review security logs
   - Performance optimization

3. **Quarterly:**
   - Full security audit
   - Database optimization
   - Update documentation

### Getting Help
- Check Laravel documentation: https://laravel.com/docs
- Review error logs in cPanel
- Contact hosting provider for server-related issues
- GitHub repository: https://github.com/shauritanga/twa-system

## 🎉 Deployment Complete!

Your TWA system should now be live and accessible at your domain. The system includes:

- ✅ Complete member management
- ✅ Financial tracking and reporting
- ✅ Accounting integration with double-entry bookkeeping
- ✅ Admin portal with comprehensive features
- ✅ Secure authentication with 2FA support
- ✅ Document management
- ✅ Automated backups
- ✅ Audit logging
- ✅ Role-based permissions

**Default Admin Credentials:**
- Email: admin@twa.com (or check AdminUserSeeder)
- Password: Check the seeder file or create new admin

Remember to change default passwords and configure all settings according to your organization's needs!