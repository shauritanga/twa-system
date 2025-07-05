<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Dependent;
use App\Models\Member;

class DependentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    public function memberIndex()
    {
        $member = auth()->user()->member;
        if (is_null($member)) {
            return redirect()->back()->with('error', 'You do not have a member profile associated with your account.');
        }
        $dependents = $member->dependents()->get();

        return inertia('Member/Dependents', [
            'dependents' => $dependents,
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
            'name' => 'required|string',
            'relationship' => 'nullable|string',
            'date_of_birth' => 'nullable|date',
            'tribe' => 'nullable|string',
            'residence' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'member_id' => 'nullable|exists:members,id',
        ]);
        
        $member = auth()->user()->member;
        if (is_null($member) && !$request->has('member_id')) {
            return redirect()->back()->with('error', 'You do not have a member profile associated with your account.');
        }
        
        $memberId = $request->has('member_id') ? $request->input('member_id') : $member->id;
        $status = auth()->user()->role === 'admin' ? 'approved' : 'pending';
        
        // Check for potential duplicate dependent
        $existingDependent = Dependent::where('member_id', $memberId)
            ->where('name', $request->name)
            ->where('date_of_birth', $request->date_of_birth)
            ->first();
            
        if ($existingDependent) {
            return redirect()->back()->withErrors(['name' => 'A dependent with these details already exists for this member. Please verify the information.']);
        }
        
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('dependents', 'public');
        }
        
        $dependent = Dependent::create([
            'member_id' => $memberId,
            'name' => $request->name,
            'relationship' => $request->relationship,
            'date_of_birth' => $request->date_of_birth,
            'tribe' => $request->tribe,
            'residence' => $request->residence,
            'image_path' => $imagePath,
            'status' => $status,
        ]);
        
        $memberToUpdate = Member::find($memberId);
        if ($status === 'pending') {
            $memberToUpdate->is_verified = false;
        } else {
            $allApproved = $memberToUpdate->dependents()->whereNull('deleted_at')->get()->every(function ($dep) {
                return $dep->status === 'approved';
            });
            $memberToUpdate->is_verified = $allApproved;
        }
        $memberToUpdate->save();
        
        return redirect()->back()->with('success', $status === 'approved' ? 'Dependent added and approved successfully.' : 'Dependent added and pending approval.');
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
        $dependent = Dependent::findOrFail($id);
        $status = $request->input('status');
        
        // Prevent changing status if already approved
        if ($dependent->status === 'approved') {
            return response()->json(['error' => 'Cannot change status of an approved dependent'], 403);
        }
        
        if (in_array($status, ['approved', 'rejected', 'pending'])) {
            $dependent->status = $status;
            if ($status === 'rejected') {
                $reason = $request->input('rejection_reason');
                if (empty($reason)) {
                    return response()->json(['error' => 'Rejection reason is required'], 400);
                }
                $dependent->rejection_reason = $reason;
                $dependent->delete(); // Soft delete the rejected dependent
                // Send email notification to member
                \Illuminate\Support\Facades\Mail::to($dependent->member->user->email)->send(new \App\Mail\DependentRejectionMail($dependent, $dependent->member));
            }
            $dependent->save();
            
            // Update member verification status based on all dependents
            $member = $dependent->member;
            $allApproved = $member->dependents()->whereNull('deleted_at')->get()->every(function ($dep) {
                return $dep->status === 'approved';
            });
            $member->is_verified = $allApproved;
            $member->save();
            
            return response()->json(['message' => 'Dependent status updated successfully']);
        }
        
        return response()->json(['error' => 'Invalid status'], 400);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function approve($id)
    {
        $dependent = Dependent::findOrFail($id);
        // Prevent approving if already approved
        if ($dependent->status === 'approved') {
            return redirect()->back()->with('error', 'Dependent is already approved.');
        }
        $dependent->status = 'approved';
        $dependent->save();
        // Mark member as verified only if all active dependents are approved
        $member = $dependent->member;
        $allApproved = $member->dependents()->whereNull('deleted_at')->get()->every(function ($dep) {
            return $dep->status === 'approved';
        });
        $member->is_verified = $allApproved;
        $member->save();
        return redirect()->back()->with('success', 'Dependent approved.');
    }

    public function reject(Request $request, $id)
    {
        $dependent = Dependent::findOrFail($id);
        // Prevent rejecting if already approved
        if ($dependent->status === 'approved') {
            return redirect()->back()->with('error', 'Cannot reject an already approved dependent.');
        }
        $reason = $request->input('rejection_reason');
        if (empty($reason)) {
            return redirect()->back()->with('error', 'Rejection reason is required.');
        }
        $dependent->status = 'rejected';
        $dependent->rejection_reason = $reason;
        $dependent->delete(); // Soft delete the rejected dependent
        $dependent->save();
        // Set member as unverified if any dependent is rejected
        $dependent->member->is_verified = false;
        $dependent->member->save();
        // Send email notification to member
        \Illuminate\Support\Facades\Mail::to($dependent->member->user->email)->send(new \App\Mail\DependentRejectionMail($dependent, $dependent->member));
        return redirect()->back()->with('success', 'Dependent rejected and removed from list.');
    }
}
