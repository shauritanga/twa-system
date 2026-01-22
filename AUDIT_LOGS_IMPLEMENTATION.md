# Audit Logs Implementation

## Overview
Comprehensive audit logging system to track all user actions and system events in the admin portal.

## Features Implemented

### 1. Database Schema
- **Table**: `audit_logs`
- **Fields**:
  - User information (user_id, user_name, user_email, user_role)
  - Action details (action, model_type, model_id, model_name)
  - Request information (ip_address, user_agent, url, method)
  - Change tracking (old_values, new_values, properties)
  - Categorization (description, category, severity)
  - Session tracking (session_id, batch_id)
  - Timestamps (created_at, updated_at)

### 2. Audit Log Model
- **Location**: `app/Models/AuditLog.php`
- **Features**:
  - Relationship with User model
  - Scopes for filtering (by user, action, category, model type, severity, date range)
  - Formatted changes attribute for UI display
  - Severity and category color/icon helpers

### 3. Controller
- **Location**: `app/Http/Controllers/AdminPortal/AuditLogController.php`
- **Methods**:
  - `index()` - List all audit logs with filtering
  - `show()` - View detailed log information

### 4. User Interface
- **Location**: `resources/js/Pages/AdminPortal/AuditLogs.jsx`
- **Features**:
  - Comprehensive filtering:
    - Search by description, user, model name, action
    - Filter by user, action, category, severity, model type
    - Date range filtering
  - Sortable table with pagination
  - Color-coded tags for actions, categories, and severity levels
  - Detailed view modal showing:
    - Complete log information
    - Change tracking (old vs new values)
    - Additional properties
    - User agent and session details
  - Responsive design with Ant Design components

### 5. Logging Trait
- **Location**: `app/Traits/LogsAudit.php`
- **Usage**: Add `use LogsAudit;` to any controller
- **Methods**:
  - `logCreate($model, $description, $category, $properties)` - Log creation
  - `logUpdate($model, $oldValues, $description, $category, $properties)` - Log updates
  - `logDelete($model, $description, $category, $properties)` - Log deletions
  - `logView($model, $description, $category, $properties)` - Log views
  - `logCustomAction($action, $model, $description, $category, $severity, $properties)` - Log custom actions

### 6. Sample Data
- **Seeder**: `database/seeders/SampleAuditLogsSeeder.php`
- Creates 50 sample audit logs for testing

## Categories
- `auth` - Authentication events (login, logout, password changes)
- `member` - Member-related actions
- `financial` - Financial transactions and accounting
- `system` - System configuration and settings
- `security` - Security-related events
- `general` - General actions

## Severity Levels
- `low` - Routine operations (view, create)
- `medium` - Important changes (update, delete)
- `high` - Critical operations (role changes, system settings)
- `critical` - Security events (failed logins, unauthorized access)

## Actions
Common actions include:
- `created` - Record created
- `updated` - Record updated
- `deleted` - Record deleted
- `viewed` - Record viewed
- `login` - User logged in
- `logout` - User logged out
- `posted` - Journal entry posted
- `reversed` - Transaction reversed
- `approved` - Item approved
- `rejected` - Item rejected

## Usage Example

```php
use App\Traits\LogsAudit;

class AccountController extends Controller
{
    use LogsAudit;

    public function store(Request $request)
    {
        $account = Account::create($request->validated());
        
        // Log the creation
        $this->logCreate(
            $account,
            'New account created: ' . $account->account_name,
            'financial',
            ['account_type' => $account->account_type]
        );
        
        return redirect()->back();
    }

    public function update(Request $request, Account $account)
    {
        $oldValues = $account->getAttributes();
        $account->update($request->validated());
        
        // Log the update
        $this->logUpdate(
            $account,
            $oldValues,
            'Account updated: ' . $account->account_name,
            'financial'
        );
        
        return redirect()->back();
    }
}
```

## Routes
- `GET /admin-portal/audit-logs` - List all audit logs
- `GET /admin-portal/audit-logs/{auditLog}` - View specific log details

## Access
- Available in Admin Portal under Administration > Audit Logs
- Requires admin authentication

## Future Enhancements
1. Export audit logs to CSV/Excel
2. Automatic cleanup of old logs (retention policy)
3. Real-time audit log notifications
4. Advanced analytics and reporting
5. Audit log archiving
6. Integration with external SIEM systems
