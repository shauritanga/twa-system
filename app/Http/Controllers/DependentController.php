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
        // Debug: Log that the request reached the controller
        \Log::info('DependentController@store called', []);
        \Log::info('Request data:', ['data' => $request->all()]);
        \Log::info('Request files:', ['files' => $request->allFiles()]);
        \Log::info('Request headers:', ['headers' => $request->headers->all()]);
        $user = auth()->user();
        $roleName = 'No role';
        if ($user) {
            if (isset($user->role_id)) {
                $role = \App\Models\Role::find($user->role_id);
                $roleName = $role ? $role->name : 'Role not found';
            } else if ($user->role) {
                $roleName = $user->role->name ?? 'Role name not available';
            }
        }
        \Log::info('User role:', ['role' => $roleName, 'user_id' => $user ? $user->id : 'Not authenticated']);

        $request->validate([
            'name' => 'required|string',
            'relationship' => 'nullable|string',
            'date_of_birth' => 'nullable|date',
            'tribe' => 'nullable|string',
            'residence' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'member_id' => 'nullable|exists:members,id',
        ]);
        
        // Log raw input and all request data to debug if member_id is received
        \Log::info('Raw request input:', ['input' => $request->input()]);
        \Log::info('All request data:', ['all' => $request->all()]);
        \Log::info('Request content type:', ['content_type' => $request->header('Content-Type')]);
        
        // Check for member_id in the request first, trying multiple methods to ensure it's captured
        $memberId = null;
        if ($request->has('member_id')) {
            $memberId = $request->input('member_id');
            \Log::info('Using member_id from request input:', ['member_id' => $memberId]);
        } elseif (isset($request->all()['member_id'])) {
            $memberId = $request->all()['member_id'];
            \Log::info('Using member_id from request all:', ['member_id' => $memberId]);
        } else {
            $user = auth()->user();
            if ($user->role && $user->role->name === 'admin') {
                // For admin users, try to extract member_id from the referer URL as a fallback
                $referer = $request->header('Referer');
                \Log::info('Admin user detected, checking referer for member_id:', ['referer' => $referer]);
                if ($referer && preg_match('/\/admin\/members\/(\d+)/', $referer, $matches)) {
                    $memberId = $matches[1];
                    \Log::info('Using member_id extracted from referer URL:', ['member_id' => $memberId]);
                } else {
                    \Log::info('No member_id found in request or referer for admin user', []);
                }
            } else {
                $member = $user->member;
                if ($member) {
                    $memberId = $member->id;
                    \Log::info('Using member_id from authenticated user:', ['member_id' => $memberId]);
                } else {
                    \Log::info('Returning 403: No member profile associated with account and no member_id provided', []);
                    if ($request->wantsJson() || $request->header('X-Inertia')) {
                        return response()->json([
                            'error' => 'You do not have a member profile associated with your account and no member ID was provided.'
                        ], 403);
                    }
                    return redirect()->back()->with('error', 'You do not have a member profile associated with your account and no member ID was provided.');
                }
            }
        }
        
        if (!$memberId) {
            \Log::info('Returning 403: No valid member ID provided or associated with account', []);
            if ($request->wantsJson() || $request->header('X-Inertia')) {
                return response()->json([
                    'error' => 'No valid member ID provided or associated with your account.'
                ], 403);
            }
            return redirect()->back()->with('error', 'No valid member ID provided or associated with your account.');
        }
        $status = 'pending';
        $user = auth()->user();
        if ($user) {
            if (isset($user->role_id)) {
                $role = \App\Models\Role::find($user->role_id);
                if ($role && $role->name === 'admin') {
                    $status = 'approved';
                }
            } else if ($user->role && $user->role->name === 'admin') {
                $status = 'approved';
            }
        }
        \Log::info('Dependent status set:', ['status' => $status, 'user_role' => $roleName]);
        
        // Check for potential duplicate dependent
        $existingDependent = Dependent::where('member_id', $memberId)
            ->where('name', $request->name)
            ->where('date_of_birth', $request->date_of_birth)
            ->first();
            
        if ($existingDependent) {
            \Log::info('Returning 422: Duplicate dependent found', []);
            if ($request->wantsJson() || $request->header('X-Inertia')) {
                return response()->json([
                    'errors' => ['name' => 'A dependent with these details already exists for this member. Please verify the information.']
                ], 422);
            }
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

        \Log::info('Dependent created successfully:', $dependent->toArray());
        
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
        
        if ($request->wantsJson() || $request->header('X-Inertia')) {
            return redirect()->back()->with('toast', [
                'type' => 'success',
                'message' => $status === 'approved' ? 'Dependent added and approved by default successfully.' : 'Dependent added and pending approval.',
            ]);
        }
        
        return redirect()->back()->with('success', $status === 'approved' ? 'Dependent added and approved by default successfully.' : 'Dependent added and pending approval.');
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
            return redirect()->back()->with('toast', [
                'type' => 'error',
                'message' => 'Cannot change status of an approved dependent.',
            ]);
        }
        
        if (in_array($status, ['approved', 'rejected', 'pending'])) {
            $dependent->status = $status;
            if ($status === 'rejected') {
                $reason = $request->input('rejection_reason');
                if (empty($reason)) {
                    return redirect()->back()->with('toast', [
                    'type' => 'error',
                    'message' => 'Rejection reason is required.',
                ]);
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
            
            return redirect()->back()->with('toast', [
                'type' => 'success',
                'message' => 'Dependent status updated successfully.',
            ]);
        }
        
        return redirect()->back()->with('toast', [
            'type' => 'error',
            'message' => 'Invalid status.',
        ]);
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
            return redirect()->back()->with('toast', [
            'type' => 'error',
            'message' => 'Dependent is already approved.',
        ]);
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
        return redirect()->back()->with('toast', [
            'type' => 'success',
            'message' => 'Dependent approved.',
        ]);
    }

    public function reject(Request $request, $id)
    {
        $dependent = Dependent::findOrFail($id);
        // Prevent rejecting if already approved
        if ($dependent->status === 'approved') {
            return redirect()->back()->with('toast', [
            'type' => 'error',
            'message' => 'Cannot reject an already approved dependent.',
        ]);
        }
        $reason = $request->input('rejection_reason');
        if (empty($reason)) {
            return redirect()->back()->with('toast', [
            'type' => 'error',
            'message' => 'Rejection reason is required.',
        ]);
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
        return redirect()->back()->with('toast', [
            'type' => 'success',
            'message' => 'Dependent rejected and removed from list.',
        ]);
    }
}
