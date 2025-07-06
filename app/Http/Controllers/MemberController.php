<?php

namespace App\Http\Controllers;

use App\Exports\MembersExport;
use App\Models\Member;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;

class MemberController extends Controller
{
    public function index()
    {
        return Inertia::render('Members/Index', [
            'members' => Member::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:members',
            'phone_number' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'date_of_birth' => 'required|date',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Generate a default password
        $defaultPassword = \Illuminate\Support\Str::random(8);
        // Create a User record
        $user = \App\Models\User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => \Illuminate\Support\Facades\Hash::make($defaultPassword),
            'role' => 'member',
        ]);

        // Create a Member record linked to the User
        $memberData = $request->all();
        $memberData['user_id'] = $user->id;
        
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('members', 'public');
            $memberData['image_path'] = $imagePath;
        }
        
        $member = Member::create($memberData);

        // Send email with default password
        \Illuminate\Support\Facades\Mail::to($user->email)->send(new \App\Mail\WelcomeMail($user, $defaultPassword));

        return redirect()->back()->with([
            'message' => 'Member created successfully and welcome email sent.',
            'member' => $member
        ]);
    }

    public function update(Request $request, Member $member)
    {
        // Debug incoming request data including multipart form data, raw content, and headers
        \Log::info('Update Member Request Input Data:', $request->input());
        \Log::info('Update Member Request File Data:', $request->files->all());
        \Log::info('Update Member Request Raw Content:', ['raw' => $request->getContent()]);
        \Log::info('Update Member Request Headers:', $request->headers->all());
        
        // Use request input data directly since it's being parsed correctly
        $memberData = $request->input();
        
        // Validate the data
        $validator = \Validator::make($memberData, [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:members,email,'.$member->id,
            'phone_number' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'date_of_birth' => 'nullable|date',
        ]);
        
        if ($validator->fails()) {
            \Log::error('Validation failed for member update', $validator->errors()->toArray());
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }
        
        $imagePath = $member->image_path;
        if ($request->hasFile('image')) {
            // Handle file upload if available
            $imagePath = $request->file('image')->store('members', 'public');
            $memberData['image_path'] = $imagePath;
        }
        
        $member->update($memberData);

        return redirect()->back()->with([
            'message' => 'Member updated successfully.',
            'member' => $member
        ]);
    }

    public function show(Member $member)
    {
        return Inertia::render('Members/Show', [
            'member' => $member->load('dependents'),
        ]);
    }

    public function destroy(Member $member)
    {
        $member->delete();

        return response()->json([
            'message' => 'Member deleted successfully.'
        ], 200);
    }

    public function export(Request $request)
    {
        $format = $request->query('format', 'xlsx');
        $members = Member::all();

        if ($format === 'pdf') {
            $pdf = PDF::loadView('exports.members', compact('members'));
            return $pdf->download('members.pdf');
        }

        if ($format === 'csv') {
            return Excel::download(new MembersExport, 'members.csv', \Maatwebsite\Excel\Excel::CSV);
        }

        return Excel::download(new MembersExport, 'members.xlsx');
    }
}
