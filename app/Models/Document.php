<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class Document extends Model
{
    protected $fillable = [
        'title',
        'description',
        'category',
        'file_name',
        'file_path',
        'file_type',
        'file_size',
        'visibility',
        'status',
        'document_date',
        'tags',
        'download_count',
        'uploaded_by',
        'published_at',
    ];

    protected $casts = [
        'tags' => 'array',
        'document_date' => 'date',
        'published_at' => 'datetime',
        'file_size' => 'integer',
        'download_count' => 'integer',
    ];

    protected $appends = [
        'category_display',
        'visibility_display',
    ];

    /**
     * Get the user who uploaded the document
     */
    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    /**
     * Scope for active documents
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope for published documents
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'active')
                    ->whereNotNull('published_at')
                    ->where('published_at', '<=', now());
    }

    /**
     * Scope for documents visible to members
     */
    public function scopeVisibleToMembers(Builder $query): Builder
    {
        return $query->whereIn('visibility', ['public', 'members_only']);
    }

    /**
     * Scope for documents by category
     */
    public function scopeByCategory(Builder $query, string $category): Builder
    {
        return $query->where('category', $category);
    }

    /**
     * Get formatted file size
     */
    public function getFormattedFileSizeAttribute(): string
    {
        $bytes = $this->file_size;

        if ($bytes >= 1073741824) {
            return number_format($bytes / 1073741824, 2) . ' GB';
        } elseif ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 2) . ' MB';
        } elseif ($bytes >= 1024) {
            return number_format($bytes / 1024, 2) . ' KB';
        } else {
            return $bytes . ' bytes';
        }
    }

    /**
     * Get file extension
     */
    public function getFileExtensionAttribute(): string
    {
        return strtoupper(pathinfo($this->file_name, PATHINFO_EXTENSION));
    }

    /**
     * Check if document is published
     */
    public function isPublished(): bool
    {
        return $this->status === 'active' &&
               $this->published_at !== null &&
               $this->published_at <= now();
    }

    /**
     * Check if document is visible to user
     */
    public function isVisibleTo(User $user): bool
    {
        if (!$this->isPublished()) {
            return false;
        }

        return match($this->visibility) {
            'public' => true,
            'members_only' => $user !== null,
            'admin_only' => $user && $user->role && in_array($user->role->name, ['admin', 'secretary']),
            default => false,
        };
    }

    /**
     * Get download URL
     */
    public function getDownloadUrlAttribute(): string
    {
        return route('documents.download', $this->id);
    }

    /**
     * Get file icon based on file type
     */
    public function getFileIconAttribute(): string
    {
        return match(strtolower($this->file_type)) {
            'pdf' => '📄',
            'doc', 'docx' => '📝',
            'xls', 'xlsx' => '📊',
            'ppt', 'pptx' => '📋',
            'txt' => '📃',
            'jpg', 'jpeg', 'png', 'gif' => '🖼️',
            default => '📁',
        };
    }

    /**
     * Increment download count
     */
    public function incrementDownloadCount(): void
    {
        $this->increment('download_count');
    }

    /**
     * Get category display name
     */
    public function getCategoryDisplayAttribute(): string
    {
        return match($this->category) {
            'meeting_minutes' => 'Meeting Minutes',
            'policies' => 'Policies',
            'procedures' => 'Procedures',
            'financial_reports' => 'Financial Reports',
            'legal_documents' => 'Legal Documents',
            'forms' => 'Forms',
            'announcements' => 'Announcements',
            'other' => 'Other',
            default => ucfirst($this->category),
        };
    }

    /**
     * Get visibility display name
     */
    public function getVisibilityDisplayAttribute(): string
    {
        return match($this->visibility) {
            'public' => 'Public',
            'members_only' => 'Members Only',
            'admin_only' => 'Admin Only',
            default => ucfirst($this->visibility),
        };
    }

    /**
     * Delete document file when model is deleted
     */
    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($document) {
            if (Storage::disk('public')->exists($document->file_path)) {
                Storage::disk('public')->delete($document->file_path);
            }
        });
    }
}
