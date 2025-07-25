<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Traits\Auditable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, SoftDeletes, Auditable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'last_login',
        'avatar',
        'phone',
        'date_of_birth',
        'bio',
        'address',
        'city',
        'region',
        'postal_code',
        'preferences',
        'last_profile_update',
        'otp_secret',
        'otp_enabled',
        'otp_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'date_of_birth' => 'date',
            'preferences' => 'array',
            'last_profile_update' => 'datetime',
            'last_login' => 'datetime',
            'otp_enabled' => 'boolean',
            'otp_verified_at' => 'datetime',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role && $this->role->name === 'admin';
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function hasPermission($permissionName)
    {
        if (!$this->role) {
            return false;
        }
        return $this->role->permissions->contains('name', $permissionName);
    }

    public function member()
    {
        return $this->hasOne(Member::class);
    }

    public function contributions()
    {
        return $this->hasMany(Contribution::class);
    }

    public function activityLogs()
    {
        return $this->hasMany(ActivityLog::class);
    }

    /**
     * Get the user's avatar URL
     */
    public function getAvatarUrlAttribute(): string
    {
        if ($this->avatar) {
            return asset('storage/avatars/' . $this->avatar);
        }

        // Generate initials-based avatar
        $initials = collect(explode(' ', $this->name))
            ->map(fn($name) => strtoupper(substr($name, 0, 1)))
            ->take(2)
            ->implode('');

        return "https://ui-avatars.com/api/?name={$initials}&color=ffffff&background=3b82f6&size=200";
    }

    /**
     * Get user's full address
     */
    public function getFullAddressAttribute(): string
    {
        $parts = array_filter([
            $this->address,
            $this->city,
            $this->region,
            $this->postal_code
        ]);

        return implode(', ', $parts);
    }

    /**
     * Check if profile is complete
     */
    public function getIsProfileCompleteAttribute(): bool
    {
        $requiredFields = ['name', 'email', 'phone'];

        foreach ($requiredFields as $field) {
            if (empty($this->$field)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Get profile completion percentage
     */
    public function getProfileCompletionAttribute(): int
    {
        $fields = ['name', 'email', 'phone', 'date_of_birth', 'bio', 'address', 'avatar'];
        $completed = 0;

        foreach ($fields as $field) {
            if (!empty($this->$field)) {
                $completed++;
            }
        }

        return round(($completed / count($fields)) * 100);
    }

    /**
     * Log user activity
     */
    public function logActivity(string $action, string $description, array $metadata = []): ActivityLog
    {
        return ActivityLog::log($action, $description, $metadata, $this);
    }

    /**
     * Get the OTP codes for the user.
     */
    public function otpCodes()
    {
        return $this->hasMany(OtpCode::class);
    }

    /**
     * Check if the user has OTP enabled.
     */
    public function hasOtpEnabled(): bool
    {
        return $this->otp_enabled;
    }

    /**
     * Enable OTP for the user.
     */
    public function enableOtp(): void
    {
        $this->update([
            'otp_enabled' => true,
            'otp_secret' => \Str::random(32),
        ]);
    }

    /**
     * Disable OTP for the user.
     */
    public function disableOtp(): void
    {
        $this->update([
            'otp_enabled' => false,
            'otp_secret' => null,
            'otp_verified_at' => null,
        ]);

        // Delete all existing OTP codes
        $this->otpCodes()->delete();
    }

    /**
     * Get the latest valid OTP code for the user.
     */
    public function getLatestValidOtpCode()
    {
        return $this->otpCodes()
                    ->valid()
                    ->latest()
                    ->first();
    }

    /**
     * Check if user needs OTP verification.
     */
    public function needsOtpVerification(): bool
    {
        return $this->hasOtpEnabled() &&
               (is_null($this->otp_verified_at) ||
                $this->otp_verified_at->diffInMinutes(now()) > 30);
    }
}
