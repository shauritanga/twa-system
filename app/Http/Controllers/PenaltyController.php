<?php

namespace App\Http\Controllers;

use App\Models\Penalty;
use App\Services\PenaltyService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;

class PenaltyController extends Controller
{
    protected PenaltyService $penaltyService;

    public function __construct(PenaltyService $penaltyService)
    {
        $this->penaltyService = $penaltyService;
    }

    /**
     * Mark penalty as paid
     */
    public function markAsPaid(Penalty $penalty): RedirectResponse
    {
        try {
            $penalty->markAsPaid();

            // Log the payment
            Log::info("Penalty marked as paid", [
                'penalty_id' => $penalty->id,
                'member_id' => $penalty->member_id,
                'amount' => $penalty->amount,
                'month' => $penalty->penalty_month
            ]);

            return redirect()->back()->with('success', 'Penalty marked as paid successfully.');
        } catch (\Exception $e) {
            Log::error("Failed to mark penalty as paid: " . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to mark penalty as paid.');
        }
    }

    /**
     * Mark multiple penalties as paid
     */
    public function markMultipleAsPaid(Request $request): RedirectResponse
    {
        $request->validate([
            'penalty_ids' => 'required|array',
            'penalty_ids.*' => 'exists:penalties,id'
        ]);

        try {
            $updated = Penalty::whereIn('id', $request->penalty_ids)
                ->where('status', 'unpaid')
                ->update(['status' => 'paid']);

            Log::info("Multiple penalties marked as paid", [
                'penalty_ids' => $request->penalty_ids,
                'updated_count' => $updated
            ]);

            return redirect()->back()->with('success', "{$updated} penalties marked as paid successfully.");
        } catch (\Exception $e) {
            Log::error("Failed to mark multiple penalties as paid: " . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to mark penalties as paid.');
        }
    }

    /**
     * Get penalty statistics for dashboard
     */
    public function getStatistics(): array
    {
        return $this->penaltyService->getPenaltyStatistics();
    }

    /**
     * Recalculate penalties for a specific member
     */
    public function recalculateForMember(Request $request): RedirectResponse
    {
        $request->validate([
            'member_id' => 'required|exists:members,id'
        ]);

        try {
            $member = \App\Models\Member::findOrFail($request->member_id);
            $results = $this->penaltyService->calculatePenaltiesForMember($member);

            if ($results['penalties_created'] > 0) {
                return redirect()->back()->with('success',
                    "Created {$results['penalties_created']} penalties for {$member->name}.");
            } else {
                return redirect()->back()->with('info',
                    "No new penalties needed for {$member->name}.");
            }
        } catch (\Exception $e) {
            Log::error("Failed to recalculate penalties for member: " . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to recalculate penalties.');
        }
    }

    /**
     * Delete penalty (admin only)
     */
    public function destroy(Penalty $penalty): RedirectResponse
    {
        try {
            $memberName = $penalty->member->name;
            $penaltyMonth = $penalty->penalty_month;

            $penalty->delete();

            Log::info("Penalty deleted", [
                'penalty_id' => $penalty->id,
                'member_name' => $memberName,
                'penalty_month' => $penaltyMonth
            ]);

            return redirect()->back()->with('success',
                "Penalty for {$memberName} ({$penaltyMonth}) deleted successfully.");
        } catch (\Exception $e) {
            Log::error("Failed to delete penalty: " . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to delete penalty.');
        }
    }

    /**
     * Display a listing of penalties with filters
     */
    public function index(Request $request)
    {
        $query = Penalty::with('member');

        // Apply filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('member_id')) {
            $query->where('member_id', $request->member_id);
        }

        if ($request->filled('month')) {
            $query->where('penalty_month', $request->month);
        }

        $penalties = $query->orderBy('created_at', 'desc')->paginate(50);
        $statistics = $this->penaltyService->getPenaltyStatistics();

        return inertia('Admin/Penalties/Index', [
            'penalties' => $penalties,
            'statistics' => $statistics,
            'filters' => $request->only(['status', 'member_id', 'month'])
        ]);
    }
}
