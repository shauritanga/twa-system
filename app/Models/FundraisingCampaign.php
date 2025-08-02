<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\Auditable;
use Carbon\Carbon;

class FundraisingCampaign extends Model
{
    use Auditable;

    protected $fillable = [
        'title',
        'description',
        'full_description',
        'goal_amount',
        'raised_amount',
        'status',
        'start_date',
        'end_date',
        'image_path',
        'video_path',
        'video_url',
        'payment_methods',
        'bank_details',
        'mobile_money_number',
        'is_featured',
        'sort_order',
        'created_by',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'goal_amount' => 'decimal:2',
        'raised_amount' => 'decimal:2',
        'payment_methods' => 'array',
        'is_featured' => 'boolean',
    ];

    /**
     * Get the user who created the campaign
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Scope for active campaigns
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active')
                    ->where('start_date', '<=', now()->toDateString())
                    ->where(function ($q) {
                        $q->whereNull('end_date')
                          ->orWhere('end_date', '>=', now()->toDateString());
                    });
    }

    /**
     * Scope for featured campaigns
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope for ordering campaigns
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('is_featured', 'desc')
                    ->orderBy('sort_order', 'asc')
                    ->orderBy('start_date', 'desc');
    }

    /**
     * Get the progress percentage
     */
    public function getProgressPercentageAttribute(): float
    {
        if ($this->goal_amount <= 0) {
            return 0;
        }

        return min(100, ($this->raised_amount / $this->goal_amount) * 100);
    }

    /**
     * Get the remaining amount needed
     */
    public function getRemainingAmountAttribute(): float
    {
        return max(0, $this->goal_amount - $this->raised_amount);
    }

    /**
     * Check if campaign is expired
     */
    public function getIsExpiredAttribute(): bool
    {
        return $this->end_date && $this->end_date->isPast();
    }

    /**
     * Check if campaign is completed (goal reached)
     */
    public function getIsCompletedAttribute(): bool
    {
        return $this->raised_amount >= $this->goal_amount;
    }

    /**
     * Get the image URL
     */
    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image_path) {
            return null;
        }

        // If it's a storage path (uploaded file), use storage URL
        if (str_starts_with($this->image_path, 'campaigns/')) {
            return asset('storage/' . $this->image_path);
        }

        // Otherwise, treat as regular asset path
        return asset($this->image_path);
    }

    /**
     * Get the video URL for uploaded videos
     */
    public function getVideoUrlFullAttribute(): ?string
    {
        if ($this->video_path) {
            // If it's a storage path (uploaded file), use storage URL
            if (str_starts_with($this->video_path, 'campaigns/')) {
                return asset('storage/' . $this->video_path);
            }
            // Otherwise, treat as regular asset path
            return asset($this->video_path);
        }

        // Fall back to video_url (for YouTube/Vimeo links)
        return $this->video_url;
    }

    /**
     * Get days remaining
     */
    public function getDaysRemainingAttribute(): ?int
    {
        if (!$this->end_date) {
            return null;
        }

        return max(0, now()->diffInDays($this->end_date, false));
    }

    /**
     * Get formatted goal amount
     */
    public function getFormattedGoalAmountAttribute(): string
    {
        return 'TZS ' . number_format($this->goal_amount, 0);
    }

    /**
     * Get formatted raised amount
     */
    public function getFormattedRaisedAmountAttribute(): string
    {
        return 'TZS ' . number_format($this->raised_amount, 0);
    }

    /**
     * Get formatted remaining amount
     */
    public function getFormattedRemainingAmountAttribute(): string
    {
        return 'TZS ' . number_format($this->remaining_amount, 0);
    }

    /**
     * Check if campaign accepts donations
     */
    public function acceptsDonations(): bool
    {
        return $this->status === 'active' &&
               !$this->is_expired &&
               !$this->is_completed;
    }
}
