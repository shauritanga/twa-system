#!/bin/bash

echo "🧹 Cleaning Financial Data - Starting Fresh with Accounting Integration"
echo "======================================================================="

# Run the clean financial data command
php artisan tinker --execute="
// Delete all financial transaction data
DB::statement('SET FOREIGN_KEY_CHECKS=0;');

// Clear financial transactions (but keep structure)
echo 'Clearing Payments...';
\App\Models\Payment::truncate();

echo 'Clearing Contribution Allocations...';
\App\Models\ContributionAllocation::truncate();

echo 'Clearing Contributions...';
\App\Models\Contribution::truncate();

echo 'Clearing Expenses...';
\App\Models\Expense::truncate();

echo 'Clearing Disaster Payments...';
\App\Models\DisasterPayment::truncate();

echo 'Clearing Loans...';
\App\Models\Loan::truncate();

echo 'Clearing Penalties...';
\App\Models\Penalty::truncate();

// Clear accounting data (journal entries and reset account balances)
echo 'Clearing Journal Entry Lines...';
\App\Models\JournalEntryLine::truncate();

echo 'Clearing Journal Entries...';
\App\Models\JournalEntry::truncate();

// Reset all account balances to their opening balances
echo 'Resetting Account Balances...';
\App\Models\Account::query()->update([
    'current_balance' => DB::raw('opening_balance')
]);

DB::statement('SET FOREIGN_KEY_CHECKS=1;');

echo '';
echo '✅ Financial data cleanup completed!';
echo '';
echo 'What was cleared:';
echo '- All payments and contribution allocations';
echo '- All contributions (old system)';
echo '- All expenses';
echo '- All disaster payments';
echo '- All debts and penalties';
echo '- All journal entries and lines';
echo '- Account balances reset to opening balances';
echo '';
echo 'What was preserved:';
echo '- Chart of Accounts structure';
echo '- Account definitions and types';
echo '- Members data';
echo '- Users and roles';
echo '- System settings';
echo '';
echo '🚀 Ready for fresh financial data with accounting integration!';
"

echo ""
echo "✅ Financial data cleanup completed!"
echo ""
echo "Next steps:"
echo "1. Create new payments - they will automatically create journal entries"
echo "2. Create new expenses - they will automatically create journal entries"  
echo "3. Check AdminPortal → Journal Entries to see automatic entries"
echo "4. Check AdminPortal → Chart of Accounts to see updated balances"
echo "5. Check Dashboard for accurate financial statistics"