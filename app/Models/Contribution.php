<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contribution extends Model
{
    protected $fillable = [
        'member_id',
        'amount',
        'date',
        'purpose',
        'type',
        'months_covered',
        'contribution_month',
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'date' => 'date',
        'months_covered' => 'integer',
    ];

    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    // Scopes
    public function scopeMonthly($query)
    {
        return $query->where('type', 'monthly');
    }

    public function scopeOther($query)
    {
        return $query->where('type', 'other');
    }

    public function scopeForMonth($query, $month)
    {
        return $query->where('contribution_month', $month);
    }

    // Helper methods
    public function getTypeDisplayAttribute()
    {
        return ucfirst($this->type);
    }

    public function isMonthly()
    {
        return $this->type === 'monthly';
    }

    public function isOther()
    {
        return $this->type === 'other';
    }
}
