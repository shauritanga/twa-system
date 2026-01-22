<?php

namespace App\Http\Controllers\AdminPortal;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\PaginationConfigService;

class AuditLogController extends Controller
{
    protected $paginationService;

    public function __construct(PaginationConfigService $paginationService)
    {
        $this->paginationService = $paginationService;
    }
    public function index(Request $request)
    {
        $query = AuditLog::with('user')
            ->orderBy('created_at', 'desc');

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                    ->orWhere('user_name', 'like', "%{$search}%")
                    ->orWhere('user_email', 'like', "%{$search}%")
                    ->orWhere('model_name', 'like', "%{$search}%")
                    ->orWhere('action', 'like', "%{$search}%");
            });
        }

        // User filter
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Action filter
        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }

        // Category filter
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        // Severity filter
        if ($request->filled('severity')) {
            $query->where('severity', $request->severity);
        }

        // Model type filter
        if ($request->filled('model_type')) {
            $query->where('model_type', $request->model_type);
        }

        // Date range filter
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $logs = $query->paginate($this->paginationService->getItemsPerPage());

        // Get unique values for filters
        $users = User::select('id', 'name', 'email')
            ->orderBy('name')
            ->get();

        $actions = AuditLog::select('action')
            ->distinct()
            ->orderBy('action')
            ->pluck('action');

        $categories = AuditLog::select('category')
            ->distinct()
            ->whereNotNull('category')
            ->orderBy('category')
            ->pluck('category');

        $modelTypes = AuditLog::select('model_type')
            ->distinct()
            ->whereNotNull('model_type')
            ->orderBy('model_type')
            ->pluck('model_type')
            ->map(function ($type) {
                return [
                    'value' => $type,
                    'label' => class_basename($type),
                ];
            });

        return Inertia::render('AdminPortal/AuditLogs', [
            'logs' => $logs,
            'users' => $users,
            'actions' => $actions,
            'categories' => $categories,
            'modelTypes' => $modelTypes,
            'filters' => $request->only(['search', 'user_id', 'action', 'category', 'severity', 'model_type', 'date_from', 'date_to']),
        ]);
    }

    public function show(AuditLog $auditLog)
    {
        $auditLog->load('user');

        return Inertia::render('AdminPortal/AuditLogs/Show', [
            'log' => $auditLog,
        ]);
    }
}
