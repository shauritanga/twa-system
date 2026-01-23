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
        Schema::table('loans', function (Blueprint $table) {
            // Fix default values for required fields
            $table->decimal('total_amount', 10, 2)->default(0)->change();
            
            // Update existing records to have calculated values
            DB::statement('UPDATE loans SET total_amount = amount WHERE total_amount = 0');
            DB::statement('UPDATE loans SET interest_amount = (amount * interest_rate / 100 * term_months) WHERE interest_amount = 0');
            DB::statement('UPDATE loans SET total_amount = (amount + interest_amount) WHERE total_amount = amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No need to reverse this fix
    }
};