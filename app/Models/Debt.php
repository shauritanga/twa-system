<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Debt extends Model
{
    protected $fillable = ['member_id', 'amount', 'reason', 'due_date', 'status'];
    public function member()
    {
        return $this->belongsTo(Member::class);
    }
}
