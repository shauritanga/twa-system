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
        Schema::table('members', function (Blueprint $table) {
            if (!Schema::hasColumn('members', 'tribe')) {
                $table->string('tribe')->nullable()->after('date_of_birth');
            }
            if (!Schema::hasColumn('members', 'occupation')) {
                $table->string('occupation')->nullable()->after('tribe');
            }
            if (!Schema::hasColumn('members', 'reason_for_membership')) {
                $table->text('reason_for_membership')->nullable()->after('occupation');
            }
            if (!Schema::hasColumn('members', 'applicant_date')) {
                $table->date('applicant_date')->nullable()->after('reason_for_membership');
            }
            if (!Schema::hasColumn('members', 'declaration_name')) {
                $table->string('declaration_name')->nullable()->after('applicant_date');
            }
            if (!Schema::hasColumn('members', 'witness_name')) {
                $table->string('witness_name')->nullable()->after('declaration_name');
            }
            if (!Schema::hasColumn('members', 'witness_date')) {
                $table->date('witness_date')->nullable()->after('witness_name');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('members', function (Blueprint $table) {
            $columnsToDrop = [];
            $columns = ['tribe', 'occupation', 'reason_for_membership', 'applicant_date', 'declaration_name', 'witness_name', 'witness_date'];

            foreach ($columns as $column) {
                if (Schema::hasColumn('members', $column)) {
                    $columnsToDrop[] = $column;
                }
            }

            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }
};
