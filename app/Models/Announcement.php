<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\Auditable;

class Announcement extends Model
{
    use Auditable;

    protected $fillable = [
        'title',
        'content',
        'type',
        'status',
        'link_url',
        'link_text',
        'image_path',
        'video_path',
        'video_url',
        'media_type',
        'image_alt_text',
        'announcement_date',
        'expires_at',
        'is_featured',
        'sort_order',
        'created_by',
    ];

    protected $casts = [
        'announcement_date' => 'date',
        'expires_at' => 'date',
        'is_featured' => 'boolean',
    ];

    /**
     * Get the user who created the announcement
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Scope for active announcements
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active')
                    ->where(function ($q) {
                        $q->whereNull('expires_at')
                          ->orWhere('expires_at', '>=', now()->toDateString());
                    });
    }

    /**
     * Scope for featured announcements
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope for ordering by date and sort order
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('is_featured', 'desc')
                    ->orderBy('announcement_date', 'desc')
                    ->orderBy('sort_order', 'asc');
    }

    /**
     * Get the type badge color
     */
    public function getTypeBadgeColorAttribute(): string
    {
        return match($this->type) {
            'important' => 'bg-red-100 text-red-800',
            'event' => 'bg-green-100 text-green-800',
            'update' => 'bg-blue-100 text-blue-800',
            'general' => 'bg-gray-100 text-gray-800',
            default => 'bg-gray-100 text-gray-800',
        };
    }

    /**
     * Get the type icon
     */
    public function getTypeIconAttribute(): string
    {
        return match($this->type) {
            'important' => '<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>',
            'event' => '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>',
            'update' => '<path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>',
            'general' => '<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>',
            default => '<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>',
        };
    }

    /**
     * Check if announcement is expired
     */
    public function getIsExpiredAttribute(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    /**
     * Get the full image URL
     */
    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image_path) {
            return null;
        }

        // If it's a storage path (uploaded file), use storage URL
        if (str_starts_with($this->image_path, 'announcements/')) {
            return asset('storage/' . $this->image_path);
        }

        // Otherwise, treat as regular asset path
        return asset($this->image_path);
    }

    /**
     * Get the full video URL
     */
    public function getVideoUrlFullAttribute(): ?string
    {
        if ($this->media_type === 'video_url') {
            return $this->video_url;
        }

        if (!$this->video_path) {
            return null;
        }

        // If it's a storage path (uploaded file), use storage URL
        if (str_starts_with($this->video_path, 'announcements/')) {
            return asset('storage/' . $this->video_path);
        }

        // Otherwise, treat as regular asset path
        return asset($this->video_path);
    }

    /**
     * Check if announcement has media
     */
    public function hasMedia(): bool
    {
        return $this->media_type !== 'none' && (
            ($this->media_type === 'image' && $this->image_path) ||
            ($this->media_type === 'video' && $this->video_path) ||
            ($this->media_type === 'video_url' && $this->video_url)
        );
    }

    /**
     * Get YouTube video ID from URL
     */
    public function getYoutubeVideoIdAttribute(): ?string
    {
        if ($this->media_type !== 'video_url' || !$this->video_url) {
            return null;
        }

        preg_match('/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/', $this->video_url, $matches);

        return $matches[1] ?? null;
    }

    /**
     * Check if video URL is YouTube
     */
    public function isYoutubeVideo(): bool
    {
        return $this->media_type === 'video_url' &&
               $this->video_url &&
               (str_contains($this->video_url, 'youtube.com') || str_contains($this->video_url, 'youtu.be'));
    }
}
