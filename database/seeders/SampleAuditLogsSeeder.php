<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AuditLog;
use App\Models\User;
use Carbon\Carbon;

class SampleAuditLogsSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        
        if ($users->isEmpty()) {
            $this->command->warn('No users found. Please seed users first.');
            return;
        }

        $actions = ['created', 'updated', 'deleted', 'viewed', 'login', 'logout', 'posted', 'reversed'];
        $categories = ['auth', 'member', 'financial', 'system', 'security', 'general'];
        $severities = ['low', 'medium', 'high', 'critical'];
        $modelTypes = [
            'App\Models\Member',
            'App\Models\Account',
            'App\Models\JournalEntry',
            'App\Models\Expense',
            'App\Models\Asset',
            'App\Models\User',
        ];

        $descriptions = [
            'User logged in successfully',
            'Member profile updated',
            'Journal entry posted to ledger',
            'Expense approved by administrator',
            'Account balance updated',
            'New member registered',
            'Password changed',
            'Financial report generated',
            'System settings modified',
            'Backup created successfully',
            'User role changed',
            'Document uploaded',
            'Announcement published',
            'Asset status updated',
            'Journal entry reversed',
        ];

        // Create 50 sample audit logs
        for ($i = 0; $i < 50; $i++) {
            $user = $users->random();
            $action = $actions[array_rand($actions)];
            $category = $categories[array_rand($categories)];
            $severity = $severities[array_rand($severities)];
            $modelType = $modelTypes[array_rand($modelTypes)];
            $description = $descriptions[array_rand($descriptions)];

            $oldValues = null;
            $newValues = null;

            // Add sample old/new values for update actions
            if ($action === 'updated') {
                $oldValues = [
                    'status' => 'pending',
                    'amount' => '1000.00',
                    'name' => 'Old Value',
                ];
                $newValues = [
                    'status' => 'approved',
                    'amount' => '1500.00',
                    'name' => 'New Value',
                ];
            }

            AuditLog::create([
                'user_id' => $user->id,
                'user_name' => $user->name,
                'user_email' => $user->email,
                'user_role' => $user->role?->name ?? 'member',
                'action' => $action,
                'model_type' => $modelType,
                'model_id' => rand(1, 100),
                'model_name' => class_basename($modelType) . ' #' . rand(1, 100),
                'ip_address' => $this->randomIp(),
                'user_agent' => $this->randomUserAgent(),
                'url' => '/admin-portal/' . strtolower(class_basename($modelType)) . 's',
                'method' => $this->randomMethod($action),
                'old_values' => $oldValues,
                'new_values' => $newValues,
                'properties' => [
                    'browser' => ['Chrome', 'Firefox', 'Safari', 'Edge'][array_rand(['Chrome', 'Firefox', 'Safari', 'Edge'])],
                    'platform' => ['Windows', 'macOS', 'Linux', 'iOS', 'Android'][array_rand(['Windows', 'macOS', 'Linux', 'iOS', 'Android'])],
                ],
                'description' => $description,
                'category' => $category,
                'severity' => $severity,
                'session_id' => 'session_' . uniqid(),
                'batch_id' => rand(0, 1) ? 'batch_' . uniqid() : null,
                'created_at' => Carbon::now()->subDays(rand(0, 30))->subHours(rand(0, 23)),
            ]);
        }

        $this->command->info('Sample audit logs created successfully!');
    }

    private function randomIp(): string
    {
        return rand(1, 255) . '.' . rand(0, 255) . '.' . rand(0, 255) . '.' . rand(1, 255);
    }

    private function randomUserAgent(): string
    {
        $userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
        ];
        return $userAgents[array_rand($userAgents)];
    }

    private function randomMethod(string $action): string
    {
        return match($action) {
            'created' => 'POST',
            'updated' => 'PUT',
            'deleted' => 'DELETE',
            'viewed', 'login', 'logout' => 'GET',
            default => 'POST',
        };
    }
}
