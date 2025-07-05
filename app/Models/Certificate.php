<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    public function member()
    {
        return $this->belongsTo(Member::class);
    }
    public function dependent()
    {
        return $this->belongsTo(Dependent::class);
    }
}
