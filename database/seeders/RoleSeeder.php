<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\User;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Create default roles if they don't exist
        $roles = [
            ['name' => 'admin', 'description' => 'Administrator with full access'],
            ['name' => 'secretary', 'description' => 'Secretary with access to reports and member management'],
            ['name' => 'member', 'description' => 'Regular member with limited access'],
        ];

        foreach ($roles as $roleData) {
            $role = Role::firstOrCreate(['name' => $roleData['name']], $roleData);
        }

        // Update existing users to assign role_id based on their old role value
        // This assumes that before migration, users had a 'role' string field
        // Since the field is dropped, we can't access it directly, so we'll assign 'member' to all without role_id
        // and ensure at least one admin exists
        $adminRole = Role::where('name', 'admin')->first();
        $memberRole = Role::where('name', 'member')->first();

        // Assign admin role to the first user or any user without a role_id
        $firstUser = User::whereNull('role_id')->first();
        if ($firstUser) {
            $firstUser->update(['role_id' => $adminRole->id]);
        }

        // Assign member role to all other users without a role_id
        User::whereNull('role_id')->update(['role_id' => $memberRole->id]);
    }
}
