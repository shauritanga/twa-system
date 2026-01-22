<?php

namespace App\Http\Controllers\AdminPortal;

use App\Http\Controllers\Controller;
use App\Models\JournalEntry;
use App\Models\JournalEntryLine;
use App\Models\Account;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class JournalEntryController extends Controller
{
    public function index(Request $request)
    {
        $query = JournalEntry::with(['creator', 'lines.account']);

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('entry_number', 'like', "%{$search}%")
                    ->orWhere('reference', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('entry_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('entry_date', '<=', $request->date_to);
        }

        $entries = $query->orderBy('entry_date', 'desc')
            ->orderBy('entry_number', 'desc')
            ->paginate(15)
            ->withQueryString();

        // Get active accounts for dropdown
        $accounts = Account::active()
            ->orderBy('account_code')
            ->get(['id', 'account_code', 'account_name', 'account_type', 'normal_balance']);

        return Inertia::render('AdminPortal/JournalEntries', [
            'entries' => $entries,
            'accounts' => $accounts,
            'filters' => $request->only(['search', 'status', 'date_from', 'date_to']),
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'entry_date' => 'required|date',
                'reference' => 'nullable|string|max:255',
                'description' => 'required|string',
                'lines' => 'required|array|min:2',
                'lines.*.account_id' => 'required|exists:accounts,id',
                'lines.*.description' => 'nullable|string',
                'lines.*.debit' => 'required|numeric|min:0',
                'lines.*.credit' => 'required|numeric|min:0',
            ]);

            DB::beginTransaction();

            // Generate entry number
            $entryNumber = $this->generateEntryNumber();

            // Calculate totals
            $totalDebit = collect($validated['lines'])->sum('debit');
            $totalCredit = collect($validated['lines'])->sum('credit');

            // Create journal entry
            $entry = JournalEntry::create([
                'entry_number' => $entryNumber,
                'entry_date' => $validated['entry_date'],
                'reference' => $validated['reference'],
                'description' => $validated['description'],
                'status' => 'draft',
                'total_debit' => $totalDebit,
                'total_credit' => $totalCredit,
                'created_by' => auth()->id(),
            ]);

            // Create journal entry lines
            foreach ($validated['lines'] as $index => $line) {
                JournalEntryLine::create([
                    'journal_entry_id' => $entry->id,
                    'account_id' => $line['account_id'],
                    'description' => $line['description'],
                    'debit' => $line['debit'],
                    'credit' => $line['credit'],
                    'line_order' => $index,
                ]);
            }

            DB::commit();

            return redirect()->back()->with('success', 'Journal entry created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Journal entry creation failed: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to create journal entry: ' . $e->getMessage());
        }
    }

    public function update(Request $request, JournalEntry $journalEntry)
    {
        if (!$journalEntry->canEdit()) {
            return redirect()->back()->with('error', 'Only draft entries can be edited.');
        }

        try {
            $validated = $request->validate([
                'entry_date' => 'required|date',
                'reference' => 'nullable|string|max:255',
                'description' => 'required|string',
                'lines' => 'required|array|min:2',
                'lines.*.account_id' => 'required|exists:accounts,id',
                'lines.*.description' => 'nullable|string',
                'lines.*.debit' => 'required|numeric|min:0',
                'lines.*.credit' => 'required|numeric|min:0',
            ]);

            DB::beginTransaction();

            // Calculate totals
            $totalDebit = collect($validated['lines'])->sum('debit');
            $totalCredit = collect($validated['lines'])->sum('credit');

            // Update journal entry
            $journalEntry->update([
                'entry_date' => $validated['entry_date'],
                'reference' => $validated['reference'],
                'description' => $validated['description'],
                'total_debit' => $totalDebit,
                'total_credit' => $totalCredit,
            ]);

            // Delete old lines and create new ones
            $journalEntry->lines()->delete();

            foreach ($validated['lines'] as $index => $line) {
                JournalEntryLine::create([
                    'journal_entry_id' => $journalEntry->id,
                    'account_id' => $line['account_id'],
                    'description' => $line['description'],
                    'debit' => $line['debit'],
                    'credit' => $line['credit'],
                    'line_order' => $index,
                ]);
            }

            DB::commit();

            return redirect()->back()->with('success', 'Journal entry updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Journal entry update failed: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to update journal entry: ' . $e->getMessage());
        }
    }

    public function destroy(JournalEntry $journalEntry)
    {
        if (!$journalEntry->canEdit()) {
            return redirect()->back()->with('error', 'Only draft entries can be deleted.');
        }

        $journalEntry->delete();

        return redirect()->back()->with('success', 'Journal entry deleted successfully.');
    }

    public function post(JournalEntry $journalEntry)
    {
        if (!$journalEntry->canPost()) {
            return redirect()->back()->with('error', 'Entry cannot be posted. Ensure it is balanced and has at least 2 lines.');
        }

        try {
            DB::beginTransaction();

            // Update entry status
            $journalEntry->update([
                'status' => 'posted',
                'posted_by' => auth()->id(),
                'posted_at' => now(),
            ]);

            // Update account balances
            foreach ($journalEntry->lines as $line) {
                $account = $line->account;
                if ($line->debit > 0) {
                    $account->increment('current_balance', $line->debit);
                } else {
                    $account->decrement('current_balance', $line->credit);
                }
            }

            DB::commit();

            return redirect()->back()->with('success', 'Journal entry posted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Journal entry posting failed: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to post journal entry: ' . $e->getMessage());
        }
    }

    public function reverse(Request $request, JournalEntry $journalEntry)
    {
        if (!$journalEntry->canReverse()) {
            return redirect()->back()->with('error', 'Only posted entries can be reversed.');
        }

        $validated = $request->validate([
            'reversal_reason' => 'required|string',
        ]);

        try {
            DB::beginTransaction();

            // Update entry status
            $journalEntry->update([
                'status' => 'reversed',
                'reversed_by' => auth()->id(),
                'reversed_at' => now(),
                'reversal_reason' => $validated['reversal_reason'],
            ]);

            // Reverse account balances
            foreach ($journalEntry->lines as $line) {
                $account = $line->account;
                if ($line->debit > 0) {
                    $account->decrement('current_balance', $line->debit);
                } else {
                    $account->increment('current_balance', $line->credit);
                }
            }

            DB::commit();

            return redirect()->back()->with('success', 'Journal entry reversed successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Journal entry reversal failed: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to reverse journal entry: ' . $e->getMessage());
        }
    }

    /**
     * Generate unique entry number
     */
    private function generateEntryNumber()
    {
        do {
            // Generate code in format: JE-YYYYMMDD-XXX
            $code = 'JE-' . date('Ymd') . '-' . str_pad(rand(1, 999), 3, '0', STR_PAD_LEFT);
        } while (JournalEntry::where('entry_number', $code)->exists());

        return $code;
    }
}
