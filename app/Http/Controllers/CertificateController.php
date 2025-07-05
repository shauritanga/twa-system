<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Certificate;
use App\Models\Member;

class CertificateController extends Controller
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
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'type' => 'nullable|string',
            'dependent_id' => 'nullable|exists:dependents,id',
        ]);
        $member = auth()->user()->member;
        $path = $request->file('file')->store('certificates');
        $certificate = Certificate::create([
            'member_id' => $member->id,
            'dependent_id' => $request->dependent_id,
            'file_path' => $path,
            'type' => $request->type,
            'status' => 'pending',
        ]);
        return redirect()->back()->with('success', 'Certificate uploaded and pending approval.');
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

    public function approve($id)
    {
        $certificate = Certificate::findOrFail($id);
        $certificate->status = 'approved';
        $certificate->save();
        // Optionally, mark member as verified if all dependents/certificates are approved
        $certificate->member->is_verified = true;
        $certificate->member->save();
        return redirect()->back()->with('success', 'Certificate approved.');
    }

    public function reject($id)
    {
        $certificate = Certificate::findOrFail($id);
        $certificate->status = 'rejected';
        $certificate->save();
        return redirect()->back()->with('success', 'Certificate rejected.');
    }
}
