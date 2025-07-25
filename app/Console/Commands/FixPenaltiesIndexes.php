<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class FixPenaltiesIndexes extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'fix:penalties-indexes {--dry-run : Show what would be done without executing}';

    /**
     * The console command description.
     */
    protected $description = 'Fix duplicate indexes on penalties table for production deployment';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $dryRun = $this->option('dry-run');
        
        if ($dryRun) {
            $this->info('DRY RUN MODE - No changes will be made');
        }

        $this->info('Checking penalties table indexes...');

        // Check if penalties table exists
        if (!Schema::hasTable('penalties')) {
            $this->error('Penalties table does not exist!');
            return 1;
        }

        // Get current indexes
        $indexes = $this->getCurrentIndexes();
        
        $this->info('Current indexes on penalties table:');
        foreach ($indexes as $index) {
            $this->line("- {$index->INDEX_NAME} on columns: {$index->COLUMNS}");
        }

        // Check for problematic indexes
        $problematicIndexes = ['idx_penalty_month', 'idx_status_due_date', 'idx_calculated_at'];
        $existingProblematicIndexes = [];

        foreach ($problematicIndexes as $indexName) {
            if ($this->indexExists($indexName)) {
                $existingProblematicIndexes[] = $indexName;
            }
        }

        if (empty($existingProblematicIndexes)) {
            $this->info('No problematic indexes found. Migration should run successfully.');
            return 0;
        }

        $this->warn('Found existing indexes that will conflict with migration:');
        foreach ($existingProblematicIndexes as $index) {
            $this->line("- {$index}");
        }

        if ($dryRun) {
            $this->info('Would drop the following indexes:');
            foreach ($existingProblematicIndexes as $index) {
                $this->line("- DROP INDEX {$index} ON penalties");
            }
            return 0;
        }

        if (!$this->confirm('Do you want to drop these indexes so the migration can recreate them properly?')) {
            $this->info('Operation cancelled.');
            return 0;
        }

        // Drop existing indexes
        foreach ($existingProblematicIndexes as $indexName) {
            try {
                $this->info("Dropping index: {$indexName}");
                DB::statement("DROP INDEX {$indexName} ON penalties");
                $this->info("✓ Successfully dropped {$indexName}");
            } catch (\Exception $e) {
                $this->error("✗ Failed to drop {$indexName}: " . $e->getMessage());
            }
        }

        // Check for unique constraint
        if ($this->constraintExists('unique_member_penalty_month')) {
            $this->warn('Found existing unique constraint: unique_member_penalty_month');
            
            if ($this->confirm('Do you want to drop this constraint so the migration can recreate it?')) {
                try {
                    $this->info('Dropping unique constraint: unique_member_penalty_month');
                    DB::statement('ALTER TABLE penalties DROP CONSTRAINT unique_member_penalty_month');
                    $this->info('✓ Successfully dropped unique_member_penalty_month');
                } catch (\Exception $e) {
                    $this->error('✗ Failed to drop unique_member_penalty_month: ' . $e->getMessage());
                }
            }
        }

        $this->info('✓ Cleanup completed. You can now run: php artisan migrate');
        
        return 0;
    }

    /**
     * Get current indexes on penalties table
     */
    private function getCurrentIndexes()
    {
        return DB::select("
            SELECT 
                INDEX_NAME,
                TABLE_NAME,
                GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX) as COLUMNS
            FROM information_schema.statistics 
            WHERE table_schema = DATABASE() 
            AND table_name = 'penalties' 
            AND INDEX_NAME != 'PRIMARY'
            GROUP BY INDEX_NAME, TABLE_NAME
        ");
    }

    /**
     * Check if index exists
     */
    private function indexExists(string $indexName): bool
    {
        try {
            $result = DB::select("
                SELECT COUNT(*) as count 
                FROM information_schema.statistics 
                WHERE table_schema = DATABASE() 
                AND table_name = 'penalties' 
                AND index_name = ?
            ", [$indexName]);
            
            return $result[0]->count > 0;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Check if constraint exists
     */
    private function constraintExists(string $constraintName): bool
    {
        try {
            $result = DB::select("
                SELECT COUNT(*) as count 
                FROM information_schema.table_constraints 
                WHERE constraint_schema = DATABASE() 
                AND table_name = 'penalties' 
                AND constraint_name = ?
            ", [$constraintName]);
            
            return $result[0]->count > 0;
        } catch (\Exception $e) {
            return false;
        }
    }
}
