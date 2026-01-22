# Clean Database Commands

## 🧹 Option 1: Use the Script (Recommended)

```bash
# Make executable and run
chmod +x clean-and-seed-basic.sh
./clean-and-seed-basic.sh
```

## 🔧 Option 2: Manual Commands

### Step 1: Clean Database (⚠️ DELETES ALL DATA)
```bash
# Find your PHP 8.3 path first
/usr/local/bin/php83 -v  # or /usr/bin/php83 -v

# Use the correct PHP path for all commands below
# Replace /usr/local/bin/php83 with your actual PHP 8.3 path

# Fresh migration (deletes all data, recreates tables)
/usr/local/bin/php83 artisan migrate:fresh --force
```

### Step 2: Seed Essential Data Only
```bash
# Seed roles (admin, secretary, member)
/usr/local/bin/php83 artisan db:seed --class=RoleSeeder --force

# Seed permissions and assign to roles
/usr/local/bin/php83 artisan db:seed --class=PermissionSeeder --force

# Create admin user
/usr/local/bin/php83 artisan db:seed --class=AdminUserSeeder --force
```

### Step 3: Optimize Application
```bash
# Clear and cache configuration
/usr/local/bin/php83 artisan config:cache
/usr/local/bin/php83 artisan route:cache
/usr/local/bin/php83 artisan view:cache
```

## 🔑 Login Credentials After Clean Install

**Admin User:**
- **Email:** shauritangaathanas@gmail.com
- **Password:** password

**Additional Admin:**
- **Email:** superadmin@tabatawelfare.org  
- **Password:** Super@123456

## 📋 What Gets Created

### Roles:
- ✅ **admin** - Full system access
- ✅ **secretary** - Reports, members, financials
- ✅ **member** - Personal data only

### Permissions (35 total):
- ✅ **Dashboard & Overview (1)**
  - view_dashboard

- ✅ **Member Management (5)**  
  - view_members, create_members, edit_members, delete_members, archive_members

- ✅ **Financial Management (7)**
  - view_financials, manage_contributions, manage_expenses, manage_assets, manage_debts, manage_penalties, manage_disaster_payments

- ✅ **Accounting System (7)**
  - view_accounting, manage_chart_of_accounts, manage_journal_entries, view_general_ledger, view_trial_balance, view_balance_sheet, view_income_statement, view_cash_flow

- ✅ **Document Management (3)**
  - view_documents, upload_documents, delete_documents

- ✅ **Communication (2)**
  - manage_announcements, manage_fundraising

- ✅ **Reports (2)**
  - view_reports, export_reports

- ✅ **System Administration (7)**
  - manage_roles, manage_permissions, assign_roles, manage_backups, view_audit_logs, manage_settings

- ✅ **Personal Access (1)**
  - view_personal_data

### Admin User:
- ✅ Full access to all features
- ✅ Can manage other users
- ✅ Can configure system settings

## 🚀 After Clean Install

1. **Login** with admin credentials
2. **Configure settings** in Admin Portal → Settings
3. **Add members** as needed
4. **Set up accounting** (accounts will need to be recreated)
5. **Configure organization details**

## ⚠️ Important Notes

- **This deletes ALL existing data** (members, contributions, financial records)
- **Database structure is preserved** (all tables recreated)
- **Only essential system data is seeded** (roles, permissions, admin user)
- **You'll need to reconfigure** organization settings and add accounts
- **All previous members will need to re-register** or be re-added

## 🔄 If You Want to Add More Data Later

```bash
# Add default settings (optional)
/usr/local/bin/php83 artisan db:seed --class=DefaultSettingsSeeder --force

# Add default chart of accounts (optional)  
/usr/local/bin/php83 artisan db:seed --class=DefaultAccountsSeeder --force
```

This gives you a **completely clean system** with just the essentials to get started!