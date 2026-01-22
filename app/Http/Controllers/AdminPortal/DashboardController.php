<?php

namespace App\Http\Controllers\AdminPortal;

use App\Http\Controllers\Controller;
use App\Models\Member;
use App\Models\Contribution;
use App\Models\DisasterPayment;
use App\Models\Debt;
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

        // Financial statistics
        $contributionSum = Contribution::where('status', 'approved')->sum('amount');
        $disasterPaymentSum = DisasterPayment::sum('amount');
        $debtSum = Debt::where('status', 'active')->sum('amount');

        // Monthly contributions for chart
        $monthlyContributions = Contribution::selectRaw('DATE_FORMAT(date, "%Y-%m") as month, SUM(amount) as total')
            ->where('status', 'approved')
            ->whereYear('date', Carbon::now()->year)
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Recent contributions
        $recentContributions = Contribution::with('member')
            ->where('status', 'approved')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Recent disaster payments
        $recentDisasterPayments = DisasterPayment::with('member')
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
            
            // Financial data
            'contributionSum' => $contributionSum,
            'disasterPaymentSum' => $disasterPaymentSum,
            'debtSum' => $debtSum,
            'monthlyContributions' => $monthlyContributions,
            'recentContributions' => $recentContributions,
            'recentDisasterPayments' => $recentDisasterPayments,
            
            // Accounting data
            'accountingSummary' => $accountingSummary,
            'accountBalances' => $accountBalances,
            'topAccounts' => $topAccounts,
        ]);
    }
}