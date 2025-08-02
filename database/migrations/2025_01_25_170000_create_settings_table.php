<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Check if table already exists
        if (!Schema::hasTable('settings')) {
            Schema::create('settings', function (Blueprint $table) {
                $table->id();
                $table->string('key')->unique();
                $table->string('value');
                $table->string('description')->nullable();
                $table->timestamps();
            });

            // Insert default settings only if table was just created
            DB::table('settings')->insert([
                ['key' => 'monthly_contribution_amount', 'value' => '50000', 'description' => 'Default monthly contribution amount for members', 'created_at' => now(), 'updated_at' => now()],
                ['key' => 'penalty_percentage_rate', 'value' => '10', 'description' => 'Percentage rate applied to missed contributions for penalties', 'created_at' => now(), 'updated_at' => now()],
                ['key' => 'apply_penalty_to_existing', 'value' => '0', 'description' => 'Flag to apply penalty rate changes to existing unpaid penalties (1 for yes, 0 for no)', 'created_at' => now(), 'updated_at' => now()],
                ['key' => 'allow_admin_assignment', 'value' => '1', 'description' => 'Allow administrators to assign roles to users', 'created_at' => now(), 'updated_at' => now()],
            ]);
        } else {
            // Table exists, check if default settings need to be inserted
            $existingSettings = DB::table('settings')->whereIn('key', [
                'monthly_contribution_amount',
                'penalty_percentage_rate',
                'apply_penalty_to_existing',
                'allow_admin_assignment'
            ])->pluck('key')->toArray();

            $defaultSettings = [
                'monthly_contribution_amount' => ['value' => '50000', 'description' => 'Default monthly contribution amount for members'],
                'penalty_percentage_rate' => ['value' => '10', 'description' => 'Percentage rate applied to missed contributions for penalties'],
                'apply_penalty_to_existing' => ['value' => '0', 'description' => 'Flag to apply penalty rate changes to existing unpaid penalties (1 for yes, 0 for no)'],
                'allow_admin_assignment' => ['value' => '1', 'description' => 'Allow administrators to assign roles to users'],
            ];

            foreach ($defaultSettings as $key => $data) {
                if (!in_array($key, $existingSettings)) {
                    DB::table('settings')->insert([
                        'key' => $key,
                        'value' => $data['value'],
                        'description' => $data['description'],
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
