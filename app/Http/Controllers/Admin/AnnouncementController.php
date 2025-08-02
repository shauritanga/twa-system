<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AnnouncementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $announcements = Announcement::with('creator')
            ->orderBy('announcement_date', 'desc')
            ->paginate(10);

        return Inertia::render('Admin/Announcements/Index', [
            'announcements' => $announcements
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Announcements/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|in:important,event,update,general',
            'status' => 'required|in:active,inactive,draft',
            'link_url' => 'nullable|url',
            'link_text' => 'nullable|string|max:100',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB max
            'video_file' => 'nullable|file|mimes:mp4,avi,mov,wmv,flv,webm|max:51200', // 50MB max
            'video_url' => 'nullable|url|max:500',
            'media_type' => 'required|in:none,image,video,video_url',
            'image_alt_text' => 'nullable|string|max:255',
            'announcement_date' => 'required|date',
            'expires_at' => 'nullable|date|after:announcement_date',
            'is_featured' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

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
        $announcementData['created_by'] = auth()->id();
        $announcementData['image_path'] = $imagePath;
        $announcementData['video_path'] = $videoPath;

        // Remove file fields from data as they're not database columns
        unset($announcementData['image_file'], $announcementData['video_file']);

        Announcement::create($announcementData);

        return redirect()->route('admin.announcements.index')
            ->with('success', 'Announcement created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Announcement $announcement)
    {
        return Inertia::render('Admin/Announcements/Show', [
            'announcement' => $announcement->load('creator')
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Announcement $announcement)
    {
        return Inertia::render('Admin/Announcements/Edit', [
            'announcement' => $announcement
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Announcement $announcement)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|in:important,event,update,general',
            'status' => 'required|in:active,inactive,draft',
            'link_url' => 'nullable|url',
            'link_text' => 'nullable|string|max:100',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB max
            'video_file' => 'nullable|file|mimes:mp4,avi,mov,wmv,flv,webm|max:51200', // 50MB max
            'video_url' => 'nullable|url|max:500',
            'media_type' => 'required|in:none,image,video,video_url',
            'image_alt_text' => 'nullable|string|max:255',
            'announcement_date' => 'required|date',
            'expires_at' => 'nullable|date|after:announcement_date',
            'is_featured' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        // Handle file uploads
        $imagePath = $announcement->image_path; // Keep existing if no new file
        $videoPath = $announcement->video_path; // Keep existing if no new file

        if ($request->hasFile('image_file') && $validated['media_type'] === 'image') {
            // Delete old image if exists
            if ($announcement->image_path) {
                Storage::disk('public')->delete($announcement->image_path);
            }

            $imageFile = $request->file('image_file');
            $imageName = time() . '_' . uniqid() . '.' . $imageFile->getClientOriginalExtension();
            $imagePath = $imageFile->storeAs('announcements/images', $imageName, 'public');
        }

        if ($request->hasFile('video_file') && $validated['media_type'] === 'video') {
            // Delete old video if exists
            if ($announcement->video_path) {
                Storage::disk('public')->delete($announcement->video_path);
            }

            $videoFile = $request->file('video_file');
            $videoName = time() . '_' . uniqid() . '.' . $videoFile->getClientOriginalExtension();
            $videoPath = $videoFile->storeAs('announcements/videos', $videoName, 'public');
        }

        // If media type changed to none, clear existing files
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

        // Prepare data for update
        $announcementData = $validated;
        $announcementData['image_path'] = $imagePath;
        $announcementData['video_path'] = $videoPath;

        // Remove file fields from data as they're not database columns
        unset($announcementData['image_file'], $announcementData['video_file']);

        $announcement->update($announcementData);

        return redirect()->route('admin.announcements.index')
            ->with('success', 'Announcement updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Announcement $announcement)
    {
        // Delete associated files
        if ($announcement->image_path) {
            Storage::disk('public')->delete($announcement->image_path);
        }

        if ($announcement->video_path) {
            Storage::disk('public')->delete($announcement->video_path);
        }

        $announcement->delete();

        return redirect()->route('admin.announcements.index')
            ->with('success', 'Announcement deleted successfully.');
    }
}
