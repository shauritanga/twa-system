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
        // Define default permissions
        $permissions = [
            ['name' => 'view_reports', 'description' => 'View financial and member reports'],
            ['name' => 'manage_members', 'description' => 'Create, update, and delete member information'],
            ['name' => 'edit_settings', 'description' => 'Modify application settings'],
            ['name' => 'manage_roles', 'description' => 'Create, update, and delete roles'],
            ['name' => 'manage_permissions', 'description' => 'Create, update, and delete permissions'],
            ['name' => 'assign_roles', 'description' => 'Assign roles to users'],
            ['name' => 'assign_permissions', 'description' => 'Assign permissions to roles'],
            ['name' => 'view_financials', 'description' => 'View financial data'],
            ['name' => 'manage_contributions', 'description' => 'Record and manage contributions'],
            ['name' => 'manage_debts', 'description' => 'Record and manage debts'],
            ['name' => 'manage_penalties', 'description' => 'Record and manage penalties'],
            ['name' => 'manage_disaster_payments', 'description' => 'Record and manage disaster payments'],
            ['name' => 'view_personal_data', 'description' => 'View personal member data'],
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
            // Secretary gets permissions related to reports, members, and financials
            $secretaryPermissions = Permission::whereIn('name', [
                'view_reports',
                'manage_members',
                'view_financials',
                'manage_contributions',
                'manage_debts',
                'manage_penalties',
                'manage_disaster_payments',
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
    }
}
