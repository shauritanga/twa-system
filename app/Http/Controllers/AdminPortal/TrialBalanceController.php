<?php

namespace App\Http\Controllers\AdminPortal;

use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\JournalEntryLine;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class TrialBalanceController extends Controller
{
    public function index(Request $request)
    {
        $asOfDate = $request->as_of_date ?? now()->format('Y-m-d');
        $accountType = $request->account_type;

        // Get all active accounts
        $query = Account::active()->orderBy('account_code');

        if ($accountType) {
            $query->where('account_type', $accountType);
        }

        $accounts = $query->get();

        // Calculate balances for each account
        $trialBalanceData = $accounts->map(function ($account) use ($asOfDate) {
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
                $debitBalance = $balance >= 0 ? $balance : 0;
                $creditBalance = $balance < 0 ? abs($balance) : 0;
            } else {
                $balance = $account->opening_balance + $totalCredit - $totalDebit;
                $creditBalance = $balance >= 0 ? $balance : 0;
                $debitBalance = $balance < 0 ? abs($balance) : 0;
            }

            return [
                'id' => $account->id,
                'account_code' => $account->account_code,
                'account_name' => $account->account_name,
                'account_type' => $account->account_type,
                'account_subtype' => $account->account_subtype,
                'normal_balance' => $account->normal_balance,
                'opening_balance' => $account->opening_balance,
                'total_debit' => $totalDebit,
                'total_credit' => $totalCredit,
                'debit_balance' => $debitBalance,
                'credit_balance' => $creditBalance,
            ];
        })->filter(function ($account) {
            // Only show accounts with activity or opening balance
            return $account['opening_balance'] != 0 
                || $account['total_debit'] != 0 
                || $account['total_credit'] != 0;
        })->values();

        // Calculate totals
        $totalDebits = $trialBalanceData->sum('debit_balance');
        $totalCredits = $trialBalanceData->sum('credit_balance');
        $difference = abs($totalDebits - $totalCredits);
        $isBalanced = $difference < 0.01;

        // Group by account type
        $groupedData = $trialBalanceData->groupBy('account_type');

        return Inertia::render('AdminPortal/TrialBalance', [
            'trialBalanceData' => $trialBalanceData,
            'groupedData' => $groupedData,
            'totals' => [
                'total_debits' => $totalDebits,
                'total_credits' => $totalCredits,
                'difference' => $difference,
                'is_balanced' => $isBalanced,
            ],
            'filters' => [
                'as_of_date' => $asOfDate,
                'account_type' => $accountType,
            ],
        ]);
    }

    public function export(Request $request)
    {
        // TODO: Implement PDF/Excel export
        return response()->json(['message' => 'Export functionality coming soon']);
    }
}
