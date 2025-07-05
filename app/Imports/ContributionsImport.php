<?php

namespace App\Imports;

use App\Models\Contribution;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class ContributionsImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        return new Contribution([
            'member_id' => $row['member_id'],
            'amount' => $row['amount'],
            'date' => $row['date'],
            'purpose' => $row['purpose'],
        ]);
    }
}
