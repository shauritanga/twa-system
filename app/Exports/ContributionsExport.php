<?php

namespace App\Exports;

use App\Models\Contribution;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ContributionsExport implements FromCollection, WithHeadings
{
    protected $filters;

    public function __construct(array $filters)
    {
        $this->filters = $filters;
    }

    public function collection()
    {
        $query = Contribution::with('member');

        if (!empty($this->filters['search'])) {
            $query->whereHas('member', function ($q) {
                $q->where('name', 'like', '%' . $this->filters['search'] . '%');
            });
        }

        if (!empty($this->filters['year'])) {
            $query->whereYear('date', $this->filters['year']);
        }

        if (!empty($this->filters['month'])) {
            $query->whereMonth('date', $this->filters['month']);
        }

        return $query->get()->map(function ($contribution) {
            return [
                'id' => $contribution->id,
                'member' => $contribution->member->name,
                'amount' => $contribution->amount,
                'date' => $contribution->date,
                'purpose' => $contribution->purpose,
            ];
        });
    }

    public function headings(): array
    {
        return [
            'ID',
            'Member',
            'Amount',
            'Date',
            'Purpose',
        ];
    }
}
