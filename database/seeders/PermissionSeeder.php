<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;
use App\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Define comprehensive permissions based on actual system features
        $permissions = [
            // Dashboard & Overview
            ['name' => 'view_dashboard', 'description' => 'View admin dashboard'],
            
            // Member Management
            ['name' => 'view_members', 'description' => 'View member list and details'],
            ['name' => 'create_members', 'description' => 'Create new members'],
            ['name' => 'edit_members', 'description' => 'Edit member information'],
            ['name' => 'delete_members', 'description' => 'Delete members'],
            ['name' => 'archive_members', 'description' => 'Archive/restore members'],
            
            // Financial Management
            ['name' => 'view_financials', 'description' => 'View financial data and reports'],
            ['name' => 'manage_contributions', 'description' => 'Record and manage member contributions'],
            ['name' => 'manage_expenses', 'description' => 'Record and manage expenses'],
            ['name' => 'manage_assets', 'description' => 'Manage organizational assets'],
            ['name' => 'manage_debts', 'description' => 'Record and manage member debts'],
            ['name' => 'manage_penalties', 'description' => 'Record and manage penalties'],
            ['name' => 'manage_disaster_payments', 'description' => 'Record and manage disaster payments'],
            
            // Accounting System
            ['name' => 'view_accounting', 'description' => 'Access accounting features'],
            ['name' => 'manage_chart_of_accounts', 'description' => 'Manage chart of accounts'],
            ['name' => 'manage_journal_entries', 'description' => 'Create and manage journal entries'],
            ['name' => 'view_general_ledger', 'description' => 'View general ledger'],
            ['name' => 'view_trial_balance', 'description' => 'View trial balance'],
            ['name' => 'view_balance_sheet', 'description' => 'View balance sheet'],
            ['name' => 'view_income_statement', 'description' => 'View income statement'],
            ['name' => 'view_cash_flow', 'description' => 'View cash flow statement'],
            
            // Document Management
            ['name' => 'view_documents', 'description' => 'View documents'],
            ['name' => 'upload_documents', 'description' => 'Upload new documents'],
            ['name' => 'delete_documents', 'description' => 'Delete documents'],
            
            // Communication
            ['name' => 'manage_announcements', 'description' => 'Create and manage announcements'],
            ['name' => 'manage_fundraising', 'description' => 'Manage fundraising campaigns'],
            
            // Reports
            ['name' => 'view_reports', 'description' => 'View and generate reports'],
            ['name' => 'export_reports', 'description' => 'Export reports to various formats'],
            
            // System Administration
            ['name' => 'manage_roles', 'description' => 'Create, update, and delete roles'],
            ['name' => 'manage_permissions', 'description' => 'Create, update, and delete permissions'],
            ['name' => 'assign_roles', 'description' => 'Assign roles to users'],
            ['name' => 'manage_backups', 'description' => 'Create and manage system backups'],
            ['name' => 'view_audit_logs', 'description' => 'View system audit trail'],
            ['name' => 'manage_settings', 'description' => 'Modify system settings'],
            
            // Personal Data (for members)
            ['name' => 'view_personal_data', 'description' => 'View own personal data and contributions'],
        ];

        // Create permissions if they don't exist
        foreach ($permissions as $permissionData) {
            Permission::firstOrCreate(['name' => $permissionData['name']], $permissionData);
        }

        // Assign permissions to roles
        $adminRole = Role::where('name', 'admin')->first();
        $secretaryRole = Role::where('name', 'secretary')->first();
        $memberRole = Role::where('name', 'member')->first();

        if ($adminRole) {
            // Admin gets all permissions
            $allPermissions = Permission::all()->pluck('id')->toArray();
            $adminRole->permissions()->sync($allPermissions);
        }

        if ($secretaryRole) {
            // Secretary gets permissions for daily operations (no system admin features)
            $secretaryPermissions = Permission::whereIn('name', [
                'view_dashboard',
                'view_members',
                'create_members',
                'edit_members',
                'archive_members',
                'view_financials',
                'manage_contributions',
                'manage_expenses',
                'manage_assets',
                'manage_debts',
                'manage_penalties',
                'manage_disaster_payments',
                'view_documents',
                'upload_documents',
                'manage_announcements',
                'view_reports',
                'export_reports',
            ])->pluck('id')->toArray();
            $secretaryRole->permissions()->sync($secretaryPermissions);
        }

        if ($memberRole) {
            // Member gets permission to view personal data only
            $memberPermissions = Permission::whereIn('name', [
                'view_personal_data',
            ])->pluck('id')->toArray();
            $memberRole->permissions()->sync($memberPermissions);
        }

        $this->command->info('✅ ' . count($permissions) . ' permissions created/updated successfully!');
        $this->command->info('✅ Permissions assigned to roles successfully!');
    }
}
