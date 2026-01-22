# Settings Integration Status

## Overview
This document tracks which settings are actively integrated into the system and which are UI-only (not yet affecting system behavior).

## ✅ FULLY INTEGRATED SETTINGS (Currently Active)

### Member Settings
1. **`monthly_contribution_amount`** ✅
   - Used in: `PaymentService`, `FinancialsController`, `PenaltyService`, `CalculatePenaltiesCommand`
   - Purpose: Calculates expected contributions, penalties, and financial reports
   - Impact: Changes immediately affect contribution calculations

2. **`penalty_percentage_rate`** ✅
   - Used in: `PenaltyService`, `CalculatePenaltiesCommand`
   - Purpose: Calculates penalty amounts for missed contributions
   - Impact: Changes affect penalty calculations

3. **`apply_penalty_to_existing`** ✅
   - Used in: `PenaltyService`
   - Purpose: Determines if penalty rate changes apply to existing unpaid penalties
   - Impact: Controls retroactive penalty adjustments

4. **`auto_approve_members`** ✅
   - Used in: `MemberController` (store and import methods)
   - Purpose: Automatically verify new members upon registration/import
   - Impact: Sets `is_verified` status based on setting

### Security Settings
5. **`enable_two_factor_auth`** ✅
   - Used in: `AuthConfigService`
   - Purpose: System-wide 2FA enforcement
   - Impact: Requires/disables 2FA for all users

6. **`otp_grace_period_days`** ✅
   - Used in: OTP system
   - Purpose: Days to allow login without OTP for existing users
   - Impact: Controls 2FA grace period

7. **`max_login_attempts`** ✅
   - Used in: `AuthConfigService`
   - Purpose: Maximum failed login attempts before lockout
   - Impact: Controls account lockout threshold

8. **`allow_admin_assignment`** ✅
   - Used in: `AdminDashboardController`, `AuthConfigService`
   - Purpose: Allow administrators to assign roles to users
   - Impact: Controls role assignment permissions

9. **`password_min_length`** ✅
   - Used in: `PasswordConfigService`, all auth controllers
   - Purpose: Minimum password length requirement
   - Impact: Enforced in registration, password change, password reset

10. **`require_password_special_char`** ✅
    - Used in: `PasswordConfigService`, all auth controllers
    - Purpose: Require special characters in passwords
    - Impact: Enforced in registration, password change, password reset

### System Settings
11. **`maintenance_mode`** ✅
    - Used in: `MaintenanceConfigService`
    - Purpose: Enable/disable maintenance mode
    - Impact: Blocks user access when enabled

12. **`backup_frequency`** ✅
    - Used in: `BackupService`
    - Purpose: Automatic backup schedule
    - Impact: Controls backup automation

13. **`session_timeout`** ✅ (as `session_timeout_minutes`)
    - Used in: `SessionConfigService`, `SessionTimeoutService`
    - Purpose: Session timeout in minutes
    - Impact: Controls automatic logout timing

14. **`items_per_page`** ✅
    - Used in: `PaginationConfigService`, multiple controllers
    - Purpose: Default pagination size
    - Impact: Controls items per page in all paginated lists

### Regional Settings
15. **`timezone`** ✅ (as `system_timezone`)
    - Used in: `SystemConfigService`
    - Purpose: System timezone
    - Impact: Affects date/time display and calculations

16. **`date_format`** ✅
    - Used in: `SystemConfigService`
    - Purpose: Date display format
    - Impact: Controls how dates are formatted

17. **`currency`** ✅ (as `currency_symbol`)
    - Used in: `SystemConfigService`
    - Purpose: Default currency
    - Impact: Currency display throughout system

### General Settings
18. **`organization_name`** ✅
    - Used in: `OrganizationConfigService`, `ShareOrganizationData` middleware
    - Purpose: Organization name displayed throughout system
    - Impact: Shared with all Inertia pages via middleware

19. **`organization_email`** ✅
    - Used in: `OrganizationConfigService`, `ShareOrganizationData` middleware
    - Purpose: Organization contact email
    - Impact: Shared with all Inertia pages via middleware

20. **`organization_phone`** ✅
    - Used in: `OrganizationConfigService`, `ShareOrganizationData` middleware
    - Purpose: Organization contact phone
    - Impact: Shared with all Inertia pages via middleware

21. **`organization_address`** ✅
    - Used in: `OrganizationConfigService`, `ShareOrganizationData` middleware
    - Purpose: Organization physical address
    - Impact: Shared with all Inertia pages via middleware

