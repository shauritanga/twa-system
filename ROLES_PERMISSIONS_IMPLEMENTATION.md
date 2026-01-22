# Roles & Permissions Implementation

## Overview
Comprehensive Role-Based Access Control (RBAC) system for managing user roles and permissions in the admin portal.

## Features Implemented

### 1. Role Management
**Location**: `resources/js/Pages/AdminPortal/Roles/Index.jsx`

**Features**:
- List all roles with user and permission counts
- Create new custom roles
- Edit custom roles (system roles protected)
- Delete custom roles (with validation)
- Search roles by name or description
- Manage permissions for each role
- System role protection (admin, secretary, member cannot be edited/deleted)
- Badge indicators for users and permissions count

**System Roles** (Protected):
- `admin` - Full system access with all permissions
- `secretary` - Access to reports and member management
- `member` - Limited access to personal data only

### 2. Permission Management
**Location**: `resources/js/Pages/AdminPortal/Permissions/Index.jsx`

**Features**:
- List all permissions with role assignment count
- Create new permissions
- Edit existing permissions
- Delete permissions (with validation)
- Search permissions by name or description
- View which roles have each permission

**Existing Permissions** (25 total):
- `view_reports` - View financial and member reports
- `manage_members` - Create, update, and delete member information
- `edit_settings` - Modify application settings
- `manage_roles` - Create, update, and delete roles
- `manage_permissions` - Create, update, and delete permissions
- `assign_roles` - Assign roles to users
- `assign_permissions` - Assign permissions to roles
- `view_financials` - View financial data
- `manage_contributions` - Record and manage contributions
- `manage_debts` - Record and manage debts
- `manage_penalties` - Record and manage penalties
- `manage_disaster_payments` - Record and manage disaster payments
- `view_personal_data` - View personal member data
- `export_data` - Export system data to various formats
- `import_data` - Import data from external sources
- `view_audit_logs` - View system audit logs and activity
- `manage_system_settings` - Modify system configuration settings
- `send_notifications` - Send notifications to members
- `manage_backups` - Create and manage system backups
- `view_analytics` - View system analytics and reports
- `manage_certificates` - Issue and manage member certificates
- `approve_members` - Approve or reject member applications
- `manage_dependents` - Manage member dependents
- `bulk_operations` - Perform bulk operations on data
- `advanced_reporting` - Access advanced reporting features

### 3. Role Detail View
**Location**: `resources/js/Pages/AdminPortal/Roles/Show.jsx`

**Features**:
- View complete role information
- List all assigned permissions
- List all users with this role
- Breadcrumb navigation
- System role indicator

### 4. Controllers

**RoleController** (`app/Http/Controllers/AdminPortal/RoleController.php`):
- `index()` - List all roles with counts
- `store()` - Create new role
- `update()` - Update role (with system role protection)
- `destroy()` - Delete role (with validation)
- `show()` - View role details
- `syncPermissions()` - Update role permissions

**PermissionController** (`app/Http/Controllers/AdminPortal/PermissionController.php`):
- `index()` - List all permissions
- `store()` - Create new permission
- `update()` - Update permission
- `destroy()` - Delete permission (with validation)

### 5. Validation Rules

**Role Name**:
- Required
- Unique
- Lowercase with underscores only (regex: `/^[a-z_]+$/`)
- Example: `custom_role`, `finance_manager`

**Permission Name**:
- Required
- Unique
- Lowercase with underscores only (regex: `/^[a-z_]+$/`)
- Example: `manage_users`, `view_reports`

### 6. Protection Mechanisms

**System Role Protection**:
- Cannot edit system roles (admin, secretary, member)
- Cannot delete system roles
- Visual indicator (gold "SYSTEM" tag)

**Deletion Validation**:
- Cannot delete role with assigned users
- Cannot delete permission assigned to roles
- Requires typing exact name to confirm deletion

**Permission Assignment**:
- Multi-select dropdown with search
- Shows permission count in real-time
- Displays permission descriptions

## Database Structure

### Tables
- `roles` - Stores role information
- `permissions` - Stores permission information
- `role_permission` - Pivot table for many-to-many relationship
- `users.role_id` - Foreign key linking users to roles

### Relationships
- Role `hasMany` Users
- Role `belongsToMany` Permissions
- Permission `belongsToMany` Roles
- User `belongsTo` Role

## Routes

### Roles
- `GET /admin-portal/roles` - List roles
- `POST /admin-portal/roles` - Create role
- `GET /admin-portal/roles/{role}` - View role details
- `PUT /admin-portal/roles/{role}` - Update role
- `DELETE /admin-portal/roles/{role}` - Delete role
- `POST /admin-portal/roles/{role}/sync-permissions` - Update role permissions

### Permissions
- `GET /admin-portal/permissions` - List permissions
- `POST /admin-portal/permissions` - Create permission
- `PUT /admin-portal/permissions/{permission}` - Update permission
- `DELETE /admin-portal/permissions/{permission}` - Delete permission

## UI Components

### Roles Index
- Compact table with small fonts (13px)
- Badge indicators for counts
- Three-dot dropdown menu for actions
- Modal forms for create/edit
- Separate modal for permission management
- Delete confirmation with name typing

### Permissions Index
- Similar compact design
- Shows assigned roles count
- Modal forms for create/edit
- Delete confirmation with name typing

### Role Show Page
- Breadcrumb navigation
- Organized sections with dividers
- Lists of permissions and users
- System role indicator

## Usage Examples

### Creating a Custom Role
```javascript
// Role name: finance_manager
// Description: Manages financial operations
// Permissions: view_financials, manage_contributions, view_reports
```

### Assigning Permissions to Role
1. Click three-dot menu on role
2. Select "Manage Permissions"
3. Select permissions from dropdown
4. Click "Update Permissions"

### Creating a Custom Permission
```javascript
// Permission name: manage_inventory
// Description: Manage inventory and stock
```

## Access Control
- Available in Admin Portal under Administration > Roles & Permissions
- Requires admin authentication
- System roles are protected from modification

## Future Enhancements
1. Permission categories/groups for better organization
2. Permission inheritance
3. Role hierarchy
4. Bulk permission assignment
5. Permission usage analytics
6. Role templates
7. Export/import roles and permissions
8. Permission testing interface
