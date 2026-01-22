<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContributionAllocation extends Model
{
    use HasFactory;

    protected $fillable = [
        'payment_id',
        'member_id',
        'allocated_amount',
        'contribution_month',
        'allocation_type',
        'notes',
    ];

    protected $casts = [
        'allocated_amount' => 'decimal:2',
    ];

    /**
     * Get the payment this allocation belongs to
     */
    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }

    /**
     * Get the member this allocation is for
     */
    public function member()
    {
        return $this->belongsTo(Member::class);
    }
}
