<?php

namespace App\Observers;

use App\Models\Contribution;
use App\Services\AccountingService;
use Illuminate\Support\Facades\Log;

class ContributionObserver
{
    protected AccountingService $accountingService;

    public function __construct(AccountingService $accountingService)
    {
        $this->accountingService = $accountingService;
    }

    /**
     * Handle the Contribution "created" event.
     */
    public function created(Contribution $contribution): void
    {
        // Only create journal entry for approved contributions
        if ($contribution->status === 'approved') {
            $this->createJournalEntry($contribution);
        }
    }

    /**
     * Handle the Contribution "updated" event.
     */
    public function updated(Contribution $contribution): void
    {
        // If contribution was just approved, create journal entry
        if ($contribution->isDirty('status') && $contribution->status === 'approved') {
            $this->createJournalEntry($contribution);
        }
    }

    /**
     * Create journal entry for contribution
     */
    private function createJournalEntry(Contribution $contribution): void
    {
        try {
            $journalEntry = $this->accountingService->recordContribution($contribution);
            
            if ($journalEntry) {
                // Store reference to journal entry
                $contribution->update(['journal_entry_id' => $journalEntry->id]);
                Log::info("Journal entry created for contribution ID: {$contribution->id}");
            } else {
                Log::warning("Failed to create journal entry for contribution ID: {$contribution->id}");
            }
        } catch (\Exception $e) {
            Log::error("Error creating journal entry for contribution: " . $e->getMessage());
        }
    }
}