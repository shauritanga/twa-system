<?php

namespace App\Http\Controllers;

use App\Exports\ContributionsExport;
use App\Imports\ContributionsImport;
use App\Models\Contribution;
use App\Models\Member;
use App\Models\Penalty;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;

class ContributionController extends Controller
{
    protected PaymentService $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }
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
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Only administrators can add contributions.'
                ], 403);
            }
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

        try {
            // Use the new payment service
            $payment = $this->paymentService->processPayment([
                'member_id' => $request->member_id,
                'amount' => (float)$request->amount,
                'payment_date' => $request->date,
                'payment_type' => $request->type,
                'purpose' => $request->purpose,
                'notes' => $request->notes,
                'contribution_month' => date('Y-m', strtotime($request->date)),
            ]);

            // Support both JSON and redirect responses
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Payment recorded successfully.',
                    'payment' => $payment,
                ]);
            }

            return redirect()->route('admin.financials.index')->with('success', 'Payment recorded successfully.');
        } catch (\Exception $e) {
            \Log::error('Payment processing error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to process payment: ' . $e->getMessage()
                ], 500);
            }

            return redirect()->back()->with('error', 'Failed to process payment: ' . $e->getMessage());
        }
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
