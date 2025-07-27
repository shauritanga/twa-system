<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class CreateAdminUser extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'create:admin-user 
                            {--name= : Admin user name}
                            {--email= : Admin email address}
                            {--password= : Admin password}
                            {--force : Force creation even if user exists}';

    /**
     * The console command description.
     */
    protected $description = 'Create an admin user with admin role';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $force = $this->option('force');

        // Check if admin role exists
        $adminRole = Role::where('name', 'admin')->first();
        
        if (!$adminRole) {
            $this->error('Admin role does not exist!');
            $this->info('Please create admin role first with:');
            $this->info('php artisan create:admin-role');
            return 1;
        }

        // Get user details
        $name = $this->option('name') ?: $this->ask('Enter admin name');
        $email = $this->option('email') ?: $this->ask('Enter admin email');
        $password = $this->option('password') ?: $this->secret('Enter admin password');

        // Validate input
        $validator = Validator::make([
            'name' => $name,
            'email' => $email,
            'password' => $password,
        ], [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            $this->error('Validation failed:');
            foreach ($validator->errors()->all() as $error) {
                $this->error('- ' . $error);
            }
            return 1;
        }

        // Check if user already exists
        $existingUser = User::where('email', $email)->first();
        
        if ($existingUser && !$force) {
            $this->error('User with email "' . $email . '" already exists!');
            $this->info('Use --force flag to update existing user.');
            return 1;
        }

        if ($existingUser && $force) {
            $this->warn('User exists. Updating...');
            
            $existingUser->update([
                'name' => $name,
                'password' => Hash::make($password),
                'role_id' => $adminRole->id,
                'email_verified_at' => now(),
            ]);

            $user = $existingUser;
            $this->info('✓ Admin user updated successfully');
        } else {
            // Create new admin user
            $this->info('Creating admin user...');
            
            $user = User::create([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make($password),
                'role_id' => $adminRole->id,
                'email_verified_at' => now(),
            ]);

            $this->info('✓ Admin user created successfully');
        }

        // Display summary
        $this->info('');
        $this->info('🎉 Admin user setup completed!');
        $this->info('');
        $this->info('User Details:');
        $this->info('- ID: ' . $user->id);
        $this->info('- Name: ' . $user->name);
        $this->info('- Email: ' . $user->email);
        $this->info('- Role: ' . $user->role->display_name ?? 'Admin');
        $this->info('- Created: ' . $user->created_at->format('Y-m-d H:i:s'));
        $this->info('');
        $this->info('Login credentials:');
        $this->info('- Email: ' . $user->email);
        $this->info('- Password: [hidden for security]');
        $this->info('');
        $this->info('You can now login to the admin panel!');

        return 0;
    }
}
