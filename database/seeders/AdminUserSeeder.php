<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure admin role exists
        $adminRole = Role::where('name', 'admin')->first();
        
        if (!$adminRole) {
            $this->command->error('Admin role does not exist! Please run RoleSeeder first.');
            return;
        }

        // Create admin user
        $adminUser = User::firstOrCreate(
            ['email' => 'shauritangaathanas@gmail.com'],
            [
                'name' => 'Athanas Shauritanga',
                'password' => Hash::make('password'),
                'role_id' => $adminRole->id,
                'email_verified_at' => now(),
                'phone' => '+255748571660',
                'bio' => 'System Administrator with full access to all features',
            ]
        );

        if ($adminUser->wasRecentlyCreated) {
            $this->command->info('✅ Admin user created successfully!');
        } else {
            $this->command->info('ℹ️  Admin user already exists.');
        }

        // Create additional admin users if needed
        $additionalAdmins = [
            [
                'name' => 'Super Admin',
                'email' => 'admin@twa.or.tz',
                'password' => Hash::make('password'),
                'phone' => '+255629593331',
                'bio' => 'Super Administrator account',
            ],
        ];

        foreach ($additionalAdmins as $adminData) {
            $user = User::firstOrCreate(
                ['email' => $adminData['email']],
                array_merge($adminData, [
                    'role_id' => $adminRole->id,
                    'email_verified_at' => now(),
                ])
            );

            if ($user->wasRecentlyCreated) {
                $this->command->info("✅ Additional admin user created: {$adminData['email']}");
            }
        }

        // Display summary
        $this->command->info('');
        $this->command->info('🎉 Admin user seeding completed!');
        $this->command->info('');
        $this->command->info('Login Credentials:');
        $this->command->info('📧 Email: shauritangaathanas@gmail.com');
        $this->command->info('🔑 Password: password');
        $this->command->info('');
        $this->command->info('Additional Admin:');
        $this->command->info('📧 Email: admin@twa.or.tz');
        $this->command->info('🔑 Password: password');
        $this->command->info('');
        $this->command->info('✅ Admin user ready for login!');
    }
}
