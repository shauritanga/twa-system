<?php

namespace App\Http\Controllers\AdminPortal;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use App\Services\PaginationConfigService;

class RoleController extends Controller
{
    protected $paginationService;

    public function __construct(PaginationConfigService $paginationService)
    {
        $this->paginationService = $paginationService;
    }
    public function index(Request $request)
    {
        $query = Role::withCount(['users', 'permissions'])
            ->orderBy('name');

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $roles = $query->paginate($this->paginationService->getItemsPerPage());

        $allPermissions = Permission::orderBy('name')->get();

        return Inertia::render('AdminPortal/Roles/Index', [
            'roles' => $roles,
            'allPermissions' => $allPermissions,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:191', 'unique:roles,name', 'regex:/^[a-z_]+$/'],
            'description' => ['nullable', 'string', 'max:191'],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['exists:permissions,id'],
        ], [
            'name.regex' => 'Role name must be lowercase with underscores only (e.g., custom_role)',
        ]);

        $role = Role::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
        ]);

        if (!empty($validated['permissions'])) {
            $role->permissions()->sync($validated['permissions']);
        }

        return redirect()->back()->with('success', 'Role created successfully');
    }

    public function update(Request $request, Role $role)
    {
        // Prevent editing system roles
        if (in_array($role->name, ['admin', 'secretary', 'member'])) {
            return redirect()->back()->withErrors(['message' => 'Cannot edit system roles']);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:191', Rule::unique('roles')->ignore($role->id), 'regex:/^[a-z_]+$/'],
            'description' => ['nullable', 'string', 'max:191'],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['exists:permissions,id'],
        ], [
            'name.regex' => 'Role name must be lowercase with underscores only (e.g., custom_role)',
        ]);

        $role->update([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
        ]);

        if (isset($validated['permissions'])) {
            $role->permissions()->sync($validated['permissions']);
        }

        return redirect()->back()->with('success', 'Role updated successfully');
    }

    public function destroy(Role $role)
    {
        // Prevent deleting system roles
        if (in_array($role->name, ['admin', 'secretary', 'member'])) {
            return redirect()->back()->withErrors(['message' => 'Cannot delete system roles']);
        }

        // Check if role has users
        if ($role->users()->count() > 0) {
            return redirect()->back()->withErrors(['message' => 'Cannot delete role with assigned users']);
        }

        $role->permissions()->detach();
        $role->delete();

        return redirect()->back()->with('success', 'Role deleted successfully');
    }

    public function show(Role $role)
    {
        $role->load(['permissions', 'users']);

        return Inertia::render('AdminPortal/Roles/Show', [
            'role' => $role,
        ]);
    }

    public function getPermissions(Role $role)
    {
        $role->load('permissions');
        
        return response()->json([
            'role' => $role,
            'permissions' => $role->permissions->pluck('id')->toArray(),
        ]);
    }

    public function syncPermissions(Request $request, Role $role)
    {
        $validated = $request->validate([
            'permissions' => ['required', 'array'],
            'permissions.*' => ['exists:permissions,id'],
        ]);

        $role->permissions()->sync($validated['permissions']);

        return redirect()->back()->with('success', 'Permissions updated successfully');
    }
}
