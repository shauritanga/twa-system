<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class CleanupOrphanedUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'members:cleanup-orphaned-users {--dry-run : Show what would be deleted without actually deleting}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean up orphaned user records that don\'t have corresponding member records';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $dryRun = $this->option('dry-run');

        $this->info('Searching for orphaned user records...');

        // Find users that don't have corresponding member records
        $orphanedUsers = User::whereDoesntHave('member')->get();

        if ($orphanedUsers->isEmpty()) {
            $this->info('No orphaned user records found.');
            return 0;
        }

        $this->info("Found {$orphanedUsers->count()} orphaned user records:");

        $deletableUsers = [];
        foreach ($orphanedUsers as $user) {
            // Only consider users with 'member' role or no role for deletion
            if (!$user->role || $user->role->name === 'member') {
                $deletableUsers[] = $user;
                $this->line("- {$user->name} ({$user->email}) - Role: " . ($user->role ? $user->role->name : 'none'));
            } else {
                $this->warn("- {$user->name} ({$user->email}) - Role: {$user->role->name} [SKIPPED - Important role]");
            }
        }

        if (empty($deletableUsers)) {
            $this->info('No orphaned users are safe to delete (all have important roles).');
            return 0;
        }

        if ($dryRun) {
            $this->info("\nDry run mode: Would delete " . count($deletableUsers) . " orphaned user records.");
            $this->info('Run without --dry-run to actually delete these records.');
            return 0;
        }

        if (!$this->confirm("Are you sure you want to delete " . count($deletableUsers) . " orphaned user records?")) {
            $this->info('Operation cancelled.');
            return 0;
        }

        $deletedCount = 0;
        foreach ($deletableUsers as $user) {
            try {
                $user->delete();
                $deletedCount++;
                $this->info("Deleted: {$user->name} ({$user->email})");
            } catch (\Exception $e) {
                $this->error("Failed to delete {$user->name} ({$user->email}): " . $e->getMessage());
            }
        }

        $this->info("\nCleanup completed: {$deletedCount} orphaned user records deleted.");
        return 0;
    }
}
