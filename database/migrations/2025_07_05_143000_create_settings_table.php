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
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->string('value');
            $table->string('description')->nullable();
            $table->timestamps();
        });

        // Insert default settings
        DB::table('settings')->insert([
            ['key' => 'monthly_contribution_amount', 'value' => '50000', 'description' => 'Default monthly contribution amount for members', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'penalty_percentage_rate', 'value' => '10', 'description' => 'Percentage rate applied to missed contributions for penalties', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'apply_penalty_to_existing', 'value' => '0', 'description' => 'Flag to apply penalty rate changes to existing unpaid penalties (1 for yes, 0 for no)', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'allow_admin_assignment', 'value' => '1', 'description' => 'Allow administrators to assign roles to users', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
