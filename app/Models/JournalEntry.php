<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JournalEntry extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'entry_number',
        'entry_date',
        'reference',
        'description',
        'status',
        'total_debit',
        'total_credit',
        'created_by',
        'posted_by',
        'posted_at',
        'reversed_by',
        'reversed_at',
        'reversal_reason',
    ];

    protected $casts = [
        'entry_date' => 'date',
        'total_debit' => 'decimal:2',
        'total_credit' => 'decimal:2',
        'posted_at' => 'datetime',
        'reversed_at' => 'datetime',
    ];

    /**
     * Get the journal entry lines
     */
    public function lines(): HasMany
    {
        return $this->hasMany(JournalEntryLine::class)->orderBy('line_order');
    }

    /**
     * Get the user who created this entry
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user who posted this entry
     */
    public function poster(): BelongsTo
    {
        return $this->belongsTo(User::class, 'posted_by');
    }

    /**
     * Get the user who reversed this entry
     */
    public function reverser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reversed_by');
    }

    /**
     * Check if entry is balanced
     */
    public function isBalanced(): bool
    {
        return abs($this->total_debit - $this->total_credit) < 0.01;
    }

    /**
     * Check if entry can be edited
     */
    public function canEdit(): bool
    {
        return $this->status === 'draft';
    }

    /**
     * Check if entry can be posted
     */
    public function canPost(): bool
    {
        return $this->status === 'draft' && $this->isBalanced() && $this->lines()->count() >= 2;
    }

    /**
     * Check if entry can be reversed
     */
    public function canReverse(): bool
    {
        return $this->status === 'posted';
    }
}
