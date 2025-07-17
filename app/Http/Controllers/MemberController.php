<?php

namespace App\Http\Controllers;

use App\Exports\MembersExport;
use App\Models\Member;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

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
            // Get member role ID
            $memberRole = \App\Models\Role::where('name', 'member')->first();
            if (!$memberRole) {
                return back()->withErrors([
                    'role' => 'Member role not found in database. Please contact administrator.'
                ])->withInput();
            }

            // Create a User record
            $user = \App\Models\User::create([
                'name' => $fullName,
                'email' => $request->email,
                'password' => \Illuminate\Support\Facades\Hash::make($defaultPassword),
                'role_id' => $memberRole->id,
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

    public function downloadApplicationForm(Member $member)
    {
        if (!$member->application_form_path) {
            abort(404, 'Application form not found');
        }

        $filePath = storage_path('app/public/' . $member->application_form_path);

        if (!file_exists($filePath)) {
            abort(404, 'Application form file not found');
        }

        $extension = pathinfo($filePath, PATHINFO_EXTENSION);
        $fileName = preg_replace('/[^A-Za-z0-9_\-]/', '_', $member->name) . '_application_form.' . $extension;

        // Get MIME type
        $mimeType = mime_content_type($filePath);

        // Log the download for audit purposes
        Log::info('Application form downloaded', [
            'member_id' => $member->id,
            'member_name' => $member->name,
            'file_path' => $member->application_form_path,
            'downloaded_by' => auth()->user()->name ?? 'Unknown',
            'downloaded_at' => now()
        ]);

        return response()->download($filePath, $fileName, [
            'Content-Type' => $mimeType,
        ]);
    }

    public function destroy(Member $member)
    {
        try {
            // Delete the member record (the model's booted method will handle user deletion automatically)
            $member->delete();

            return redirect()->route('admin.members.index')->with('message', 'Member and associated user account deleted successfully.');

        } catch (\Exception $e) {
            \Log::error('Error deleting member: ' . $e->getMessage());
            return redirect()->route('admin.members.index')->with('error', 'An error occurred while deleting the member. Please try again.');
        }
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

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:csv,xlsx,xls',
        ]);

        try {
            $file = $request->file('file');
            $path = $file->getRealPath();

            Log::info('Starting member import', [
                'file_name' => $file->getClientOriginalName(),
                'file_size' => $file->getSize(),
                'file_extension' => $file->getClientOriginalExtension()
            ]);

            // Read the file based on its extension
            if ($file->getClientOriginalExtension() === 'csv') {
                $data = array_map('str_getcsv', file($path));
                $header = array_shift($data);
            } else {
                // For Excel files, use Laravel Excel to read as array
                $collection = Excel::toArray([], $file);
                $rows = $collection[0]; // Get first sheet
                $header = array_shift($rows);
                $data = $rows;
            }

            Log::info('File parsed successfully', [
                'header_count' => count($header),
                'data_rows' => count($data),
                'headers' => $header
            ]);

            $successCount = 0;
            $errorCount = 0;
            $errors = [];

            foreach ($data as $index => $row) {
                try {
                    // Skip empty rows
                    if (empty(array_filter($row))) {
                        continue;
                    }

                    $rowData = array_combine($header, $row);

                    Log::info("Processing row", [
                        'row_index' => $index + 2,
                        'email' => $rowData['email'] ?? 'missing',
                        'first_name' => $rowData['first_name'] ?? 'missing',
                        'surname' => $rowData['surname'] ?? 'missing'
                    ]);

                    // Validate required fields
                    if (empty($rowData['first_name']) || empty($rowData['surname']) || empty($rowData['email'])) {
                        $errors[] = "Row " . ($index + 2) . ": Missing required fields (first_name, surname, email)";
                        $errorCount++;
                        Log::warning("Row skipped - missing required fields", [
                            'row_index' => $index + 2,
                            'missing_fields' => [
                                'first_name' => empty($rowData['first_name']),
                                'surname' => empty($rowData['surname']),
                                'email' => empty($rowData['email'])
                            ]
                        ]);
                        continue;
                    }

                    // Construct full name
                    $fullName = trim(implode(' ', array_filter([
                        $rowData['first_name'] ?? '',
                        $rowData['middle_name'] ?? '',
                        $rowData['surname'] ?? ''
                    ])));

                    // Generate a default password
                    $defaultPassword = \Illuminate\Support\Str::random(8);

                    // Get member role ID
                    $memberRole = \App\Models\Role::where('name', 'member')->first();
                    if (!$memberRole) {
                        throw new \Exception('Member role not found in database');
                    }

                    // Create User record
                    Log::info("Creating user", [
                        'row_index' => $index + 2,
                        'name' => $fullName,
                        'email' => $rowData['email'],
                        'role_id' => $memberRole->id
                    ]);

                    $user = \App\Models\User::create([
                        'name' => $fullName,
                        'email' => $rowData['email'],
                        'password' => \Illuminate\Support\Facades\Hash::make($defaultPassword),
                        'role_id' => $memberRole->id,
                    ]);

                    Log::info("User created successfully", [
                        'row_index' => $index + 2,
                        'user_id' => $user->id,
                        'email' => $user->email
                    ]);

                    // Helper function to handle date fields
                    $parseDate = function($dateValue) {
                        if (empty($dateValue) || trim($dateValue) === '') {
                            return null;
                        }
                        try {
                            return \Carbon\Carbon::parse($dateValue)->format('Y-m-d');
                        } catch (\Exception $e) {
                            return null;
                        }
                    };

                    // Create Member record
                    $memberData = [
                        'user_id' => $user->id,
                        'name' => $fullName,
                        'first_name' => $rowData['first_name'] ?? '',
                        'middle_name' => $rowData['middle_name'] ?? '',
                        'surname' => $rowData['surname'] ?? '',
                        'email' => $rowData['email'],
                        'phone_number' => $rowData['phone_number'] ?? '',
                        'address' => $rowData['address'] ?? '',
                        'place_of_birth' => $rowData['place_of_birth'] ?? '',
                        'sex' => $rowData['sex'] ?? '',
                        'date_of_birth' => $parseDate($rowData['date_of_birth'] ?? ''),
                        'tribe' => $rowData['tribe'] ?? '',
                        'occupation' => $rowData['occupation'] ?? '',
                        'reason_for_membership' => $rowData['reason_for_membership'] ?? '',
                        'applicant_date' => $parseDate($rowData['applicant_date'] ?? ''),
                        'declaration_name' => $rowData['declaration_name'] ?? '',
                        'witness_name' => $rowData['witness_name'] ?? '',
                        'witness_date' => $parseDate($rowData['witness_date'] ?? ''),
                        'is_verified' => false,
                    ];

                    Log::info("Creating member", [
                        'row_index' => $index + 2,
                        'user_id' => $user->id,
                        'member_data_keys' => array_keys($memberData)
                    ]);

                    $member = Member::create($memberData);

                    Log::info("Member created successfully", [
                        'row_index' => $index + 2,
                        'member_id' => $member->id,
                        'user_id' => $user->id,
                        'email' => $member->email
                    ]);

                    // Send welcome email
                    try {
                        \Illuminate\Support\Facades\Mail::to($user->email)->send(new \App\Mail\WelcomeMail($user, $defaultPassword));
                        Log::info("Welcome email sent", ['row_index' => $index + 2, 'email' => $user->email]);
                    } catch (\Exception $e) {
                        // Log email error but don't fail the import
                        Log::warning("Failed to send welcome email to {$user->email}: " . $e->getMessage());
                    }

                    $successCount++;
                    Log::info("Row processed successfully", ['row_index' => $index + 2, 'success_count' => $successCount]);

                } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
                    $errorMessage = "Row " . ($index + 2) . ": Email already exists - " . ($rowData['email'] ?? 'unknown');
                    $errors[] = $errorMessage;
                    $errorCount++;
                    Log::error("Unique constraint violation during import", [
                        'row_index' => $index + 2,
                        'email' => $rowData['email'] ?? 'unknown',
                        'error' => $e->getMessage()
                    ]);
                    // If user was created but member creation failed, delete the user
                    if (isset($user)) {
                        $user->delete();
                        Log::info("Deleted user due to constraint violation", ['user_id' => $user->id]);
                    }
                } catch (\Exception $e) {
                    $errorMessage = "Row " . ($index + 2) . ": " . $e->getMessage();
                    $errors[] = $errorMessage;
                    $errorCount++;
                    Log::error("General error during import", [
                        'row_index' => $index + 2,
                        'email' => $rowData['email'] ?? 'unknown',
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString()
                    ]);
                    // If user was created but member creation failed, delete the user
                    if (isset($user)) {
                        $user->delete();
                        Log::info("Deleted user due to general error", ['user_id' => $user->id]);
                    }
                }
            }

            $message = "Import completed: {$successCount} members imported successfully";
            if ($errorCount > 0) {
                $message .= ", {$errorCount} errors occurred";
            }

            Log::info("Import process completed", [
                'success_count' => $successCount,
                'error_count' => $errorCount,
                'total_rows_processed' => count($data),
                'errors' => $errors
            ]);

            return redirect()->back()->with([
                'message' => $message,
                'import_errors' => $errors
            ]);

        } catch (\Exception $e) {
            return redirect()->back()->withErrors([
                'file' => 'Failed to process the file: ' . $e->getMessage()
            ]);
        }
    }

    public function downloadTemplate()
    {
        $headers = [
            'Content-type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename=members_template.csv',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0'
        ];

        $columns = [
            'first_name',
            'middle_name',
            'surname',
            'email',
            'phone_number',
            'address',
            'place_of_birth',
            'sex',
            'date_of_birth',
            'tribe',
            'occupation',
            'reason_for_membership',
            'applicant_date',
            'declaration_name',
            'witness_name',
            'witness_date'
        ];

        $callback = function() use ($columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            // Add sample data row
            fputcsv($file, [
                'first_name' => 'John',
                'middle_name' => 'William',
                'surname' => 'Doe',
                'email' => 'john.doe@example.com',
                'phone_number' => '+255123456789',
                'address' => '123 Main Street, Dar es Salaam',
                'place_of_birth' => 'Dar es Salaam',
                'sex' => 'Male',
                'date_of_birth' => '1990-01-15',
                'tribe' => 'Chagga',
                'occupation' => 'Teacher',
                'reason_for_membership' => 'Community development',
                'applicant_date' => '2024-01-01',
                'declaration_name' => 'John William Doe',
                'witness_name' => 'Jane Smith',
                'witness_date' => '2024-01-01'
            ]);

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Clean up orphaned user records that don't have corresponding member records
     * This method can be called to fix existing data inconsistencies
     */
    public function cleanupOrphanedUsers()
    {
        try {
            // Find users that don't have corresponding member records
            $orphanedUsers = \App\Models\User::whereDoesntHave('member')->get();

            $deletedCount = 0;
            foreach ($orphanedUsers as $user) {
                // Additional safety check: only delete users with 'member' role or no role
                // Don't delete admin users or users with other important roles
                if (!$user->role || $user->role->name === 'member') {
                    $user->delete();
                    $deletedCount++;
                }
            }

            return redirect()->back()->with('message', "Cleanup completed: {$deletedCount} orphaned user records deleted.");

        } catch (\Exception $e) {
            \Log::error('Error cleaning up orphaned users: ' . $e->getMessage());
            return redirect()->back()->with('error', 'An error occurred during cleanup. Please check the logs.');
        }
    }
}
