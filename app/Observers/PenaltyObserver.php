<?php

namespace App\Observers;

use App\Models\Penalty;
use App\Services\AccountingService;
use Illuminate\Support\Facades\Log;

class PenaltyObserver
{
    protected AccountingService $accountingService;

    public function __construct(AccountingService $accountingService)
    {
        $this->accountingService = $accountingService;
    }

    /**
     * Handle the Penalty "updated" event.
     * We listen for updates because penalties are marked as paid via status change
     */
    public function updated(Penalty $penalty): void
    {
        // Only create journal entry when penalty is marked as paid
        if ($penalty->isDirty('status') && $penalty->status === 'paid') {
            $this->createJournalEntry($penalty);
        }
    }

    /**
     * Create journal entry for penalty payment
     */
    private function createJournalEntry(Penalty $penalty): void
    {
        try {
            // Prevent duplicate journal entries
            if ($penalty->journal_entry_id) {
                Log::info("Journal entry already exists for penalty ID: {$penalty->id}");
                return;
            }

            $journalEntry = $this->accountingService->recordPenaltyPayment($penalty);
            
            if ($journalEntry) {
                // Store reference to journal entry
                $penalty->updateQuietly(['journal_entry_id' => $journalEntry->id]);
                Log::info("Journal entry created for penalty payment ID: {$penalty->id}");
            } else {
                Log::warning("Failed to create journal entry for penalty payment ID: {$penalty->id}");
            }
        } catch (\Exception $e) {
            Log::error("Error creating journal entry for penalty payment: " . $e->getMessage());
        }
    }
}