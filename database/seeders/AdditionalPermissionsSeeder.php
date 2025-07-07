<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;
use App\Models\Role;

class AdditionalPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Additional permissions that might be useful
        $additionalPermissions = [
            ['name' => 'export_data', 'description' => 'Export system data to various formats'],
            ['name' => 'import_data', 'description' => 'Import data from external sources'],
            ['name' => 'view_audit_logs', 'description' => 'View system audit logs and activity'],
            ['name' => 'manage_system_settings', 'description' => 'Modify system configuration settings'],
            ['name' => 'send_notifications', 'description' => 'Send notifications to members'],
            ['name' => 'manage_backups', 'description' => 'Create and manage system backups'],
            ['name' => 'view_analytics', 'description' => 'View system analytics and reports'],
            ['name' => 'manage_certificates', 'description' => 'Issue and manage member certificates'],
            ['name' => 'approve_members', 'description' => 'Approve or reject member applications'],
            ['name' => 'manage_dependents', 'description' => 'Manage member dependents'],
            ['name' => 'bulk_operations', 'description' => 'Perform bulk operations on data'],
            ['name' => 'advanced_reporting', 'description' => 'Access advanced reporting features'],
        ];

        // Create permissions if they don't exist
        foreach ($additionalPermissions as $permissionData) {
            Permission::firstOrCreate(['name' => $permissionData['name']], $permissionData);
        }

        // Assign some additional permissions to admin role
        $adminRole = Role::where('name', 'admin')->first();
        if ($adminRole) {
            $adminPermissions = Permission::whereIn('name', [
                'export_data',
                'import_data',
                'view_audit_logs',
                'manage_system_settings',
                'send_notifications',
                'manage_backups',
                'view_analytics',
                'manage_certificates',
                'approve_members',
                'manage_dependents',
                'bulk_operations',
                'advanced_reporting',
            ])->pluck('id')->toArray();
            
            $adminRole->permissions()->syncWithoutDetaching($adminPermissions);
        }

        // Assign some permissions to secretary role
        $secretaryRole = Role::where('name', 'secretary')->first();
        if ($secretaryRole) {
            $secretaryPermissions = Permission::whereIn('name', [
                'export_data',
                'view_analytics',
                'manage_certificates',
                'approve_members',
                'manage_dependents',
                'send_notifications',
            ])->pluck('id')->toArray();
            
            $secretaryRole->permissions()->syncWithoutDetaching($secretaryPermissions);
        }

        $this->command->info('Additional permissions created and assigned successfully!');
    }
}
