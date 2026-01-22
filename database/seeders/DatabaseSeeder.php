<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        $this->call(RoleSeeder::class);
        $this->call(PermissionSeeder::class);
        $this->call(AdditionalPermissionsSeeder::class);
        $this->call(AdminUserSeeder::class);
        $this->call(DefaultSettingsSeeder::class);
        $this->call(DefaultAccountsSeeder::class);
        $this->call(AccountingIntegrationSeeder::class);
        $this->call(SampleDocumentsSeeder::class);
    }
}
