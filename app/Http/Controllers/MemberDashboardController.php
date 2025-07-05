<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Member;
use App\Models\Contribution;
use App\Models\DisasterPayment;

class MemberDashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $member = $user->member;
        $contributions = $member ? $member->contributions : collect();
        $debts = $member ? $member->debts : collect();
        $penalties = $member ? $member->penalties : collect();
        $dependents = $member ? $member->dependents : collect();
        // $certificates = $member ? $member->certificates : collect(); // Commented out due to dropped table

        $totalContributions = Contribution::sum('amount');
        $memberContributions = $member ? $member->contributions->sum('amount') : 0;
        $otherContributions = $totalContributions - $memberContributions;

        $recentDisasterPayments = DisasterPayment::with('member')->latest()->take(5)->get();

        $monthlyContributions = Contribution::selectRaw('DATE_FORMAT(date, "%Y-%m") as month, sum(amount) as total')
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get();

        $monthlyDisasterPayments = DisasterPayment::selectRaw('DATE_FORMAT(date, "%Y-%m") as month, sum(amount) as total')
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get();

        return Inertia::render('Member/Dashboard', [
            'contributions' => $contributions,
            'debts' => $debts,
            'penalties' => $penalties,
            'dependents' => $dependents,
            // 'certificates' => $certificates, // Commented out due to dropped table
            'memberContributions' => $memberContributions,
            'otherContributions' => $otherContributions,
            'recentDisasterPayments' => $recentDisasterPayments,
            'monthlyContributions' => $monthlyContributions,
            'monthlyDisasterPayments' => $monthlyDisasterPayments,
        ]);
    }
}
