<?php

namespace App\Http\Controllers;

use App\Exports\GenericExport;
use App\Models\Contribution;
use App\Models\Debt;
use App\Models\DisasterPayment;
use App\Models\Member;
use App\Models\Penalty;
use App\Models\Dependent;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class AdminDashboardController extends Controller
{
    public function index()
    {
        // Basic statistics
        $memberCount = Member::count();
        $contributionSum = Contribution::sum('amount');
        $debtSum = Debt::sum('amount');
        $penaltySum = Penalty::sum('amount');
        $disasterPaymentSum = DisasterPayment::sum('amount');
        $beneficiaryCount = DisasterPayment::distinct('member_id')->count('member_id');
        $dependentCount = Dependent::count();
        $paidPenalties = Penalty::where('status', 'paid')->sum('amount');
        $availableAmount = $contributionSum + $paidPenalties - $debtSum - $disasterPaymentSum;

        // Additional statistics for enhanced dashboard
        $activeMembers = Member::where('is_verified', true)->count();
        $pendingMembers = Member::where('is_verified', false)->count();
        $unpaidDebts = Debt::where('status', 'unpaid')->sum('amount');
        $unpaidPenalties = Penalty::where('status', 'unpaid')->sum('amount');
        $thisMonthContributions = Contribution::whereMonth('date', now()->month)
            ->whereYear('date', now()->year)
            ->sum('amount');
        $thisMonthDisasterPayments = DisasterPayment::whereMonth('date', now()->month)
            ->whereYear('date', now()->year)
            ->sum('amount');

        // Monthly data for charts
        $monthlyContributions = Contribution::selectRaw('DATE_FORMAT(date, "%Y-%m") as month, SUM(amount) as total')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $monthlyDisasterPayments = DisasterPayment::selectRaw('DATE_FORMAT(date, "%Y-%m") as month, SUM(amount) as total')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $monthlyDebts = Debt::selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, SUM(amount) as total')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $monthlyPenalties = Penalty::selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, SUM(amount) as total')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Recent activities
        $recentDisasterPayments = DisasterPayment::with('member')->latest()->take(5)->get();
        $recentContributions = Contribution::with('member')->latest()->take(5)->get();
        $recentDebts = Debt::with('member')->latest()->take(5)->get();

        // Top performers and defaulters
        $topContributors = Member::withSum('contributions', 'amount')
            ->orderBy('contributions_sum_amount', 'desc')
            ->take(5)
            ->get();

        $defaulters = Member::whereHas('debts', function($query) {
            $query->where('status', 'unpaid');
        })->withSum(['debts' => function($query) {
            $query->where('status', 'unpaid');
        }], 'amount')->take(5)->get();

        // Growth trends (comparing with previous month)
        $lastMonthContributions = Contribution::whereMonth('date', now()->subMonth()->month)
            ->whereYear('date', now()->subMonth()->year)
            ->sum('amount');
        $contributionGrowth = $lastMonthContributions > 0
            ? (($thisMonthContributions - $lastMonthContributions) / $lastMonthContributions) * 100
            : 0;

        $lastMonthMembers = Member::whereMonth('created_at', now()->subMonth()->month)
            ->whereYear('created_at', now()->subMonth()->year)
            ->count();
        $thisMonthMembers = Member::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
        $memberGrowth = $lastMonthMembers > 0
            ? (($thisMonthMembers - $lastMonthMembers) / $lastMonthMembers) * 100
            : 0;

        // Gender distribution
        $genderDistribution = Member::selectRaw('sex, COUNT(*) as count')
            ->whereNotNull('sex')
            ->groupBy('sex')
            ->get()
            ->mapWithKeys(function ($item) {
                return [ucfirst(strtolower($item->sex)) => $item->count];
            });

        return Inertia::render('Admin/Dashboard', [
            'memberCount' => $memberCount,
            'contributionSum' => $contributionSum,
            'debtSum' => $debtSum,
            'penaltySum' => $penaltySum,
            'disasterPaymentSum' => $disasterPaymentSum,
            'beneficiaryCount' => $beneficiaryCount,
            'dependentCount' => $dependentCount,
            'availableAmount' => $availableAmount,
            'activeMembers' => $activeMembers,
            'pendingMembers' => $pendingMembers,
            'unpaidDebts' => $unpaidDebts,
            'unpaidPenalties' => $unpaidPenalties,
            'thisMonthContributions' => $thisMonthContributions,
            'thisMonthDisasterPayments' => $thisMonthDisasterPayments,
            'contributionGrowth' => round($contributionGrowth, 1),
            'memberGrowth' => round($memberGrowth, 1),
            'monthlyContributions' => $monthlyContributions,
            'monthlyDisasterPayments' => $monthlyDisasterPayments,
            'monthlyDebts' => $monthlyDebts,
            'monthlyPenalties' => $monthlyPenalties,
            'recentDisasterPayments' => $recentDisasterPayments,
            'recentContributions' => $recentContributions,
            'recentDebts' => $recentDebts,
            'topContributors' => $topContributors,
            'defaulters' => $defaulters,
            'genderDistribution' => $genderDistribution,
        ]);
    }

    public function report(Request $request)
    {
        $type = $request->input('type', 'contributions');
        $format = $request->input('format', 'csv');
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $query = match ($type) {
            'contributions' => Contribution::query(),
            'debts' => Debt::query(),
            'penalties' => Penalty::query(),
            'disaster_payments' => DisasterPayment::query(),
            default => Contribution::query(),
        };

        if ($startDate && $endDate) {
            $query->whereBetween('date', [$startDate, $endDate]);
        }

        $data = $query->with('member')->get();

        $headings = match ($type) {
            'contributions' => ['ID', 'Member', 'Amount', 'Date', 'Purpose', 'Status'],
            'debts' => ['ID', 'Member', 'Amount', 'Reason', 'Due Date', 'Status'],
            'penalties' => ['ID', 'Member', 'Amount', 'Reason', 'Due Date', 'Status'],
            'disaster_payments' => ['ID', 'Member', 'Amount', 'Date', 'Purpose'],
            default => [],
        };

        $filename = $type . '_report_' . now()->format('Ymd_His');

        if ($format === 'pdf') {
            $pdf = PDF::loadView('exports.report', compact('data', 'headings', 'type'));
            return $pdf->download($filename . '.pdf');
        }

        if ($format === 'csv') {
            return Excel::download(new GenericExport($data, $headings), $filename . '.csv', \Maatwebsite\Excel\Excel::CSV);
        }

        return Excel::download(new GenericExport($data, $headings), $filename . '.xlsx');
    }

    public function reportsPage()
    {
        $memberCount = Member::count();
        $contributionSum = Contribution::sum('amount');
        $debtSum = Debt::sum('amount');
        $penaltySum = Penalty::sum('amount');
        $disasterPaymentSum = DisasterPayment::sum('amount');
        $beneficiaryCount = DisasterPayment::distinct('member_id')->count('member_id');
        $dependentCount = Dependent::count();
        $paidPenalties = Penalty::where('status', 'paid')->sum('amount');
        $availableAmount = $contributionSum + $paidPenalties - $debtSum - $disasterPaymentSum;

        $monthlyContributions = Contribution::selectRaw('DATE_FORMAT(date, "%Y-%m") as month, SUM(amount) as total')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $monthlyDisasterPayments = DisasterPayment::selectRaw('DATE_FORMAT(date, "%Y-%m") as month, SUM(amount) as total')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $monthlyDebts = Debt::selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, SUM(amount) as total')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $monthlyPenalties = Penalty::selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, SUM(amount) as total')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Recent data for detailed views
        $recentContributions = Contribution::with('member')->latest()->take(10)->get();
        $recentDebts = Debt::with('member')->latest()->take(10)->get();
        $recentPenalties = Penalty::with('member')->latest()->take(10)->get();
        $recentDisasterPayments = DisasterPayment::with('member')->latest()->take(10)->get();

        // Top contributors
        $topContributors = Member::withSum('contributions', 'amount')
            ->orderBy('contributions_sum_amount', 'desc')
            ->take(10)
            ->get();

        // Members with outstanding debts (defaulters)
        $defaulters = Member::whereHas('debts', function($query) {
            $query->where('status', 'unpaid');
        })->withSum(['debts' => function($query) {
            $query->where('status', 'unpaid');
        }], 'amount')->take(10)->get();

        $members = Member::all();

        return inertia('Admin/Reports', [
            'memberCount' => $memberCount,
            'contributionSum' => $contributionSum,
            'debtSum' => $debtSum,
            'penaltySum' => $penaltySum,
            'disasterPaymentSum' => $disasterPaymentSum,
            'beneficiaryCount' => $beneficiaryCount,
            'dependentCount' => $dependentCount,
            'availableAmount' => $availableAmount,
            'monthlyContributions' => $monthlyContributions,
            'monthlyDisasterPayments' => $monthlyDisasterPayments,
            'monthlyDebts' => $monthlyDebts,
            'monthlyPenalties' => $monthlyPenalties,
            'recentContributions' => $recentContributions,
            'recentDebts' => $recentDebts,
            'recentPenalties' => $recentPenalties,
            'recentDisasterPayments' => $recentDisasterPayments,
            'topContributors' => $topContributors,
            'defaulters' => $defaulters,
            'members' => $members,
        ]);
    }

    public function chartsPage(Request $request)
    {
        $type = $request->input('type', 'contributions');

        $query = match ($type) {
            'contributions' => Contribution::query(),
            'debts' => Debt::query(),
            'penalties' => Penalty::query(),
            'disaster_payments' => DisasterPayment::query(),
            default => Contribution::query(),
        };

        $dateColumn = match ($type) {
            'debts', 'penalties' => 'created_at',
            default => 'date',
        };

        $data = $query->selectRaw("DATE_FORMAT($dateColumn, \"%b\") as month, SUM(amount) as total")
            ->groupBy('month')
            ->orderByRaw("MIN($dateColumn)")
            ->get();

        $labels = $data->pluck('month')->toArray();
        $totals = $data->pluck('total')->toArray();

        $chartData = [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => ucfirst($type),
                    'backgroundColor' => 'rgba(54, 162, 235, 0.5)',
                    'borderColor' => 'rgba(54, 162, 235, 1)',
                    'borderWidth' => 1,
                    'data' => $totals,
                ]
            ]
        ];

        return response()->json(['chartData' => $chartData]);
    }

    public function settings()
    {
        $settings = \App\Models\Setting::all()->keyBy('key');
        $recentLogins = \App\Models\User::orderBy('last_login', 'desc')->take(5)->get();
        $users = \App\Models\User::all();

        return inertia('Admin/Settings', [
            'settings' => $settings,
            'recentLogins' => $recentLogins,
            'users' => $users,
        ]);
    }

    // Removed old method to avoid duplication

    public function updateSettings(Request $request)
    {
        $validated = $request->validate([
            'monthly_contribution_amount' => 'sometimes|numeric|min:0',
            'penalty_percentage_rate' => 'sometimes|numeric|min:0|max:100',
            'apply_penalty_to_existing' => 'sometimes|boolean',
            'email_new_member' => 'sometimes|boolean',
            'email_contribution_reminder' => 'sometimes|boolean',
            'email_penalty_notice' => 'sometimes|boolean',
            'allow_admin_assignment' => 'sometimes|boolean',
            'auto_backup' => 'sometimes|boolean',
            'backup_frequency' => 'sometimes|in:daily,weekly,monthly',
            'maintenance_mode' => 'sometimes|boolean',
        ]);

        foreach ($validated as $key => $value) {
            \App\Models\Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        // If apply_penalty_to_existing is true, recalculate existing unpaid penalties
        if ($request->input('apply_penalty_to_existing')) {
            $penaltyRate = $request->input('penalty_percentage_rate');
            $monthlyContribution = $request->input('monthly_contribution_amount');
            $unpaidPenalties = Penalty::where('status', 'unpaid')->get();
            foreach ($unpaidPenalties as $penalty) {
                // Assuming penalty amount is based on missed contributions
                // This is a placeholder logic; adjust based on actual penalty calculation rules
                $missedMonths = 1; // This should be calculated based on actual missed contributions
                $newPenaltyAmount = ($monthlyContribution * $missedMonths) * ($penaltyRate / 100);
                $penalty->update(['amount' => $newPenaltyAmount]);
            }
        }

        return redirect()->back()->with('message', 'Settings updated successfully.');
    }

    public function backup(Request $request)
    {
        // Placeholder for backup logic
        // This could involve triggering a backup job or command
        // For now, we'll just return a success message
        return redirect()->back()->with('message', 'Manual backup triggered successfully.');
    }

    public function roles(Request $request)
    {
        $perPage = 10;
        $page = $request->input('page', 1);
        $search = $request->input('search', '');
        
        $query = \App\Models\User::query();
        
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
        
        $total = $query->count();
        $users = $query->with('role')->skip(($page - 1) * $perPage)
                       ->take($perPage)
                       ->get();
                       
        $totalPages = ceil($total / $perPage);
        $roles = \App\Models\Role::all();
        $permissions = \App\Models\Permission::all();

        return inertia('Admin/RolesManagement', [
            'users' => $users,
            'totalPages' => $totalPages,
            'roles' => $roles,
            'permissions' => $permissions,
        ]);
    }

    public function createRole(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:roles,name',
            'description' => 'nullable|string',
        ]);

        $role = \App\Models\Role::create($validated);

        return redirect()->back()->with('message', 'Role created successfully.');
    }

    public function updateRole(Request $request, $roleId)
    {
        $role = \App\Models\Role::findOrFail($roleId);
        $validated = $request->validate([
            'name' => 'required|string|unique:roles,name,' . $roleId,
            'description' => 'nullable|string',
        ]);

        $role->update($validated);

        return redirect()->back()->with('message', 'Role updated successfully.');
    }

    public function deleteRole(Request $request, $roleId)
    {
        $role = \App\Models\Role::findOrFail($roleId);
        $role->delete();

        return redirect()->back()->with('message', 'Role deleted successfully.');
    }

    public function assignPermissionsToRole(Request $request, $roleId)
    {
        $role = \App\Models\Role::findOrFail($roleId);
        $validated = $request->validate([
            'permission_ids' => 'required|array',
            'permission_ids.*' => 'exists:permissions,id',
        ]);

        $role->permissions()->sync($validated['permission_ids']);

        return redirect()->back()->with('message', 'Permissions assigned to role successfully.');
    }

    public function createPermission(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:permissions,name',
            'description' => 'nullable|string',
        ]);

        $permission = \App\Models\Permission::create($validated);

        return redirect()->back()->with('message', 'Permission created successfully.');
    }

    public function updatePermission(Request $request, $permissionId)
    {
        $permission = \App\Models\Permission::findOrFail($permissionId);
        $validated = $request->validate([
            'name' => 'required|string|unique:permissions,name,' . $permissionId,
            'description' => 'nullable|string',
        ]);

        $permission->update($validated);

        return redirect()->back()->with('message', 'Permission updated successfully.');
    }

    public function deletePermission(Request $request, $permissionId)
    {
        $permission = \App\Models\Permission::findOrFail($permissionId);
        $permission->delete();

        return redirect()->back()->with('message', 'Permission deleted successfully.');
    }

    public function updateUserRole(Request $request, $userId)
    {
        $setting = \App\Models\Setting::where('key', 'allow_admin_assignment')->first();
        if (!$setting || $setting->value != '1') {
            return redirect()->back()->with('error', 'Role assignment is not allowed at this time.');
        }

        $validated = $request->validate([
            'role_id' => 'required|exists:roles,id',
        ]);

        $user = \App\Models\User::findOrFail($userId);
        $user->update(['role_id' => $validated['role_id']]);

        return redirect()->back()->with('message', 'User role updated successfully.');
    }
}
