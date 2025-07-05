<?php

namespace App\Exports;

use App\Models\Member;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class MembersExport implements FromCollection, WithHeadings
{
    public function collection()
    {
        return Member::all();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Name',
            'Email',
            'Phone Number',
            'Address',
            'Date of Birth',
            'Verified',
            'Created At',
            'Updated At',
        ];
    }
}
