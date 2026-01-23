<?php

namespace App\Observers;

use App\Models\DisasterPayment;
use App\Services\AccountingService;
use Illuminate\Support\Facades\Log;

class DisasterPaymentObserver
{
    protected AccountingService $accountingService;

    public function __construct(AccountingService $accountingService)
    {
        $this->accountingService = $accountingService;
    }

    /**
     * Handle the DisasterPayment "created" event.
     */
    public function created(DisasterPayment $payment): void
    {
        $this->createJournalEntry($payment);
    }

    /**
     * Create journal entry for disaster payment
     */
    private function createJournalEntry(DisasterPayment $payment): void
    {
        // Skip if journal entry already exists
        if ($payment->journal_entry_id) {
            return;
        }

        try {
            $journalEntry = $this->accountingService->recordDisasterPayment($payment);
            
            if ($journalEntry) {
                // Store reference to journal entry without triggering observers
                $payment->updateQuietly(['journal_entry_id' => $journalEntry->id]);
                Log::info("Journal entry created for disaster payment ID: {$payment->id}");
            } else {
                Log::warning("Failed to create journal entry for disaster payment ID: {$payment->id}");
                throw new \Exception("Failed to create journal entry for disaster payment");
            }
        } catch (\Exception $e) {
            Log::error("Error creating journal entry for disaster payment: " . $e->getMessage());
            // Re-throw the exception to prevent the disaster payment creation
            throw $e;
        }
    }
}