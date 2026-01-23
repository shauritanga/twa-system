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
        // Rename debts table to loans
        Schema::rename('debts', 'loans');
        
        // Add loan-specific fields
        Schema::table('loans', function (Blueprint $table) {
            // Rename columns for clarity
            $table->renameColumn('reason', 'purpose');
            
            // Add loan-specific fields
            $table->decimal('interest_rate', 5, 2)->default(13.00)->after('amount'); // Monthly interest rate %
            $table->decimal('interest_amount', 10, 2)->default(0)->after('interest_rate'); // Calculated interest
            $table->decimal('total_amount', 10, 2)->default(0)->after('interest_amount'); // Principal + Interest
            $table->date('disbursed_date')->nullable()->after('total_amount'); // When loan was given
            $table->date('repaid_date')->nullable()->after('disbursed_date'); // When loan was repaid
            $table->integer('term_months')->default(1)->after('repaid_date'); // Loan term in months
            $table->unsignedBigInteger('disbursement_journal_entry_id')->nullable()->after('journal_entry_id');
            $table->unsignedBigInteger('repayment_journal_entry_id')->nullable()->after('disbursement_journal_entry_id');
            
            // Add foreign keys
            $table->foreign('disbursement_journal_entry_id')->references('id')->on('journal_entries')->onDelete('set null');
            $table->foreign('repayment_journal_entry_id')->references('id')->on('journal_entries')->onDelete('set null');
            
            // Update status values (pending, disbursed, repaid, defaulted)
            $table->string('status')->default('pending')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('loans', function (Blueprint $table) {
            // Drop foreign keys
            $table->dropForeign(['disbursement_journal_entry_id']);
            $table->dropForeign(['repayment_journal_entry_id']);
            
            // Drop added columns
            $table->dropColumn([
                'interest_rate',
                'interest_amount', 
                'total_amount',
                'disbursed_date',
                'repaid_date',
                'term_months',
                'disbursement_journal_entry_id',
                'repayment_journal_entry_id'
            ]);
            
            // Rename column back
            $table->renameColumn('purpose', 'reason');
        });
        
        // Rename table back
        Schema::rename('loans', 'debts');
    }
};