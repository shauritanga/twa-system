<?php

namespace App\Http\Controllers\AdminPortal;

use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\JournalEntryLine;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BalanceSheetController extends Controller
{
    public function index(Request $request)
    {
        $asOfDate = $request->as_of_date ?? now()->format('Y-m-d');

        // Get accounts by type
        $assets = $this->getAccountBalances('asset', $asOfDate);
        $liabilities = $this->getAccountBalances('liability', $asOfDate);
        $equity = $this->getAccountBalances('equity', $asOfDate);

        // Calculate totals
        $totalAssets = $assets->sum('balance');
        $totalLiabilities = $liabilities->sum('balance');
        $totalEquity = $equity->sum('balance');

        // Calculate net income from revenue and expenses (for current period)
        $revenue = $this->getAccountBalances('revenue', $asOfDate);
        $expenses = $this->getAccountBalances('expense', $asOfDate);
        $netIncome = $revenue->sum('balance') - $expenses->sum('balance');

        // Add net income to equity
        $totalEquityWithIncome = $totalEquity + $netIncome;

        // Check if balanced (Assets = Liabilities + Equity)
        $totalLiabilitiesAndEquity = $totalLiabilities + $totalEquityWithIncome;
        $difference = abs($totalAssets - $totalLiabilitiesAndEquity);
        $isBalanced = $difference < 0.01;

        // Group by subtype
        $groupedAssets = $assets->groupBy('account_subtype');
        $groupedLiabilities = $liabilities->groupBy('account_subtype');
        $groupedEquity = $equity->groupBy('account_subtype');

        return Inertia::render('AdminPortal/BalanceSheet', [
            'assets' => $assets,
            'liabilities' => $liabilities,
            'equity' => $equity,
            'groupedAssets' => $groupedAssets,
            'groupedLiabilities' => $groupedLiabilities,
            'groupedEquity' => $groupedEquity,
            'totals' => [
                'total_assets' => $totalAssets,
                'total_liabilities' => $totalLiabilities,
                'total_equity' => $totalEquity,
                'net_income' => $netIncome,
                'total_equity_with_income' => $totalEquityWithIncome,
                'total_liabilities_and_equity' => $totalLiabilitiesAndEquity,
                'difference' => $difference,
                'is_balanced' => $isBalanced,
            ],
            'filters' => [
                'as_of_date' => $asOfDate,
            ],
        ]);
    }

    /**
     * Get account balances for a specific type
     */
    private function getAccountBalances($accountType, $asOfDate)
    {
        $accounts = Account::active()
            ->where('account_type', $accountType)
            ->orderBy('account_code')
            ->get();

        return $accounts->map(function ($account) use ($asOfDate) {
            // Get all posted journal entry lines for this account up to the date
            $lines = JournalEntryLine::whereHas('journalEntry', function ($q) use ($asOfDate) {
                $q->where('status', 'posted')
                    ->whereDate('entry_date', '<=', $asOfDate);
            })
            ->where('account_id', $account->id)
            ->get();

            $totalDebit = $lines->sum('debit');
            $totalCredit = $lines->sum('credit');

            // Calculate balance based on normal balance type
            if ($account->normal_balance === 'debit') {
                $balance = $account->opening_balance + $totalDebit - $totalCredit;
            } else {
                $balance = $account->opening_balance + $totalCredit - $totalDebit;
            }

            return [
                'id' => $account->id,
                'account_code' => $account->account_code,
                'account_name' => $account->account_name,
                'account_type' => $account->account_type,
                'account_subtype' => $account->account_subtype ?: 'Other',
                'balance' => $balance,
            ];
        })->filter(function ($account) {
            // Only show accounts with non-zero balance
            return abs($account['balance']) > 0.01;
        })->values();
    }

    public function export(Request $request)
    {
        // TODO: Implement PDF/Excel export
        return response()->json(['message' => 'Export functionality coming soon']);
    }
}
