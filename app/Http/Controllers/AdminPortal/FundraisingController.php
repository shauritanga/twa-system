<?php

namespace App\Http\Controllers\AdminPortal;

use App\Http\Controllers\Controller;
use App\Models\FundraisingCampaign;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class FundraisingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = FundraisingCampaign::with('creator')
            ->orderBy('created_at', 'desc');

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $campaigns = $query->paginate(15)->withQueryString();

        return Inertia::render('AdminPortal/Fundraising/Index', [
            'campaigns' => $campaigns,
            'filters' => $request->only(['status', 'search']),
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
            'description' => 'required|string',
            'full_description' => 'nullable|string',
            'goal_amount' => 'required|numeric|min:1',
            'status' => 'required|in:draft,active,paused,completed,cancelled',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'video_file' => 'nullable|file|mimes:mp4,avi,mov,wmv,flv,webm|max:51200',
            'video_url' => 'nullable|url|max:500',
            'payment_methods' => 'nullable|array',
            'bank_details' => 'nullable|string',
            'mobile_money_number' => 'nullable|string|max:20',
            'is_featured' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        try {
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

            $campaignData = $validated;
            $campaignData['created_by'] = Auth::id();
            $campaignData['image_path'] = $imagePath;
            $campaignData['video_path'] = $videoPath;
            $campaignData['raised_amount'] = 0;

            unset($campaignData['image_file'], $campaignData['video_file']);

            FundraisingCampaign::create($campaignData);

            return redirect()->route('admin-portal.fundraising.index')
                ->with('success', 'Campaign created successfully.');

        } catch (\Exception $e) {
            \Log::error('Campaign creation failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to create campaign.'])->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(FundraisingCampaign $fundraising): Response
    {
        $fundraising->load('creator');

        return Inertia::render('AdminPortal/Fundraising/Show', [
            'campaign' => $fundraising,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, FundraisingCampaign $fundraising): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'full_description' => 'nullable|string',
            'goal_amount' => 'required|numeric|min:1',
            'raised_amount' => 'required|numeric|min:0',
            'status' => 'required|in:draft,active,paused,completed,cancelled',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'video_file' => 'nullable|file|mimes:mp4,avi,mov,wmv,flv,webm|max:51200',
            'video_url' => 'nullable|url|max:500',
            'payment_methods' => 'nullable|array',
            'bank_details' => 'nullable|string',
            'mobile_money_number' => 'nullable|string|max:20',
            'is_featured' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        try {
            $imagePath = $fundraising->image_path;
            $videoPath = $fundraising->video_path;

            if ($request->hasFile('image_file')) {
                if ($fundraising->image_path && str_starts_with($fundraising->image_path, 'campaigns/')) {
                    Storage::disk('public')->delete($fundraising->image_path);
                }
                $imageFile = $request->file('image_file');
                $imageName = time() . '_' . uniqid() . '.' . $imageFile->getClientOriginalExtension();
                $imagePath = $imageFile->storeAs('campaigns/images', $imageName, 'public');
            }

            if ($request->hasFile('video_file')) {
                if ($fundraising->video_path && str_starts_with($fundraising->video_path, 'campaigns/')) {
                    Storage::disk('public')->delete($fundraising->video_path);
                }
                $videoFile = $request->file('video_file');
                $videoName = time() . '_' . uniqid() . '.' . $videoFile->getClientOriginalExtension();
                $videoPath = $videoFile->storeAs('campaigns/videos', $videoName, 'public');
            }

            $campaignData = $validated;
            $campaignData['image_path'] = $imagePath;
            $campaignData['video_path'] = $videoPath;

            unset($campaignData['image_file'], $campaignData['video_file']);

            $fundraising->update($campaignData);

            return redirect()->route('admin-portal.fundraising.index')
                ->with('success', 'Campaign updated successfully.');

        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to update campaign.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FundraisingCampaign $fundraising): RedirectResponse
    {
        try {
            if ($fundraising->image_path && str_starts_with($fundraising->image_path, 'campaigns/')) {
                Storage::disk('public')->delete($fundraising->image_path);
            }

            if ($fundraising->video_path && str_starts_with($fundraising->video_path, 'campaigns/')) {
                Storage::disk('public')->delete($fundraising->video_path);
            }

            $fundraising->delete();

            return redirect()->route('admin-portal.fundraising.index')
                ->with('success', 'Campaign deleted successfully.');

        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to delete campaign.']);
        }
    }

    /**
     * Get available statuses
     */
    private function getStatuses(): array
    {
        return [
            'draft' => 'Draft',
            'active' => 'Active',
            'paused' => 'Paused',
            'completed' => 'Completed',
            'cancelled' => 'Cancelled',
        ];
    }
}
