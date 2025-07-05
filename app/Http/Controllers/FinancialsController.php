<?php

namespace App\Http\Controllers;

use App\Models\Contribution;
use App\Models\Debt;
use App\Models\DisasterPayment;
use App\Models\Member;
use App\Models\Penalty;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FinancialsController extends Controller
{
    public function index(Request $request)
    {
        $members = Member::query()->paginate(10);

        $membersQuery = Member::query();

        if ($request->has('search')) {
            $membersQuery->where('name', 'like', '%' . $request->input('search') . '%');
        }

        $members = $membersQuery->paginate(10);

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

        $settings = \App\Models\Setting::all()->keyBy('key');

        return Inertia::render('Financials/Index', [
            'members' => $members,
            'contributionsByMonth' => $contributionsByMonth,
            'filters' => $request->only(['search', 'year', 'month']),
            'debts' => Debt::with('member')->paginate(10),
            'penalties' => Penalty::with('member')->paginate(10),
            'disasterPayments' => DisasterPayment::with('member')->paginate(10),
            'settings' => $settings,
        ]);
    }
}
