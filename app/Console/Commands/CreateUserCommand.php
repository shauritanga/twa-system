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
        $role = $this->argument('role') ?? 'member';

        // Create the user
        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'role' => $role,
        ]);

        // If the role is not admin, create a linked Member record
        if ($role !== 'admin') {
            Member::create([
                'user_id' => $user->id,
                'name' => $user->name,
            ]);
        }

        $this->info("User created successfully!");
        $this->info("Name: {$user->name}");
        $this->info("Email: {$user->email}");
        $this->info("Role: {$user->role}");

        return 0;
    }
}
