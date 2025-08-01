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
use App\Services\AuditService;

class MemberController extends Controller
{
    public function index()
    {
        // Only calculate statistics needed for archive link
        $statistics = [
            'deleted_members' => Member::onlyTrashed()->count(),
        ];

        return Inertia::render('Members/Index', [
            'members' => Member::all(),
            'statistics' => $statistics,
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
            // Soft delete the member record (the model's booted method will handle user soft deletion automatically)
            $member->delete();

            // Use Inertia redirect back with success message
            return redirect()->back()->with('success', 'Member has been moved to archive. You can restore them later if needed.');

        } catch (\Exception $e) {
            \Log::error('Error archiving member: ' . $e->getMessage());

            // Use Inertia redirect back with error message
            return redirect()->back()->with('error', 'An error occurred while archiving the member. Please try again.');
        }
    }

    /**
     * Show archived (soft deleted) members
     */
    public function archived()
    {
        return Inertia::render('Members/Archived', [
            'archivedMembers' => Member::onlyTrashed()->with('user')->get(),
        ]);
    }

    /**
     * Restore a soft deleted member
     */
    public function restore($id)
    {
        try {
            $member = Member::onlyTrashed()->findOrFail($id);
            $member->restore();

            return redirect()->back()->with('message', 'Member restored successfully.');

        } catch (\Exception $e) {
            \Log::error('Error restoring member: ' . $e->getMessage());
            return redirect()->back()->with('error', 'An error occurred while restoring the member. Please try again.');
        }
    }

    /**
     * Permanently delete a member (force delete)
     */
    public function forceDelete($id)
    {
        try {
            $member = Member::onlyTrashed()->findOrFail($id);

            // Force delete the associated user first if it exists
            if ($member->user_id) {
                $user = \App\Models\User::withTrashed()->find($member->user_id);
                if ($user) {
                    $user->forceDelete();
                }
            }

            // Force delete the member
            $member->forceDelete();

            return redirect()->back()->with('message', 'Member permanently deleted from the system.');

        } catch (\Exception $e) {
            \Log::error('Error permanently deleting member: ' . $e->getMessage());
            return redirect()->back()->with('error', 'An error occurred while permanently deleting the member. Please try again.');
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
        // Debug info for production
        Log::info('Import attempt started', [
            'upload_max_filesize' => ini_get('upload_max_filesize'),
            'post_max_size' => ini_get('post_max_size'),
            'memory_limit' => ini_get('memory_limit'),
            'max_execution_time' => ini_get('max_execution_time'),
            'storage_writable' => is_writable(storage_path()),
        ]);

        // Environment-specific validation
        if (app()->environment('production')) {
            // More lenient validation for production
            $request->validate([
                'file' => 'required|file|max:10240', // 10MB max
            ]);

            // Check file extension manually
            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $extension = strtolower($file->getClientOriginalExtension());

                if (!in_array($extension, ['csv', 'xlsx', 'xls'])) {
                    return redirect()->back()->withErrors([
                        'file' => 'Please upload a CSV or Excel file.'
                    ]);
                }
            }
        } else {
            // Strict validation for development
            $request->validate([
                'file' => 'required|mimes:csv,xlsx,xls',
            ]);
        }

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
                // Improved CSV reading with error handling
                if (!is_readable($path)) {
                    throw new \Exception('CSV file is not readable');
                }

                $fileContent = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
                if ($fileContent === false) {
                    throw new \Exception('Failed to read CSV file');
                }

                $data = array_map('str_getcsv', $fileContent);
                $header = array_shift($data);

                // Validate CSV structure
                if (empty($header)) {
                    throw new \Exception('CSV file has no header row');
                }

                Log::info('CSV file read successfully', [
                    'header_columns' => count($header),
                    'data_rows' => count($data),
                    'file_size' => filesize($path)
                ]);
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

            // Validate expected headers
            $requiredHeaders = ['first_name', 'surname', 'email'];
            $missingHeaders = array_diff($requiredHeaders, $header);
            if (!empty($missingHeaders)) {
                throw new \Exception('Missing required columns: ' . implode(', ', $missingHeaders) . '. Found columns: ' . implode(', ', $header));
            }

            $successCount = 0;
            $errorCount = 0;
            $errors = [];

            foreach ($data as $index => $row) {
                try {
                    // Skip empty rows
                    if (empty(array_filter($row))) {
                        continue;
                    }

                    // Use database transaction for each row
                    \DB::beginTransaction();

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
                        \DB::rollBack();
                        continue;
                    }

                    // Validate email format
                    if (!filter_var($rowData['email'], FILTER_VALIDATE_EMAIL)) {
                        $errors[] = "Row " . ($index + 2) . ": Invalid email format - " . $rowData['email'];
                        $errorCount++;
                        Log::warning("Row skipped - invalid email", [
                            'row_index' => $index + 2,
                            'email' => $rowData['email']
                        ]);
                        \DB::rollBack();
                        continue;
                    }

                    // Validate sex field if provided
                    if (!empty($rowData['sex']) && !in_array($rowData['sex'], ['Male', 'Female'])) {
                        $errors[] = "Row " . ($index + 2) . ": Invalid sex value - must be 'Male' or 'Female'";
                        $errorCount++;
                        Log::warning("Row skipped - invalid sex value", [
                            'row_index' => $index + 2,
                            'sex' => $rowData['sex']
                        ]);
                        \DB::rollBack();
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

                    // Commit the transaction
                    \DB::commit();

                    $successCount++;
                    Log::info("Row processed successfully", ['row_index' => $index + 2, 'success_count' => $successCount]);

                } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
                    \DB::rollBack();
                    $errorMessage = "Row " . ($index + 2) . ": Email already exists - " . ($rowData['email'] ?? 'unknown');
                    $errors[] = $errorMessage;
                    $errorCount++;
                    Log::error("Unique constraint violation during import", [
                        'row_index' => $index + 2,
                        'email' => $rowData['email'] ?? 'unknown',
                        'error' => $e->getMessage()
                    ]);
                } catch (\Exception $e) {
                    \DB::rollBack();
                    $errorMessage = "Row " . ($index + 2) . ": " . $e->getMessage();
                    $errors[] = $errorMessage;
                    $errorCount++;
                    Log::error("General error during import", [
                        'row_index' => $index + 2,
                        'email' => $rowData['email'] ?? 'unknown',
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString()
                    ]);
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

            // Log audit trail for import
            AuditService::logSystem(
                'member_import',
                "Imported {$successCount} members from file '{$file->getClientOriginalName()}'",
                [
                    'file_name' => $file->getClientOriginalName(),
                    'success_count' => $successCount,
                    'error_count' => $errorCount,
                    'total_rows' => count($data),
                    'errors' => array_slice($errors, 0, 10), // Limit errors in audit log
                ],
                $errorCount > 0 ? 'medium' : 'low'
            );

            // Prepare detailed response
            $response = [
                'message' => $message,
                'import_errors' => $errors,
                'import_summary' => [
                    'total_rows' => count($data),
                    'successful' => $successCount,
                    'failed' => $errorCount,
                    'file_name' => $file->getClientOriginalName()
                ]
            ];

            return redirect()->back()->with($response);

        } catch (\Exception $e) {
            // Enhanced error logging for production debugging
            Log::error('Member import failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'file_name' => $request->file('file')?->getClientOriginalName(),
                'file_size' => $request->file('file')?->getSize(),
                'php_upload_max' => ini_get('upload_max_filesize'),
                'php_post_max' => ini_get('post_max_size'),
                'php_memory_limit' => ini_get('memory_limit'),
                'storage_writable' => is_writable(storage_path()),
            ]);

            return redirect()->back()->withErrors([
                'file' => 'Failed to process the file: ' . $e->getMessage() .
                         ' (Check server logs for detailed error information)'
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
            'first_name',        // Required: Member's first name
            'middle_name',       // Optional: Member's middle name
            'surname',          // Required: Member's surname/last name
            'email',            // Required: Unique email address
            'phone_number',     // Optional: Phone number with country code
            'address',          // Optional: Physical address
            'place_of_birth',   // Optional: Place of birth
            'sex',              // Optional: Male or Female
            'date_of_birth',    // Optional: Format: YYYY-MM-DD
            'tribe',            // Optional: Tribal affiliation
            'occupation',       // Optional: Current occupation
            'reason_for_membership', // Optional: Why joining the association
            'applicant_date',   // Optional: Application date (YYYY-MM-DD)
            'declaration_name', // Optional: Name on declaration
            'witness_name',     // Optional: Witness name
            'witness_date'      // Optional: Witness date (YYYY-MM-DD)
        ];

        $callback = function() use ($columns) {
            $file = fopen('php://output', 'w');

            // Add instructions as comments
            fputcsv($file, ['# MEMBER IMPORT TEMPLATE - Tabata Welfare Association']);
            fputcsv($file, ['# INSTRUCTIONS:']);
            fputcsv($file, ['# 1. Required fields: first_name, surname, email']);
            fputcsv($file, ['# 2. Email must be unique']);
            fputcsv($file, ['# 3. Date format: YYYY-MM-DD (e.g., 1990-01-15)']);
            fputcsv($file, ['# 4. Sex: Male or Female']);
            fputcsv($file, ['# 5. Delete these instruction rows before importing']);
            fputcsv($file, ['# 6. Keep the header row (first_name, middle_name, etc.)']);
            fputcsv($file, ['']);

            // Add column headers
            fputcsv($file, $columns);

            // Add sample data rows
            fputcsv($file, [
                'John',
                'William',
                'Doe',
                'john.doe@example.com',
                '+255123456789',
                '123 Main Street, Dar es Salaam',
                'Dar es Salaam',
                'Male',
                '1990-01-15',
                'Chagga',
                'Teacher',
                'Community development',
                '2024-01-01',
                'John William Doe',
                'Jane Smith',
                '2024-01-01'
            ]);

            fputcsv($file, [
                'Mary',
                'Grace',
                'Johnson',
                'mary.johnson@example.com',
                '+255987654321',
                '456 Oak Avenue, Arusha',
                'Arusha',
                'Female',
                '1985-03-22',
                'Maasai',
                'Nurse',
                'Healthcare support',
                '2024-01-02',
                'Mary Grace Johnson',
                'Peter Wilson',
                '2024-01-02'
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
