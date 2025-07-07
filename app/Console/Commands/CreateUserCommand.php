<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Member;
use Illuminate\Support\Facades\Hash;

class CreateUserCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:create {name} {email} {password} {role?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new user with the specified role';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $name = $this->argument('name');
        $email = $this->argument('email');
        $password = $this->argument('password');
        $roleName = $this->argument('role') ?? 'member';

        // Check if user already exists
        if (User::where('email', $email)->exists()) {
            $this->error("User with email '{$email}' already exists!");
            return 1;
        }

        // Find the role
        $role = \App\Models\Role::where('name', $roleName)->first();
        if (!$role) {
            $this->error("Role '{$roleName}' not found! Available roles: " . \App\Models\Role::pluck('name')->implode(', '));
            return 1;
        }

        // Create the user
        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'role_id' => $role->id,
        ]);

        // If the role is not admin, create a linked Member record
        if ($roleName !== 'admin') {
            Member::create([
                'user_id' => $user->id,
                'name' => $user->name,
            ]);
        }

        $this->info("✅ User created successfully!");
        $this->info("Name: {$user->name}");
        $this->info("Email: {$user->email}");
        $this->info("Role: {$user->role->name}");

        return 0;
    }
}
