<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use Illuminate\Http\Request;

class LoanController extends Controller
{
    /**
     * Mark loan as repaid
     */
    public function markAsRepaid(Loan $loan)
    {
        $loan->update(['status' => 'repaid']);
        return redirect()->back()->with('success', 'Loan marked as repaid successfully.');
    }

    /**
     * Disburse a loan
     */
    public function disburse(Loan $loan)
    {
        try {
            // Check if loan is in pending status
            if ($loan->status !== 'pending') {
                return redirect()->back()->with('error', 'Only pending loans can be disbursed.');
            }

            // The observer will handle cash validation and journal entry creation
            $loan->update(['status' => 'disbursed']);
            
            return redirect()->back()->with('success', 'Loan disbursed successfully.');
        } catch (\Exception $e) {
            // Handle cash validation errors
            if (str_contains($e->getMessage(), 'Insufficient cash balance')) {
                return redirect()->back()->with('error', $e->getMessage());
            }
            
            // Handle other errors
            return redirect()->back()->with('error', 'Failed to disburse loan: ' . $e->getMessage());
        }
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $loans = Loan::with('member')->latest()->paginate(15);
        return inertia('AdminPortal/Loans/Index', [
            'loans' => $loans
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'member_id' => 'required|exists:members,id',
            'amount' => 'required|numeric|min:0',
            'purpose' => 'required|string|max:255',
            'interest_rate' => 'required|numeric|min:0|max:100',
            'term_months' => 'required|integer|min:1|max:60',
            'due_date' => 'required|date|after_or_equal:today',
        ]);

        $loan = Loan::create([
            'member_id' => $request->member_id,
            'amount' => $request->amount,
            'purpose' => $request->purpose,
            'interest_rate' => $request->interest_rate,
            'term_months' => $request->term_months,
            'due_date' => $request->due_date,
            'status' => 'pending',
        ]);

        // Calculate interest and total amount
        $loan->updateCalculatedFields();

        // Support both JSON and redirect responses
        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Loan created successfully.',
                'loan' => $loan->load('member')
            ]);
        }

        return redirect()->back()->with('success', 'Loan created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Loan $loan)
    {
        return inertia('AdminPortal/Loans/Show', [
            'loan' => $loan->load(['member', 'disbursementJournalEntry', 'repaymentJournalEntry'])
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Loan $loan)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Loan $loan)
    {
        $request->validate([
            'amount' => 'sometimes|required|numeric|min:0',
            'purpose' => 'sometimes|required|string|max:255',
            'interest_rate' => 'sometimes|required|numeric|min:0|max:100',
            'term_months' => 'sometimes|required|integer|min:1|max:60',
            'due_date' => 'sometimes|required|date|after_or_equal:today',
            'status' => 'sometimes|required|in:pending,disbursed,repaid,defaulted',
        ]);

        $loan->update($request->only([
            'amount', 'purpose', 'interest_rate', 'term_months', 'due_date', 'status'
        ]));

        // Recalculate if amount, rate, or term changed
        if ($request->hasAny(['amount', 'interest_rate', 'term_months'])) {
            $loan->updateCalculatedFields();
        }

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Loan updated successfully.',
                'loan' => $loan->load('member')
            ]);
        }

        return redirect()->back()->with('success', 'Loan updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Loan $loan)
    {
        // Only allow deletion of pending loans
        if ($loan->status !== 'pending') {
            return redirect()->back()->with('error', 'Only pending loans can be deleted.');
        }

        $loan->delete();

        if (request()->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Loan deleted successfully.'
            ]);
        }

        return redirect()->back()->with('success', 'Loan deleted successfully.');
    }
}