<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Document::with('uploader')
            ->orderBy('created_at', 'desc');

        // Filter by category
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('file_name', 'like', "%{$search}%");
            });
        }

        $documents = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Documents/Index', [
            'documents' => $documents,
            'filters' => $request->only(['category', 'status', 'search']),
            'categories' => $this->getCategories(),
            'statuses' => $this->getStatuses(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Documents/Create', [
            'categories' => $this->getCategories(),
            'visibilityOptions' => $this->getVisibilityOptions(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        // Set PHP configuration for file uploads at runtime
        ini_set('upload_max_filesize', '15M');
        ini_set('post_max_size', '20M');
        ini_set('max_execution_time', '300');
        ini_set('memory_limit', '256M');

        // Check file size before validation to provide better error message
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $maxSize = 15 * 1024 * 1024; // 15MB in bytes

            if ($file->getSize() > $maxSize) {
                return back()->withErrors([
                    'file' => 'The file size must not exceed 15MB. Current file size: ' .
                             round($file->getSize() / 1024 / 1024, 2) . 'MB'
                ])->withInput();
            }
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|in:meeting_minutes,policies,procedures,financial_reports,legal_documents,forms,announcements,other',
            'visibility' => 'required|in:public,members_only,admin_only',
            'document_date' => 'nullable|date',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'file' => 'required|file|mimes:pdf,doc,docx,xls,xlsx,ppt,pptx,txt,jpg,jpeg,png|max:15360', // 15MB max
            'publish_immediately' => 'boolean',
        ]);

        try {
            // Handle file upload
            $file = $request->file('file');
            $fileName = $file->getClientOriginalName();
            $fileExtension = $file->getClientOriginalExtension();
            $fileSize = $file->getSize();

            // Generate unique file name to prevent conflicts
            $uniqueFileName = Str::uuid() . '.' . $fileExtension;
            $filePath = $file->storeAs('documents', $uniqueFileName, 'public');

            // Create document record
            $document = Document::create([
                'title' => $request->title,
                'description' => $request->description,
                'category' => $request->category,
                'file_name' => $fileName,
                'file_path' => $filePath,
                'file_type' => $fileExtension,
                'file_size' => $fileSize,
                'visibility' => $request->visibility,
                'status' => 'active',
                'document_date' => $request->document_date,
                'tags' => $request->tags ?? [],
                'uploaded_by' => Auth::id(),
                'published_at' => $request->publish_immediately ? now() : null,
            ]);

            // Log activity
            Auth::user()->logActivity('document_created', 'Document uploaded', [
                'document_id' => $document->id,
                'document_title' => $document->title,
                'file_name' => $fileName,
                'category' => $document->category,
            ]);

            return redirect()->route('admin.documents.index')
                ->with('success', 'Document uploaded successfully.');

        } catch (\Illuminate\Http\Exceptions\PostTooLargeException $e) {
            return back()->withErrors([
                'file' => 'The file is too large. Maximum allowed size is 15MB. Please reduce the file size and try again.'
            ])->withInput();
        } catch (\Exception $e) {
            \Log::error('Document upload failed: ' . $e->getMessage());
            return back()->withErrors([
                'file' => 'Failed to upload document. Please check the file and try again.'
            ])->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Document $document): Response
    {
        $document->load('uploader');

        return Inertia::render('Admin/Documents/Show', [
            'document' => $document,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Document $document): Response
    {
        $document->load('uploader');

        return Inertia::render('Admin/Documents/Edit', [
            'document' => $document,
            'categories' => $this->getCategories(),
            'visibilityOptions' => $this->getVisibilityOptions(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Document $document): RedirectResponse
    {
        // Set PHP configuration for file uploads at runtime
        ini_set('upload_max_filesize', '15M');
        ini_set('post_max_size', '20M');
        ini_set('max_execution_time', '300');
        ini_set('memory_limit', '256M');

        // Check file size before validation to provide better error message
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $maxSize = 15 * 1024 * 1024; // 15MB in bytes

            if ($file->getSize() > $maxSize) {
                return back()->withErrors([
                    'file' => 'The file size must not exceed 15MB. Current file size: ' .
                             round($file->getSize() / 1024 / 1024, 2) . 'MB'
                ])->withInput();
            }
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|in:meeting_minutes,policies,procedures,financial_reports,legal_documents,forms,announcements,other',
            'visibility' => 'required|in:public,members_only,admin_only',
            'document_date' => 'nullable|date',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'status' => 'required|in:active,archived,draft',
            'file' => 'nullable|file|mimes:pdf,doc,docx,xls,xlsx,ppt,pptx,txt,jpg,jpeg,png|max:15360', // 15MB max
        ]);

        try {
            $updateData = [
                'title' => $request->title,
                'description' => $request->description,
                'category' => $request->category,
                'visibility' => $request->visibility,
                'status' => $request->status,
                'document_date' => $request->document_date,
                'tags' => $request->tags ?? [],
            ];

            // Handle file replacement if new file uploaded
            if ($request->hasFile('file')) {
                // Delete old file
                if (Storage::disk('public')->exists($document->file_path)) {
                    Storage::disk('public')->delete($document->file_path);
                }

                // Upload new file
                $file = $request->file('file');
                $fileName = $file->getClientOriginalName();
                $fileExtension = $file->getClientOriginalExtension();
                $fileSize = $file->getSize();

                $uniqueFileName = Str::uuid() . '.' . $fileExtension;
                $filePath = $file->storeAs('documents', $uniqueFileName, 'public');

                $updateData = array_merge($updateData, [
                    'file_name' => $fileName,
                    'file_path' => $filePath,
                    'file_type' => $fileExtension,
                    'file_size' => $fileSize,
                ]);
            }

            $document->update($updateData);

            // Log activity
            Auth::user()->logActivity('document_updated', 'Document updated', [
                'document_id' => $document->id,
                'document_title' => $document->title,
                'changes' => array_keys($updateData),
            ]);

            return redirect()->route('admin.documents.index')
                ->with('success', 'Document updated successfully.');

        } catch (\Exception $e) {
            return back()->withErrors(['file' => 'Failed to update document. Please try again.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Document $document): RedirectResponse
    {
        try {
            // Log activity before deletion
            Auth::user()->logActivity('document_deleted', 'Document deleted', [
                'document_id' => $document->id,
                'document_title' => $document->title,
                'file_name' => $document->file_name,
            ]);

            // Delete the document (file will be deleted automatically via model boot method)
            $document->delete();

            return redirect()->route('admin.documents.index')
                ->with('success', 'Document deleted successfully.');

        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to delete document. Please try again.']);
        }
    }

    /**
     * Publish a document
     */
    public function publish(Document $document): RedirectResponse
    {
        $document->update([
            'published_at' => now(),
            'status' => 'active',
        ]);

        Auth::user()->logActivity('document_published', 'Document published', [
            'document_id' => $document->id,
            'document_title' => $document->title,
        ]);

        return back()->with('success', 'Document published successfully.');
    }

    /**
     * Unpublish a document
     */
    public function unpublish(Document $document): RedirectResponse
    {
        $document->update(['published_at' => null]);

        Auth::user()->logActivity('document_unpublished', 'Document unpublished', [
            'document_id' => $document->id,
            'document_title' => $document->title,
        ]);

        return back()->with('success', 'Document unpublished successfully.');
    }

    /**
     * Get available categories
     */
    private function getCategories(): array
    {
        return [
            'meeting_minutes' => 'Meeting Minutes',
            'policies' => 'Policies',
            'procedures' => 'Procedures',
            'financial_reports' => 'Financial Reports',
            'legal_documents' => 'Legal Documents',
            'forms' => 'Forms',
            'announcements' => 'Announcements',
            'other' => 'Other',
        ];
    }

    /**
     * Get available statuses
     */
    private function getStatuses(): array
    {
        return [
            'active' => 'Active',
            'archived' => 'Archived',
            'draft' => 'Draft',
        ];
    }

    /**
     * Get visibility options
     */
    private function getVisibilityOptions(): array
    {
        return [
            'public' => 'Public',
            'members_only' => 'Members Only',
            'admin_only' => 'Admin Only',
        ];
    }
}
