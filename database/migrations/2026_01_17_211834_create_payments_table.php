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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')->constrained()->onDelete('cascade');
            $table->decimal('amount', 10, 2);
            $table->date('payment_date'); // Actual date money was received
            $table->enum('payment_type', ['monthly', 'other']); // Type of payment
            $table->string('purpose'); // Purpose of payment
            $table->text('notes')->nullable(); // Additional notes
            $table->string('payment_method')->nullable(); // cash, bank transfer, mobile money, etc.
            $table->string('reference_number')->nullable(); // Transaction reference
            $table->timestamps();
            
            // Indexes for better query performance
            $table->index('member_id');
            $table->index('payment_date');
            $table->index('payment_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
