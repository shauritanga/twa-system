#!/bin/bash

echo "🧹 Starting Fresh Financial Data Cleanup..."
echo "This will clear all financial transactions while preserving members and users"
echo ""

# Confirm before proceeding
read -p "Are you sure you want to clear all financial data? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Operation cancelled"
    exit 1
fi

echo "🔄 Clearing financial data..."

# Clear all financial transaction tables
php artisan tinker --execute="
// Clear all financial transactions
DB::statement('SET FOREIGN_KEY_CHECKS=0;');

// Clear journal entries and lines
DB::table('journal_entry_lines')->truncate();
DB::table('journal_entries')->truncate();

// Clear all financial transactions
DB::table('payments')->truncate();
DB::table('contribution_allocations')->truncate();
DB::table('contributions')->truncate();
DB::table('loans')->truncate();
DB::table('disaster_payments')->truncate();
DB::table('expenses')->truncate();
DB::table('penalties')->truncate();

// Reset account balances to zero (keep accounts but reset balances)
DB::table('accounts')->update([
    'current_balance' => 0,
    'opening_balance' => 0
]);

DB::statement('SET FOREIGN_KEY_CHECKS=1;');

echo 'Financial data cleared successfully!';
echo PHP_EOL;
"

echo "✅ Financial data cleared!"
echo ""
echo "📊 Resetting account balances to zero..."

# Verify the cleanup
php artisan tinker --execute="
echo 'Verification Results:';
echo PHP_EOL;
echo 'Journal Entries: ' . DB::table('journal_entries')->count();
echo PHP_EOL;
echo 'Journal Entry Lines: ' . DB::table('journal_entry_lines')->count();
echo PHP_EOL;
echo 'Payments: ' . DB::table('payments')->count();
echo PHP_EOL;
echo 'Contribution Allocations: ' . DB::table('contribution_allocations')->count();
echo PHP_EOL;
echo 'Contributions: ' . DB::table('contributions')->count();
echo PHP_EOL;
echo 'Loans: ' . DB::table('loans')->count();
echo PHP_EOL;
echo 'Disaster Payments: ' . DB::table('disaster_payments')->count();
echo PHP_EOL;
echo 'Expenses: ' . DB::table('expenses')->count();
echo PHP_EOL;
echo 'Penalties: ' . DB::table('penalties')->count();
echo PHP_EOL;
echo 'Cash Account Balance: ' . (DB::table('accounts')->where('account_code', '1000')->first()->current_balance ?? 'N/A');
echo PHP_EOL;
echo 'Total Accounts: ' . DB::table('accounts')->count();
echo PHP_EOL;
echo 'Members Preserved: ' . DB::table('members')->count();
echo PHP_EOL;
echo 'Users Preserved: ' . DB::table('users')->count();
echo PHP_EOL;
"

echo ""
echo "🎯 Fresh Start Ready!"
echo "✅ All financial transactions cleared"
echo "✅ Account balances reset to zero"
echo "✅ Chart of accounts preserved"
echo "✅ Members and users preserved"
echo "✅ System ready for fresh testing"
echo ""
echo "💡 You can now:"
echo "   - Add member contributions to build cash balance"
echo "   - Test loan disbursements with proper cash flow validation"
echo "   - Test expense payments and disaster relief"
echo "   - Verify all accounting integrations work correctly"