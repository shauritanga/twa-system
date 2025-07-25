<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AuditLog;
use App\Models\User;
use Inertia\Inertia;
use Carbon\Carbon;

class AuditController extends Controller
{
    /**
     * Display audit logs
     */
    public function index(Request $request)
    {
        $query = AuditLog::with('user')
            ->orderBy('created_at', 'desc');

        // Apply filters
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('severity')) {
            $query->where('severity', $request->severity);
        }

        if ($request->filled('model_type')) {
            $query->where('model_type', $request->model_type);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhere('user_name', 'like', "%{$search}%")
                  ->orWhere('user_email', 'like', "%{$search}%")
                  ->orWhere('model_name', 'like', "%{$search}%")
                  ->orWhere('ip_address', 'like', "%{$search}%");
            });
        }

        // Get per page from request, default to 25, max 100
        $perPage = min((int) $request->get('per_page', 25), 100);
        $auditLogs = $query->paginate($perPage)->withQueryString();

        // Get filter options
        $users = User::select('id', 'name', 'email')->orderBy('name')->get();
        $actions = AuditLog::distinct()->pluck('action')->sort()->values();
        $categories = AuditLog::distinct()->pluck('category')->sort()->values();
        $modelTypes = AuditLog::distinct()->pluck('model_type')->filter()->sort()->values();

        // Get statistics
        $statistics = [
            'total_logs' => AuditLog::count(),
            'today_logs' => AuditLog::whereDate('created_at', today())->count(),
            'this_week_logs' => AuditLog::whereBetween('created_at', [
                Carbon::now()->startOfWeek(),
                Carbon::now()->endOfWeek()
            ])->count(),
            'critical_logs' => AuditLog::where('severity', 'critical')->count(),
            'failed_logins' => AuditLog::where('action', 'login_failed')
                ->whereDate('created_at', '>=', Carbon::now()->subDays(7))
                ->count(),
        ];

        return Inertia::render('Admin/AuditLogs/Index', [
            'auditLogs' => $auditLogs,
            'filters' => $request->only(['user_id', 'action', 'category', 'severity', 'model_type', 'date_from', 'date_to', 'search']),
            'users' => $users,
            'actions' => $actions,
            'categories' => $categories,
            'modelTypes' => $modelTypes,
            'statistics' => $statistics,
        ]);
    }

    /**
     * Show detailed audit log
     */
    public function show(AuditLog $auditLog)
    {
        $auditLog->load('user');

        return Inertia::render('Admin/AuditLogs/Show', [
            'auditLog' => $auditLog,
        ]);
    }

    /**
     * Export audit logs
     */
    public function export(Request $request)
    {
        $query = AuditLog::with('user')
            ->orderBy('created_at', 'desc');

        // Apply same filters as index
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $auditLogs = $query->limit(10000)->get(); // Limit for performance

        $filename = 'audit_logs_' . now()->format('Y-m-d_H-i-s') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function () use ($auditLogs) {
            $file = fopen('php://output', 'w');

            // CSV headers
            fputcsv($file, [
                'ID',
                'Date/Time',
                'User',
                'Email',
                'Role',
                'Action',
                'Category',
                'Severity',
                'Model Type',
                'Model Name',
                'Description',
                'IP Address',
                'User Agent',
                'URL',
                'Method',
            ]);

            // CSV data
            foreach ($auditLogs as $log) {
                fputcsv($file, [
                    $log->id,
                    $log->created_at->format('Y-m-d H:i:s'),
                    $log->user_name ?? 'System',
                    $log->user_email ?? '',
                    $log->user_role ?? '',
                    $log->action,
                    $log->category,
                    $log->severity,
                    $log->model_type ? class_basename($log->model_type) : '',
                    $log->model_name ?? '',
                    $log->description,
                    $log->ip_address ?? '',
                    $log->user_agent ?? '',
                    $log->url ?? '',
                    $log->method ?? '',
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
