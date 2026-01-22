<?php

namespace App\Exports;

use App\Models\Member;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

class MembersExport implements FromCollection, WithHeadings, WithColumnFormatting
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

    public function columnFormats(): array
    {
        return [
            'D' => NumberFormat::FORMAT_TEXT, // Phone Number column as text
        ];
    }
}
