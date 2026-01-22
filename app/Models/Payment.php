<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'member_id',
        'amount',
        'payment_date',
        'payment_type',
        'purpose',
        'notes',
        'payment_method',
        'reference_number',
    ];

    protected $casts = [
        'payment_date' => 'date',
        'amount' => 'decimal:2',
    ];

    /**
     * Get the member that made this payment
     */
    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    /**
     * Get all allocations for this payment
     */
    public function allocations()
    {
        return $this->hasMany(ContributionAllocation::class);
    }

    /**
     * Get the total allocated amount
     */
    public function getTotalAllocatedAttribute()
    {
        return $this->allocations()->sum('allocated_amount');
    }

    /**
     * Check if payment is fully allocated
     */
    public function isFullyAllocated()
    {
        return $this->total_allocated >= $this->amount;
    }
}
