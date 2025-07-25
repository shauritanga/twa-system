<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DocumentController extends Controller
{
    /**
     * Display a listing of documents for members
     */
    public function index(Request $request): Response
    {
        $user = Auth::user();

        $query = Document::with('uploader')
            ->published()
            ->where(function ($q) use ($user) {
                $q->where('visibility', 'public')
                  ->orWhere('visibility', 'members_only');

                // Include admin-only documents if user is admin
                if ($user->role && in_array($user->role->name, ['admin', 'secretary'])) {
                    $q->orWhere('visibility', 'admin_only');
                }
            })
            ->orderBy('document_date', 'desc')
            ->orderBy('created_at', 'desc');

        // Filter by category
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $documents = $query->paginate(12)->withQueryString();

        return Inertia::render('Member/Documents/Index', [
            'documents' => $documents,
            'filters' => $request->only(['category', 'search']),
            'categories' => $this->getCategories(),
        ]);
    }

    /**
     * Display the specified document
     */
    public function show(Document $document): Response
    {
        $user = Auth::user();

        // Check if user can view this document
        if (!$document->isVisibleTo($user)) {
            abort(403, 'You do not have permission to view this document.');
        }

        $document->load('uploader');

        return Inertia::render('Member/Documents/Show', [
            'document' => $document,
        ]);
    }

    /**
     * Get documents by category for quick access
     */
    public function byCategory(string $category): Response
    {
        $user = Auth::user();

        $documents = Document::with('uploader')
            ->published()
            ->where('category', $category)
            ->where(function ($q) use ($user) {
                $q->where('visibility', 'public')
                  ->orWhere('visibility', 'members_only');

                if ($user->role && in_array($user->role->name, ['admin', 'secretary'])) {
                    $q->orWhere('visibility', 'admin_only');
                }
            })
            ->orderBy('document_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        $categoryName = $this->getCategories()[$category] ?? ucfirst($category);

        return Inertia::render('Member/Documents/Category', [
            'documents' => $documents,
            'category' => $category,
            'categoryName' => $categoryName,
            'categories' => $this->getCategories(),
        ]);
    }

    /**
     * Get recent documents for dashboard
     */
    public function recent(): array
    {
        $user = Auth::user();

        $documents = Document::with('uploader')
            ->published()
            ->where(function ($q) use ($user) {
                $q->where('visibility', 'public')
                  ->orWhere('visibility', 'members_only');

                if ($user->role && in_array($user->role->name, ['admin', 'secretary'])) {
                    $q->orWhere('visibility', 'admin_only');
                }
            })
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return $documents->toArray();
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
}
