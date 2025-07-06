<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    protected $fillable = [
        'name',
        'first_name',
        'middle_name',
        'surname',
        'email',
        'phone_number',
        'address',
        'place_of_birth',
        'sex',
        'date_of_birth',
        'tribe',
        'occupation',
        'reason_for_membership',
        'applicant_date',
        'declaration_name',
        'witness_name',
        'witness_date',
        'user_id',
        'is_verified',
        'image_path',
        'application_form_path',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function contributions()
    {
        return $this->hasMany(Contribution::class);
    }
    public function debts()
    {
        return $this->hasMany(Debt::class);
    }
    public function penalties()
    {
        return $this->hasMany(Penalty::class);
    }
    public function disasterPayments()
    {
        return $this->hasMany(DisasterPayment::class);
    }
    public function dependents()
    {
        return $this->hasMany(Dependent::class);
    }
    // public function certificates()
    // {
    //     return $this->hasMany(Certificate::class);
    // }
}
