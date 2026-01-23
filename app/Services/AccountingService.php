<?php

namespace App\Services;

use App\Models\Account;
use App\Models\JournalEntry;
use App\Models\JournalEntryLine;
use App\Models\Contribution;
use App\Models\Payment;
use App\Models\DisasterPayment;
use App\Models\Expense;
use App\Models\Debt;
use App\Models\Loan;
use App\Models\Penalty;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class AccountingService
{
    /**
     * Create journal entry for a contribution
     */
    public function recordContribution(Contribution $contribution): ?JournalEntry
    {
        try {
            DB::beginTransaction();

            // Get accounts
            $cashAccount = $this->getCashAccount();
            $revenueAccount = $this->getContributionRevenueAccount();

            if (!$cashAccount || !$revenueAccount) {
                Log::warning('Required accounts not found for contribution recording');
                DB::rollBack();
                return null;
            }

            // Create journal entry
            $entry = JournalEntry::create([
                'entry_number' => $this->generateEntryNumber(),
                'entry_date' => $contribution->date,
                'reference' => "CONTRIB-{$contribution->id}",
                'description' => "Member contribution from {$contribution->member->name} - {$contribution->purpose}",
                'status' => 'posted', // Auto-post system entries
                'total_debit' => $contribution->amount,
                'total_credit' => $contribution->amount,
                'created_by' => $contribution->created_by ?? auth()->id(),
                'posted_by' => auth()->id(),
                'posted_at' => now(),
            ]);

            // Create journal entry lines
            // Debit: Cash (increase asset)
            JournalEntryLine::create([
                'journal_entry_id' => $entry->id,
                'account_id' => $cashAccount->id,
                'description' => "Cash received from {$contribution->member->name}",
                'debit' => $contribution->amount,
                'credit' => 0,
                'line_order' => 1,
            ]);

            // Credit: Contribution Revenue (increase revenue)
            JournalEntryLine::create([
                'journal_entry_id' => $entry->id,
                'account_id' => $revenueAccount->id,
                'description' => "Member contribution - {$contribution->purpose}",
                'debit' => 0,
                'credit' => $contribution->amount,
                'line_order' => 2,
            ]);

            // Update account balances
            $this->updateAccountBalance($cashAccount, $contribution->amount, 'debit');
            $this->updateAccountBalance($revenueAccount, $contribution->amount, 'credit');

            DB::commit();
            Log::info("Journal entry created for contribution ID: {$contribution->id}");
            
            return $entry;

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to create journal entry for contribution: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Create journal entry for a payment (new payment system)
     */
    public function recordPayment(Payment $payment): ?JournalEntry
    {
        try {
            DB::beginTransaction();

            // Get accounts
            $cashAccount = $this->getCashAccount();
            $revenueAccount = $this->getContributionRevenueAccount();

            if (!$cashAccount || !$revenueAccount) {
                Log::warning('Required accounts not found for payment recording');
                DB::rollBack();
                return null;
            }

            // Create journal entry
            $entry = JournalEntry::create([
                'entry_number' => $this->generateEntryNumber(),
                'entry_date' => $payment->payment_date,
                'reference' => "PAYMENT-{$payment->id}",
                'description' => "Member payment from {$payment->member->name} - {$payment->purpose}",
                'status' => 'posted', // Auto-post system entries
                'total_debit' => $payment->amount,
                'total_credit' => $payment->amount,
                'created_by' => auth()->id(),
                'posted_by' => auth()->id(),
                'posted_at' => now(),
            ]);

            // Create journal entry lines
            // Debit: Cash (increase asset)
            JournalEntryLine::create([
                'journal_entry_id' => $entry->id,
                'account_id' => $cashAccount->id,
                'description' => "Cash received from {$payment->member->name}",
                'debit' => $payment->amount,
                'credit' => 0,
                'line_order' => 1,
            ]);

            // Credit: Contribution Revenue (increase revenue)
            JournalEntryLine::create([
                'journal_entry_id' => $entry->id,
                'account_id' => $revenueAccount->id,
                'description' => "Member payment - {$payment->purpose}",
                'debit' => 0,
                'credit' => $payment->amount,
                'line_order' => 2,
            ]);

            // Update account balances
            $this->updateAccountBalance($cashAccount, $payment->amount, 'debit');
            $this->updateAccountBalance($revenueAccount, $payment->amount, 'credit');

            DB::commit();
            Log::info("Journal entry created for payment ID: {$payment->id}");
            
            return $entry;

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to create journal entry for payment: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Create journal entry for a disaster payment (disbursement)
     */
    public function recordDisasterPayment(DisasterPayment $payment): ?JournalEntry
    {
        try {
            DB::beginTransaction();

            // Validate cash availability before disbursement
            $this->validateCashAvailability($payment->amount, 'disaster payment');

            // Get accounts
            $cashAccount = $this->getCashAccount();
            $disasterExpenseAccount = $this->getDisasterExpenseAccount();

            if (!$cashAccount || !$disasterExpenseAccount) {
                Log::warning('Required accounts not found for disaster payment recording');
                DB::rollBack();
                return null;
            }

            // Create journal entry
            $entry = JournalEntry::create([
                'entry_number' => $this->generateEntryNumber(),
                'entry_date' => $payment->date ?? now()->toDateString(),
                'reference' => "DISASTER-{$payment->id}",
                'description' => "Disaster payment to {$payment->member->name} - {$payment->purpose}",
                'status' => 'posted',
                'total_debit' => $payment->amount,
                'total_credit' => $payment->amount,
                'created_by' => $payment->admin_id ?? auth()->id(),
                'posted_by' => auth()->id(),
                'posted_at' => now(),
            ]);

            // Create journal entry lines
            // Debit: Disaster Expense (increase expense)
            JournalEntryLine::create([
                'journal_entry_id' => $entry->id,
                'account_id' => $disasterExpenseAccount->id,
                'description' => "Disaster payment to {$payment->member->name}",
                'debit' => $payment->amount,
                'credit' => 0,
                'line_order' => 1,
            ]);

            // Credit: Cash (decrease asset)
            JournalEntryLine::create([
                'journal_entry_id' => $entry->id,
                'account_id' => $cashAccount->id,
                'description' => "Cash paid for disaster relief - {$payment->purpose}",
                'debit' => 0,
                'credit' => $payment->amount,
                'line_order' => 2,
            ]);

            // Update account balances
            $this->updateAccountBalance($disasterExpenseAccount, $payment->amount, 'debit');
            $this->updateAccountBalance($cashAccount, $payment->amount, 'credit');

            DB::commit();
            Log::info("Journal entry created for disaster payment ID: {$payment->id}");
            
            return $entry;

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to create journal entry for disaster payment: " . $e->getMessage());
            throw $e; // Re-throw to handle in controller
        }
    }

    /**
     * Create journal entry for an expense
     */
    public function recordExpense(Expense $expense): ?JournalEntry
    {
        try {
            DB::beginTransaction();

            // Validate cash availability before expense payment
            $this->validateCashAvailability($expense->amount, 'expense payment');

            // Get accounts
            $cashAccount = $this->getCashAccount();
            $expenseAccount = $this->getExpenseAccount($expense->category);

            if (!$cashAccount || !$expenseAccount) {
                Log::warning('Required accounts not found for expense recording');
                DB::rollBack();
                return null;
            }

            // Create journal entry
            $entry = JournalEntry::create([
                'entry_number' => $this->generateEntryNumber(),
                'entry_date' => $expense->expense_date,
                'reference' => "EXPENSE-{$expense->id}",
                'description' => "Expense: {$expense->description} - {$expense->category}",
                'status' => 'posted',
                'total_debit' => $expense->amount,
                'total_credit' => $expense->amount,
                'created_by' => $expense->created_by ?? auth()->id(),
                'posted_by' => auth()->id(),
                'posted_at' => now(),
            ]);

            // Create journal entry lines
            // Debit: Expense Account (increase expense)
            JournalEntryLine::create([
                'journal_entry_id' => $entry->id,
                'account_id' => $expenseAccount->id,
                'description' => $expense->description,
                'debit' => $expense->amount,
                'credit' => 0,
                'line_order' => 1,
            ]);

            // Credit: Cash (decrease asset)
            JournalEntryLine::create([
                'journal_entry_id' => $entry->id,
                'account_id' => $cashAccount->id,
                'description' => "Cash paid for {$expense->category}",
                'debit' => 0,
                'credit' => $expense->amount,
                'line_order' => 2,
            ]);

            // Update account balances
            $this->updateAccountBalance($expenseAccount, $expense->amount, 'debit');
            $this->updateAccountBalance($cashAccount, $expense->amount, 'credit');

            DB::commit();
            Log::info("Journal entry created for expense ID: {$expense->id}");
            
            return $entry;

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to create journal entry for expense: " . $e->getMessage());
            throw $e; // Re-throw to handle in controller
        }
    }

    /**
     * Get or create cash account
     */
    private function getCashAccount(): ?Account
    {
        return Account::where('account_code', '1000')
            ->orWhere('account_name', 'Cash')
            ->orWhere(function($q) {
                $q->where('account_type', 'asset')
                  ->where('account_subtype', 'current_assets')
                  ->where('account_name', 'like', '%cash%');
            })
            ->first();
    }

    /**
     * Get current cash balance
     */
    public function getCashBalance(): float
    {
        $cashAccount = $this->getCashAccount();
        return $cashAccount ? $cashAccount->current_balance : 0;
    }

    /**
     * Check if sufficient cash is available for a transaction
     */
    public function hasSufficientCash(float $amount): bool
    {
        return $this->getCashBalance() >= $amount;
    }

    /**
     * Validate cash availability before transaction
     */
    public function validateCashAvailability(float $amount, string $transactionType = 'transaction'): void
    {
        $currentBalance = $this->getCashBalance();
        
        if ($currentBalance < $amount) {
            $shortfall = $amount - $currentBalance;
            throw new \Exception(
                "Insufficient cash balance for {$transactionType}. " .
                "Required: " . number_format($amount, 2) . " TZS, " .
                "Available: " . number_format($currentBalance, 2) . " TZS, " .
                "Shortfall: " . number_format($shortfall, 2) . " TZS"
            );
        }
    }

    /**
     * Get or create contribution revenue account
     */
    private function getContributionRevenueAccount(): ?Account
    {
        return Account::where('account_code', '4000')
            ->orWhere('account_name', 'Member Contributions')
            ->orWhere(function($q) {
                $q->where('account_type', 'revenue')
                  ->where('account_name', 'like', '%contribution%');
            })
            ->first();
    }

    /**
     * Get or create disaster expense account
     */
    private function getDisasterExpenseAccount(): ?Account
    {
        return Account::where('account_code', '5950')
            ->orWhere('account_name', 'Disaster Relief')
            ->orWhere(function($q) {
                $q->where('account_type', 'expense')
                  ->where('account_name', 'like', '%disaster%');
            })
            ->first();
    }

    /**
     * Get expense account based on category
     */
    private function getExpenseAccount(string $category): ?Account
    {
        // Map expense categories to account codes
        $categoryMapping = [
            'office_supplies' => '5000',
            'utilities' => '5100',
            'rent' => '5200',
            'travel' => '5300',
            'meals' => '5400',
            'equipment' => '5500',
            'maintenance' => '5600',
            'professional_services' => '5700',
            'insurance' => '5800',
            'other' => '5900',
        ];

        $accountCode = $categoryMapping[$category] ?? '5900';

        return Account::where('account_code', $accountCode)
            ->orWhere(function($q) use ($category) {
                $q->where('account_type', 'expense')
                  ->where('account_name', 'like', '%' . str_replace('_', ' ', $category) . '%');
            })
            ->first();
    }

    /**
     * Get or create loans receivable account
     */
    private function getLoansReceivableAccount(): ?Account
    {
        return Account::where('account_code', '1300')
            ->orWhere('account_name', 'Loans Receivable')
            ->orWhere(function($q) {
                $q->where('account_type', 'asset')
                  ->where('account_subtype', 'current_assets')
                  ->where('account_name', 'like', '%loan%');
            })
            ->first();
    }

    /**
     * Get or create interest income account
     */
    private function getInterestIncomeAccount(): ?Account
    {
        return Account::where('account_code', '4300')
            ->orWhere('account_name', 'Interest Income')
            ->orWhere(function($q) {
                $q->where('account_type', 'revenue')
                  ->where('account_name', 'like', '%interest%');
            })
            ->first();
    }

    /**
     * Create journal entry for a penalty payment
     */
    public function recordPenaltyPayment(Penalty $penalty): ?JournalEntry
    {
        try {
            DB::beginTransaction();

            // Get accounts
            $cashAccount = $this->getCashAccount();
            $penaltyRevenueAccount = $this->getPenaltyRevenueAccount();

            if (!$cashAccount || !$penaltyRevenueAccount) {
                Log::warning('Required accounts not found for penalty payment recording');
                DB::rollBack();
                return null;
            }

            // Create journal entry
            $entry = JournalEntry::create([
                'entry_number' => $this->generateEntryNumber(),
                'entry_date' => now()->toDateString(),
                'reference' => "PENALTY-{$penalty->id}",
                'description' => "Penalty payment from {$penalty->member->name} - {$penalty->reason} ({$penalty->penalty_month})",
                'status' => 'posted',
                'total_debit' => $penalty->amount,
                'total_credit' => $penalty->amount,
                'created_by' => auth()->id(),
                'posted_by' => auth()->id(),
                'posted_at' => now(),
            ]);

            // Create journal entry lines
            // Debit: Cash (increase asset)
            JournalEntryLine::create([
                'journal_entry_id' => $entry->id,
                'account_id' => $cashAccount->id,
                'description' => "Cash received from {$penalty->member->name} - Penalty payment",
                'debit' => $penalty->amount,
                'credit' => 0,
                'line_order' => 1,
            ]);

            // Credit: Penalty Revenue (increase revenue)
            JournalEntryLine::create([
                'journal_entry_id' => $entry->id,
                'account_id' => $penaltyRevenueAccount->id,
                'description' => "Penalty revenue - {$penalty->reason} ({$penalty->penalty_month})",
                'debit' => 0,
                'credit' => $penalty->amount,
                'line_order' => 2,
            ]);

            // Update account balances
            $this->updateAccountBalance($cashAccount, $penalty->amount, 'debit');
            $this->updateAccountBalance($penaltyRevenueAccount, $penalty->amount, 'credit');

            DB::commit();
            Log::info("Journal entry created for penalty payment ID: {$penalty->id}");
            
            return $entry;

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to create journal entry for penalty payment: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Get or create penalty revenue account
     */
    private function getPenaltyRevenueAccount(): ?Account
    {
        return Account::where('account_code', '4200')
            ->orWhere('account_name', 'Penalty Revenue')
            ->orWhere(function($q) {
                $q->where('account_type', 'revenue')
                  ->where('account_name', 'like', '%penalty%');
            })
            ->first();
    }

    /**
     * Update account balance based on account type and normal balance
     */
    private function updateAccountBalance(Account $account, float $amount, string $type): void
    {
        // For accounts with normal debit balance (Assets, Expenses)
        if ($account->normal_balance === 'debit') {
            if ($type === 'debit') {
                $account->increment('current_balance', $amount);
            } else {
                $account->decrement('current_balance', $amount);
            }
        } 
        // For accounts with normal credit balance (Liabilities, Equity, Revenue)
        else {
            if ($type === 'credit') {
                $account->increment('current_balance', $amount);
            } else {
                $account->decrement('current_balance', $amount);
            }
        }
    }

    /**
     * Generate journal entry number
     */
    private function generateEntryNumber(): string
    {
        $date = Carbon::now()->format('Ymd');
        
        // Get all entry numbers for today and extract the sequence numbers
        $entries = JournalEntry::where('entry_number', 'like', "JE-{$date}-%")
            ->pluck('entry_number')
            ->map(function ($entryNumber) {
                // Extract the sequence part after the last dash
                $parts = explode('-', $entryNumber);
                return (int) end($parts);
            })
            ->sort()
            ->values();

        // Find the next available sequence number
        $sequence = 1;
        if ($entries->isNotEmpty()) {
            $sequence = $entries->max() + 1;
        }

        return "JE-{$date}-" . str_pad($sequence, 3, '0', STR_PAD_LEFT);
    }

    /**
     * Create journal entry for loan disbursement (money going out)
     */
    public function recordLoanDisbursement(Loan $loan): ?JournalEntry
    {
        try {
            DB::beginTransaction();

            // Validate cash availability before disbursement
            $this->validateCashAvailability($loan->amount, 'loan disbursement');

            // Get accounts
            $cashAccount = $this->getCashAccount();
            $loansReceivableAccount = $this->getLoansReceivableAccount();

            if (!$cashAccount || !$loansReceivableAccount) {
                Log::warning('Required accounts not found for loan disbursement recording');
                DB::rollBack();
                return null;
            }

            // Create journal entry
            $entry = JournalEntry::create([
                'entry_number' => $this->generateEntryNumber(),
                'entry_date' => now()->toDateString(),
                'reference' => "LOAN-DISBURSEMENT-{$loan->id}",
                'description' => "Loan disbursed to {$loan->member->name} - {$loan->purpose}",
                'status' => 'posted',
                'total_debit' => $loan->amount,
                'total_credit' => $loan->amount,
                'created_by' => auth()->id(),
                'posted_by' => auth()->id(),
                'posted_at' => now(),
            ]);

            // Create journal entry lines
            // Debit: Loans Receivable (increase asset)
            JournalEntryLine::create([
                'journal_entry_id' => $entry->id,
                'account_id' => $loansReceivableAccount->id,
                'description' => "Loan disbursed to {$loan->member->name}",
                'debit' => $loan->amount,
                'credit' => 0,
                'line_order' => 1,
            ]);

            // Credit: Cash (decrease asset)
            JournalEntryLine::create([
                'journal_entry_id' => $entry->id,
                'account_id' => $cashAccount->id,
                'description' => "Cash disbursed for loan - {$loan->purpose}",
                'debit' => 0,
                'credit' => $loan->amount,
                'line_order' => 2,
            ]);

            // Update account balances
            $this->updateAccountBalance($loansReceivableAccount, $loan->amount, 'debit');
            $this->updateAccountBalance($cashAccount, $loan->amount, 'credit');

            DB::commit();
            Log::info("Loan disbursement journal entry created for loan ID: {$loan->id}");
            
            return $entry;

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to create loan disbursement journal entry: " . $e->getMessage());
            throw $e; // Re-throw to handle in controller
        }
    }

    /**
     * Create journal entry for loan repayment (principal + interest)
     */
    public function recordLoanRepayment(Loan $loan): ?JournalEntry
    {
        try {
            DB::beginTransaction();

            // Get accounts
            $cashAccount = $this->getCashAccount();
            $loansReceivableAccount = $this->getLoansReceivableAccount();
            $interestIncomeAccount = $this->getInterestIncomeAccount();

            if (!$cashAccount || !$loansReceivableAccount || !$interestIncomeAccount) {
                Log::warning('Required accounts not found for loan repayment recording');
                DB::rollBack();
                return null;
            }

            // Create journal entry
            $entry = JournalEntry::create([
                'entry_number' => $this->generateEntryNumber(),
                'entry_date' => now()->toDateString(),
                'reference' => "LOAN-REPAYMENT-{$loan->id}",
                'description' => "Loan repayment from {$loan->member->name} - Principal: {$loan->amount}, Interest: {$loan->interest_amount}",
                'status' => 'posted',
                'total_debit' => $loan->total_amount,
                'total_credit' => $loan->total_amount,
                'created_by' => auth()->id(),
                'posted_by' => auth()->id(),
                'posted_at' => now(),
            ]);

            // Create journal entry lines
            // Debit: Cash (increase asset) - Total amount received
            JournalEntryLine::create([
                'journal_entry_id' => $entry->id,
                'account_id' => $cashAccount->id,
                'description' => "Cash received from {$loan->member->name} - Loan repayment",
                'debit' => $loan->total_amount,
                'credit' => 0,
                'line_order' => 1,
            ]);

            // Credit: Loans Receivable (decrease asset) - Principal only
            JournalEntryLine::create([
                'journal_entry_id' => $entry->id,
                'account_id' => $loansReceivableAccount->id,
                'description' => "Loan principal repaid by {$loan->member->name}",
                'debit' => 0,
                'credit' => $loan->amount,
                'line_order' => 2,
            ]);

            // Credit: Interest Income (increase revenue) - Interest only
            if ($loan->interest_amount > 0) {
                JournalEntryLine::create([
                    'journal_entry_id' => $entry->id,
                    'account_id' => $interestIncomeAccount->id,
                    'description' => "Interest earned from {$loan->member->name} - {$loan->interest_rate}% for {$loan->term_months} months",
                    'debit' => 0,
                    'credit' => $loan->interest_amount,
                    'line_order' => 3,
                ]);
            }

            // Update account balances
            $this->updateAccountBalance($cashAccount, $loan->total_amount, 'debit');
            $this->updateAccountBalance($loansReceivableAccount, $loan->amount, 'credit');
            if ($loan->interest_amount > 0) {
                $this->updateAccountBalance($interestIncomeAccount, $loan->interest_amount, 'credit');
            }

            DB::commit();
            Log::info("Loan repayment journal entry created for loan ID: {$loan->id}");
            
            return $entry;

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to create loan repayment journal entry: " . $e->getMessage());
            return null;
        }
    }
    public function getAccountingSummary(): array
    {
        $cashAccount = $this->getCashAccount();
        $totalRevenue = Account::where('account_type', 'revenue')->sum('current_balance');
        $totalExpenses = Account::where('account_type', 'expense')->sum('current_balance');
        $totalAssets = Account::where('account_type', 'asset')->sum('current_balance');
        $totalLiabilities = Account::where('account_type', 'liability')->sum('current_balance');

        // Recent journal entries
        $recentEntries = JournalEntry::with(['creator', 'lines.account'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return [
            'cash_balance' => $cashAccount ? $cashAccount->current_balance : 0,
            'total_revenue' => $totalRevenue,
            'total_expenses' => $totalExpenses,
            'net_income' => $totalRevenue - $totalExpenses,
            'total_assets' => $totalAssets,
            'total_liabilities' => $totalLiabilities,
            'equity' => $totalAssets - $totalLiabilities,
            'recent_entries' => $recentEntries,
            'entries_count_today' => JournalEntry::whereDate('created_at', Carbon::today())->count(),
            'entries_count_month' => JournalEntry::whereMonth('created_at', Carbon::now()->month)->count(),
            'cash_flow_status' => $this->getCashFlowStatus($cashAccount ? $cashAccount->current_balance : 0),
        ];
    }

    /**
     * Get cash flow status with warnings
     */
    private function getCashFlowStatus(float $cashBalance): array
    {
        $status = 'healthy';
        $message = 'Cash flow is healthy';
        $color = 'green';

        if ($cashBalance < 0) {
            $status = 'critical';
            $message = 'CRITICAL: Negative cash balance - Immediate action required';
            $color = 'red';
        } elseif ($cashBalance < 100000) { // Less than 100,000 TZS
            $status = 'warning';
            $message = 'WARNING: Low cash balance - Monitor closely';
            $color = 'orange';
        } elseif ($cashBalance < 500000) { // Less than 500,000 TZS
            $status = 'caution';
            $message = 'CAUTION: Moderate cash balance - Plan ahead';
            $color = 'yellow';
        }

        return [
            'status' => $status,
            'message' => $message,
            'color' => $color,
            'balance' => $cashBalance,
        ];
    }

    /**
     * Reverse a journal entry (for corrections)
     */
    public function reverseEntry(JournalEntry $entry, string $reason): ?JournalEntry
    {
        if ($entry->status !== 'posted') {
            return null;
        }

        try {
            DB::beginTransaction();

            // Create reversal entry
            $reversalEntry = JournalEntry::create([
                'entry_number' => $this->generateEntryNumber(),
                'entry_date' => Carbon::now()->toDateString(),
                'reference' => "REV-{$entry->entry_number}",
                'description' => "Reversal of {$entry->entry_number}: {$reason}",
                'status' => 'posted',
                'total_debit' => $entry->total_debit,
                'total_credit' => $entry->total_credit,
                'created_by' => auth()->id(),
                'posted_by' => auth()->id(),
                'posted_at' => now(),
            ]);

            // Create reversal lines (swap debits and credits)
            foreach ($entry->lines as $index => $line) {
                JournalEntryLine::create([
                    'journal_entry_id' => $reversalEntry->id,
                    'account_id' => $line->account_id,
                    'description' => "Reversal: {$line->description}",
                    'debit' => $line->credit, // Swap
                    'credit' => $line->debit, // Swap
                    'line_order' => $index + 1,
                ]);

                // Update account balances (reverse the original effect)
                $account = $line->account;
                if ($line->debit > 0) {
                    $this->updateAccountBalance($account, $line->debit, 'credit');
                } else {
                    $this->updateAccountBalance($account, $line->credit, 'debit');
                }
            }

            // Mark original entry as reversed
            $entry->update([
                'status' => 'reversed',
                'reversed_by' => auth()->id(),
                'reversed_at' => now(),
                'reversal_reason' => $reason,
            ]);

            DB::commit();
            Log::info("Journal entry {$entry->entry_number} reversed");
            
            return $reversalEntry;

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to reverse journal entry: " . $e->getMessage());
            return null;
        }
    }
}