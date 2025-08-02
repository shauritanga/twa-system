<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FundraisingCampaign;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class FundraisingCampaignController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $campaigns = FundraisingCampaign::with('creator')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Admin/FundraisingCampaigns/Index', [
            'campaigns' => $campaigns
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/FundraisingCampaigns/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'full_description' => 'nullable|string',
            'goal_amount' => 'required|numeric|min:1',
            'status' => 'required|in:draft,active,paused,completed,cancelled',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB max
            'video_file' => 'nullable|file|mimes:mp4,avi,mov,wmv,flv,webm|max:51200', // 50MB max
            'video_url' => 'nullable|url|max:500',
            'payment_methods' => 'nullable|array',
            'bank_details' => 'nullable|string',
            'mobile_money_number' => 'nullable|string|max:20',
            'is_featured' => 'in:0,1,true,false',
            'sort_order' => 'integer|min:0',
        ]);

        // Handle file uploads
        $imagePath = null;
        $videoPath = null;

        if ($request->hasFile('image_file')) {
            $imageFile = $request->file('image_file');
            $imageName = time() . '_' . uniqid() . '.' . $imageFile->getClientOriginalExtension();
            $imagePath = $imageFile->storeAs('campaigns/images', $imageName, 'public');
        }

        if ($request->hasFile('video_file')) {
            $videoFile = $request->file('video_file');
            $videoName = time() . '_' . uniqid() . '.' . $videoFile->getClientOriginalExtension();
            $videoPath = $videoFile->storeAs('campaigns/videos', $videoName, 'public');
        }

        // Prepare data for creation
        $campaignData = $validated;
        $campaignData['created_by'] = auth()->id();
        $campaignData['image_path'] = $imagePath;
        $campaignData['video_path'] = $videoPath;

        // Convert is_featured to boolean
        $campaignData['is_featured'] = in_array($campaignData['is_featured'], [1, '1', 'true', true], true);

        // Remove file fields from data as they're not database columns
        unset($campaignData['image_file'], $campaignData['video_file']);

        FundraisingCampaign::create($campaignData);

        return redirect()->route('admin.fundraising-campaigns.index')
            ->with('success', 'Fundraising campaign created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(FundraisingCampaign $fundraisingCampaign)
    {
        return Inertia::render('Admin/FundraisingCampaigns/Show', [
            'campaign' => $fundraisingCampaign->load('creator')
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FundraisingCampaign $fundraisingCampaign)
    {
        return Inertia::render('Admin/FundraisingCampaigns/Edit', [
            'campaign' => $fundraisingCampaign
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, FundraisingCampaign $fundraisingCampaign)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'full_description' => 'nullable|string',
            'goal_amount' => 'required|numeric|min:1',
            'status' => 'required|in:draft,active,paused,completed,cancelled',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB max
            'video_file' => 'nullable|file|mimes:mp4,avi,mov,wmv,flv,webm|max:51200', // 50MB max
            'video_url' => 'nullable|url|max:500',
            'payment_methods' => 'nullable|array',
            'bank_details' => 'nullable|string',
            'mobile_money_number' => 'nullable|string|max:20',
            'is_featured' => 'in:0,1,true,false',
            'sort_order' => 'integer|min:0',
        ]);

        // Handle file uploads
        $imagePath = $fundraisingCampaign->image_path; // Keep existing if no new file
        $videoPath = $fundraisingCampaign->video_path; // Keep existing if no new file

        if ($request->hasFile('image_file')) {
            // Delete old image if exists
            if ($fundraisingCampaign->image_path && str_starts_with($fundraisingCampaign->image_path, 'campaigns/')) {
                Storage::disk('public')->delete($fundraisingCampaign->image_path);
            }

            $imageFile = $request->file('image_file');
            $imageName = time() . '_' . uniqid() . '.' . $imageFile->getClientOriginalExtension();
            $imagePath = $imageFile->storeAs('campaigns/images', $imageName, 'public');
        }

        if ($request->hasFile('video_file')) {
            // Delete old video if exists
            if ($fundraisingCampaign->video_path && str_starts_with($fundraisingCampaign->video_path, 'campaigns/')) {
                Storage::disk('public')->delete($fundraisingCampaign->video_path);
            }

            $videoFile = $request->file('video_file');
            $videoName = time() . '_' . uniqid() . '.' . $videoFile->getClientOriginalExtension();
            $videoPath = $videoFile->storeAs('campaigns/videos', $videoName, 'public');
        }

        // Prepare data for update
        $campaignData = $validated;
        $campaignData['image_path'] = $imagePath;
        $campaignData['video_path'] = $videoPath;

        // Convert is_featured to boolean
        $campaignData['is_featured'] = in_array($campaignData['is_featured'], [1, '1', 'true', true], true);

        // Remove file fields from data as they're not database columns
        unset($campaignData['image_file'], $campaignData['video_file']);

        $fundraisingCampaign->update($campaignData);

        return redirect()->route('admin.fundraising-campaigns.index')
            ->with('success', 'Fundraising campaign updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FundraisingCampaign $fundraisingCampaign)
    {
        // Delete associated files
        if ($fundraisingCampaign->image_path && str_starts_with($fundraisingCampaign->image_path, 'campaigns/')) {
            Storage::disk('public')->delete($fundraisingCampaign->image_path);
        }

        if ($fundraisingCampaign->video_path && str_starts_with($fundraisingCampaign->video_path, 'campaigns/')) {
            Storage::disk('public')->delete($fundraisingCampaign->video_path);
        }

        $fundraisingCampaign->delete();

        return redirect()->route('admin.fundraising-campaigns.index')
            ->with('success', 'Fundraising campaign deleted successfully.');
    }

    /**
     * Update the raised amount for a campaign
     */
    public function updateRaisedAmount(Request $request, FundraisingCampaign $fundraisingCampaign)
    {
        $validated = $request->validate([
            'raised_amount' => 'required|numeric|min:0',
        ]);

        $fundraisingCampaign->update($validated);

        return redirect()->back()
            ->with('success', 'Raised amount updated successfully.');
    }
}
