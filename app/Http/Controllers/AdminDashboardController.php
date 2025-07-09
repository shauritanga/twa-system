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

        // Get recent logins with online status logic
        $recentLogins = \App\Models\User::with('role')
            ->whereNotNull('last_login')
            ->orderBy('last_login', 'desc')
            ->take(10)
            ->get()
            ->map(function ($user) {
                // Check if user has active session (online in last 15 minutes)
                $isOnline = \DB::table('sessions')
                    ->where('user_id', $user->id)
                    ->where('last_activity', '>', now()->subMinutes(15)->timestamp)
                    ->exists();

                $user->is_online = $isOnline;
                $user->formatted_last_login = $user->last_login ? \Carbon\Carbon::parse($user->last_login)->diffForHumans() : 'Never';
                return $user;
            });

        // System statistics for dashboard
        $systemStats = [
            'total_users' => \App\Models\User::count(),
            'online_users' => \DB::table('sessions')
                ->where('last_activity', '>', now()->subMinutes(15)->timestamp)
                ->whereNotNull('user_id')
                ->distinct('user_id')
                ->count(),
            'total_members' => \App\Models\Member::count(),
            'verified_members' => \App\Models\Member::where('is_verified', true)->count(),
            'database_size' => $this->getDatabaseSize(),
            'storage_used' => $this->getStorageUsed(),
        ];

        return inertia('Admin/Settings', [
            'settings' => $settings,
            'recentLogins' => $recentLogins,
            'systemStats' => $systemStats,
        ]);
    }

    private function getDatabaseSize()
    {
        try {
            $result = \DB::select("SELECT
                ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'size_mb'
                FROM information_schema.tables
                WHERE table_schema = DATABASE()");
            return $result[0]->size_mb ?? 0;
        } catch (\Exception $e) {
            return 0;
        }
    }

    private function getStorageUsed()
    {
        try {
            $storagePath = storage_path('app');
            $bytes = 0;
            $iterator = new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator($storagePath, \RecursiveDirectoryIterator::SKIP_DOTS)
            );
            foreach ($iterator as $file) {
                $bytes += $file->getSize();
            }
            return round($bytes / 1024 / 1024, 2); // Convert to MB
        } catch (\Exception $e) {
            return 0;
        }
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
            'email_system_alerts' => 'sometimes|boolean',
            'email_backup_reports' => 'sometimes|boolean',
            'allow_admin_assignment' => 'sometimes|boolean',
            'auto_backup' => 'sometimes|boolean',
            'backup_frequency' => 'sometimes|in:daily,weekly,monthly',
            'backup_retention_days' => 'sometimes|integer|min:1|max:365',
            'maintenance_mode' => 'sometimes|boolean',
            'session_timeout_minutes' => 'sometimes|integer|min:15|max:1440',
            'max_login_attempts' => 'sometimes|integer|min:3|max:10',
            'require_email_verification' => 'sometimes|boolean',
            'enable_two_factor_auth' => 'sometimes|boolean',
            'system_timezone' => 'sometimes|string|max:50',
            'date_format' => 'sometimes|in:Y-m-d,d/m/Y,m/d/Y,d-m-Y',
            'currency_symbol' => 'sometimes|string|max:10',
        ]);

        foreach ($validated as $key => $value) {
            \App\Models\Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        // Clear all settings caches to ensure immediate effect
        $this->clearSettingsCache($validated);

        // Handle special maintenance mode setting
        if (isset($validated['maintenance_mode'])) {
            $maintenanceService = app(\App\Services\MaintenanceConfigService::class);
            $maintenanceService->setMaintenanceMode((bool) $validated['maintenance_mode']);
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

    /**
     * Clear settings cache based on updated settings
     *
     * @param array $updatedSettings
     * @return void
     */
    private function clearSettingsCache(array $updatedSettings): void
    {
        // Clear session settings cache if session-related settings were updated
        if (array_intersect_key($updatedSettings, array_flip([
            'session_timeout_minutes', 'require_email_verification', 'enable_two_factor_auth'
        ]))) {
            app(\App\Services\SessionConfigService::class)->clearAllCache();
        }

        // Clear auth settings cache if auth-related settings were updated
        if (array_intersect_key($updatedSettings, array_flip([
            'max_login_attempts', 'require_email_verification', 'enable_two_factor_auth', 'allow_admin_assignment'
        ]))) {
            app(\App\Services\AuthConfigService::class)->clearCache();
        }

        // Clear system settings cache if system-related settings were updated
        if (array_intersect_key($updatedSettings, array_flip([
            'system_timezone', 'date_format', 'currency_symbol'
        ]))) {
            app(\App\Services\SystemConfigService::class)->clearCache();
        }

        // Clear maintenance settings cache if maintenance mode was updated
        if (isset($updatedSettings['maintenance_mode'])) {
            app(\App\Services\MaintenanceConfigService::class)->clearCache();
        }
    }

    public function backup(Request $request)
    {
        $backupService = app(\App\Services\BackupService::class);
        $result = $backupService->createManualBackup();

        if ($result['success']) {
            $message = $result['message'];
            if ($result['backup_info']) {
                $backup = $result['backup_info'];
                $message .= ' Backup saved as: ' . $backup['filename'] . ' (' . $backup['size'] . ')';
            }
            return redirect()->back()->with('success', $message);
        } else {
            return redirect()->back()->withErrors(['backup' => $result['message']]);
        }
    }

    public function roles(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $page = $request->input('page', 1);
        $search = $request->input('search', '');
        $roleFilter = $request->input('role_filter', '');
        $sortBy = $request->input('sort_by', 'name');
        $sortOrder = $request->input('sort_order', 'asc');

        $query = \App\Models\User::query();

        // Apply search filter
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Apply role filter
        if ($roleFilter) {
            if ($roleFilter === 'no_role') {
                $query->whereNull('role_id');
            } else {
                $query->where('role_id', $roleFilter);
            }
        }

        $total = $query->count();

        // Apply sorting
        if ($sortBy === 'role') {
            $users = $query->with('role')
                           ->leftJoin('roles', 'users.role_id', '=', 'roles.id')
                           ->orderBy('roles.name', $sortOrder)
                           ->select('users.*')
                           ->skip(($page - 1) * $perPage)
                           ->take($perPage)
                           ->get();
        } else {
            $users = $query->with('role')
                           ->orderBy($sortBy, $sortOrder)
                           ->skip(($page - 1) * $perPage)
                           ->take($perPage)
                           ->get();
        }

        $totalPages = ceil($total / $perPage);
        $roles = \App\Models\Role::all();
        $permissions = \App\Models\Permission::all();

        return inertia('Admin/RolesManagement', [
            'users' => $users,
            'totalPages' => $totalPages,
            'currentPage' => (int) $page,
            'total' => $total,
            'perPage' => $perPage,
            'search' => $search,
            'roleFilter' => $roleFilter,
            'sortBy' => $sortBy,
            'sortOrder' => $sortOrder,
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
            'role_id' => 'nullable|exists:roles,id',
        ]);

        $user = \App\Models\User::findOrFail($userId);
        $user->update(['role_id' => $validated['role_id']]);

        return redirect()->back()->with('message', 'User role updated successfully.');
    }
}
