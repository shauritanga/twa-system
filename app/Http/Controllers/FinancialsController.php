<?php

namespace App\Http\Controllers;

use App\Models\Contribution;
use App\Models\Debt;
use App\Models\DisasterPayment;
use App\Models\Member;
use App\Models\Penalty;
use App\Models\Setting;
use App\Services\PenaltyService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FinancialsController extends Controller
{
    protected PenaltyService $penaltyService;

    public function __construct(PenaltyService $penaltyService)
    {
        $this->penaltyService = $penaltyService;
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

        // Build monthly contributions by month for display (using paginated members)
        $monthlyContributionsByMonth = [];
        foreach ($membersDisplay as $member) {
            $monthlyContributionsByMonth[$member->id] = [];
            $query = $member->contributions()->where('type', 'monthly');

            if ($request->has('year')) {
                $query->whereYear('date', $request->input('year'));
            }

            if ($request->has('month')) {
                $query->whereMonth('date', $request->input('month'));
            }

            foreach ($query->get() as $contribution) {
                // For monthly contributions, use contribution_month field
                $month = $contribution->contribution_month ?: date('Y-m', strtotime($contribution->date));

                // If multiple contributions exist for the same month, sum them
                if (isset($monthlyContributionsByMonth[$member->id][$month])) {
                    $monthlyContributionsByMonth[$member->id][$month]->amount += $contribution->amount;
                } else {
                    $monthlyContributionsByMonth[$member->id][$month] = $contribution;
                }
            }
        }

        // Get other contributions separately
        $otherContributionsQuery = Contribution::with('member')
            ->where('type', 'other')
            ->orderBy('date', 'desc');

        if ($request->has('search')) {
            $otherContributionsQuery->whereHas('member', function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->input('search') . '%');
            });
        }

        if ($request->has('year')) {
            $otherContributionsQuery->whereYear('date', $request->input('year'));
        }

        if ($request->has('month')) {
            $otherContributionsQuery->whereMonth('date', $request->input('month'));
        }

        $otherContributions = $otherContributionsQuery->paginate(10, ['*'], 'other_page');

        // Calculate other contributions summary by purpose
        $otherContributionsSummary = Contribution::where('type', 'other')
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

        // Calculate enhanced statistics for the cards
        $statistics = [
            'active_members' => Member::where('is_verified', true)->count(), // Active (non-deleted) verified members
            'total_members' => Member::count(), // Total active (non-deleted) members
            'total_members_ever' => Member::withTrashed()->count(), // Total members including deleted
            'deleted_members' => Member::onlyTrashed()->count(), // Deleted members count
            'contributors' => Member::whereHas('contributions')->count(),
            'total_contributions' => \App\Models\Contribution::sum('amount'),
            'monthly_contributions' => \App\Models\Contribution::where('type', 'monthly')->sum('amount'),
            'other_contributions' => \App\Models\Contribution::where('type', 'other')->sum('amount'),
            'monthly_compliance' => $this->calculateMonthlyCompliance(),
            'total_disaster_payments' => DisasterPayment::sum('amount'),
            'total_debts' => \App\Models\Debt::sum('amount'),
        ];

        return Inertia::render('Financials/Index', [
            'members' => $membersDisplay, // Paginated members for display
            'allMembers' => $allMembers, // All members for form dropdowns
            'monthlyContributionsByMonth' => $monthlyContributionsByMonth,
            'otherContributions' => $otherContributions,
            'otherContributionsSummary' => $otherContributionsSummary,
            'filters' => $request->only(['search', 'year', 'month']),
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
                $monthlyTotal = Contribution::where('member_id', $member->id)
                    ->where('type', 'monthly')
                    ->where('contribution_month', $monthString)
                    ->sum('amount');

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
}
