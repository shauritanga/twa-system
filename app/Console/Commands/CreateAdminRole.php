<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Role;
use App\Models\Permission;

class CreateAdminRole extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'create:admin-role {--force : Force creation even if role exists}';

    /**
     * The console command description.
     */
    protected $description = 'Create admin role with all permissions';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $force = $this->option('force');

        // Check if admin role already exists
        $existingRole = Role::where('name', 'admin')->first();
        
        if ($existingRole && !$force) {
            $this->error('Admin role already exists!');
            $this->info('Use --force flag to recreate it.');
            return 1;
        }

        if ($existingRole && $force) {
            $this->warn('Admin role exists. Recreating...');
            $existingRole->delete();
        }

        // Create admin role
        $this->info('Creating admin role...');
        
        $adminRole = Role::create([
            'name' => 'admin',
            'display_name' => 'Administrator',
            'description' => 'System administrator with full access to all features'
        ]);

        $this->info('✓ Admin role created successfully');

        // Get all permissions
        $permissions = Permission::all();
        
        if ($permissions->isEmpty()) {
            $this->warn('No permissions found in the system.');
            $this->info('Creating basic permissions...');
            
            // Create basic permissions
            $basicPermissions = [
                ['name' => 'manage_users', 'display_name' => 'Manage Users', 'description' => 'Create, edit, and delete users'],
                ['name' => 'manage_members', 'display_name' => 'Manage Members', 'description' => 'Manage welfare association members'],
                ['name' => 'manage_contributions', 'display_name' => 'Manage Contributions', 'description' => 'Handle member contributions'],
                ['name' => 'manage_payments', 'display_name' => 'Manage Payments', 'description' => 'Handle disaster payments'],
                ['name' => 'manage_penalties', 'display_name' => 'Manage Penalties', 'description' => 'Manage member penalties'],
                ['name' => 'manage_reports', 'display_name' => 'Manage Reports', 'description' => 'Access and generate reports'],
                ['name' => 'manage_settings', 'display_name' => 'Manage Settings', 'description' => 'Configure system settings'],
                ['name' => 'view_audit_logs', 'display_name' => 'View Audit Logs', 'description' => 'Access audit trail'],
                ['name' => 'manage_roles', 'display_name' => 'Manage Roles', 'description' => 'Create and manage user roles'],
                ['name' => 'manage_backups', 'display_name' => 'Manage Backups', 'description' => 'Handle system backups'],
            ];

            foreach ($basicPermissions as $permissionData) {
                Permission::create($permissionData);
            }

            $permissions = Permission::all();
            $this->info('✓ Created ' . count($basicPermissions) . ' basic permissions');
        }

        // Assign all permissions to admin role
        $this->info('Assigning permissions to admin role...');
        
        $adminRole->permissions()->sync($permissions->pluck('id')->toArray());
        
        $this->info('✓ Assigned ' . $permissions->count() . ' permissions to admin role');

        // Display summary
        $this->info('');
        $this->info('🎉 Admin role setup completed!');
        $this->info('');
        $this->info('Role Details:');
        $this->info('- Name: ' . $adminRole->name);
        $this->info('- Display Name: ' . $adminRole->display_name);
        $this->info('- Permissions: ' . $adminRole->permissions()->count());
        $this->info('');
        $this->info('Next step: Create an admin user with:');
        $this->info('php artisan create:admin-user');

        return 0;
    }
}
