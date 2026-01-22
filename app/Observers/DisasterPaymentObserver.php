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
        try {
            $journalEntry = $this->accountingService->recordDisasterPayment($payment);
            
            if ($journalEntry) {
                // Store reference to journal entry
                $payment->update(['journal_entry_id' => $journalEntry->id]);
                Log::info("Journal entry created for disaster payment ID: {$payment->id}");
            } else {
                Log::warning("Failed to create journal entry for disaster payment ID: {$payment->id}");
            }
        } catch (\Exception $e) {
            Log::error("Error creating journal entry for disaster payment: " . $e->getMessage());
        }
    }
}