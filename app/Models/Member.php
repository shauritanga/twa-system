<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\Auditable;

class Member extends Model
{
    use SoftDeletes, Auditable;
    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        // When a member is soft deleted, also soft delete the associated user
        static::deleted(function (Member $member) {
            if ($member->user_id) {
                $user = User::find($member->user_id);
                if ($user) {
                    // Only soft delete the user if it's a member role or has no role
                    if (!$user->role || $user->role->name === 'member') {
                        $user->delete(); // This will be soft delete if User model uses SoftDeletes
                    }
                }
            }
        });

        // When a member is restored, also restore the associated user
        static::restored(function (Member $member) {
            if ($member->user_id) {
                $user = User::withTrashed()->find($member->user_id);
                if ($user && $user->trashed()) {
                    // Only restore the user if it's a member role or has no role
                    if (!$user->role || $user->role->name === 'member') {
                        $user->restore();
                    }
                }
            }
        });
    }
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
    
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
    
    public function contributionAllocations()
    {
        return $this->hasMany(ContributionAllocation::class);
    }
    
    public function loans()
    {
        return $this->hasMany(Loan::class);
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
