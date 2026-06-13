# cPanel Deployment Runbook — TWA System

Laravel 12 + Inertia/React (Vite). Target: SSH + Composer available, document root
points at the app's `public/` folder, fresh MySQL/MariaDB database.

Replace these placeholders throughout:
- `CPUSER`  — your cPanel username
- `example.com` — your domain
- `twa_db`, `twa_user`, `DB_PASSWORD` — the DB you create in step 3

---

## 0. Build assets (done already)
The frontend is built and committed (`public/build`). cPanel has no Node, so the
server just serves these files. **If you change any JS/CSS, rebuild locally with
`npm run build` and commit `public/build` before deploying.**

## 1. Wipe the old install on cPanel
> Back up anything you still need first (old DB dump, uploaded files in storage).
- File Manager: empty `public_html` and delete the old app directory.
- MySQL Databases: delete the old database and DB user (or keep, and just make a new one).
- Remove old cron jobs (cPanel → Cron Jobs) pointing at the old install.

## 2. PHP version + extensions
cPanel → **MultiPHP Manager**: set `example.com` to **PHP 8.3** (8.2 also OK).
cPanel → **Select PHP Version → Extensions**, enable:
`pdo_mysql, mbstring, openssl, curl, gd, zip, bcmath, intl, fileinfo, tokenizer, ctype, xml, json, exif`
(`gd` is required by Excel/PDF export.)
Make sure the **CLI** PHP matches; use the full binary in commands, e.g.
`/opt/cpanel/ea-php83/root/usr/bin/php`. Below, `php` = that binary.

## 3. Create the database
cPanel → **MySQL Databases**: create DB `CPUSER_twa_db`, user `CPUSER_twa_user`
with a strong password, and **add the user to the DB with ALL PRIVILEGES**.

## 4. Put the code on the server (outside public_html)
SSH in, then:
```bash
cd ~
git clone https://github.com/shauritanga/twa-system.git twa
cd ~/twa
```
(Updates later: `cd ~/twa && git pull`.)

## 5. Make public_html serve the repo's public/ (symlink)
The primary domain's document root is locked to `~/public_html`, so replace
`public_html` with a symlink to the app's `public/` folder (the app itself stays
outside the web root). This is a transparent serve, NOT an HTTP redirect — URLs
don't change, and `git pull` updates the served files automatically.
```bash
cd ~
mv public_html public_html.bak.$(date +%F)   # back up whatever's there first
ln -s twa/public public_html
```
Now `~/public_html` resolves to `~/twa/public`, so the website + admin + member
portals are all served from the one app. `.env`, `vendor`, and source stay in
`~/twa` (not web-accessible).

## 6. Install PHP dependencies (production)
```bash
cd ~/twa
composer install --no-dev --optimize-autoloader --no-interaction
```
If composer hits the `ext-gd` check before you enabled gd, enable gd (step 2) first.

## 7. Configure .env
```bash
cp .env.production.example .env   # or create fresh; then edit:
nano .env
```
Use these values (see template at the bottom of this file). Key points:
- `APP_ENV=production`, `APP_DEBUG=false`, real `APP_URL=https://example.com`
- DB credentials from step 3, `DB_CONNECTION=mysql`
- `SESSION_DRIVER=database`, `SESSION_SECURE_COOKIE=true` (you have HTTPS)
- `CACHE_STORE=database`
- **`QUEUE_CONNECTION=sync`** — important: OTP login emails are queued jobs; with
  `sync` they send immediately without needing a background worker. (Use `database`
  + a worker only if you set up a persistent queue worker.)
- Mail = your cPanel email SMTP account.
Then:
```bash
php artisan key:generate
```

## 8. Migrate + seed
```bash
php artisan migrate --force
php artisan db:seed --force            # default settings, accounts, roles, admin
```
The seeder creates an admin (`shauritangaathanas@gmail.com` / `password`).
**Log in and change that password immediately**, or edit `AdminUserSeeder` first.

## 9. Storage link + permissions
```bash
php artisan storage:link
chmod -R 775 storage bootstrap/cache
```

## 10. Cache for production
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```
> After ANY `.env` change later, re-run `php artisan config:cache` (cached config
> ignores `.env`). To undo all caches: `php artisan optimize:clear`.

## 11. Cron for the scheduler (required)
This app schedules backups and penalty calculation. cPanel → **Cron Jobs**, add
(every minute):
```
* * * * * /opt/cpanel/ea-php83/root/usr/bin/php /home/CPUSER/twa/artisan schedule:run >> /dev/null 2>&1
```

## 12. SSL / HTTPS
cPanel → **SSL/TLS Status** → run **AutoSSL** for the domain. Force HTTPS
(cPanel → Domains → Force HTTPS Redirect). `SESSION_SECURE_COOKIE=true` requires HTTPS.

## 13. Verify
- Visit `https://example.com` → landing page loads.
- Log in, go to Members → **Add Member** → confirm no 419 (the CSRF fix is in this build).
- Upload an image/PDF on a member → confirms `gd` + upload limits (`.htaccess` sets 15M/20M).

---

## Production .env template
```env
APP_NAME="TWA Group Contributions"
APP_ENV=production
APP_KEY=                      # set by: php artisan key:generate
APP_DEBUG=false
APP_URL=https://example.com

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=CPUSER_twa_db
DB_USERNAME=CPUSER_twa_user
DB_PASSWORD=your_secure_password

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=lax

CACHE_STORE=database
QUEUE_CONNECTION=sync
BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local

MAIL_MAILER=smtp
MAIL_HOST=mail.example.com
MAIL_PORT=465
MAIL_USERNAME=no-reply@example.com
MAIL_PASSWORD="your_email_password"
MAIL_ENCRYPTION=ssl
MAIL_FROM_ADDRESS=no-reply@example.com
MAIL_FROM_NAME="${APP_NAME}"

SANCTUM_STATEFUL_DOMAINS=example.com,www.example.com
```

## Common pitfalls
- **419 on submit** → fixed in this build; ensure the server has the latest
  `public/build` (deploy via `git pull`, don't hand-edit built files).
- **500 / blank page** → check `storage/logs/laravel.log`; usually a missing PHP
  extension, wrong DB creds, or `storage`/`bootstrap/cache` not writable.
- **OTP email never arrives** → `QUEUE_CONNECTION` must be `sync` unless a queue
  worker is running.
- **Old `.env` example here is a production template** — it shipped with a typo'd DB
  host and redis drivers; use the template above instead. Avoid redis unless your
  host actually provides it.
- **Symlink `public_html` to `~/twa/public` only** — never to `~/twa` (the project
  root), or `.env`/source become web-accessible.
- **403 "Symbolic link not allowed"** → your host blocks symlinked doc roots; ask
  support to allow `FollowSymLinks`/`SymLinksIfOwnerMatch` for your account.
