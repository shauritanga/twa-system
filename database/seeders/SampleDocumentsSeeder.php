<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Document;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

class SampleDocumentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first admin user to be the uploader
        $adminUser = User::whereHas('role', function ($query) {
            $query->where('name', 'admin');
        })->first();

        if (!$adminUser) {
            $this->command->warn('No admin user found. Skipping document seeding.');
            return;
        }

        // Create sample public documents
        $documents = [
            [
                'title' => 'TWA Membership Application Form',
                'description' => 'Official membership application form for new members joining Tabata Welfare Association.',
                'category' => 'forms',
                'visibility' => 'public',
                'file_name' => 'membership-application-form.pdf',
                'file_type' => 'pdf',
                'file_size' => 245760, // 240KB
                'document_date' => now()->subDays(30),
                'tags' => ['membership', 'application', 'form'],
            ],
            [
                'title' => 'TWA Constitution and Bylaws',
                'description' => 'The official constitution and bylaws governing Tabata Welfare Association operations and member rights.',
                'category' => 'legal_documents',
                'visibility' => 'public',
                'file_name' => 'twa-constitution-bylaws.pdf',
                'file_type' => 'pdf',
                'file_size' => 512000, // 500KB
                'document_date' => now()->subDays(90),
                'tags' => ['constitution', 'bylaws', 'governance'],
            ],
            [
                'title' => 'Member Benefits Guide',
                'description' => 'Comprehensive guide outlining all benefits available to TWA members and their families.',
                'category' => 'policies',
                'visibility' => 'public',
                'file_name' => 'member-benefits-guide.pdf',
                'file_type' => 'pdf',
                'file_size' => 358400, // 350KB
                'document_date' => now()->subDays(60),
                'tags' => ['benefits', 'guide', 'members'],
            ],
            [
                'title' => 'Contribution Payment Procedures',
                'description' => 'Step-by-step guide on how to make monthly contributions and payment methods available.',
                'category' => 'procedures',
                'visibility' => 'public',
                'file_name' => 'contribution-payment-procedures.pdf',
                'file_type' => 'pdf',
                'file_size' => 204800, // 200KB
                'document_date' => now()->subDays(45),
                'tags' => ['contributions', 'payments', 'procedures'],
            ],
            [
                'title' => 'Annual Financial Report 2023',
                'description' => 'Annual financial report showing TWA\'s financial performance and member contributions for 2023.',
                'category' => 'financial_reports',
                'visibility' => 'public',
                'file_name' => 'annual-financial-report-2023.pdf',
                'file_type' => 'pdf',
                'file_size' => 1048576, // 1MB
                'document_date' => now()->subDays(120),
                'tags' => ['financial', 'annual', 'report', '2023'],
            ],
            [
                'title' => 'Disaster Assistance Application Form',
                'description' => 'Form to apply for disaster assistance benefits for eligible members and their families.',
                'category' => 'forms',
                'visibility' => 'public',
                'file_name' => 'disaster-assistance-form.pdf',
                'file_type' => 'pdf',
                'file_size' => 163840, // 160KB
                'document_date' => now()->subDays(15),
                'tags' => ['disaster', 'assistance', 'form', 'benefits'],
            ],
        ];

        foreach ($documents as $docData) {
            // Create a dummy file path (in production, actual files would be uploaded)
            $filePath = 'documents/' . $docData['file_name'];
            
            Document::create([
                'title' => $docData['title'],
                'description' => $docData['description'],
                'category' => $docData['category'],
                'file_name' => $docData['file_name'],
                'file_path' => $filePath,
                'file_type' => $docData['file_type'],
                'file_size' => $docData['file_size'],
                'visibility' => $docData['visibility'],
                'status' => 'active',
                'document_date' => $docData['document_date'],
                'tags' => $docData['tags'],
                'download_count' => rand(5, 50),
                'uploaded_by' => $adminUser->id,
                'published_at' => now()->subDays(rand(1, 30)),
            ]);
        }

        $this->command->info('Sample public documents created successfully.');
    }
}