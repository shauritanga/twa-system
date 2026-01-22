<?php

namespace App\Http\Controllers\AdminPortal;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AnnouncementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Announcement::with('creator')
            ->orderBy('announcement_date', 'desc');

        // Filter by type
        if ($request->filled('type')) {
            $query->where('type', $request->type);
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
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        $announcements = $query->paginate(15)->withQueryString();

        return Inertia::render('AdminPortal/Announcements/Index', [
            'announcements' => $announcements,
            'filters' => $request->only(['type', 'status', 'search']),
            'types' => $this->getTypes(),
            'statuses' => $this->getStatuses(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|in:important,event,update,general',
            'status' => 'required|in:active,inactive,draft',
            'link_url' => 'nullable|url',
            'link_text' => 'nullable|string|max:100',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'video_file' => 'nullable|file|mimes:mp4,avi,mov,wmv,flv,webm|max:51200',
            'video_url' => 'nullable|url|max:500',
            'media_type' => 'required|in:none,image,video,video_url',
            'image_alt_text' => 'nullable|string|max:255',
            'announcement_date' => 'required|date',
            'expires_at' => 'nullable|date|after:announcement_date',
            'is_featured' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        try {
            // Handle file uploads
            $imagePath = null;
            $videoPath = null;

            if ($request->hasFile('image_file') && $validated['media_type'] === 'image') {
                $imageFile = $request->file('image_file');
                $imageName = time() . '_' . uniqid() . '.' . $imageFile->getClientOriginalExtension();
                $imagePath = $imageFile->storeAs('announcements/images', $imageName, 'public');
            }

            if ($request->hasFile('video_file') && $validated['media_type'] === 'video') {
                $videoFile = $request->file('video_file');
                $videoName = time() . '_' . uniqid() . '.' . $videoFile->getClientOriginalExtension();
                $videoPath = $videoFile->storeAs('announcements/videos', $videoName, 'public');
            }

            // Prepare data for creation
            $announcementData = $validated;
            $announcementData['created_by'] = Auth::id();
            $announcementData['image_path'] = $imagePath;
            $announcementData['video_path'] = $videoPath;

            // Remove file fields from data
            unset($announcementData['image_file'], $announcementData['video_file']);

            Announcement::create($announcementData);

            return redirect()->route('admin-portal.announcements.index')
                ->with('success', 'Announcement created successfully.');

        } catch (\Exception $e) {
            \Log::error('Announcement creation failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to create announcement.'])->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Announcement $announcement): Response
    {
        $announcement->load('creator');

        return Inertia::render('AdminPortal/Announcements/Show', [
            'announcement' => $announcement,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Announcement $announcement): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|in:important,event,update,general',
            'status' => 'required|in:active,inactive,draft',
            'link_url' => 'nullable|url',
            'link_text' => 'nullable|string|max:100',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'video_file' => 'nullable|file|mimes:mp4,avi,mov,wmv,flv,webm|max:51200',
            'video_url' => 'nullable|url|max:500',
            'media_type' => 'required|in:none,image,video,video_url',
            'image_alt_text' => 'nullable|string|max:255',
            'announcement_date' => 'required|date',
            'expires_at' => 'nullable|date|after:announcement_date',
            'is_featured' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        try {
            $imagePath = $announcement->image_path;
            $videoPath = $announcement->video_path;

            if ($request->hasFile('image_file') && $validated['media_type'] === 'image') {
                if ($announcement->image_path) {
                    Storage::disk('public')->delete($announcement->image_path);
                }
                $imageFile = $request->file('image_file');
                $imageName = time() . '_' . uniqid() . '.' . $imageFile->getClientOriginalExtension();
                $imagePath = $imageFile->storeAs('announcements/images', $imageName, 'public');
            }

            if ($request->hasFile('video_file') && $validated['media_type'] === 'video') {
                if ($announcement->video_path) {
                    Storage::disk('public')->delete($announcement->video_path);
                }
                $videoFile = $request->file('video_file');
                $videoName = time() . '_' . uniqid() . '.' . $videoFile->getClientOriginalExtension();
                $videoPath = $videoFile->storeAs('announcements/videos', $videoName, 'public');
            }

            if ($validated['media_type'] === 'none') {
                if ($announcement->image_path) {
                    Storage::disk('public')->delete($announcement->image_path);
                    $imagePath = null;
                }
                if ($announcement->video_path) {
                    Storage::disk('public')->delete($announcement->video_path);
                    $videoPath = null;
                }
            }

            $announcementData = $validated;
            $announcementData['image_path'] = $imagePath;
            $announcementData['video_path'] = $videoPath;

            unset($announcementData['image_file'], $announcementData['video_file']);

            $announcement->update($announcementData);

            return redirect()->route('admin-portal.announcements.index')
                ->with('success', 'Announcement updated successfully.');

        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to update announcement.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Announcement $announcement): RedirectResponse
    {
        try {
            if ($announcement->image_path) {
                Storage::disk('public')->delete($announcement->image_path);
            }

            if ($announcement->video_path) {
                Storage::disk('public')->delete($announcement->video_path);
            }

            $announcement->delete();

            return redirect()->route('admin-portal.announcements.index')
                ->with('success', 'Announcement deleted successfully.');

        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to delete announcement.']);
        }
    }

    /**
     * Get available types
     */
    private function getTypes(): array
    {
        return [
            'important' => 'Important',
            'event' => 'Event',
            'update' => 'Update',
            'general' => 'General',
        ];
    }

    /**
     * Get available statuses
     */
    private function getStatuses(): array
    {
        return [
            'active' => 'Active',
            'inactive' => 'Inactive',
            'draft' => 'Draft',
        ];
    }
}
