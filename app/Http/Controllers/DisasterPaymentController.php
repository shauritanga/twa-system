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

        // Create the disaster payment first
        $payment = DisasterPayment::create([
            'member_id' => $request->member_id,
            'amount' => $request->amount,
            'date' => $request->date,
            'purpose' => $request->purpose,
            'admin_id' => auth()->id(),
        ]);

        // Get recipient and all users for email notifications
        $recipient = Member::find($request->member_id);
        $users = User::whereNotNull('email')->get();

        $emailResults = [
            'total' => $users->count(),
            'sent' => 0,
            'failed' => 0,
            'errors' => []
        ];

        // Send email notifications to all members with progress tracking
        foreach ($users as $user) {
            try {
                Mail::raw(
                    "A disaster payment of " . number_format($payment->amount, 0, '.', ',') . "/= TZS has been made to {$recipient->name} for {$payment->purpose} on " . date('F j, Y', strtotime($payment->date)) . ".",
                    function ($message) use ($user) {
                        $message->to($user->email)
                            ->subject('Disaster Payment Notification - ' . config('app.name'));
                    }
                );
                $emailResults['sent']++;
            } catch (\Exception $e) {
                $emailResults['failed']++;
                $emailResults['errors'][] = "Failed to send to {$user->email}: " . $e->getMessage();
                \Log::error("Failed to send disaster payment notification to {$user->email}: " . $e->getMessage());
            }
        }

        // Log the activity
        \Log::info("Disaster payment created", [
            'payment_id' => $payment->id,
            'amount' => $payment->amount,
            'recipient' => $recipient->name,
            'admin' => auth()->user()->name,
            'emails_sent' => $emailResults['sent'],
            'emails_total' => $emailResults['total'],
            'emails_failed' => $emailResults['failed']
        ]);

        // Return JSON response with email results for AJAX handling
        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Disaster payment recorded successfully.',
                'payment' => $payment->load('member', 'admin'),
                'email_results' => $emailResults
            ]);
        }

        // For non-AJAX requests, return with success message
        $message = "Disaster payment recorded successfully. Notifications sent to {$emailResults['sent']} members";
        if ($emailResults['failed'] > 0) {
            $message .= " ({$emailResults['failed']} failed)";
        }

        return redirect()->back()->with('success', $message);
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
