<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class DefaultSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // General Settings
            [
                'key' => 'organization_name',
                'value' => 'TWAOR',
                'description' => 'Organization name',
            ],
            [
                'key' => 'organization_email',
                'value' => 'info@twaor.org',
                'description' => 'Organization contact email',
            ],
            [
                'key' => 'organization_phone',
                'value' => '+255 XXX XXX XXX',
                'description' => 'Organization contact phone',
            ],
            [
                'key' => 'organization_address',
                'value' => 'Dar es Salaam, Tanzania',
                'description' => 'Organization physical address',
            ],
            [
                'key' => 'timezone',
                'value' => 'Africa/Dar_es_Salaam',
                'description' => 'System timezone',
            ],
            [
                'key' => 'date_format',
                'value' => 'Y-m-d',
                'description' => 'Date display format',
            ],
            [
                'key' => 'currency',
                'value' => 'TZS',
                'description' => 'Default currency',
            ],

            // Member Settings (already exist, but included for completeness)
            [
                'key' => 'monthly_contribution_amount',
                'value' => '50000',
                'description' => 'Default monthly contribution amount for members',
            ],
            [
                'key' => 'penalty_percentage_rate',
                'value' => '10',
                'description' => 'Percentage rate applied to missed contributions for penalties',
            ],
            [
                'key' => 'apply_penalty_to_existing',
                'value' => '0',
                'description' => 'Flag to apply penalty rate changes to existing unpaid penalties',
            ],
            [
                'key' => 'member_id_prefix',
                'value' => 'MEM',
                'description' => 'Prefix for auto-generated member IDs',
            ],
            [
                'key' => 'auto_approve_members',
                'value' => '0',
                'description' => 'Automatically approve new member registrations',
            ],

            // Financial Settings
            [
                'key' => 'fiscal_year_start_month',
                'value' => '1',
                'description' => 'Month when fiscal year begins (1-12)',
            ],
            [
                'key' => 'receipt_number_prefix',
                'value' => 'RCP',
                'description' => 'Prefix for receipt numbers',
            ],
            [
                'key' => 'invoice_number_prefix',
                'value' => 'INV',
                'description' => 'Prefix for invoice numbers',
            ],
            [
                'key' => 'tax_rate',
                'value' => '0',
                'description' => 'Default tax rate for transactions',
            ],

            // Email Settings
            [
                'key' => 'smtp_host',
                'value' => '',
                'description' => 'SMTP server host',
            ],
            [
                'key' => 'smtp_port',
                'value' => '587',
                'description' => 'SMTP server port',
            ],
            [
                'key' => 'smtp_username',
                'value' => '',
                'description' => 'SMTP username',
            ],
            [
                'key' => 'smtp_encryption',
                'value' => 'tls',
                'description' => 'SMTP encryption method',
            ],
            [
                'key' => 'mail_from_address',
                'value' => '',
                'description' => 'Email from address',
            ],
            [
                'key' => 'mail_from_name',
                'value' => 'TWAOR',
                'description' => 'Email from name',
            ],

            // Security Settings (some already exist)
            [
                'key' => 'session_timeout',
                'value' => '120',
                'description' => 'Session timeout in minutes',
            ],
            [
                'key' => 'enable_two_factor_auth',
                'value' => '1',
                'description' => 'Enable two-factor authentication system-wide',
            ],
            [
                'key' => 'otp_grace_period_days',
                'value' => '7',
                'description' => 'Days to allow login without OTP for existing users',
            ],
            [
                'key' => 'max_login_attempts',
                'value' => '5',
                'description' => 'Maximum failed login attempts before lockout',
            ],
            [
                'key' => 'password_min_length',
                'value' => '8',
                'description' => 'Minimum password length',
            ],
            [
                'key' => 'require_password_special_char',
                'value' => '1',
                'description' => 'Require special character in passwords',
            ],

            // System Settings
            [
                'key' => 'maintenance_mode',
                'value' => '0',
                'description' => 'Enable maintenance mode',
            ],
            [
                'key' => 'items_per_page',
                'value' => '20',
                'description' => 'Default items per page in tables',
            ],
            [
                'key' => 'enable_debug_mode',
                'value' => '0',
                'description' => 'Enable debug mode',
            ],
            [
                'key' => 'backup_frequency',
                'value' => 'weekly',
                'description' => 'Automatic backup frequency',
            ],
            [
                'key' => 'allow_admin_assignment',
                'value' => '1',
                'description' => 'Allow administrators to assign roles to users',
            ],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                [
                    'value' => $setting['value'],
                    'description' => $setting['description'],
                ]
            );
        }

        $this->command->info('Default settings created/updated successfully!');
    }
}
