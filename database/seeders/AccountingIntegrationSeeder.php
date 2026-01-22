<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Account;

class AccountingIntegrationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure required accounts exist for automatic journal entries
        $requiredAccounts = [
            [
                'account_code' => '1000',
                'account_name' => 'Cash',
                'account_type' => 'asset',
                'account_subtype' => 'current_assets',
                'description' => 'Cash on hand and in bank accounts',
                'opening_balance' => 0,
                'current_balance' => 0,
                'normal_balance' => 'debit',
                'is_active' => true,
                'is_system_account' => true,
            ],
            [
                'account_code' => '4000',
                'account_name' => 'Member Contributions',
                'account_type' => 'revenue',
                'account_subtype' => 'operating_revenue',
                'description' => 'Revenue from member contributions',
                'opening_balance' => 0,
                'current_balance' => 0,
                'normal_balance' => 'credit',
                'is_active' => true,
                'is_system_account' => true,
            ],
            [
                'account_code' => '5100',
                'account_name' => 'Office Expenses',
                'account_type' => 'expense',
                'account_subtype' => 'operating_expenses',
                'description' => 'Office-related expenses',
                'opening_balance' => 0,
                'current_balance' => 0,
                'normal_balance' => 'debit',
                'is_active' => true,
                'is_system_account' => true,
            ],
            [
                'account_code' => '5200',
                'account_name' => 'Travel Expenses',
                'account_type' => 'expense',
                'account_subtype' => 'operating_expenses',
                'description' => 'Travel and transportation expenses',
                'opening_balance' => 0,
                'current_balance' => 0,
                'normal_balance' => 'debit',
                'is_active' => true,
                'is_system_account' => true,
            ],
            [
                'account_code' => '5300',
                'account_name' => 'Utilities',
                'account_type' => 'expense',
                'account_subtype' => 'operating_expenses',
                'description' => 'Utility expenses (electricity, water, internet)',
                'opening_balance' => 0,
                'current_balance' => 0,
                'normal_balance' => 'debit',
                'is_active' => true,
                'is_system_account' => true,
            ],
            [
                'account_code' => '5400',
                'account_name' => 'Maintenance',
                'account_type' => 'expense',
                'account_subtype' => 'operating_expenses',
                'description' => 'Maintenance and repair expenses',
                'opening_balance' => 0,
                'current_balance' => 0,
                'normal_balance' => 'debit',
                'is_active' => true,
                'is_system_account' => true,
            ],
            [
                'account_code' => '5500',
                'account_name' => 'Supplies',
                'account_type' => 'expense',
                'account_subtype' => 'operating_expenses',
                'description' => 'Office supplies and materials',
                'opening_balance' => 0,
                'current_balance' => 0,
                'normal_balance' => 'debit',
                'is_active' => true,
                'is_system_account' => true,
            ],
            [
                'account_code' => '5800',
                'account_name' => 'Disaster Relief',
                'account_type' => 'expense',
                'account_subtype' => 'operating_expenses',
                'description' => 'Disaster relief payments to members',
                'opening_balance' => 0,
                'current_balance' => 0,
                'normal_balance' => 'debit',
                'is_active' => true,
                'is_system_account' => true,
            ],
            [
                'account_code' => '5900',
                'account_name' => 'Other Expenses',
                'account_type' => 'expense',
                'account_subtype' => 'operating_expenses',
                'description' => 'Miscellaneous expenses',
                'opening_balance' => 0,
                'current_balance' => 0,
                'normal_balance' => 'debit',
                'is_active' => true,
                'is_system_account' => true,
            ],
        ];

        foreach ($requiredAccounts as $accountData) {
            Account::updateOrCreate(
                ['account_code' => $accountData['account_code']],
                $accountData
            );
        }

        $this->command->info('Accounting integration accounts created/updated successfully.');
    }
}