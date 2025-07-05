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
    ];

    public function member()
    {
        return $this->belongsTo(Member::class);
    }
}
