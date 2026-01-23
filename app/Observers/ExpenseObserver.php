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
        // Create journal entry for approved or paid expenses
        if (in_array($expense->status, ['approved', 'paid'])) {
            $this->createJournalEntry($expense);
        }
    }

    /**
     * Handle the Expense "updated" event.
     */
    public function updated(Expense $expense): void
    {
        // Skip if only journal_entry_id was updated (to prevent infinite loop)
        if ($expense->isDirty('journal_entry_id') && count($expense->getDirty()) === 1) {
            return;
        }

        // If expense was just approved or paid, create journal entry
        if ($expense->isDirty('status') && in_array($expense->status, ['approved', 'paid']) && !$expense->journal_entry_id) {
            $this->createJournalEntry($expense);
        }
    }

    /**
     * Create journal entry for expense
     */
    private function createJournalEntry(Expense $expense): void
    {
        // Skip if journal entry already exists
        if ($expense->journal_entry_id) {
            return;
        }

        try {
            $journalEntry = $this->accountingService->recordExpense($expense);
            
            if ($journalEntry) {
                // Store reference to journal entry without triggering observers
                $expense->updateQuietly(['journal_entry_id' => $journalEntry->id]);
                Log::info("Journal entry created for expense ID: {$expense->id}");
            } else {
                Log::warning("Failed to create journal entry for expense ID: {$expense->id}");
                throw new \Exception("Failed to create journal entry for expense");
            }
        } catch (\Exception $e) {
            Log::error("Error creating journal entry for expense: " . $e->getMessage());
            // Re-throw the exception to prevent the expense status update
            throw $e;
        }
    }
}