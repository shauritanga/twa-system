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

            // Add indexes for better performance
            //$table->index(['member_id', 'status'], 'idx_member_status');
            $table->index(['penalty_month'], 'idx_penalty_month');
            $table->index(['status', 'due_date'], 'idx_status_due_date');
            $table->index(['calculated_at'], 'idx_calculated_at');
        });

        // Add unique constraint to prevent duplicate penalties for same member/month
        try {
            Schema::table('penalties', function (Blueprint $table) {
                $table->unique(['member_id', 'penalty_month'], 'unique_member_penalty_month');
            });
        } catch (\Exception $e) {
            // Handle case where constraint already exists or data conflicts
            \Log::warning('Could not add unique constraint to penalties table: ' . $e->getMessage());
        }

        // Update existing penalties with penalty_month data
        $this->updateExistingPenalties();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('penalties', function (Blueprint $table) {
            // Drop unique constraint
            $table->dropUnique('unique_member_penalty_month');
            
            // Drop indexes
            $table->dropIndex('idx_member_status');
            $table->dropIndex('idx_penalty_month');
            $table->dropIndex('idx_status_due_date');
            $table->dropIndex('idx_calculated_at');
            
            // Drop new columns
            $table->dropColumn([
                'penalty_month',
                'contribution_amount', 
                'penalty_rate',
                'calculated_at'
            ]);
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
};
