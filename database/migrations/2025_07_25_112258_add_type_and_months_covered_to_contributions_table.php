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
            $table->enum('type', ['monthly', 'other'])->default('monthly')->after('purpose');
            $table->integer('months_covered')->default(1)->after('type');
            $table->string('contribution_month')->nullable()->after('months_covered'); // Format: YYYY-MM
            $table->text('notes')->nullable()->after('contribution_month');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contributions', function (Blueprint $table) {
            $table->dropColumn(['type', 'months_covered', 'contribution_month', 'notes']);
        });
    }
};
