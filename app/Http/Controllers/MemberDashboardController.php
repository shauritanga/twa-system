<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Member;
use App\Models\Contribution;
use App\Models\DisasterPayment;
use App\Models\Document;

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

        // Get recent documents for member
        $recentDocuments = Document::with('uploader')
            ->published()
            ->where(function ($q) use ($user) {
                $q->where('visibility', 'public')
                  ->orWhere('visibility', 'members_only');

                // Include admin-only documents if user is admin
                if ($user->role && in_array($user->role->name, ['admin', 'secretary'])) {
                    $q->orWhere('visibility', 'admin_only');
                }
            })
            ->orderBy('created_at', 'desc')
            ->limit(5)
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
            'recentDocuments' => $recentDocuments,
        ]);
    }
}
