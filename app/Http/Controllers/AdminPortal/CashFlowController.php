<?php

namespace App\Http\Controllers\AdminPortal;

use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\JournalEntryLine;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CashFlowController extends Controller
{
    public function index(Request $request)
    {
        $dateFrom = $request->date_from ?? now()->startOfYear()->format('Y-m-d');
        $dateTo = $request->date_to ?? now()->format('Y-m-d');

        // Get cash accounts (typically account code 1000 for Cash)
        $cashAccounts = Account::active()
            ->where('account_type', 'asset')
            ->where(function($q) {
                $q->where('account_name', 'like', '%Cash%')
                  ->orWhere('account_code', '1000');
            })
            ->get();

        // Calculate opening and closing cash balances
        $openingCash = $this->getCashBalance($cashAccounts, $dateFrom, true);
        $closingCash = $this->getCashBalance($cashAccounts, $dateTo, false);

        // Get cash flows by category
        $operatingActivities = $this->getOperatingCashFlows($dateFrom, $dateTo);
        $investingActivities = $this->getInvestingCashFlows($dateFrom, $dateTo);
        $financingActivities = $this->getFinancingCashFlows($dateFrom, $dateTo);

        // Calculate totals
        $netOperating = $operatingActivities->sum('amount');
        $netInvesting = $investingActivities->sum('amount');
        $netFinancing = $financingActivities->sum('amount');
        $netCashChange = $netOperating + $netInvesting + $netFinancing;

        // Verify calculation
        $calculatedClosing = $openingCash + $netCashChange;
        $difference = abs($closingCash - $calculatedClosing);

        return Inertia::render('AdminPortal/CashFlow', [
            'operatingActivities' => $operatingActivities,
            'investingActivities' => $investingActivities,
            'financingActivities' => $financingActivities,
            'totals' => [
                'opening_cash' => $openingCash,
                'net_operating' => $netOperating,
                'net_investing' => $netInvesting,
                'net_financing' => $netFinancing,
                'net_cash_change' => $netCashChange,
                'closing_cash' => $closingCash,
                'calculated_closing' => $calculatedClosing,
                'difference' => $difference,
            ],
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
        ]);
    }

    /**
     * Get cash balance at a specific date
     */
    private function getCashBalance($cashAccounts, $date, $isOpening = false)
    {
        $totalBalance = 0;

        foreach ($cashAccounts as $account) {
            $query = JournalEntryLine::whereHas('journalEntry', function ($q) use ($date, $isOpening) {
                $q->where('status', 'posted');
                if ($isOpening) {
                    $q->whereDate('entry_date', '<', $date);
                } else {
                    $q->whereDate('entry_date', '<=', $date);
                }
            })->where('account_id', $account->id);

            $lines = $query->get();
            $totalDebit = $lines->sum('debit');
            $totalCredit = $lines->sum('credit');

            // Cash is an asset with debit normal balance
            $balance = $account->opening_balance + $totalDebit - $totalCredit;
            $totalBalance += $balance;
        }

        return $totalBalance;
    }

    /**
     * Get operating cash flows (from revenue and expense accounts)
     */
    private function getOperatingCashFlows($dateFrom, $dateTo)
    {
        $activities = collect();

        // Revenue accounts (cash inflows)
        $revenueAccounts = Account::active()
            ->where('account_type', 'revenue')
            ->get();

        foreach ($revenueAccounts as $account) {
            $amount = $this->getAccountActivity($account, $dateFrom, $dateTo);
            if (abs($amount) > 0.01) {
                $activities->push([
                    'description' => $account->account_name,
                    'amount' => $amount,
                    'type' => 'inflow',
                ]);
            }
        }

        // Expense accounts (cash outflows)
        $expenseAccounts = Account::active()
            ->where('account_type', 'expense')
            ->get();

        foreach ($expenseAccounts as $account) {
            $amount = $this->getAccountActivity($account, $dateFrom, $dateTo);
            if (abs($amount) > 0.01) {
                $activities->push([
                    'description' => $account->account_name,
                    'amount' => -$amount, // Negative for outflows
                    'type' => 'outflow',
                ]);
            }
        }

        return $activities;
    }

    /**
     * Get investing cash flows (from asset purchases/sales)
     */
    private function getInvestingCashFlows($dateFrom, $dateTo)
    {
        $activities = collect();

        // Fixed assets and investments
        $assetAccounts = Account::active()
            ->where('account_type', 'asset')
            ->where(function($q) {
                $q->where('account_subtype', 'Fixed Asset')
                  ->orWhere('account_subtype', 'Intangible Asset')
                  ->orWhere('account_name', 'like', '%Investment%')
                  ->orWhere('account_name', 'like', '%Equipment%')
                  ->orWhere('account_name', 'like', '%Property%');
            })
            ->get();

        foreach ($assetAccounts as $account) {
            $amount = $this->getAccountActivity($account, $dateFrom, $dateTo);
            if (abs($amount) > 0.01) {
                $activities->push([
                    'description' => $account->account_name,
                    'amount' => -$amount, // Negative for purchases (cash outflow)
                    'type' => $amount > 0 ? 'outflow' : 'inflow',
                ]);
            }
        }

        return $activities;
    }

    /**
     * Get financing cash flows (from loans, equity)
     */
    private function getFinancingCashFlows($dateFrom, $dateTo)
    {
        $activities = collect();

        // Liability accounts (loans, debt)
        $liabilityAccounts = Account::active()
            ->where('account_type', 'liability')
            ->where(function($q) {
                $q->where('account_name', 'like', '%Loan%')
                  ->orWhere('account_name', 'like', '%Debt%')
                  ->orWhere('account_name', 'like', '%Payable%');
            })
            ->get();

        foreach ($liabilityAccounts as $account) {
            $amount = $this->getAccountActivity($account, $dateFrom, $dateTo);
            if (abs($amount) > 0.01) {
                $activities->push([
                    'description' => $account->account_name,
                    'amount' => $amount, // Positive for borrowing (cash inflow)
                    'type' => $amount > 0 ? 'inflow' : 'outflow',
                ]);
            }
        }

        // Equity accounts
        $equityAccounts = Account::active()
            ->where('account_type', 'equity')
            ->where(function($q) {
                $q->where('account_name', 'like', '%Capital%')
                  ->orWhere('account_name', 'like', '%Contribution%');
            })
            ->get();

        foreach ($equityAccounts as $account) {
            $amount = $this->getAccountActivity($account, $dateFrom, $dateTo);
            if (abs($amount) > 0.01) {
                $activities->push([
                    'description' => $account->account_name,
                    'amount' => $amount, // Positive for capital contributions
                    'type' => $amount > 0 ? 'inflow' : 'outflow',
                ]);
            }
        }

        return $activities;
    }

    /**
     * Get account activity within date range
     */
    private function getAccountActivity($account, $dateFrom, $dateTo)
    {
        $lines = JournalEntryLine::whereHas('journalEntry', function ($q) use ($dateFrom, $dateTo) {
            $q->where('status', 'posted')
                ->whereDate('entry_date', '>=', $dateFrom)
                ->whereDate('entry_date', '<=', $dateTo);
        })
        ->where('account_id', $account->id)
        ->get();

        $totalDebit = $lines->sum('debit');
        $totalCredit = $lines->sum('credit');

        // Return net activity based on normal balance
        if ($account->normal_balance === 'debit') {
            return $totalDebit - $totalCredit;
        } else {
            return $totalCredit - $totalDebit;
        }
    }

    public function export(Request $request)
    {
        // TODO: Implement PDF/Excel export
        return response()->json(['message' => 'Export functionality coming soon']);
    }
}
