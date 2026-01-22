<?php

namespace App\Http\Controllers\AdminPortal;

use App\Http\Controllers\Controller;
use App\Models\Asset;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class AssetController extends Controller
{
    public function index(Request $request)
    {
        $query = Asset::with(['creator']);

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('asset_code', 'like', "%{$search}%")
                    ->orWhere('serial_number', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%");
            });
        }

        // Filter by category
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by condition
        if ($request->filled('condition')) {
            $query->where('condition', $request->condition);
        }

        $assets = $query->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        // Calculate current values based on depreciation
        $assets->getCollection()->transform(function ($asset) {
            if (!$asset->current_value && $asset->useful_life_years) {
                $asset->current_value = $asset->calculateDepreciation();
            }
            return $asset;
        });

        return Inertia::render('AdminPortal/Assets/Index', [
            'assets' => $assets,
            'filters' => $request->only(['search', 'category', 'status', 'condition']),
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'category' => 'required|string',
                'purchase_cost' => 'required|numeric|min:0',
                'purchase_date' => 'required|date',
                'current_value' => 'nullable|numeric|min:0',
                'location' => 'nullable|string|max:255',
                'condition' => 'nullable|string',
                'status' => 'nullable|string|in:active,under_maintenance,disposed,sold',
                'useful_life_years' => 'nullable|integer|min:1',
                'depreciation_rate' => 'nullable|numeric|min:0|max:100',
                'supplier' => 'nullable|string|max:255',
                'serial_number' => 'nullable|string|max:255',
                'photo' => 'nullable|file|mimes:jpg,jpeg,png|max:5120',
                'notes' => 'nullable|string',
            ]);

            // Generate unique asset code
            $validated['asset_code'] = $this->generateAssetCode();
            $validated['created_by'] = auth()->id();
            $validated['status'] = $validated['status'] ?? 'active';

            if ($request->hasFile('photo')) {
                $validated['photo_path'] = $request->file('photo')->store('assets', 'public');
            }

            Asset::create($validated);

            return redirect()->back()->with('success', 'Asset created successfully.');
        } catch (\Exception $e) {
            \Log::error('Asset creation failed: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            return redirect()->back()->with('error', 'Failed to create asset: ' . $e->getMessage());
        }
    }

    /**
     * Generate a unique asset code
     */
    private function generateAssetCode()
    {
        do {
            // Generate code in format: AST-YYYYMMDD-XXX
            $code = 'AST-' . date('Ymd') . '-' . str_pad(rand(1, 999), 3, '0', STR_PAD_LEFT);
        } while (Asset::where('asset_code', $code)->exists());

        return $code;
    }

    public function update(Request $request, Asset $asset)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string',
            'purchase_cost' => 'required|numeric|min:0',
            'purchase_date' => 'required|date',
            'current_value' => 'nullable|numeric|min:0',
            'location' => 'nullable|string|max:255',
            'condition' => 'nullable|string',
            'status' => 'nullable|string|in:active,under_maintenance,disposed,sold',
            'useful_life_years' => 'nullable|integer|min:1',
            'depreciation_rate' => 'nullable|numeric|min:0|max:100',
            'supplier' => 'nullable|string|max:255',
            'serial_number' => 'nullable|string|max:255',
            'photo' => 'nullable|file|mimes:jpg,jpeg,png|max:5120',
            'notes' => 'nullable|string',
        ]);

        if ($request->hasFile('photo')) {
            // Delete old photo
            if ($asset->photo_path) {
                Storage::disk('public')->delete($asset->photo_path);
            }
            $validated['photo_path'] = $request->file('photo')->store('assets', 'public');
        }

        $asset->update($validated);

        return redirect()->back()->with('success', 'Asset updated successfully.');
    }

    public function destroy(Asset $asset)
    {
        // Delete photo file
        if ($asset->photo_path) {
            Storage::disk('public')->delete($asset->photo_path);
        }

        $asset->delete();

        return redirect()->back()->with('success', 'Asset deleted successfully.');
    }

    public function updateStatus(Request $request, Asset $asset)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:active,under_maintenance,disposed,sold',
        ]);

        $asset->update($validated);

        return redirect()->back()->with('success', 'Asset status updated successfully.');
    }
}
