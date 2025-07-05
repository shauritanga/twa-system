<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DisasterPayment;
use App\Models\Member;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

class DisasterPaymentController extends Controller
{
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
            'date' => 'required|date',
            'purpose' => 'nullable|string',
        ]);
        $payment = DisasterPayment::create([
            'member_id' => $request->member_id,
            'amount' => $request->amount,
            'date' => $request->date,
            'purpose' => $request->purpose,
            'admin_id' => auth()->id(),
        ]);
        // Send email notification to all members
        $recipient = Member::find($request->member_id);
        $users = User::all();
        foreach ($users as $user) {
            Mail::raw(
                "A payment of " . number_format($payment->amount, 0, '.', ',') . "/= shillings has been made to {$recipient->name} for {$payment->purpose}.",
                function ($message) use ($user) {
                    $message->to($user->email)
                        ->subject('Disaster Payment Notification');
                }
            );
        }
        return redirect()->back()->with('success', 'Disaster payment recorded and notifications sent.');
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
