# Settings System Implementation

## Overview
Comprehensive system settings management with organized categories, caching, and helper functions for easy access throughout the application.

## Features Implemented

### 1. Settings Management UI
**Location**: `resources/js/Pages/AdminPortal/Settings/Index.jsx`

**Features**:
- Organized into 6 tabbed categories
- Single form for all settings
- Real-time validation
- Informative descriptions and help text
- Save all settings at once
- Toast notifications for success/error

**Categories**:

#### General Settings
- Organization name, email, phone, address
- Timezone selection (18 major timezones)
- Date format preferences (6 formats)
- Currency selection (8 currencies)

#### Member Settings
- Default monthly contribution amount
- Penalty percentage rate
- Apply penalty to existing toggle
- Member ID prefix
- Auto-approve members toggle

#### Financial Settings
- Fiscal year start month
- Receipt number prefix
- Invoice number prefix
- Tax rate percentage

#### Email Settings
- SMTP host, port, username
- SMTP encryption (TLS/SSL/None)
- Mail from address and name
- Configuration alert

#### Security Settings
- Session timeout (minutes)
- Two-factor authentication toggle
- OTP grace period (days)
- Max login attempts
- Password minimum length
- Require special character toggle

#### System Settings
- Maintenance mode toggle
- Debug mode toggle
- Items per page (10/20/50/100)
- Backup frequency (daily/weekly/monthly/manual)

### 2. Settings Controller
**Location**: `app/Http/Controllers/AdminPortal/SettingsController.php`

**Methods**:
- `index()` - Display settings page with all current values
- `update()` - Update multiple settings at once
- `updateSingle()` - Update a single setting
- `getTimezones()` - Get available timezones
- `getCurrencies()` - Get available currencies
- `getDateFormats()` - Get available date formats

**Features**:
- Automatic cache clearing on update
- Boolean to string conversion ('1'/'0')
- Validation for all inputs
- Bulk update support

### 3. Settings Helper
**Location**: `app/Helpers/SettingsHelper.php`

**Methods**:
- `all()` - Get all settings as key-value array (cached)
- `get($key, $default)` - Get specific setting value
- `set($key, $value, $description)` - Set setting value
- `has($key)` - Check if setting exists
- `forget($key)` - Delete a setting
- `getBool($key, $default)` - Get setting as boolean
- `getInt($key, $default)` - Get setting as integer
- `getFloat($key, $default)` - Get setting as float
- `clearCache()` - Clear settings cache

**Caching**:
- Settings cached for 1 hour (3600 seconds)
- Automatic cache invalidation on update
- Cache key: `app_settings`

### 4. Global Helper Functions
**Location**: `app/helpers.php`

**Functions**:
```php
// Get setting value
setting('organization_name', 'Default Name');

// Get all settings
$allSettings = setting();

// Get as boolean
setting_bool('enable_two_factor_auth', false);

// Get as integer
setting_int('session_timeout', 120);

// Get as float
setting_float('tax_rate', 0.0);
```

### 5. Database Structure

**Table**: `settings`
- `id` - Primary key
- `key` - Unique setting key
- `value` - Setting value (string)
- `description` - Optional description
- `created_at` - Timestamp
- `updated_at` - Timestamp

### 6. Default Settings Seeder
**Location**: `database/seeders/DefaultSettingsSeeder.php`

**Populates 37 default settings**:
- 7 general settings
- 5 member settings
- 4 financial settings
- 6 email settings
- 6 security settings
- 5 system settings
- 4 additional settings

## Usage Examples

### In Controllers
```php
use App\Helpers\SettingsHelper;

// Get organization name
$orgName = SettingsHelper::get('organization_name', 'TWAOR');

// Check if 2FA is enabled
if (SettingsHelper::getBool('enable_two_factor_auth')) {
    // Require 2FA
}

// Get contribution amount
$amount = SettingsHelper::getInt('monthly_contribution_amount', 50000);

// Set a setting
SettingsHelper::set('maintenance_mode', '1', 'System under maintenance');
```

### Using Global Helpers
```php
// Get setting
$timezone = setting('timezone', 'Africa/Dar_es_Salaam');

// Get as boolean
if (setting_bool('maintenance_mode')) {
    abort(503, 'System under maintenance');
}

// Get as integer
$timeout = setting_int('session_timeout', 120);

// Get as float
$taxRate = setting_float('tax_rate', 0.0);
```

### In Blade Templates
```php
{{ setting('organization_name') }}

@if(setting_bool('enable_two_factor_auth'))
    <div>2FA is enabled</div>
@endif
```

### In JavaScript (via Inertia)
```javascript
// Pass settings in controller
return Inertia::render('Page', [
    'orgName' => setting('organization_name'),
    'currency' => setting('currency', 'TZS'),
]);

// Access in component
const { orgName, currency } = usePage().props;
```

## Available Settings

### General (7)
- `organization_name` - Organization name
- `organization_email` - Contact email
- `organization_phone` - Contact phone
- `organization_address` - Physical address
- `timezone` - System timezone
- `date_format` - Date display format
- `currency` - Default currency

### Members (5)
- `monthly_contribution_amount` - Default contribution
- `penalty_percentage_rate` - Penalty rate
- `apply_penalty_to_existing` - Apply to existing penalties
- `member_id_prefix` - Member ID prefix
- `auto_approve_members` - Auto-approve registrations

### Financial (4)
- `fiscal_year_start_month` - Fiscal year start
- `receipt_number_prefix` - Receipt prefix
- `invoice_number_prefix` - Invoice prefix
- `tax_rate` - Default tax rate

### Email (6)
- `smtp_host` - SMTP server
- `smtp_port` - SMTP port
- `smtp_username` - SMTP username
- `smtp_encryption` - Encryption method
- `mail_from_address` - From email
- `mail_from_name` - From name

### Security (6)
- `session_timeout` - Session timeout (minutes)
- `enable_two_factor_auth` - Enable 2FA
- `otp_grace_period_days` - OTP grace period
- `max_login_attempts` - Max login attempts
- `password_min_length` - Min password length
- `require_password_special_char` - Require special char

### System (5)
- `maintenance_mode` - Maintenance mode
- `items_per_page` - Items per page
- `enable_debug_mode` - Debug mode
- `backup_frequency` - Backup frequency
- `allow_admin_assignment` - Allow role assignment

## Routes
- `GET /admin-portal/settings` - Display settings page
- `POST /admin-portal/settings` - Update all settings
- `POST /admin-portal/settings/single` - Update single setting

## Access Control
- Available in Admin Portal under Administration > Settings
- Requires admin authentication
- All settings can be modified

## Performance
- Settings cached for 1 hour
- Cache automatically cleared on update
- Single database query for all settings
- Efficient key-value storage

## Future Enhancements
1. Setting groups/categories in database
2. Setting types (string, int, bool, json)
3. Setting validation rules
4. Setting history/audit trail
5. Import/export settings
6. Environment-specific settings
7. Setting search functionality
8. Setting reset to defaults
9. Setting dependencies
10. Setting permissions per role
