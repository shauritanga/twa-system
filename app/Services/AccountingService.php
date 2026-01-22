<?php

namespace App\Services;

use App\Models\Account;
use App\Models\JournalEntry;
use App\Models\JournalEntryLine;
use App\Models\Contribution;
use App\Models\DisasterPayment;
use App\Models\Expense;
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
     * Create journal entry for a disaster payment
     */
    public function recordDisasterPayment(DisasterPayment $payment): ?JournalEntry
    {
        try {
            DB::beginTransaction();

            // Get accounts
            $cashAccount = $this->getCashAccount();
            $disasterAccount = $this->getDisasterRevenueAccount();

            if (!$cashAccount || !$disasterAccount) {
                Log::warning('Required accounts not found for disaster payment recording');
                DB::rollBack();
                return null;
            }

            // Create journal entry
            $entry = JournalEntry::create([
                'entry_number' => $this->generateEntryNumber(),
                'entry_date' => $payment->payment_date,
                'reference' => "DISASTER-{$payment->id}",
                'description' => "Disaster payment from {$payment->member->name} - {$payment->disaster_type}",
                'status' => 'posted',
                'total_debit' => $payment->amount,
                'total_credit' => $payment->amount,
                'created_by' => $payment->created_by ?? auth()->id(),
                'posted_by' => auth()->id(),
                'posted_at' => now(),
            ]);

            // Create journal entry lines
            JournalEntryLine::create([
                'journal_entry_id' => $entry->id,
                'account_id' => $cashAccount->id,
                'description' => "Cash received from {$payment->member->name}",
                'debit' => $payment->amount,
                'credit' => 0,
                'line_order' => 1,
            ]);

            JournalEntryLine::create([
                'journal_entry_id' => $entry->id,
                'account_id' => $disasterAccount->id,
                'description' => "Disaster payment - {$payment->disaster_type}",
                'debit' => 0,
                'credit' => $payment->amount,
                'line_order' => 2,
            ]);

            // Update account balances
            $this->updateAccountBalance($cashAccount, $payment->amount, 'debit');
            $this->updateAccountBalance($disasterAccount, $payment->amount, 'credit');

            DB::commit();
            Log::info("Journal entry created for disaster payment ID: {$payment->id}");
            
            return $entry;

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to create journal entry for disaster payment: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Create journal entry for an expense
     */
    public function recordExpense(Expense $expense): ?JournalEntry
    {
        try {
            DB::beginTransaction();

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
            return null;
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
     * Get or create disaster revenue account
     */
    private function getDisasterRevenueAccount(): ?Account
    {
        return Account::where('account_code', '4100')
            ->orWhere('account_name', 'Disaster Payments')
            ->orWhere(function($q) {
                $q->where('account_type', 'revenue')
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
     * Update account balance
     */
    private function updateAccountBalance(Account $account, float $amount, string $type): void
    {
        if ($type === 'debit') {
            $account->increment('current_balance', $amount);
        } else {
            $account->decrement('current_balance', $amount);
        }
    }

    /**
     * Generate journal entry number
     */
    private function generateEntryNumber(): string
    {
        $date = Carbon::now()->format('Ymd');
        $lastEntry = JournalEntry::whereDate('created_at', Carbon::today())
            ->orderBy('id', 'desc')
            ->first();

        $sequence = $lastEntry ? (int) substr($lastEntry->entry_number, -3) + 1 : 1;

        return "JE-{$date}-" . str_pad($sequence, 3, '0', STR_PAD_LEFT);
    }

    /**
     * Get accounting summary for dashboard
     */
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