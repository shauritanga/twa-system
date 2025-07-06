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
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'surname' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:members|unique:users',
            'phone_number' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'place_of_birth' => 'required|string|max:255',
            'sex' => 'required|in:Male,Female',
            'date_of_birth' => 'required|date',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'application_form' => 'nullable|file|mimes:pdf,doc,docx,jpeg,png,jpg|max:10240', // 10MB max
        ]);

        // Construct full name from individual parts
        $fullName = trim(implode(' ', array_filter([
            $request->first_name,
            $request->middle_name,
            $request->surname
        ])));

        // Generate a default password
        $defaultPassword = \Illuminate\Support\Str::random(8);

        try {
            // Create a User record
            $user = \App\Models\User::create([
                'name' => $fullName,
                'email' => $request->email,
                'password' => \Illuminate\Support\Facades\Hash::make($defaultPassword),
                'role' => 'member',
            ]);
        } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
            // Handle unique constraint violation for users table
            return back()->withErrors([
                'email' => 'A user with this email address already exists.'
            ])->withInput();
        }

        // Create a Member record linked to the User
        $memberData = $request->all();
        $memberData['user_id'] = $user->id;
        $memberData['name'] = $fullName; // Set the constructed full name

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('members', 'public');
            $memberData['image_path'] = $imagePath;
        }

        // Handle application form upload
        if ($request->hasFile('application_form')) {
            $applicationFormPath = $request->file('application_form')->store('application_forms', 'public');
            $memberData['application_form_path'] = $applicationFormPath;
        }

        try {
            $member = Member::create($memberData);
        } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
            // If member creation fails, delete the user we just created
            $user->delete();
            return back()->withErrors([
                'email' => 'A member with this email address already exists.'
            ])->withInput();
        }

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
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'surname' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:members,email,'.$member->id,
                'unique:users,email,'.($member->user_id ?? 'NULL')
            ],
            'phone_number' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'place_of_birth' => 'required|string|max:255',
            'sex' => 'required|in:Male,Female',
            'date_of_birth' => 'nullable|date',
        ]);
        
        if ($validator->fails()) {
            \Log::error('Validation failed for member update', $validator->errors()->toArray());
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }

        // Construct full name from individual parts
        $fullName = trim(implode(' ', array_filter([
            $memberData['first_name'] ?? '',
            $memberData['middle_name'] ?? '',
            $memberData['surname'] ?? ''
        ])));
        $memberData['name'] = $fullName;

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('members', 'public');
            $memberData['image_path'] = $imagePath;
        }

        // Handle application form upload
        if ($request->hasFile('application_form')) {
            $applicationFormPath = $request->file('application_form')->store('application_forms', 'public');
            $memberData['application_form_path'] = $applicationFormPath;
        }

        try {
            // Update the member record
            $member->update($memberData);

            // Update the associated user record if it exists
            if ($member->user_id) {
                $user = \App\Models\User::find($member->user_id);
                if ($user) {
                    $user->update([
                        'name' => $fullName,
                        'email' => $memberData['email'],
                    ]);
                }
            }
        } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
            return back()->withErrors([
                'email' => 'A user with this email address already exists.'
            ])->withInput();
        }

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

        return redirect()->route('admin.members.index');
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
