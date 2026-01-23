<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Account;
use Illuminate\Support\Facades\DB;

class DefaultAccountsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $accounts = [
            // ASSETS (1000-1999)
            [
                'account_code' => '1000',
                'account_name' => 'Cash',
                'account_type' => 'asset',
                'account_subtype' => 'Current Asset',
                'description' => 'Cash on hand and in bank accounts',
                'normal_balance' => 'debit',
                'is_system_account' => true,
            ],
            [
                'account_code' => '1100',
                'account_name' => 'Bank Account',
                'account_type' => 'asset',
                'account_subtype' => 'Current Asset',
                'description' => 'Bank checking and savings accounts',
                'normal_balance' => 'debit',
                'is_system_account' => true,
            ],
            [
                'account_code' => '1200',
                'account_name' => 'Accounts Receivable',
                'account_type' => 'asset',
                'account_subtype' => 'Current Asset',
                'description' => 'Money owed to the organization',
                'normal_balance' => 'debit',
                'is_system_account' => false,
            ],
            [
                'account_code' => '1300',
                'account_name' => 'Loans Receivable',
                'account_type' => 'asset',
                'account_subtype' => 'Current Asset',
                'description' => 'Loans made to members',
                'normal_balance' => 'debit',
                'is_system_account' => true,
            ],
            [
                'account_code' => '1500',
                'account_name' => 'Fixed Assets',
                'account_type' => 'asset',
                'account_subtype' => 'Fixed Asset',
                'description' => 'Land, buildings, and equipment',
                'normal_balance' => 'debit',
                'is_system_account' => false,
            ],
            [
                'account_code' => '1600',
                'account_name' => 'Accumulated Depreciation',
                'account_type' => 'asset',
                'account_subtype' => 'Fixed Asset',
                'description' => 'Accumulated depreciation on fixed assets',
                'normal_balance' => 'credit',
                'is_system_account' => false,
            ],

            // LIABILITIES (2000-2999)
            [
                'account_code' => '2000',
                'account_name' => 'Accounts Payable',
                'account_type' => 'liability',
                'account_subtype' => 'Current Liability',
                'description' => 'Money owed to suppliers and vendors',
                'normal_balance' => 'credit',
                'is_system_account' => false,
            ],
            [
                'account_code' => '2100',
                'account_name' => 'Accrued Expenses',
                'account_type' => 'liability',
                'account_subtype' => 'Current Liability',
                'description' => 'Expenses incurred but not yet paid',
                'normal_balance' => 'credit',
                'is_system_account' => false,
            ],
            [
                'account_code' => '2500',
                'account_name' => 'Long-term Debt',
                'account_type' => 'liability',
                'account_subtype' => 'Long-term Liability',
                'description' => 'Loans and debt payable over one year',
                'normal_balance' => 'credit',
                'is_system_account' => false,
            ],

            // EQUITY (3000-3999)
            [
                'account_code' => '3000',
                'account_name' => 'Net Assets',
                'account_type' => 'equity',
                'account_subtype' => 'Owner\'s Equity',
                'description' => 'Organization\'s net assets',
                'normal_balance' => 'credit',
                'is_system_account' => true,
            ],
            [
                'account_code' => '3100',
                'account_name' => 'Retained Earnings',
                'account_type' => 'equity',
                'account_subtype' => 'Retained Earnings',
                'description' => 'Accumulated earnings retained in the organization',
                'normal_balance' => 'credit',
                'is_system_account' => true,
            ],

            // REVENUE (4000-4999)
            [
                'account_code' => '4000',
                'account_name' => 'Member Contributions',
                'account_type' => 'revenue',
                'account_subtype' => 'Operating Revenue',
                'description' => 'Regular member contributions and dues',
                'normal_balance' => 'credit',
                'is_system_account' => true,
            ],
            [
                'account_code' => '4100',
                'account_name' => 'Donations',
                'account_type' => 'revenue',
                'account_subtype' => 'Operating Revenue',
                'description' => 'Donations and gifts received',
                'normal_balance' => 'credit',
                'is_system_account' => false,
            ],
            [
                'account_code' => '4200',
                'account_name' => 'Penalty Revenue',
                'account_type' => 'revenue',
                'account_subtype' => 'Operating Revenue',
                'description' => 'Revenue from member penalties and fines',
                'normal_balance' => 'credit',
                'is_system_account' => true,
            ],
            [
                'account_code' => '4300',
                'account_name' => 'Interest Income',
                'account_type' => 'revenue',
                'account_subtype' => 'Operating Revenue',
                'description' => 'Interest earned from loans and investments',
                'normal_balance' => 'credit',
                'is_system_account' => true,
            ],
            [
                'account_code' => '4400',
                'account_name' => 'Fundraising Revenue',
                'account_type' => 'revenue',
                'account_subtype' => 'Operating Revenue',
                'description' => 'Revenue from fundraising campaigns',
                'normal_balance' => 'credit',
                'is_system_account' => false,
            ],
            [
                'account_code' => '4900',
                'account_name' => 'Other Income',
                'account_type' => 'revenue',
                'account_subtype' => 'Non-operating Revenue',
                'description' => 'Miscellaneous income',
                'normal_balance' => 'credit',
                'is_system_account' => false,
            ],

            // EXPENSES (5000-5999)
            [
                'account_code' => '5000',
                'account_name' => 'Salaries and Wages',
                'account_type' => 'expense',
                'account_subtype' => 'Operating Expense',
                'description' => 'Employee salaries and wages',
                'normal_balance' => 'debit',
                'is_system_account' => false,
            ],
            [
                'account_code' => '5100',
                'account_name' => 'Utilities',
                'account_type' => 'expense',
                'account_subtype' => 'Operating Expense',
                'description' => 'Electricity, water, gas, internet',
                'normal_balance' => 'debit',
                'is_system_account' => false,
            ],
            [
                'account_code' => '5200',
                'account_name' => 'Rent',
                'account_type' => 'expense',
                'account_subtype' => 'Operating Expense',
                'description' => 'Office and facility rent',
                'normal_balance' => 'debit',
                'is_system_account' => false,
            ],
            [
                'account_code' => '5300',
                'account_name' => 'Office Supplies',
                'account_type' => 'expense',
                'account_subtype' => 'Operating Expense',
                'description' => 'Office supplies and materials',
                'normal_balance' => 'debit',
                'is_system_account' => false,
            ],
            [
                'account_code' => '5400',
                'account_name' => 'Maintenance and Repairs',
                'account_type' => 'expense',
                'account_subtype' => 'Operating Expense',
                'description' => 'Maintenance and repair costs',
                'normal_balance' => 'debit',
                'is_system_account' => false,
            ],
            [
                'account_code' => '5500',
                'account_name' => 'Transportation',
                'account_type' => 'expense',
                'account_subtype' => 'Operating Expense',
                'description' => 'Vehicle and transportation expenses',
                'normal_balance' => 'debit',
                'is_system_account' => false,
            ],
            [
                'account_code' => '5600',
                'account_name' => 'Insurance',
                'account_type' => 'expense',
                'account_subtype' => 'Operating Expense',
                'description' => 'Insurance premiums',
                'normal_balance' => 'debit',
                'is_system_account' => false,
            ],
            [
                'account_code' => '5700',
                'account_name' => 'Marketing and Advertising',
                'account_type' => 'expense',
                'account_subtype' => 'Operating Expense',
                'description' => 'Marketing and promotional expenses',
                'normal_balance' => 'debit',
                'is_system_account' => false,
            ],
            [
                'account_code' => '5800',
                'account_name' => 'Professional Fees',
                'account_type' => 'expense',
                'account_subtype' => 'Operating Expense',
                'description' => 'Legal, accounting, and consulting fees',
                'normal_balance' => 'debit',
                'is_system_account' => false,
            ],
            [
                'account_code' => '5950',
                'account_name' => 'Disaster Relief',
                'account_type' => 'expense',
                'account_subtype' => 'Operating Expense',
                'description' => 'Disaster relief payments to members',
                'normal_balance' => 'debit',
                'is_system_account' => true,
            ],
            [
                'account_code' => '5900',
                'account_name' => 'Depreciation Expense',
                'account_type' => 'expense',
                'account_subtype' => 'Operating Expense',
                'description' => 'Depreciation of fixed assets',
                'normal_balance' => 'debit',
                'is_system_account' => false,
            ],
        ];

        foreach ($accounts as $account) {
            Account::updateOrCreate(
                ['account_code' => $account['account_code']], // Find by account_code
                $account // Update or create with these values
            );
        }
    }
}
