<?php

namespace App\Http\Controllers;

use App\Models\Contribution;
use App\Models\Payment;
use App\Models\ContributionAllocation;
use App\Models\Debt;
use App\Models\DisasterPayment;
use App\Models\Member;
use App\Models\Penalty;
use App\Models\Setting;
use App\Services\PenaltyService;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FinancialsController extends Controller
{
    protected PenaltyService $penaltyService;
    protected PaymentService $paymentService;

    public function __construct(PenaltyService $penaltyService, PaymentService $paymentService)
    {
        $this->penaltyService = $penaltyService;
        $this->paymentService = $paymentService;
    }

    public function index(Request $request)
    {
        // Get members with search functionality for display (paginated)
        $membersDisplayQuery = Member::query();

        if ($request->has('search')) {
            $membersDisplayQuery->where('name', 'like', '%' . $request->input('search') . '%');
        }

        $membersDisplay = $membersDisplayQuery->paginate(10);

        // Get ALL members for form dropdowns (not paginated)
        $allMembers = Member::orderBy('name')->get();

        // Build monthly allocations by month for display (using paginated members)
        $monthlyContributionsByMonth = [];
        $memberMonthlyTotal = []; // Track monthly contributions per member
        $memberOtherTotal = []; // Track other contributions per member
        
        foreach ($membersDisplay as $member) {
            $monthlyContributionsByMonth[$member->id] = [];
            
            // Get allocations for this member
            $query = ContributionAllocation::where('member_id', $member->id)
                ->whereHas('payment', function($q) {
                    $q->where('payment_type', 'monthly');
                });

            if ($request->filled('year')) {
                $query->where('contribution_month', 'LIKE', $request->input('year') . '-%');
            }

            if ($request->filled('month')) {
                $monthString = $request->input('year') . '-' . str_pad($request->input('month'), 2, '0', STR_PAD_LEFT);
                $query->where('contribution_month', $monthString);
            }

            foreach ($query->get() as $allocation) {
                $month = $allocation->contribution_month;

                // If multiple allocations exist for the same month, sum them
                if (isset($monthlyContributionsByMonth[$member->id][$month])) {
                    $monthlyContributionsByMonth[$member->id][$month]->amount += $allocation->allocated_amount;
                } else {
                    // Create a pseudo-object for compatibility
                    $monthlyContributionsByMonth[$member->id][$month] = (object)[
                        'amount' => $allocation->allocated_amount,
                        'date' => $allocation->payment->payment_date,
                    ];
                }
            }
            
            // Calculate monthly contributions total for this member using allocations
            $monthlyQuery = ContributionAllocation::where('member_id', $member->id)
                ->whereHas('payment', function($q) {
                    $q->where('payment_type', 'monthly');
                });
            
            if ($request->filled('year')) {
                $monthlyQuery->where('contribution_month', 'LIKE', $request->input('year') . '-%');
            }

            if ($request->filled('month')) {
                $monthString = $request->input('year') . '-' . str_pad($request->input('month'), 2, '0', STR_PAD_LEFT);
                $monthlyQuery->where('contribution_month', $monthString);
            }
            
            $memberMonthlyTotal[$member->id] = $monthlyQuery->sum('allocated_amount');
            
            // Calculate other contributions total for this member using payments
            $otherQuery = Payment::where('member_id', $member->id)
                ->where('payment_type', 'other');
            
            if ($request->filled('year')) {
                $otherQuery->whereYear('payment_date', $request->input('year'));
            }

            if ($request->filled('month')) {
                $otherQuery->whereMonth('payment_date', $request->input('month'));
            }
            
            $memberOtherTotal[$member->id] = $otherQuery->sum('amount');
        }

        // Get other contributions separately using payments
        $otherContributionsQuery = Payment::with('member')
            ->where('payment_type', 'other')
            ->orderBy('payment_date', 'desc');

        if ($request->has('search')) {
            $otherContributionsQuery->whereHas('member', function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->input('search') . '%');
            });
        }

        if ($request->filled('year')) {
            $otherContributionsQuery->whereYear('payment_date', $request->input('year'));
        }

        if ($request->filled('month')) {
            $otherContributionsQuery->whereMonth('payment_date', $request->input('month'));
        }

        $otherPayments = $otherContributionsQuery->paginate(10, ['*'], 'other_page');
        
        // Transform payments to match expected structure
        $otherContributions = $otherPayments->setCollection(
            $otherPayments->getCollection()->map(function ($payment) {
                return [
                    'id' => $payment->id,
                    'member' => $payment->member,
                    'amount' => $payment->amount,
                    'date' => $payment->payment_date,
                    'purpose' => $payment->purpose,
                    'notes' => $payment->notes,
                ];
            })
        );

        // Calculate other contributions summary by purpose using payments
        $otherContributionsSummary = Payment::where('payment_type', 'other')
            ->selectRaw('purpose, COUNT(*) as count, SUM(amount) as total')
            ->groupBy('purpose')
            ->orderBy('total', 'desc')
            ->get();

        // Get financial data
        $debts = Debt::with('member')->paginate(10);
        $penalties = Penalty::with('member')->paginate(10);
        $disasterPayments = DisasterPayment::with('member')->paginate(10);

        // Get settings
        $settings = Setting::all()->keyBy('key');

        // Get penalty statistics
        $penaltyStatistics = $this->penaltyService->getPenaltyStatistics();

        // Get optimized list of shame data
        $listOfShameData = $this->penaltyService->getListOfShameData();

        // Calculate enhanced statistics for the cards using new payment system
        $statistics = [
            'active_members' => Member::where('is_verified', true)->count(),
            'total_members' => Member::count(),
            'total_members_ever' => Member::withTrashed()->count(),
            'deleted_members' => Member::onlyTrashed()->count(),
            'contributors' => Member::whereHas('payments')->count(),
            'total_contributions' => Payment::sum('amount'),
            'monthly_contributions' => Payment::where('payment_type', 'monthly')->sum('amount'),
            'other_contributions' => Payment::where('payment_type', 'other')->sum('amount'),
            'monthly_compliance' => $this->calculateMonthlyCompliance(),
            'total_disaster_payments' => DisasterPayment::sum('amount'),
            'total_debts' => Debt::sum('amount'),
        ];

        return Inertia::render('AdminPortal/Financials', [
            'members' => $membersDisplay,
            'allMembers' => $allMembers,
            'monthlyContributionsByMonth' => $monthlyContributionsByMonth,
            'memberMonthlyTotal' => $memberMonthlyTotal,
            'memberOtherTotal' => $memberOtherTotal,
            'otherContributions' => $otherContributions,
            'otherContributionsSummary' => $otherContributionsSummary,
            'filters' => $request->only(['search', 'year', 'month', 'tab']),
            'debts' => $debts,
            'penalties' => $penalties,
            'disasterPayments' => $disasterPayments,
            'settings' => $settings,
            'penaltyStatistics' => $penaltyStatistics,
            'listOfShameData' => $listOfShameData,
            'statistics' => $statistics,
        ]);
    }

    private function calculateMonthlyCompliance()
    {
        $currentYear = date('Y');
        $currentMonth = date('n');
        $totalMembers = Member::count();

        if ($totalMembers == 0) return 0;

        $monthlyAmount = Setting::where('key', 'monthly_contribution_amount')->first();
        $requiredAmount = $monthlyAmount ? (float)$monthlyAmount->value : 50000;

        $compliantMembers = 0;

        // Check each member's compliance for current year up to current month
        foreach (Member::all() as $member) {
            $memberCompliant = true;

            for ($month = 1; $month <= $currentMonth; $month++) {
                $monthString = sprintf('%s-%02d', $currentYear, $month);
                
                // Use new allocation system
                $monthlyTotal = ContributionAllocation::where('member_id', $member->id)
                    ->where('contribution_month', $monthString)
                    ->whereHas('payment', function($q) {
                        $q->where('payment_type', 'monthly');
                    })
                    ->sum('allocated_amount');

                if ($monthlyTotal < $requiredAmount) {
                    $memberCompliant = false;
                    break;
                }
            }

            if ($memberCompliant) {
                $compliantMembers++;
            }
        }

        return round(($compliantMembers / $totalMembers) * 100, 1);
    }

    public function memberContributions(Request $request, Member $member)
    {
        $year = $request->input('year', date('Y'));

        // Get monthly allocations grouped by month using the new system
        $monthlyAllocations = $this->paymentService->getMemberMonthlyAllocations($member->id, $year);

        // Get payments for the year (for "other" contributions)
        $otherPayments = Payment::with('allocations')
            ->where('member_id', $member->id)
            ->where('payment_type', 'other')
            ->whereYear('payment_date', $year)
            ->orderBy('payment_date', 'desc')
            ->get();

        // Transform other payments for display
        $otherContributions = $otherPayments->map(function ($payment) {
            return [
                'id' => $payment->id,
                'amount' => $payment->amount,
                'date' => $payment->payment_date,
                'purpose' => $payment->purpose,
                'notes' => $payment->notes,
            ];
        });

        // Get penalties for the year
        $penalties = $member->penalties()
            ->whereYear('created_at', $year)
            ->orderBy('created_at', 'desc')
            ->get();

        // Calculate summary
        $monthlyContributionAmount = Setting::where('key', 'monthly_contribution_amount')->first();
        $expectedMonthlyAmount = $monthlyContributionAmount ? (float)$monthlyContributionAmount->value : 50000;

        $totalMonthlyContributions = ContributionAllocation::where('member_id', $member->id)
            ->where('contribution_month', 'LIKE', $year . '-%')
            ->whereHas('payment', function ($query) {
                $query->where('payment_type', 'monthly');
            })
            ->sum('allocated_amount');

        $totalOtherContributions = Payment::where('member_id', $member->id)
            ->where('payment_type', 'other')
            ->whereYear('payment_date', $year)
            ->sum('amount');

        $totalPenalties = $member->penalties()
            ->whereYear('created_at', $year)
            ->sum('amount');

        // Count months paid (months where total >= expected amount)
        $monthsPaid = 0;
        foreach ($monthlyAllocations as $month => $allocations) {
            $monthTotal = 0;
            foreach ($allocations as $allocation) {
                $monthTotal += $allocation->allocated_amount;
            }
            if ($monthTotal >= $expectedMonthlyAmount) {
                $monthsPaid++;
            }
        }

        $summary = [
            'monthly_contribution_amount' => $expectedMonthlyAmount,
            'total_monthly_contributions' => $totalMonthlyContributions,
            'total_other_contributions' => $totalOtherContributions,
            'total_penalties' => $totalPenalties,
            'months_paid' => $monthsPaid,
        ];

        // Transform monthly allocations for frontend
        $monthlyContributions = [];
        foreach ($monthlyAllocations as $month => $allocations) {
            $monthlyContributions[$month] = array_map(function ($allocation) {
                return [
                    'id' => $allocation->id,
                    'amount' => $allocation->allocated_amount,
                    'date' => $allocation->payment->payment_date,
                    'notes' => $allocation->notes,
                    'allocation_type' => $allocation->allocation_type,
                    'payment_id' => $allocation->payment_id,
                ];
            }, $allocations);
        }

        return Inertia::render('AdminPortal/MemberContributions', [
            'member' => $member,
            'year' => $year,
            'monthlyContributions' => $monthlyContributions,
            'otherContributions' => $otherContributions,
            'penalties' => $penalties,
            'summary' => $summary,
        ]);
    }
}
