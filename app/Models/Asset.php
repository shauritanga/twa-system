<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Asset extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'category',
        'asset_code',
        'purchase_cost',
        'purchase_date',
        'current_value',
        'location',
        'condition',
        'status',
        'useful_life_years',
        'depreciation_rate',
        'supplier',
        'serial_number',
        'photo_path',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'purchase_date' => 'date',
        'purchase_cost' => 'decimal:2',
        'current_value' => 'decimal:2',
        'depreciation_rate' => 'decimal:2',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function calculateDepreciation()
    {
        if (!$this->useful_life_years || !$this->purchase_cost) {
            return null;
        }

        $yearsSincePurchase = now()->diffInYears($this->purchase_date);
        $annualDepreciation = $this->purchase_cost / $this->useful_life_years;
        $totalDepreciation = min($annualDepreciation * $yearsSincePurchase, $this->purchase_cost);
        
        return $this->purchase_cost - $totalDepreciation;
    }
}
