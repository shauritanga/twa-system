<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Loan extends Model
{
    protected $fillable = [
        'member_id',
        'amount', // Principal amount
        'interest_rate', // Monthly interest rate %
        'interest_amount', // Calculated interest
        'total_amount', // Principal + Interest
        'purpose',
        'due_date',
        'disbursed_date',
        'repaid_date',
        'term_months',
        'status', // pending, disbursed, repaid, defaulted
        'journal_entry_id', // For backward compatibility
        'disbursement_journal_entry_id',
        'repayment_journal_entry_id'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'interest_rate' => 'decimal:2',
        'interest_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'due_date' => 'date',
        'disbursed_date' => 'date',
        'repaid_date' => 'date',
    ];

    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    public function disbursementJournalEntry()
    {
        return $this->belongsTo(JournalEntry::class, 'disbursement_journal_entry_id');
    }

    public function repaymentJournalEntry()
    {
        return $this->belongsTo(JournalEntry::class, 'repayment_journal_entry_id');
    }

    // For backward compatibility
    public function journalEntry()
    {
        return $this->belongsTo(JournalEntry::class);
    }

    /**
     * Calculate interest amount based on principal, rate, and term
     */
    public function calculateInterest(): float
    {
        $principal = $this->amount;
        $monthlyRate = $this->interest_rate / 100;
        $months = $this->term_months;
        
        // Simple interest calculation: Principal × Rate × Time
        return $principal * $monthlyRate * $months;
    }

    /**
     * Calculate total amount (principal + interest)
     */
    public function calculateTotalAmount(): float
    {
        return $this->amount + $this->calculateInterest();
    }

    /**
     * Update calculated fields
     */
    public function updateCalculatedFields(): void
    {
        $this->interest_amount = $this->calculateInterest();
        $this->total_amount = $this->calculateTotalAmount();
        $this->saveQuietly();
    }

    /**
     * Check if loan is overdue
     */
    public function isOverdue(): bool
    {
        return $this->status === 'disbursed' && 
               $this->due_date && 
               Carbon::now()->isAfter($this->due_date);
    }

    /**
     * Get days overdue
     */
    public function getDaysOverdue(): int
    {
        if (!$this->isOverdue()) {
            return 0;
        }
        
        return Carbon::now()->diffInDays($this->due_date);
    }
}