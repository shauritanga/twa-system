<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\FundraisingCampaign;
use App\Models\User;

class FundraisingCampaignSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::where('email', 'shauritangaathanas@gmail.com')->first();

        if (!$admin) {
            $this->command->error('Admin user not found. Please run the AdminUserSeeder first.');
            return;
        }

        $campaigns = [
            [
                'title' => 'Emergency Flood Relief Fund',
                'description' => 'Help us provide immediate assistance to families affected by recent flooding in our community.',
                'full_description' => 'Recent heavy rains have caused severe flooding in several areas of our community, leaving many families without shelter, food, and basic necessities. We are launching this emergency relief fund to provide immediate assistance including temporary shelter, food supplies, clean water, and medical aid. Your donation will directly help families rebuild their lives and get back on their feet.',
                'goal_amount' => 5000000, // 5 million TZS
                'raised_amount' => 1250000, // 1.25 million TZS already raised
                'status' => 'active',
                'start_date' => '2025-01-01',
                'end_date' => '2025-03-31',
                'image_path' => 'marketing/images/4.jpg',
                'payment_methods' => ['bank_transfer', 'mobile_money', 'cash'],
                'bank_details' => "Account Name: Tabata Welfare Association\nBank: CRDB Bank\nAccount Number: 0150-123456789\nSwift Code: CORUTZTZ",
                'mobile_money_number' => '+255 123 456 789',
                'is_featured' => true,
                'sort_order' => 1,
            ],
            [
                'title' => 'Education Support Program',
                'description' => 'Supporting underprivileged children with school fees, uniforms, and learning materials.',
                'full_description' => 'Education is the key to breaking the cycle of poverty. Our Education Support Program aims to provide scholarships, school supplies, and uniforms to children from low-income families in our community. With your support, we can ensure that every child has access to quality education regardless of their family\'s financial situation.',
                'goal_amount' => 3000000, // 3 million TZS
                'raised_amount' => 750000, // 750k TZS already raised
                'status' => 'active',
                'start_date' => '2025-01-15',
                'end_date' => '2025-12-31',
                'image_path' => 'marketing/images/3.jpeg',
                'payment_methods' => ['bank_transfer', 'mobile_money'],
                'bank_details' => "Account Name: Tabata Welfare Association - Education Fund\nBank: NMB Bank\nAccount Number: 40123456789",
                'mobile_money_number' => '+255 987 654 321',
                'is_featured' => false,
                'sort_order' => 2,
            ],
            [
                'title' => 'Community Health Initiative',
                'description' => 'Improving healthcare access and medical facilities in our community.',
                'full_description' => 'Access to quality healthcare is a fundamental right. Our Community Health Initiative focuses on improving medical facilities, providing free health screenings, and supporting community health workers. We aim to establish a community health center and provide essential medical equipment to serve our growing population.',
                'goal_amount' => 8000000, // 8 million TZS
                'raised_amount' => 2400000, // 2.4 million TZS already raised
                'status' => 'active',
                'start_date' => '2025-02-01',
                'end_date' => '2025-11-30',
                'image_path' => 'marketing/images/1.jpeg',
                'payment_methods' => ['bank_transfer', 'mobile_money', 'cash'],
                'bank_details' => "Account Name: Tabata Welfare Association - Health Fund\nBank: Equity Bank\nAccount Number: 1234567890",
                'mobile_money_number' => '+255 111 222 333',
                'is_featured' => false,
                'sort_order' => 3,
            ],
        ];

        foreach ($campaigns as $campaignData) {
            $campaignData['created_by'] = $admin->id;
            FundraisingCampaign::create($campaignData);
        }

        $this->command->info('✅ Sample fundraising campaigns created successfully!');
        $this->command->info('📊 Total campaigns: ' . FundraisingCampaign::count());
    }
}
