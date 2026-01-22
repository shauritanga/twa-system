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
        Schema::create('contribution_allocations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payment_id')->constrained()->onDelete('cascade');
            $table->foreignId('member_id')->constrained()->onDelete('cascade');
            $table->decimal('allocated_amount', 10, 2); // Amount allocated to this month
            $table->string('contribution_month'); // Format: YYYY-MM (which month this allocation is for)
            $table->enum('allocation_type', ['current', 'advance', 'partial']); // Type of allocation
            $table->text('notes')->nullable(); // Additional notes about this allocation
            $table->timestamps();
            
            // Indexes for better query performance
            $table->index('payment_id');
            $table->index('member_id');
            $table->index('contribution_month');
            
            // Unique constraint to prevent duplicate allocations for same payment and month
            $table->unique(['payment_id', 'contribution_month']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contribution_allocations');
    }
};