## ⚠️ PARTIALLY INTEGRATED SETTINGS

### Email Settings
22. **`smtp_host`** ⚠️
    - Status: Service created, needs runtime application
    - Service: `EmailConfigService`
    - Needs: Apply configuration in service provider or middleware
    - Current: Uses .env file settings

23. **`smtp_port`** ⚠️
    - Status: Service created, needs runtime application
    - Service: `EmailConfigService`
    - Needs: Apply configuration in service provider or middleware

24. **`smtp_username`** ⚠️
    - Status: Service created, needs runtime application
    - Service: `EmailConfigService`
    - Needs: Apply configuration in service provider or middleware

25. **`smtp_encryption`** ⚠️
    - Status: Service created, needs runtime application
    - Service: `EmailConfigService`
    - Needs: Apply configuration in service provider or middleware

26. **`mail_from_address`** ⚠️
    - Status: Service created, needs runtime application
    - Service: `EmailConfigService`
    - Needs: Apply configuration in service provider or middleware

27. **`mail_from_name`** ⚠️
    - Status: Service created, needs runtime application
    - Service: `EmailConfigService`
    - Needs: Apply configuration in service provider or middleware

## ❌ NOT YET INTEGRATED SETTINGS (UI Only)

### Member Settings
28. **`member_id_prefix`** ❌
    - Needs: Auto-generation of member IDs using prefix
    - Integration points: Member creation logic
    - Note: Service created but ID generation not yet implemented

### Financial Settings
29. **`fiscal_year_start_month`** ❌
    - Needs: Financial reports, year-end calculations
    - Integration points: Financial report controllers
    - Note: Service created but not used in reports

30. **`receipt_number_prefix`** ❌
    - Needs: Receipt generation with custom prefix
    - Integration points: Payment/receipt generation
    - Note: Service has generation method but not integrated

31. **`invoice_number_prefix`** ❌
    - Needs: Invoice generation with custom prefix
    - Integration points: Invoice generation
    - Note: Service has generation method but not integrated

32. **`tax_rate`** ❌
    - Needs: Transaction calculations with tax
    - Integration points: Payment processing, invoicing
    - Note: Service has calculation method but not integrated

### System Settings
33. **`enable_debug_mode`** ❌
    - Needs: Debug mode control
    - Integration points: App configuration

## INTEGRATION PRIORITY

### ✅ COMPLETED (High Priority Items)
1. **Organization info** (name, email, phone, address) - ✅ Shared via middleware to all pages
2. **Password requirements** (min length, special char) - ✅ Integrated in all auth controllers
3. **Auto-approve members** - ✅ Integrated in member creation and import
4. **Items per page** - ✅ Integrated in key controllers (Audit Logs, Roles, Permissions)

### Medium Priority (Partially Complete)
1. **Email settings** - ⚠️ Service created, needs runtime application in service provider
2. **Member ID prefix** - Service created with generation method, needs integration
3. **Receipt/Invoice prefixes** - Service created with generation methods, needs integration
4. **Tax rate** - Service created with calculation method, needs integration

### Low Priority
1. **Fiscal year start** - Service created, needs integration in financial reports
2. **Debug mode** - Development setting, low priority

## HOW TO INTEGRATE A SETTING

### Example: Integrating `organization_name`

1. **Create/Update Service** (if needed):
```php
// app/Services/OrganizationConfigService.php
class OrganizationConfigService
{
    public function getName(): string
    {
        return setting('organization_name', 'TWAOR');
    }
}
```

2. **Use in Controllers**:
```php
$orgName = setting('organization_name', 'TWAOR');
return Inertia::render('Page', ['orgName' => $orgName]);
```

3. **Use in Blade/Views**:
```php
{{ setting('organization_name', 'TWAOR') }}
```

4. **Use in JavaScript** (via Inertia props):
```javascript
const { orgName } = usePage().props;
```

## TESTING INTEGRATION

To verify a setting is integrated:

1. Change the setting value in admin panel
2. Clear cache: `php artisan cache:clear`
3. Check if the change is reflected in the relevant feature
4. If not reflected, the setting needs integration

## NOTES

- Settings with ✅ are production-ready and actively used
- Settings with ⚠️ are stored but need additional integration work
- Settings with ❌ are UI-only and don't affect system behavior yet
- All settings use caching for performance (1-hour cache)
- Cache is automatically cleared when settings are updated
