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
        Schema::create('accounts', function (Blueprint $table) {
            $table->id();
            $table->string('account_code')->unique(); // e.g., 1000, 1100, 2000
            $table->string('account_name'); // e.g., Cash, Accounts Receivable
            $table->enum('account_type', ['asset', 'liability', 'equity', 'revenue', 'expense']); // Main categories
            $table->string('account_subtype')->nullable(); // e.g., Current Asset, Fixed Asset, Current Liability
            $table->foreignId('parent_account_id')->nullable()->constrained('accounts')->onDelete('cascade'); // For sub-accounts
            $table->text('description')->nullable();
            $table->decimal('opening_balance', 15, 2)->default(0);
            $table->decimal('current_balance', 15, 2)->default(0);
            $table->enum('normal_balance', ['debit', 'credit']); // Normal balance side
            $table->boolean('is_active')->default(true);
            $table->boolean('is_system_account')->default(false); // System accounts can't be deleted
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accounts');
    }
};
