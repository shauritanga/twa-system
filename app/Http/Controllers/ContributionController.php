<?php

namespace App\Http\Controllers;

use App\Exports\ContributionsExport;
use App\Imports\ContributionsImport;
use App\Models\Contribution;
use App\Models\Member;
use App\Models\Penalty;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;

class ContributionController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = Member::query();

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->input('search') . '%');
        }

        $members = $query->paginate(10);

        $contributionsByMonth = [];
        foreach ($members as $member) {
            $contributionsByMonth[$member->id] = [];
            $query = $member->contributions();

            if ($request->has('year')) {
                $query->whereYear('date', $request->input('year'));
            }

            if ($request->has('month')) {
                $query->whereMonth('date', $request->input('month'));
            }

            foreach ($query->get() as $contribution) {
                $month = date('Y-m', strtotime($contribution->date));
                $contributionsByMonth[$member->id][$month] = $contribution;
            }
        }

        // Check for missed contributions and apply penalties
        $today = now();
        foreach ($members as $member) {
            $registrationMonth = date('Y-m', strtotime($member->created_at));
            $start = new \DateTime($registrationMonth);
            $end = new \DateTime($today->format('Y-m'));
            $interval = new \DateInterval('P1M');
            $period = new \DatePeriod($start, $interval, $end);

            foreach ($period as $dt) {
                $month = $dt->format('Y-m');
                if (!isset($contributionsByMonth[$member->id][$month])) {
                    // Check if a penalty for this month has already been applied
                    $existingPenalty = Penalty::where('member_id', $member->id)
                        ->where('reason', 'Missed contribution for ' . $month)
                        ->exists();

                    if (!$existingPenalty) {
                        $monthlyContributionSetting = \App\Models\Setting::where('key', 'monthly_contribution_amount')->first();
                        $penaltyRateSetting = \App\Models\Setting::where('key', 'penalty_percentage_rate')->first();
                        $contributionAmount = $monthlyContributionSetting ? $monthlyContributionSetting->value : 50000;
                        $penaltyRate = $penaltyRateSetting ? $penaltyRateSetting->value : 10;
                        $penaltyAmount = ($contributionAmount * $penaltyRate) / 100;

                        Penalty::create([
                            'member_id' => $member->id,
                            'amount' => $penaltyAmount,
                            'reason' => 'Missed contribution for ' . $month,
                            'due_date' => $today->format('Y-m-d'),
                        ]);
                    }
                }
            }
        }

        return Inertia::render('Contributions/Index', [
            'members' => $members,
            'contributionsByMonth' => $contributionsByMonth,
            'filters' => $request->only(['search', 'year', 'month']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'member_id' => 'required|exists:members,id',
            'date' => 'required|date',
            'purpose' => 'required|string|max:255',
        ]);

        $monthlyContributionSetting = \App\Models\Setting::where('key', 'monthly_contribution_amount')->first();
        $contributionAmount = $monthlyContributionSetting ? $monthlyContributionSetting->value : 50000;

        Contribution::create([
            'member_id' => $request->member_id,
            'amount' => $contributionAmount,
            'date' => $request->date,
            'purpose' => $request->purpose,
        ]);

        return redirect()->route('admin.financials.index');
    }

    public function export(Request $request)
    {
        $format = $request->query('format', 'xlsx');

        if ($format === 'pdf') {
            $query = Contribution::with('member');

            if ($request->has('search')) {
                $query->whereHas('member', function ($q) use ($request) {
                    $q->where('name', 'like', '%' . $request->input('search') . '%');
                });
            }
    
            if ($request->has('year')) {
                $query->whereYear('date', $request->input('year'));
            }
    
            if ($request->has('month')) {
                $query->whereMonth('date', $request->input('month'));
            }
    
            $contributions = $query->get();
            $pdf = PDF::loadView('exports.contributions', compact('contributions'));
            return $pdf->download('contributions.pdf');
        }

        if ($format === 'csv') {
            return Excel::download(new ContributionsExport($request->all()), 'contributions.csv', \Maatwebsite\Excel\Excel::CSV);
        }

        return Excel::download(new ContributionsExport($request->all()), 'contributions.xlsx');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:csv,txt',
        ]);

        $file = $request->file('file');
        $path = $file->getRealPath();
        $data = array_map('str_getcsv', file($path));
        $header = array_shift($data);

        $rules = [
            'member_id' => 'required|exists:members,id',
            'amount' => 'required|numeric',
            'date' => 'required|date',
            'purpose' => 'required|string|max:255',
        ];

        foreach ($data as $row) {
            $row_data = array_combine($header, $row);
            $validator = validator($row_data, $rules);

            if ($validator->fails()) {
                return redirect()->back()->withErrors($validator)->withInput();
            }
        }

        Excel::import(new ContributionsImport, $file);

        return redirect()->route('contributions.index')->with('success', 'Contributions imported successfully.');
    }

    public function downloadTemplate()
    {
        $headers = [
            'Content-type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename=contributions_template.csv',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0'
        ];

        $columns = ['member_id', 'name', 'amount', 'date', 'purpose'];
        $members = Member::all();

        $callback = function() use ($columns, $members) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($members as $member) {
                fputcsv($file, [
                    'member_id' => $member->id,
                    'name' => $member->name,
                    'amount' => '',
                    'date' => '',
                    'purpose' => ''
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function validateImport(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:csv,txt',
        ]);

        $file = $request->file('file');
        $path = $file->getRealPath();
        $data = array_map('str_getcsv', file($path));
        $header = array_shift($data);

        $rules = [
            'member_id' => 'required|exists:members,id',
            'amount' => 'required|numeric',
            'date' => 'required|date',
            'purpose' => 'required|string|max:255',
        ];

        $validRows = [];
        $errors = [];

        foreach ($data as $i => $row) {
            if (count($header) !== count($row)) {
                $errors[] = "Row " . ($i + 2) . ": Number of columns does not match header.";
                continue;
            }
            $row_data = array_combine($header, $row);
            $validator = validator($row_data, $rules);

            if ($validator->fails()) {
                $errors[] = "Row " . ($i + 2) . ": " . $validator->errors()->first();
            } else {
                $validRows[] = $row_data;
            }
        }

        return response()->json([
            'errors' => $errors,
            'valid_rows_preview' => array_slice($validRows, 0, 5),
            'valid_rows_count' => count($validRows),
        ]);
    }
}
