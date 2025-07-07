<?php

namespace App\Console\Commands;

use App\Models\Role;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class SetupRolesPermissions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'setup:roles-permissions 
                            {--admin-name= : Admin user name}
                            {--admin-email= : Admin user email}
                            {--admin-password= : Admin user password}
                            {--force : Force setup even if data exists}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Setup roles, permissions, and create initial admin user';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🚀 Setting up Roles & Permissions System...');

        // Check if setup already exists
        if (!$this->option('force') && Role::exists()) {
            if (!$this->confirm('Roles already exist. Do you want to continue?')) {
                $this->info('Setup cancelled.');
                return 0;
            }
        }

        // Run seeders
        $this->info('📋 Creating roles and permissions...');
        $this->call('db:seed', ['--class' => 'RoleSeeder']);
        $this->call('db:seed', ['--class' => 'PermissionSeeder']);

        // Create admin user if requested
        if ($this->option('admin-name') || $this->confirm('Do you want to create an admin user?')) {
            $this->createAdminUser();
        }

        $this->info('✅ Setup completed successfully!');
        $this->displaySummary();

        return 0;
    }

    /**
     * Create admin user
     */
    private function createAdminUser()
    {
        $name = $this->option('admin-name') ?: $this->ask('Enter admin name');
        $email = $this->option('admin-email') ?: $this->ask('Enter admin email');
        $password = $this->option('admin-password') ?: $this->secret('Enter admin password');

        // Check if user exists
        if (User::where('email', $email)->exists()) {
            $this->warn("User with email '{$email}' already exists!");
            return;
        }

        $adminRole = Role::where('name', 'admin')->first();
        if (!$adminRole) {
            $this->error('Admin role not found!');
            return;
        }

        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'role_id' => $adminRole->id,
        ]);

        $this->info("👤 Admin user '{$name}' created successfully!");
    }

    /**
     * Display setup summary
     */
    private function displaySummary()
    {
        $this->info("\n📊 SETUP SUMMARY:");
        
        // Roles
        $roles = Role::withCount('permissions')->get();
        $this->table(['Role', 'Description', 'Permissions'], $roles->map(function ($role) {
            return [$role->name, $role->description, $role->permissions_count];
        })->toArray());

        // Admin users
        $adminRole = Role::where('name', 'admin')->first();
        if ($adminRole) {
            $admins = User::where('role_id', $adminRole->id)->get();
            if ($admins->count() > 0) {
                $this->info("\n👥 ADMIN USERS:");
                $this->table(['Name', 'Email'], $admins->map(function ($admin) {
                    return [$admin->name, $admin->email];
                })->toArray());
            }
        }

        $this->info("\n🎯 NEXT STEPS:");
        $this->line("• Use 'php artisan roles:manage list' to view all roles and permissions");
        $this->line("• Use 'php artisan roles:manage create-admin' to create more admin users");
        $this->line("• Use 'php artisan roles:manage create-role --name=manager' to create custom roles");
        $this->line("• Use 'php artisan roles:manage create-permission --name=custom_permission' to create permissions");
    }
}
