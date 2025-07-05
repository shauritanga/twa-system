<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DisasterPayment extends Model
{
    protected $fillable = ['member_id', 'amount', 'date', 'purpose', 'admin_id'];
    public function member()
    {
        return $this->belongsTo(Member::class);
    }
    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
}
