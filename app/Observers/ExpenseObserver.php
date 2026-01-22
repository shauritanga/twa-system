<?php

namespace App\Observers;

use App\Models\Expense;
use App\Services\AccountingService;
use Illuminate\Support\Facades\Log;

class ExpenseObserver
{
    protected AccountingService $accountingService;

    public function __construct(AccountingService $accountingService)
    {
        $this->accountingService = $accountingService;
    }

    /**
     * Handle the Expense "created" event.
     */
    public function created(Expense $expense): void
    {
        // Only create journal entry for approved expenses
        if ($expense->status === 'approved') {
            $this->createJournalEntry($expense);
        }
    }

    /**
     * Handle the Expense "updated" event.
     */
    public function updated(Expense $expense): void
    {
        // If expense was just approved, create journal entry
        if ($expense->isDirty('status') && $expense->status === 'approved') {
            $this->createJournalEntry($expense);
        }
    }

    /**
     * Create journal entry for expense
     */
    private function createJournalEntry(Expense $expense): void
    {
        try {
            $journalEntry = $this->accountingService->recordExpense($expense);
            
            if ($journalEntry) {
                // Store reference to journal entry
                $expense->update(['journal_entry_id' => $journalEntry->id]);
                Log::info("Journal entry created for expense ID: {$expense->id}");
            } else {
                Log::warning("Failed to create journal entry for expense ID: {$expense->id}");
            }
        } catch (\Exception $e) {
            Log::error("Error creating journal entry for expense: " . $e->getMessage());
        }
    }
}