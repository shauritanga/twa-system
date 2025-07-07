<?php

namespace App\Console\Commands;

use App\Models\Role;
use App\Models\Permission;
use App\Models\User;
use App\Models\Member;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class ManageRolesPermissions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'roles:manage 
                            {action : The action to perform (create-role, create-permission, create-admin, assign-permission, list)}
                            {--name= : Name of the role, permission, or user}
                            {--description= : Description for role or permission}
                            {--email= : Email for admin user}
                            {--password= : Password for admin user}
                            {--role= : Role name to assign permissions to}
                            {--permission= : Permission name to assign}
                            {--permissions=* : Multiple permissions to assign (space-separated)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Manage roles, permissions, and admin users';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $action = $this->argument('action');

        switch ($action) {
            case 'create-role':
                return $this->createRole();
            case 'create-permission':
                return $this->createPermission();
            case 'create-admin':
                return $this->createAdmin();
            case 'assign-permission':
                return $this->assignPermission();
            case 'list':
                return $this->listAll();
            default:
                $this->error('Invalid action. Available actions: create-role, create-permission, create-admin, assign-permission, list');
                return 1;
        }
    }

    /**
     * Create a new role
     */
    private function createRole()
    {
        $name = $this->option('name') ?: $this->ask('Enter role name');
        $description = $this->option('description') ?: $this->ask('Enter role description (optional)', '');

        if (Role::where('name', $name)->exists()) {
            $this->error("Role '{$name}' already exists!");
            return 1;
        }

        $role = Role::create([
            'name' => $name,
            'description' => $description,
        ]);

        $this->info("✅ Role '{$name}' created successfully!");
        $this->table(['ID', 'Name', 'Description'], [
            [$role->id, $role->name, $role->description]
        ]);

        return 0;
    }

    /**
     * Create a new permission
     */
    private function createPermission()
    {
        $name = $this->option('name') ?: $this->ask('Enter permission name');
        $description = $this->option('description') ?: $this->ask('Enter permission description (optional)', '');

        if (Permission::where('name', $name)->exists()) {
            $this->error("Permission '{$name}' already exists!");
            return 1;
        }

        $permission = Permission::create([
            'name' => $name,
            'description' => $description,
        ]);

        $this->info("✅ Permission '{$name}' created successfully!");
        $this->table(['ID', 'Name', 'Description'], [
            [$permission->id, $permission->name, $permission->description]
        ]);

        return 0;
    }

    /**
     * Create a new admin user
     */
    private function createAdmin()
    {
        $name = $this->option('name') ?: $this->ask('Enter admin name');
        $email = $this->option('email') ?: $this->ask('Enter admin email');
        $password = $this->option('password') ?: $this->secret('Enter admin password');

        if (User::where('email', $email)->exists()) {
            $this->error("User with email '{$email}' already exists!");
            return 1;
        }

        $adminRole = Role::where('name', 'admin')->first();
        if (!$adminRole) {
            $this->error('Admin role does not exist! Please run: php artisan db:seed --class=RoleSeeder');
            return 1;
        }

        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'role_id' => $adminRole->id,
        ]);

        $this->info("✅ Admin user created successfully!");
        $this->table(['ID', 'Name', 'Email', 'Role'], [
            [$user->id, $user->name, $user->email, $user->role->name]
        ]);

        return 0;
    }

    /**
     * Assign permission(s) to a role
     */
    private function assignPermission()
    {
        $roleName = $this->option('role') ?: $this->ask('Enter role name');
        $permissions = $this->option('permissions') ?: [$this->option('permission') ?: $this->ask('Enter permission name')];

        $role = Role::where('name', $roleName)->first();
        if (!$role) {
            $this->error("Role '{$roleName}' not found!");
            return 1;
        }

        $permissionIds = [];
        foreach ($permissions as $permissionName) {
            $permission = Permission::where('name', $permissionName)->first();
            if (!$permission) {
                $this->error("Permission '{$permissionName}' not found!");
                return 1;
            }
            $permissionIds[] = $permission->id;
        }

        $role->permissions()->syncWithoutDetaching($permissionIds);

        $this->info("✅ Permissions assigned to role '{$roleName}' successfully!");
        $this->info("Assigned permissions: " . implode(', ', $permissions));

        return 0;
    }

    /**
     * List all roles, permissions, and admin users
     */
    private function listAll()
    {
        $this->info('📋 ROLES:');
        $roles = Role::with('permissions')->get();
        $roleData = $roles->map(function ($role) {
            return [
                $role->id,
                $role->name,
                $role->description,
                $role->permissions->count() . ' permissions'
            ];
        });
        $this->table(['ID', 'Name', 'Description', 'Permissions'], $roleData->toArray());

        $this->info("\n🔐 PERMISSIONS:");
        $permissions = Permission::all();
        $permissionData = $permissions->map(function ($permission) {
            return [$permission->id, $permission->name, $permission->description];
        });
        $this->table(['ID', 'Name', 'Description'], $permissionData->toArray());

        $this->info("\n👥 ADMIN USERS:");
        $adminRole = Role::where('name', 'admin')->first();
        if ($adminRole) {
            $admins = User::where('role_id', $adminRole->id)->get();
            $adminData = $admins->map(function ($admin) {
                return [$admin->id, $admin->name, $admin->email, $admin->created_at->format('Y-m-d')];
            });
            $this->table(['ID', 'Name', 'Email', 'Created'], $adminData->toArray());
        }

        return 0;
    }
}
