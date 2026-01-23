<?php

namespace App\Http\Controllers\AdminPortal;

use App\Http\Controllers\Controller;
use App\Models\Member;
use App\Models\Payment;
use App\Models\DisasterPayment;
use App\Models\Loan;
use App\Models\JournalEntry;
use App\Models\Account;
use App\Services\AccountingService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    protected AccountingService $accountingService;

    public function __construct(AccountingService $accountingService)
    {
        $this->accountingService = $accountingService;
    }

    public function index()
    {
        // Member statistics
        $memberCount = Member::count();
        $activeMembers = Member::where('is_verified', true)->count();

        // Financial statistics - Using Payment model instead of Contribution
        $contributionSum = Payment::sum('amount');
        $disasterPaymentSum = DisasterPayment::sum('amount');
        $loanSum = Loan::where('status', 'disbursed')->sum('amount'); // Outstanding loans

        // Monthly contributions for chart - Using Payment model
        $monthlyContributions = Payment::selectRaw('DATE_FORMAT(payment_date, "%Y-%m") as month, SUM(amount) as total')
            ->whereYear('payment_date', Carbon::now()->year)
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Recent contributions - Using Payment model
        $recentContributions = Payment::with('member')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Recent disaster payments
        $recentDisasterPayments = DisasterPayment::with('member')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Recent loans
        $recentLoans = Loan::with('member')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Accounting data
        $accountingSummary = $this->accountingService->getAccountingSummary();

        // Account balances by type
        $accountBalances = [
            'assets' => Account::where('account_type', 'asset')->where('is_active', true)->sum('current_balance'),
            'liabilities' => Account::where('account_type', 'liability')->where('is_active', true)->sum('current_balance'),
            'equity' => Account::where('account_type', 'equity')->where('is_active', true)->sum('current_balance'),
            'revenue' => Account::where('account_type', 'revenue')->where('is_active', true)->sum('current_balance'),
            'expenses' => Account::where('account_type', 'expense')->where('is_active', true)->sum('current_balance'),
        ];

        // Top accounts by balance
        $topAccounts = Account::where('is_active', true)
            ->whereRaw('ABS(current_balance) > 0')
            ->orderByRaw('ABS(current_balance) DESC')
            ->limit(5)
            ->get(['account_code', 'account_name', 'account_type', 'current_balance']);

        return Inertia::render('AdminPortal/Dashboard', [
            // Member data
            'memberCount' => $memberCount,
            'activeMembers' => $activeMembers,
            
            // Financial data - Updated to use Payment model
            'contributionSum' => $contributionSum,
            'disasterPaymentSum' => $disasterPaymentSum,
            'loanSum' => $loanSum,
            'monthlyContributions' => $monthlyContributions,
            'recentContributions' => $recentContributions,
            'recentDisasterPayments' => $recentDisasterPayments,
            'recentLoans' => $recentLoans,
            
            // Accounting data
            'accountingSummary' => $accountingSummary,
            'accountBalances' => $accountBalances,
            'topAccounts' => $topAccounts,
        ]);
    }
}