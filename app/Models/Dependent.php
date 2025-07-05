<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Dependent extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'member_id',
        'name',
        'relationship',
        'date_of_birth',
        'tribe',
        'residence',
        'status',
        'image_path',
        'rejection_reason',
    ];

    protected $dates = ['deleted_at'];

    public function member()
    {
        return $this->belongsTo(Member::class);
    }
    // public function certificates()
    // {
    //     return $this->hasMany(Certificate::class);
    // }
}
