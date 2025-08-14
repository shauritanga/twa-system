<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Announcement;
use App\Models\Member;
use App\Models\User;
use App\Models\DisasterPayment;
use App\Models\Dependent;
use App\Models\FundraisingCampaign;
use App\Models\WebsiteVisit;
use Illuminate\Support\Facades\DB;

class MarketingController extends Controller
{
    /**
     * Display the marketing homepage
     */
    public function index()
    {
        // Get active announcements for the homepage (limit to 3 most recent)
        $announcements = Announcement::active()
            ->ordered()
            ->limit(3)
            ->get();

        // Get active fundraising campaigns
        $activeCampaigns = FundraisingCampaign::active()
            ->ordered()
            ->get();

        // Get completed fundraising campaigns for impact stories
        $completedCampaigns = FundraisingCampaign::where('status', 'completed')
            ->orWhere(function($query) {
                $query->where('status', 'active')
                      ->whereRaw('raised_amount >= goal_amount');
            })
            ->orderBy('updated_at', 'desc')
            ->limit(6)
            ->get();

        // Get comprehensive statistics for the homepage
        $stats = [
            // Active members count
            'active_members' => Member::whereNull('deleted_at')->count(),

            // Total amount distributed from disaster payments
            'amount_distributed' => DisasterPayment::sum('amount') ?? 0,

            // Total families helped (distinct members who received disaster payments)
            'helped_families' => DisasterPayment::distinct('member_id')->count('member_id'),

            // Years of service (dynamic calculation from founding year 2018)
            'years_of_service' => now()->year - 2018,

            // Website visits
            'website_visits' => WebsiteVisit::getTotalVisits(),

            // Additional useful stats
            'total_members' => Member::count(),
            'total_users' => User::count(),
            'active_announcements' => Announcement::active()->count(),
            'total_dependents' => Dependent::where('status', 'approved')->count(),
            'pending_applications' => Member::whereNull('deleted_at')
                                           ->where('created_at', '>=', now()->subDays(30))
                                           ->count(),
        ];

        return view('marketing.index', compact('announcements', 'stats', 'activeCampaigns', 'completedCampaigns'));
    }

    /**
     * Display all announcements
     */
    public function announcements()
    {
        $announcements = Announcement::active()
            ->ordered()
            ->paginate(10);

        return view('marketing.announcements', compact('announcements'));
    }

    /**
     * Display a specific announcement
     */
    public function announcement(Announcement $announcement)
    {
        // Only show active announcements to public
        if ($announcement->status !== 'active') {
            abort(404);
        }

        return view('marketing.announcement', compact('announcement'));
    }
}
