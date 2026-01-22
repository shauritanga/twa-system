<?php

namespace App\Http\Controllers\AdminPortal;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ExpenseController extends Controller
{
    public function index(Request $request)
    {
        $query = Expense::with(['creator', 'approver']);

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('vendor', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by category
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date range
        if ($request->filled('start_date')) {
            $query->whereDate('expense_date', '>=', $request->start_date);
        }
        if ($request->filled('end_date')) {
            $query->whereDate('expense_date', '<=', $request->end_date);
        }

        $expenses = $query->orderBy('expense_date', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('AdminPortal/Expenses/Index', [
            'expenses' => $expenses,
            'filters' => $request->only(['search', 'category', 'status', 'start_date', 'end_date']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'amount' => 'required|numeric|min:0',
            'category' => 'required|string',
            'expense_date' => 'required|date',
            'payment_method' => 'nullable|string',
            'vendor' => 'nullable|string|max:255',
            'receipt' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'notes' => 'nullable|string',
        ]);

        $validated['created_by'] = auth()->id();

        if ($request->hasFile('receipt')) {
            $validated['receipt_path'] = $request->file('receipt')->store('receipts', 'public');
        }

        Expense::create($validated);

        return redirect()->back()->with('success', 'Expense created successfully.');
    }

    public function update(Request $request, Expense $expense)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'amount' => 'required|numeric|min:0',
            'category' => 'required|string',
            'expense_date' => 'required|date',
            'payment_method' => 'nullable|string',
            'vendor' => 'nullable|string|max:255',
            'receipt' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'notes' => 'nullable|string',
        ]);

        if ($request->hasFile('receipt')) {
            // Delete old receipt
            if ($expense->receipt_path) {
                Storage::disk('public')->delete($expense->receipt_path);
            }
            $validated['receipt_path'] = $request->file('receipt')->store('receipts', 'public');
        }

        $expense->update($validated);

        return redirect()->back()->with('success', 'Expense updated successfully.');
    }

    public function destroy(Expense $expense)
    {
        // Delete receipt file
        if ($expense->receipt_path) {
            Storage::disk('public')->delete($expense->receipt_path);
        }

        $expense->delete();

        return redirect()->back()->with('success', 'Expense deleted successfully.');
    }

    public function approve(Expense $expense)
    {
        $expense->update([
            'status' => 'approved',
            'approved_by' => auth()->id(),
            'approved_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Expense approved successfully.');
    }

    public function reject(Expense $expense)
    {
        $expense->update([
            'status' => 'rejected',
        ]);

        return redirect()->back()->with('success', 'Expense rejected successfully.');
    }

    public function markAsPaid(Expense $expense)
    {
        $expense->update([
            'status' => 'paid',
        ]);

        return redirect()->back()->with('success', 'Expense marked as paid successfully.');
    }
}
