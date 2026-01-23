<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Debt extends Model
{
    protected $fillable = ['member_id', 'amount', 'reason', 'due_date', 'status', 'journal_entry_id'];
    
    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    public function journalEntry()
    {
        return $this->belongsTo(JournalEntry::class);
    }
}
