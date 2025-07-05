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
        
        Member::create($memberData);

        // Send email with default password
        \Illuminate\Support\Facades\Mail::to($user->email)->send(new \App\Mail\WelcomeMail($user, $defaultPassword));

        return redirect()->route('members.index')->with('success', 'Member created successfully and welcome email sent.');
    }

    public function update(Request $request, Member $member)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:members,email,'.$member->id,
            'phone_number' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'date_of_birth' => 'required|date',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $memberData = $request->all();
        
        $imagePath = $member->image_path;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('members', 'public');
            $memberData['image_path'] = $imagePath;
        }
        
        $member->update($memberData);

        return redirect()->route('members.index');
    }

    public function show(Member $member)
    {
        return Inertia::render('Members/Show', [
            'member' => $member->load('dependents', 'certificates'),
        ]);
    }

    public function destroy(Member $member)
    {
        $member->delete();

        return redirect()->route('members.index');
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
