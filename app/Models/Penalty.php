<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Penalty extends Model
{
    protected $fillable = [
        'member_id',
        'amount',
        'reason',
        'due_date',
        'status',
        'penalty_month',
        'contribution_amount',
        'penalty_rate',
        'calculated_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'contribution_amount' => 'decimal:2',
        'penalty_rate' => 'decimal:2',
        'due_date' => 'date',
        'calculated_at' => 'datetime',
    ];

    // Relationships
    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    // Scopes for better querying
    public function scopeUnpaid(Builder $query): Builder
    {
        return $query->where('status', 'unpaid');
    }

    public function scopePaid(Builder $query): Builder
    {
        return $query->where('status', 'paid');
    }

    public function scopeForMonth(Builder $query, string $month): Builder
    {
        return $query->where('penalty_month', $month);
    }

    public function scopeForMember(Builder $query, int $memberId): Builder
    {
        return $query->where('member_id', $memberId);
    }

    public function scopeOverdue(Builder $query): Builder
    {
        return $query->where('due_date', '<', now())->where('status', 'unpaid');
    }

    // Static methods for penalty calculation
    public static function calculatePenaltyAmount(float $contributionAmount, float $penaltyRate): float
    {
        return round(($contributionAmount * $penaltyRate) / 100, 2);
    }

    public static function generateReason(string $month): string
    {
        return "Missed contribution for {$month}";
    }

    // Helper methods
    public function isOverdue(): bool
    {
        return $this->due_date < now() && $this->status === 'unpaid';
    }

    public function markAsPaid(): bool
    {
        return $this->update(['status' => 'paid']);
    }

    public function getFormattedAmountAttribute(): string
    {
        return number_format($this->amount, 0) . ' TZS';
    }

    public function getMonthNameAttribute(): string
    {
        if (!$this->penalty_month) return 'Unknown';

        $date = \DateTime::createFromFormat('Y-m', $this->penalty_month);
        return $date ? $date->format('F Y') : 'Unknown';
    }
}
