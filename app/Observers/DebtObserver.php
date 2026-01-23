<?php

namespace App\Observers;

use App\Models\Debt;
use App\Services\AccountingService;
use Illuminate\Support\Facades\Log;

class DebtObserver
{
    protected AccountingService $accountingService;

    public function __construct(AccountingService $accountingService)
    {
        $this->accountingService = $accountingService;
    }

    /**
     * Handle the Debt "created" event.
     */
    public function created(Debt $debt): void
    {
        $this->createJournalEntry($debt);
    }

    /**
     * Handle the Debt "updated" event.
     */
    public function updated(Debt $debt): void
    {
        // If debt status changed to paid, record the payment
        if ($debt->isDirty('status') && $debt->status === 'paid') {
            $this->recordDebtPayment($debt);
        }
    }

    /**
     * Create journal entry for debt creation
     */
    private function createJournalEntry(Debt $debt): void
    {
        try {
            $journalEntry = $this->accountingService->recordDebt($debt);
            
            if ($journalEntry) {
                // Store reference to journal entry
                $debt->update(['journal_entry_id' => $journalEntry->id]);
                Log::info("Journal entry created for debt ID: {$debt->id}");
            } else {
                Log::warning("Failed to create journal entry for debt ID: {$debt->id}");
            }
        } catch (\Exception $e) {
            Log::error("Error creating journal entry for debt: " . $e->getMessage());
        }
    }

    /**
     * Record debt payment
     */
    private function recordDebtPayment(Debt $debt): void
    {
        try {
            $journalEntry = $this->accountingService->recordDebtPayment($debt);
            
            if ($journalEntry) {
                Log::info("Debt payment journal entry created for debt ID: {$debt->id}");
            } else {
                Log::warning("Failed to create debt payment journal entry for debt ID: {$debt->id}");
            }
        } catch (\Exception $e) {
            Log::error("Error creating debt payment journal entry: " . $e->getMessage());
        }
    }
}