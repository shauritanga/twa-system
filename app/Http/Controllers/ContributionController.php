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

        // Get ALL members for form dropdowns (not paginated)
        $allMembers = Member::orderBy('name')->get();

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
                // For monthly contributions, use contribution_month field
                // For other contributions, use date field
                if ($contribution->type === 'monthly' && $contribution->contribution_month) {
                    $month = $contribution->contribution_month;
                } else {
                    $month = date('Y-m', strtotime($contribution->date));
                }

                // If multiple contributions exist for the same month, sum them
                if (isset($contributionsByMonth[$member->id][$month])) {
                    $contributionsByMonth[$member->id][$month]->amount += $contribution->amount;
                } else {
                    $contributionsByMonth[$member->id][$month] = $contribution;
                }
            }
        }

        // Note: Penalty calculation is now handled by scheduled job
        // See CalculatePenaltiesJob which runs monthly
        // Manual calculation can be triggered via: php artisan penalties:calculate

        return Inertia::render('Contributions/Index', [
            'members' => $members,
            'allMembers' => $allMembers, // All members for form dropdowns
            'contributionsByMonth' => $contributionsByMonth,
            'filters' => $request->only(['search', 'year', 'month']),
        ]);
    }

    public function store(Request $request)
    {
        // Check if user is admin
        if (!auth()->user() || auth()->user()->role->name !== 'admin') {
            abort(403, 'Only administrators can add contributions.');
        }

        $request->validate([
            'member_id' => 'required|exists:members,id',
            'type' => 'required|in:monthly,other',
            'amount' => 'required|numeric|min:0',
            'date' => 'required|date',
            'purpose' => 'required|string|max:255',
            'notes' => 'nullable|string|max:500',
        ]);

        $monthlyContributionSetting = \App\Models\Setting::where('key', 'monthly_contribution_amount')->first();
        $monthlyAmount = $monthlyContributionSetting ? (float)$monthlyContributionSetting->value : 50000;

        $amount = (float)$request->amount;
        $type = $request->type;
        $contributionMonth = date('Y-m', strtotime($request->date));

        if ($type === 'monthly') {
            // Handle monthly contributions
            $this->handleMonthlyContribution($request, $amount, $monthlyAmount, $contributionMonth);
        } else {
            // Handle other contributions
            $this->handleOtherContribution($request, $amount);
        }

        return redirect()->route('admin.financials.index')->with('success', 'Contribution recorded successfully.');
    }

    private function handleMonthlyContribution($request, $amount, $monthlyAmount, $contributionMonth)
    {
        $memberId = $request->member_id;

        // Check existing contributions for this member in this month
        $existingContributions = Contribution::where('member_id', $memberId)
            ->where('type', 'monthly')
            ->where('contribution_month', $contributionMonth)
            ->sum('amount');

        $totalAmount = $existingContributions + $amount;

        if ($totalAmount <= $monthlyAmount) {
            // Normal monthly contribution or partial payment
            \Log::info("Normal monthly contribution", [
                'member_id' => $memberId,
                'amount' => $amount,
                'existing' => $existingContributions,
                'total' => $totalAmount,
                'monthly_amount' => $monthlyAmount,
                'month' => $contributionMonth
            ]);

            Contribution::create([
                'member_id' => $memberId,
                'amount' => $amount,
                'date' => $request->date,
                'purpose' => $request->purpose,
                'type' => 'monthly',
                'months_covered' => 1,
                'contribution_month' => $contributionMonth,
                'notes' => $request->notes,
            ]);
        } else {
            // Amount exceeds monthly requirement - distribute across months
            \Log::info("Excess contribution - triggering redistribution", [
                'member_id' => $memberId,
                'amount' => $amount,
                'existing' => $existingContributions,
                'total' => $totalAmount,
                'monthly_amount' => $monthlyAmount,
                'month' => $contributionMonth
            ]);

            $this->distributeExcessContribution($request, $amount, $monthlyAmount, $contributionMonth);
        }
    }

    private function distributeExcessContribution($request, $amount, $monthlyAmount, $startMonth)
    {
        $memberId = $request->member_id;
        $remainingAmount = $amount;
        $currentMonth = $startMonth;

        // First, complete the current month if there are existing partial payments
        $existingForCurrentMonth = Contribution::where('member_id', $memberId)
            ->where('type', 'monthly')
            ->where('contribution_month', $currentMonth)
            ->sum('amount');

        if ($existingForCurrentMonth > 0 && $existingForCurrentMonth < $monthlyAmount) {
            // There are partial payments, complete the current month first
            $neededForCurrentMonth = $monthlyAmount - $existingForCurrentMonth;
            $amountForCurrentMonth = min($remainingAmount, $neededForCurrentMonth);

            Contribution::create([
                'member_id' => $memberId,
                'amount' => $amountForCurrentMonth,
                'date' => $request->date,
                'purpose' => $request->purpose . ' (Completing ' . date('F Y', strtotime($currentMonth)) . ')',
                'type' => 'monthly',
                'months_covered' => 1,
                'contribution_month' => $currentMonth,
                'notes' => $request->notes . ' - Completing partial payment for ' . date('F Y', strtotime($currentMonth)),
            ]);

            $remainingAmount -= $amountForCurrentMonth;
            $currentMonth = date('Y-m', strtotime($currentMonth . ' +1 month'));
        } elseif ($existingForCurrentMonth == 0) {
            // No existing contributions for current month, fill it first
            $amountForCurrentMonth = min($remainingAmount, $monthlyAmount);

            Contribution::create([
                'member_id' => $memberId,
                'amount' => $amountForCurrentMonth,
                'date' => $request->date,
                'purpose' => $request->purpose . ' (' . date('F Y', strtotime($currentMonth)) . ')',
                'type' => 'monthly',
                'months_covered' => 1,
                'contribution_month' => $currentMonth,
                'notes' => $request->notes,
            ]);

            $remainingAmount -= $amountForCurrentMonth;
            $currentMonth = date('Y-m', strtotime($currentMonth . ' +1 month'));
        } else {
            // Current month is already complete, move to next month
            $currentMonth = date('Y-m', strtotime($currentMonth . ' +1 month'));
        }

        // Distribute remaining amount across future months
        while ($remainingAmount >= $monthlyAmount) {
            // Check if this month already has contributions
            $existingForMonth = Contribution::where('member_id', $memberId)
                ->where('type', 'monthly')
                ->where('contribution_month', $currentMonth)
                ->sum('amount');

            if ($existingForMonth == 0) {
                Contribution::create([
                    'member_id' => $memberId,
                    'amount' => $monthlyAmount,
                    'date' => $request->date,
                    'purpose' => $request->purpose . ' (Advance for ' . date('F Y', strtotime($currentMonth)) . ')',
                    'type' => 'monthly',
                    'months_covered' => 1,
                    'contribution_month' => $currentMonth,
                    'notes' => $request->notes . ' - Advance payment for ' . date('F Y', strtotime($currentMonth)),
                ]);

                $remainingAmount -= $monthlyAmount;
            }

            $currentMonth = date('Y-m', strtotime($currentMonth . ' +1 month'));
        }

        // Handle any remaining partial amount
        if ($remainingAmount > 0) {
            // Check if the next month already has partial contributions
            $existingForNextMonth = Contribution::where('member_id', $memberId)
                ->where('type', 'monthly')
                ->where('contribution_month', $currentMonth)
                ->sum('amount');

            if ($existingForNextMonth == 0) {
                Contribution::create([
                    'member_id' => $memberId,
                    'amount' => $remainingAmount,
                    'date' => $request->date,
                    'purpose' => $request->purpose . ' (Partial for ' . date('F Y', strtotime($currentMonth)) . ')',
                    'type' => 'monthly',
                    'months_covered' => 1,
                    'contribution_month' => $currentMonth,
                    'notes' => $request->notes . ' - Partial advance payment for ' . date('F Y', strtotime($currentMonth)),
                ]);
            }
        }
    }

    private function handleOtherContribution($request, $amount)
    {
        Contribution::create([
            'member_id' => $request->member_id,
            'amount' => $amount,
            'date' => $request->date,
            'purpose' => $request->purpose,
            'type' => 'other',
            'months_covered' => 0, // Not applicable for other contributions
            'contribution_month' => null, // Not applicable for other contributions
            'notes' => $request->notes,
        ]);
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

        return redirect()->route('admin.financials.index')->with('success', 'Contributions imported successfully.');
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
