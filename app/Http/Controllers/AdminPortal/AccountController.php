<?php

namespace App\Http\Controllers\AdminPortal;

use App\Http\Controllers\Controller;
use App\Models\Account;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountController extends Controller
{
    public function index(Request $request)
    {
        $query = Account::with(['parentAccount', 'creator']);

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('account_name', 'like', "%{$search}%")
                    ->orWhere('account_code', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by type
        if ($request->filled('type')) {
            $query->where('account_type', $request->type);
        }

        // Filter by subtype
        if ($request->filled('subtype')) {
            $query->where('account_subtype', $request->subtype);
        }

        // Filter by status
        if ($request->filled('status')) {
            if ($request->status === 'active') {
                $query->where('is_active', true);
            } else {
                $query->where('is_active', false);
            }
        }

        $accounts = $query->orderBy('account_code')
            ->paginate(15)
            ->withQueryString();

        // Get parent accounts for dropdown
        $parentAccounts = Account::active()
            ->whereNull('parent_account_id')
            ->orderBy('account_code')
            ->get(['id', 'account_code', 'account_name']);

        return Inertia::render('AdminPortal/ChartOfAccounts', [
            'accounts' => $accounts,
            'parentAccounts' => $parentAccounts,
            'filters' => $request->only(['search', 'type', 'subtype', 'status']),
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'account_code' => 'required|string|unique:accounts,account_code|max:20',
                'account_name' => 'required|string|max:255',
                'account_type' => 'required|in:asset,liability,equity,revenue,expense',
                'account_subtype' => 'nullable|string|max:100',
                'parent_account_id' => 'nullable|exists:accounts,id',
                'description' => 'nullable|string',
                'opening_balance' => 'nullable|numeric',
                'normal_balance' => 'required|in:debit,credit',
                'is_active' => 'boolean',
            ]);

            $validated['created_by'] = auth()->id();
            $validated['current_balance'] = $validated['opening_balance'] ?? 0;

            Account::create($validated);

            return redirect()->back()->with('success', 'Account created successfully.');
        } catch (\Exception $e) {
            \Log::error('Account creation failed: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to create account: ' . $e->getMessage());
        }
    }

    public function update(Request $request, Account $account)
    {
        // Prevent editing system accounts
        if ($account->is_system_account) {
            return redirect()->back()->with('error', 'System accounts cannot be modified.');
        }

        $validated = $request->validate([
            'account_code' => 'required|string|max:20|unique:accounts,account_code,' . $account->id,
            'account_name' => 'required|string|max:255',
            'account_type' => 'required|in:asset,liability,equity,revenue,expense',
            'account_subtype' => 'nullable|string|max:100',
            'parent_account_id' => 'nullable|exists:accounts,id',
            'description' => 'nullable|string',
            'opening_balance' => 'nullable|numeric',
            'normal_balance' => 'required|in:debit,credit',
            'is_active' => 'boolean',
        ]);

        $account->update($validated);

        return redirect()->back()->with('success', 'Account updated successfully.');
    }

    public function destroy(Account $account)
    {
        // Prevent deleting system accounts
        if ($account->is_system_account) {
            return redirect()->back()->with('error', 'System accounts cannot be deleted.');
        }

        // Check if account has child accounts
        if ($account->childAccounts()->count() > 0) {
            return redirect()->back()->with('error', 'Cannot delete account with sub-accounts.');
        }

        // Check if account has transactions (you'll implement this later)
        // if ($account->transactions()->count() > 0) {
        //     return redirect()->back()->with('error', 'Cannot delete account with transactions.');
        // }

        $account->delete();

        return redirect()->back()->with('success', 'Account deleted successfully.');
    }

    public function toggleStatus(Account $account)
    {
        if ($account->is_system_account) {
            return redirect()->back()->with('error', 'System accounts cannot be deactivated.');
        }

        $account->update(['is_active' => !$account->is_active]);

        $status = $account->is_active ? 'activated' : 'deactivated';
        return redirect()->back()->with('success', "Account {$status} successfully.");
    }
}
