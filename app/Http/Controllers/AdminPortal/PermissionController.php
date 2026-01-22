<?php

namespace App\Http\Controllers\AdminPortal;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use App\Services\PaginationConfigService;

class PermissionController extends Controller
{
    protected $paginationService;

    public function __construct(PaginationConfigService $paginationService)
    {
        $this->paginationService = $paginationService;
    }
    public function index(Request $request)
    {
        $query = Permission::withCount('roles')
            ->orderBy('name');

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $permissions = $query->paginate($this->paginationService->getItemsPerPage());

        return Inertia::render('AdminPortal/Permissions/Index', [
            'permissions' => $permissions,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:191', 'unique:permissions,name', 'regex:/^[a-z_]+$/'],
            'description' => ['nullable', 'string', 'max:191'],
        ], [
            'name.regex' => 'Permission name must be lowercase with underscores only (e.g., manage_users)',
        ]);

        Permission::create($validated);

        return redirect()->back()->with('success', 'Permission created successfully');
    }

    public function update(Request $request, Permission $permission)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:191', Rule::unique('permissions')->ignore($permission->id), 'regex:/^[a-z_]+$/'],
            'description' => ['nullable', 'string', 'max:191'],
        ], [
            'name.regex' => 'Permission name must be lowercase with underscores only (e.g., manage_users)',
        ]);

        $permission->update($validated);

        return redirect()->back()->with('success', 'Permission updated successfully');
    }

    public function destroy(Permission $permission)
    {
        // Check if permission is assigned to any roles
        if ($permission->roles()->count() > 0) {
            return redirect()->back()->withErrors(['message' => 'Cannot delete permission assigned to roles']);
        }

        $permission->delete();

        return redirect()->back()->with('success', 'Permission deleted successfully');
    }
}
