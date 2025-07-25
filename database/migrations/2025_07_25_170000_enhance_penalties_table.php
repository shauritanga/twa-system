<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('penalties', function (Blueprint $table) {
            // Add new columns for enhanced penalty tracking
            if (!Schema::hasColumn('penalties', 'penalty_month')) {
                $table->string('penalty_month')->nullable()->after('reason'); // Format: 'YYYY-MM'
            }

            if (!Schema::hasColumn('penalties', 'contribution_amount')) {
                $table->decimal('contribution_amount', 10, 2)->nullable()->after('penalty_month');
            }

            if (!Schema::hasColumn('penalties', 'penalty_rate')) {
                $table->decimal('penalty_rate', 5, 2)->nullable()->after('contribution_amount');
            }

            if (!Schema::hasColumn('penalties', 'calculated_at')) {
                $table->timestamp('calculated_at')->nullable()->after('penalty_rate');
            }
        });

        // Add indexes for better performance (with existence checks)
        $this->addIndexIfNotExists('penalties', ['penalty_month'], 'idx_penalty_month');
        $this->addIndexIfNotExists('penalties', ['status', 'due_date'], 'idx_status_due_date');
        $this->addIndexIfNotExists('penalties', ['calculated_at'], 'idx_calculated_at');

        // Add unique constraint to prevent duplicate penalties for same member/month
        $this->addUniqueConstraintIfNotExists('penalties', ['member_id', 'penalty_month'], 'unique_member_penalty_month');

        // Update existing penalties with penalty_month data
        $this->updateExistingPenalties();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('penalties', function (Blueprint $table) {
            // Drop unique constraint if exists
            $this->dropConstraintIfExists('penalties', 'unique_member_penalty_month', 'unique');

            // Drop indexes if they exist
            $this->dropIndexIfExists('penalties', 'idx_penalty_month');
            $this->dropIndexIfExists('penalties', 'idx_status_due_date');
            $this->dropIndexIfExists('penalties', 'idx_calculated_at');

            // Drop new columns if they exist
            if (Schema::hasColumn('penalties', 'penalty_month')) {
                $table->dropColumn('penalty_month');
            }
            if (Schema::hasColumn('penalties', 'contribution_amount')) {
                $table->dropColumn('contribution_amount');
            }
            if (Schema::hasColumn('penalties', 'penalty_rate')) {
                $table->dropColumn('penalty_rate');
            }
            if (Schema::hasColumn('penalties', 'calculated_at')) {
                $table->dropColumn('calculated_at');
            }
        });
    }

    /**
     * Update existing penalties with penalty_month data
     */
    private function updateExistingPenalties(): void
    {
        // Get all existing penalties and extract month from reason
        $penalties = \DB::table('penalties')->whereNull('penalty_month')->get();
        
        foreach ($penalties as $penalty) {
            $penaltyMonth = $this->extractMonthFromReason($penalty->reason);
            
            if ($penaltyMonth) {
                \DB::table('penalties')
                    ->where('id', $penalty->id)
                    ->update([
                        'penalty_month' => $penaltyMonth,
                        'calculated_at' => $penalty->created_at,
                        'updated_at' => now()
                    ]);
            }
        }
    }

    /**
     * Extract month from penalty reason string
     */
    private function extractMonthFromReason(?string $reason): ?string
    {
        if (!$reason) return null;

        // Match pattern like "Missed contribution for 2024-01"
        if (preg_match('/(\d{4}-\d{2})/', $reason, $matches)) {
            return $matches[1];
        }

        return null;
    }

    /**
     * Add index if it doesn't exist
     */
    private function addIndexIfNotExists(string $table, array $columns, string $indexName): void
    {
        try {
            if (!$this->indexExists($table, $indexName)) {
                Schema::table($table, function (Blueprint $table) use ($columns, $indexName) {
                    $table->index($columns, $indexName);
                });
            }
        } catch (\Exception $e) {
            \Log::warning("Could not add index {$indexName} to {$table} table: " . $e->getMessage());
        }
    }

    /**
     * Add unique constraint if it doesn't exist
     */
    private function addUniqueConstraintIfNotExists(string $table, array $columns, string $constraintName): void
    {
        try {
            if (!$this->constraintExists($table, $constraintName)) {
                Schema::table($table, function (Blueprint $table) use ($columns, $constraintName) {
                    $table->unique($columns, $constraintName);
                });
            }
        } catch (\Exception $e) {
            \Log::warning("Could not add unique constraint {$constraintName} to {$table} table: " . $e->getMessage());
        }
    }

    /**
     * Drop index if it exists
     */
    private function dropIndexIfExists(string $table, string $indexName): void
    {
        try {
            if ($this->indexExists($table, $indexName)) {
                Schema::table($table, function (Blueprint $table) use ($indexName) {
                    $table->dropIndex($indexName);
                });
            }
        } catch (\Exception $e) {
            \Log::warning("Could not drop index {$indexName} from {$table} table: " . $e->getMessage());
        }
    }

    /**
     * Drop constraint if it exists
     */
    private function dropConstraintIfExists(string $table, string $constraintName, string $type = 'unique'): void
    {
        try {
            if ($this->constraintExists($table, $constraintName)) {
                Schema::table($table, function (Blueprint $table) use ($constraintName, $type) {
                    if ($type === 'unique') {
                        $table->dropUnique($constraintName);
                    }
                });
            }
        } catch (\Exception $e) {
            \Log::warning("Could not drop {$type} constraint {$constraintName} from {$table} table: " . $e->getMessage());
        }
    }

    /**
     * Check if index exists
     */
    private function indexExists(string $table, string $indexName): bool
    {
        try {
            $connection = Schema::getConnection();
            $database = $connection->getDatabaseName();

            $result = $connection->select("
                SELECT COUNT(*) as count
                FROM information_schema.statistics
                WHERE table_schema = ?
                AND table_name = ?
                AND index_name = ?
            ", [$database, $table, $indexName]);

            return $result[0]->count > 0;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Check if constraint exists
     */
    private function constraintExists(string $table, string $constraintName): bool
    {
        try {
            $connection = Schema::getConnection();
            $database = $connection->getDatabaseName();

            $result = $connection->select("
                SELECT COUNT(*) as count
                FROM information_schema.table_constraints
                WHERE constraint_schema = ?
                AND table_name = ?
                AND constraint_name = ?
            ", [$database, $table, $constraintName]);

            return $result[0]->count > 0;
        } catch (\Exception $e) {
            return false;
        }
    }
};
