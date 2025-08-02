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
        Schema::table('dependents', function (Blueprint $table) {
            if (!Schema::hasColumn('dependents', 'date_of_birth')) {
                $table->date('date_of_birth')->nullable()->after('relationship');
            }
            if (!Schema::hasColumn('dependents', 'tribe')) {
                $table->string('tribe')->nullable()->after('date_of_birth');
            }
            if (!Schema::hasColumn('dependents', 'residence')) {
                $table->string('residence')->nullable()->after('tribe');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dependents', function (Blueprint $table) {
            $columnsToDrop = [];
            $columns = ['date_of_birth', 'tribe', 'residence'];

            foreach ($columns as $column) {
                if (Schema::hasColumn('dependents', $column)) {
                    $columnsToDrop[] = $column;
                }
            }

            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }
};
