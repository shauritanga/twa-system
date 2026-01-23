<?php

namespace App\Observers;

use App\Models\Loan;
use App\Services\AccountingService;
use Illuminate\Support\Facades\Log;

class LoanObserver
{
    protected AccountingService $accountingService;

    public function __construct(AccountingService $accountingService)
    {
        $this->accountingService = $accountingService;
    }

    /**
     * Handle the Loan "updated" event.
     */
    public function updated(Loan $loan): void
    {
        // Skip if only calculated fields or journal entry IDs were updated
        $skipFields = ['interest_amount', 'total_amount', 'disbursement_journal_entry_id', 'repayment_journal_entry_id', 'journal_entry_id'];
        $changedFields = array_keys($loan->getDirty());
        $significantChanges = array_diff($changedFields, $skipFields);
        
        if (empty($significantChanges)) {
            return;
        }

        // If loan status changed to disbursed, record the disbursement
        if ($loan->isDirty('status') && $loan->status === 'disbursed' && !$loan->disbursement_journal_entry_id) {
            $this->recordLoanDisbursement($loan);
        }

        // If loan status changed to repaid, record the repayment
        if ($loan->isDirty('status') && $loan->status === 'repaid' && !$loan->repayment_journal_entry_id) {
            $this->recordLoanRepayment($loan);
        }
    }

    /**
     * Record loan disbursement (money going out)
     */
    private function recordLoanDisbursement(Loan $loan): void
    {
        // Skip if disbursement journal entry already exists
        if ($loan->disbursement_journal_entry_id) {
            return;
        }

        try {
            $journalEntry = $this->accountingService->recordLoanDisbursement($loan);
            
            if ($journalEntry) {
                $loan->updateQuietly([
                    'disbursement_journal_entry_id' => $journalEntry->id,
                    'disbursed_date' => now()->toDateString()
                ]);
                Log::info("Loan disbursement journal entry created for loan ID: {$loan->id}");
            } else {
                Log::warning("Failed to create loan disbursement journal entry for loan ID: {$loan->id}");
                throw new \Exception("Failed to create journal entry for loan disbursement");
            }
        } catch (\Exception $e) {
            Log::error("Error creating loan disbursement journal entry: " . $e->getMessage());
            // Re-throw the exception to prevent the loan status update
            throw $e;
        }
    }

    /**
     * Record loan repayment (money coming in with interest)
     */
    private function recordLoanRepayment(Loan $loan): void
    {
        // Skip if repayment journal entry already exists
        if ($loan->repayment_journal_entry_id) {
            return;
        }

        try {
            // Update calculated fields before recording repayment (without triggering observers)
            $loan->interest_amount = $loan->calculateInterest();
            $loan->total_amount = $loan->calculateTotalAmount();
            $loan->saveQuietly();
            
            $journalEntry = $this->accountingService->recordLoanRepayment($loan);
            
            if ($journalEntry) {
                $loan->updateQuietly([
                    'repayment_journal_entry_id' => $journalEntry->id,
                    'repaid_date' => now()->toDateString()
                ]);
                Log::info("Loan repayment journal entry created for loan ID: {$loan->id}");
            } else {
                Log::warning("Failed to create loan repayment journal entry for loan ID: {$loan->id}");
            }
        } catch (\Exception $e) {
            Log::error("Error creating loan repayment journal entry: " . $e->getMessage());
        }
    }
}