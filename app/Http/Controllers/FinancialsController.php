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
        // Get members with search functionality
        $membersQuery = Member::query();

        if ($request->has('search')) {
            $membersQuery->where('name', 'like', '%' . $request->input('search') . '%');
        }

        $members = $membersQuery->paginate(10);

        // Build contributions by month for display
        $contributionsByMonth = [];
        foreach ($members as $member) {
            $contributionsByMonth[$member->id] = [];
            $query = $member->contributions();

            if ($request->has('year')) {
                $query->whereYear('date', $request->input('year'));
            }

            if ($request->has('month')) {
                $query->whereMonth('date', $request->input('month'));
            }

            foreach ($query->get() as $contribution) {
                $month = date('Y-m', strtotime($contribution->date));
                $contributionsByMonth[$member->id][$month] = $contribution;
            }
        }

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

        return Inertia::render('Financials/Index', [
            'members' => $members,
            'contributionsByMonth' => $contributionsByMonth,
            'filters' => $request->only(['search', 'year', 'month']),
            'debts' => $debts,
            'penalties' => $penalties,
            'disasterPayments' => $disasterPayments,
            'settings' => $settings,
            'penaltyStatistics' => $penaltyStatistics,
            'listOfShameData' => $listOfShameData,
        ]);
    }
}
