<?php

namespace App\Http\Controllers;

use App\Models\Debt;
use Illuminate\Http\Request;

class DebtController extends Controller
{
    public function markAsPaid(Debt $debt)
    {
        $debt->update(['status' => 'paid']);
        return redirect()->back();
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
            'reason' => 'required|string|max:255',
            'due_date' => 'required|date|after_or_equal:today',
        ]);

        Debt::create([
            'member_id' => $request->member_id,
            'amount' => $request->amount,
            'reason' => $request->reason,
            'due_date' => $request->due_date,
            'status' => 'unpaid',
        ]);

        return redirect()->back()->with('success', 'Debt added successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
