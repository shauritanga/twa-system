<?php

namespace App\Http\Controllers\AdminPortal;

use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\JournalEntryLine;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class GeneralLedgerController extends Controller
{
    public function index(Request $request)
    {
        $accounts = Account::active()
            ->orderBy('account_code')
            ->get(['id', 'account_code', 'account_name', 'account_type', 'opening_balance']);

        $selectedAccountId = $request->account_id;
        $dateFrom = $request->date_from;
        $dateTo = $request->date_to;

        $ledgerData = null;

        if ($selectedAccountId) {
            $account = Account::findOrFail($selectedAccountId);
            
            // Get all posted journal entry lines for this account
            $query = JournalEntryLine::with(['journalEntry', 'account'])
                ->whereHas('journalEntry', function ($q) {
                    $q->where('status', 'posted');
                })
                ->where('account_id', $selectedAccountId);

            // Apply date filters
            if ($dateFrom) {
                $query->whereHas('journalEntry', function ($q) use ($dateFrom) {
                    $q->whereDate('entry_date', '>=', $dateFrom);
                });
            }
            if ($dateTo) {
                $query->whereHas('journalEntry', function ($q) use ($dateTo) {
                    $q->whereDate('entry_date', '<=', $dateTo);
                });
            }

            $transactions = $query->orderBy('created_at')
                ->get()
                ->map(function ($line) {
                    return [
                        'id' => $line->id,
                        'date' => $line->journalEntry->entry_date,
                        'entry_number' => $line->journalEntry->entry_number,
                        'description' => $line->description ?: $line->journalEntry->description,
                        'reference' => $line->journalEntry->reference,
                        'debit' => $line->debit,
                        'credit' => $line->credit,
                    ];
                });

            // Calculate running balance
            $runningBalance = $account->opening_balance;
            $transactions = $transactions->map(function ($transaction) use (&$runningBalance, $account) {
                // For debit normal balance accounts (assets, expenses): add debits, subtract credits
                // For credit normal balance accounts (liabilities, equity, revenue): add credits, subtract debits
                if ($account->normal_balance === 'debit') {
                    $runningBalance += $transaction['debit'] - $transaction['credit'];
                } else {
                    $runningBalance += $transaction['credit'] - $transaction['debit'];
                }
                
                $transaction['balance'] = $runningBalance;
                return $transaction;
            });

            // Calculate totals
            $totalDebit = $transactions->sum('debit');
            $totalCredit = $transactions->sum('credit');
            $endingBalance = $runningBalance;

            $ledgerData = [
                'account' => $account,
                'transactions' => $transactions,
                'opening_balance' => $account->opening_balance,
                'total_debit' => $totalDebit,
                'total_credit' => $totalCredit,
                'ending_balance' => $endingBalance,
            ];
        }

        return Inertia::render('AdminPortal/GeneralLedger', [
            'accounts' => $accounts,
            'ledgerData' => $ledgerData,
            'filters' => [
                'account_id' => $selectedAccountId,
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
        ]);
    }

    public function export(Request $request)
    {
        // TODO: Implement PDF/Excel export
        return response()->json(['message' => 'Export functionality coming soon']);
    }
}
