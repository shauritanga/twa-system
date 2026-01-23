<?php

namespace App\Observers;

use App\Models\Payment;
use App\Services\AccountingService;
use Illuminate\Support\Facades\Log;

class PaymentObserver
{
    protected AccountingService $accountingService;

    public function __construct(AccountingService $accountingService)
    {
        $this->accountingService = $accountingService;
    }

    /**
     * Handle the Payment "created" event.
     */
    public function created(Payment $payment): void
    {
        $this->createJournalEntry($payment);
    }

    /**
     * Handle the Payment "updated" event.
     */
    public function updated(Payment $payment): void
    {
        // If payment amount was changed, we might need to adjust the journal entry
        if ($payment->isDirty('amount')) {
            Log::info("Payment amount updated for payment ID: {$payment->id}");
            // For now, just log. In the future, we could reverse and recreate the entry
        }
    }

    /**
     * Create journal entry for payment
     */
    private function createJournalEntry(Payment $payment): void
    {
        try {
            $journalEntry = $this->accountingService->recordPayment($payment);
            
            if ($journalEntry) {
                // Store reference to journal entry
                $payment->update(['journal_entry_id' => $journalEntry->id]);
                Log::info("Journal entry created for payment ID: {$payment->id}");
            } else {
                Log::warning("Failed to create journal entry for payment ID: {$payment->id}");
            }
        } catch (\Exception $e) {
            Log::error("Error creating journal entry for payment: " . $e->getMessage());
        }
    }
}