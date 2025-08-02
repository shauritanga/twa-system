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
        Schema::table('contributions', function (Blueprint $table) {
            if (!Schema::hasColumn('contributions', 'type')) {
                $table->enum('type', ['monthly', 'other'])->default('monthly')->after('purpose');
            }
            if (!Schema::hasColumn('contributions', 'months_covered')) {
                $table->integer('months_covered')->default(1)->after('type');
            }
            if (!Schema::hasColumn('contributions', 'contribution_month')) {
                $table->string('contribution_month')->nullable()->after('months_covered'); // Format: YYYY-MM
            }
            if (!Schema::hasColumn('contributions', 'notes')) {
                $table->text('notes')->nullable()->after('contribution_month');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contributions', function (Blueprint $table) {
            $columnsToDrop = [];
            $columns = ['type', 'months_covered', 'contribution_month', 'notes'];

            foreach ($columns as $column) {
                if (Schema::hasColumn('contributions', $column)) {
                    $columnsToDrop[] = $column;
                }
            }

            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }
};
