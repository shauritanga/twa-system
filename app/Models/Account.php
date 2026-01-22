<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Account extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'account_code',
        'account_name',
        'account_type',
        'account_subtype',
        'parent_account_id',
        'description',
        'opening_balance',
        'current_balance',
        'normal_balance',
        'is_active',
        'is_system_account',
        'created_by',
    ];

    protected $casts = [
        'opening_balance' => 'decimal:2',
        'current_balance' => 'decimal:2',
        'is_active' => 'boolean',
        'is_system_account' => 'boolean',
    ];

    /**
     * Get the parent account
     */
    public function parentAccount(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'parent_account_id');
    }

    /**
     * Get child accounts
     */
    public function childAccounts(): HasMany
    {
        return $this->hasMany(Account::class, 'parent_account_id');
    }

    /**
     * Get the user who created this account
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Scope to get only active accounts
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get accounts by type
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('account_type', $type);
    }

    /**
     * Get formatted account code with name
     */
    public function getFullNameAttribute()
    {
        return "{$this->account_code} - {$this->account_name}";
    }
}
