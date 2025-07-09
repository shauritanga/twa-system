<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Get role-aware redirect URL
     */
    private function getRoleAwareRedirectUrl()
    {
        $user = auth()->user();
        if ($user->role && in_array($user->role->name, ['admin', 'secretary'])) {
            return route('admin.dashboard');
        }
        return route('member.dashboard');
    }

    /**
     * Get role-specific profile route
     */
    private function getRoleSpecificProfileRoute(string $route)
    {
        $user = auth()->user();
        if ($user->role && in_array($user->role->name, ['admin', 'secretary'])) {
            return route('admin.profile.' . $route);
        }
        return route('member.profile.' . $route);
    }

    /**
     * Display the user's profile.
     */
    public function show(): Response
    {
        $user = auth()->user();
        $recentActivities = ActivityLog::getRecentActivities($user, 10);

        return Inertia::render('Profile/Show', [
            'user' => $user->load('role'),
            'recentActivities' => $recentActivities,
            'profileCompletion' => $user->profile_completion,
            'isProfileComplete' => $user->is_profile_complete,
        ]);
    }

    /**
     * Show the form for editing the user's profile.
     */
    public function edit(): Response
    {
        return Inertia::render('Profile/Edit', [
            'user' => auth()->user()->load('role'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'phone' => ['nullable', 'string', 'max:20'],
            'date_of_birth' => ['nullable', 'date', 'before:today'],
            'bio' => ['nullable', 'string', 'max:500'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
            'region' => ['nullable', 'string', 'max:100'],
            'postal_code' => ['nullable', 'string', 'max:20'],
        ]);

        $validated['last_profile_update'] = now();

        $user->update($validated);

        // Log the activity
        $user->logActivity('profile_updated', 'Profile information updated');

        return redirect($this->getRoleSpecificProfileRoute('show'))->with('success', 'Profile updated successfully.');
    }

    /**
     * Update the user's password.
     */
    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $user = auth()->user();
        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        // Log the activity
        $user->logActivity('password_changed', 'Password changed successfully');

        return redirect($this->getRoleSpecificProfileRoute('security'))->with('success', 'Password updated successfully.');
    }

    /**
     * Upload user avatar.
     */
    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => ['required', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
        ]);

        $user = auth()->user();

        // Delete old avatar if exists
        if ($user->avatar) {
            Storage::disk('public')->delete('avatars/' . $user->avatar);
        }

        // Store new avatar
        $file = $request->file('avatar');
        $filename = time() . '_' . $user->id . '.' . $file->getClientOriginalExtension();
        $file->storeAs('avatars', $filename, 'public');

        $user->update([
            'avatar' => $filename,
            'last_profile_update' => now(),
        ]);

        // Log the activity
        $user->logActivity('avatar_uploaded', 'Profile photo updated');

        return redirect($this->getRoleSpecificProfileRoute('edit'))->with('success', 'Profile photo updated successfully.');
    }

    /**
     * Remove user avatar.
     */
    public function removeAvatar()
    {
        $user = auth()->user();

        if ($user->avatar) {
            Storage::disk('public')->delete('avatars/' . $user->avatar);
            $user->update(['avatar' => null]);

            // Log the activity
            $user->logActivity('avatar_removed', 'Profile photo removed');
        }

        return redirect($this->getRoleSpecificProfileRoute('edit'))->with('success', 'Profile photo removed successfully.');
    }

    /**
     * Update user preferences.
     */
    public function updatePreferences(Request $request)
    {
        $validated = $request->validate([
            'theme' => ['nullable', 'string', 'in:light,dark,auto'],
            'notifications' => ['nullable', 'array'],
            'notifications.email' => ['boolean'],
            'notifications.sms' => ['boolean'],
            'notifications.push' => ['boolean'],
            'language' => ['nullable', 'string', 'max:5'],
            'timezone' => ['nullable', 'string', 'max:50'],
        ]);

        $user = auth()->user();
        $currentPreferences = $user->preferences ?? [];
        $newPreferences = array_merge($currentPreferences, $validated);

        $user->update([
            'preferences' => $newPreferences,
            'last_profile_update' => now(),
        ]);

        // Log the activity
        $user->logActivity('preferences_updated', 'Account preferences updated');

        return redirect($this->getRoleSpecificProfileRoute('settings'))->with('success', 'Preferences updated successfully.');
    }

    /**
     * Get user's activity timeline.
     */
    public function activities()
    {
        $user = auth()->user();
        $activities = ActivityLog::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Profile/Activities', [
            'activities' => $activities,
            'auth' => [
                'user' => $user->load('role')
            ],
        ]);
    }

    /**
     * Show security settings.
     */
    public function security(): Response
    {
        $user = auth()->user();
        $recentLogins = ActivityLog::where('user_id', $user->id)
            ->where('action', 'login')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return Inertia::render('Profile/Security', [
            'user' => $user->load('role'),
            'recentLogins' => $recentLogins,
        ]);
    }

    /**
     * Show account settings.
     */
    public function settings(): Response
    {
        return Inertia::render('Profile/Settings', [
            'user' => auth()->user()->load('role'),
        ]);
    }
}
