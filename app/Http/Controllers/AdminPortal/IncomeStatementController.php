<?php

namespace App\Http\Controllers\AdminPortal;

use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\JournalEntryLine;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IncomeStatementController extends Controller
{
    public function index(Request $request)
    {
        $dateFrom = $request->date_from ?? now()->startOfYear()->format('Y-m-d');
        $dateTo = $request->date_to ?? now()->format('Y-m-d');

        // Get revenue and expense accounts
        $revenue = $this->getAccountBalances('revenue', $dateFrom, $dateTo);
        $expenses = $this->getAccountBalances('expense', $dateFrom, $dateTo);

        // Calculate totals
        $totalRevenue = $revenue->sum('balance');
        $totalExpenses = $expenses->sum('balance');
        $netIncome = $totalRevenue - $totalExpenses;

        // Group by subtype
        $groupedRevenue = $revenue->groupBy('account_subtype');
        $groupedExpenses = $expenses->groupBy('account_subtype');

        // Calculate percentages
        $revenueWithPercentages = $revenue->map(function ($account) use ($totalRevenue) {
            $account['percentage'] = $totalRevenue > 0 ? ($account['balance'] / $totalRevenue) * 100 : 0;
            return $account;
        });

        $expensesWithPercentages = $expenses->map(function ($account) use ($totalRevenue) {
            $account['percentage'] = $totalRevenue > 0 ? ($account['balance'] / $totalRevenue) * 100 : 0;
            return $account;
        });

        return Inertia::render('AdminPortal/IncomeStatement', [
            'revenue' => $revenueWithPercentages,
            'expenses' => $expensesWithPercentages,
            'groupedRevenue' => $groupedRevenue,
            'groupedExpenses' => $groupedExpenses,
            'totals' => [
                'total_revenue' => $totalRevenue,
                'total_expenses' => $totalExpenses,
                'net_income' => $netIncome,
                'profit_margin' => $totalRevenue > 0 ? ($netIncome / $totalRevenue) * 100 : 0,
            ],
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
        ]);
    }

    /**
     * Get account balances for a specific type within a date range
     */
    private function getAccountBalances($accountType, $dateFrom, $dateTo)
    {
        $accounts = Account::active()
            ->where('account_type', $accountType)
            ->orderBy('account_code')
            ->get();

        return $accounts->map(function ($account) use ($dateFrom, $dateTo) {
            // Get all posted journal entry lines for this account within the date range
            $lines = JournalEntryLine::whereHas('journalEntry', function ($q) use ($dateFrom, $dateTo) {
                $q->where('status', 'posted')
                    ->whereDate('entry_date', '>=', $dateFrom)
                    ->whereDate('entry_date', '<=', $dateTo);
            })
            ->where('account_id', $account->id)
            ->get();

            $totalDebit = $lines->sum('debit');
            $totalCredit = $lines->sum('credit');

            // For income statement, we don't include opening balance
            // Revenue accounts have credit normal balance
            // Expense accounts have debit normal balance
            if ($account->normal_balance === 'debit') {
                $balance = $totalDebit - $totalCredit;
            } else {
                $balance = $totalCredit - $totalDebit;
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
            // Only show accounts with activity
            return abs($account['balance']) > 0.01;
        })->values();
    }

    public function export(Request $request)
    {
        // TODO: Implement PDF/Excel export
        return response()->json(['message' => 'Export functionality coming soon']);
    }
}
