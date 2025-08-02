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
        // Check if table already exists
        if (!Schema::hasTable('fundraising_campaigns')) {
            Schema::create('fundraising_campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->text('full_description')->nullable();
            $table->decimal('goal_amount', 15, 2);
            $table->decimal('raised_amount', 15, 2)->default(0);
            $table->enum('status', ['draft', 'active', 'paused', 'completed', 'cancelled'])->default('draft');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->string('image_path')->nullable();
            $table->string('video_url')->nullable();
            $table->json('payment_methods')->nullable(); // Store available payment methods
            $table->text('bank_details')->nullable();
            $table->string('mobile_money_number')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->integer('sort_order')->default(0);
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();

            // Indexes for better performance
            $table->index(['status', 'start_date']);
            $table->index(['is_featured', 'status']);
            $table->index('end_date');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fundraising_campaigns');
    }
};
