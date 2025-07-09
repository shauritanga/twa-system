<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'action',
        'description',
        'metadata',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'metadata' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that owns the activity log.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Create a new activity log entry
     */
    public static function log(string $action, string $description, array $metadata = [], ?User $user = null): self
    {
        $user = $user ?? auth()->user();
        
        return self::create([
            'user_id' => $user?->id,
            'action' => $action,
            'description' => $description,
            'metadata' => $metadata,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    /**
     * Get recent activities for a user
     */
    public static function getRecentActivities(User $user, int $limit = 10)
    {
        return self::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get activity icon based on action
     */
    public function getIconAttribute(): string
    {
        return match($this->action) {
            'profile_updated' => 'user-circle',
            'password_changed' => 'lock-closed',
            'avatar_uploaded' => 'camera',
            'login' => 'login',
            'logout' => 'logout',
            'contribution_made' => 'currency-dollar',
            'member_created' => 'user-plus',
            'backup_created' => 'cloud-arrow-up',
            default => 'information-circle',
        };
    }

    /**
     * Get activity color based on action
     */
    public function getColorAttribute(): string
    {
        return match($this->action) {
            'profile_updated' => 'blue',
            'password_changed' => 'green',
            'avatar_uploaded' => 'purple',
            'login' => 'green',
            'logout' => 'gray',
            'contribution_made' => 'emerald',
            'member_created' => 'indigo',
            'backup_created' => 'orange',
            default => 'gray',
        };
    }
}
