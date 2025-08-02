<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Announcement;
use App\Models\User;

class AnnouncementSeeder extends Seeder
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

        $announcements = [
            [
                'title' => 'Annual General Meeting 2025',
                'content' => 'Join us for our Annual General Meeting on February 15th, 2025. All members are encouraged to attend and participate in important decisions for our association. We will discuss the annual budget, elect new committee members, and review our achievements from the past year.',
                'type' => 'important',
                'status' => 'active',
                'link_url' => '#contact',
                'link_text' => 'Learn More',
                'media_type' => 'image',
                'image_path' => 'marketing/images/event.jpeg',
                'image_alt_text' => 'Annual General Meeting venue',
                'announcement_date' => '2025-01-15',
                'is_featured' => true,
                'sort_order' => 1,
            ],
            [
                'title' => 'New Member Registration Open',
                'content' => 'We are now accepting new member applications for 2025. Join our growing community and enjoy exclusive benefits and support services. Registration includes access to our welfare programs, disaster support, and community events.',
                'type' => 'event',
                'status' => 'active',
                'link_url' => '/login',
                'link_text' => 'Apply Now',
                'media_type' => 'none',
                'announcement_date' => '2025-01-10',
                'is_featured' => false,
                'sort_order' => 2,
            ],
            [
                'title' => 'Community Meeting Highlights',
                'content' => 'Watch the highlights from our recent community meeting where we discussed important updates and future plans for our association. See what our members had to say about our progress.',
                'type' => 'event',
                'status' => 'active',
                'link_url' => '#contact',
                'link_text' => 'Join Next Meeting',
                'media_type' => 'video_url',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'announcement_date' => '2025-01-08',
                'is_featured' => false,
                'sort_order' => 3,
            ],
            [
                'title' => 'Updated Contribution Guidelines',
                'content' => 'Please review the updated monthly contribution guidelines and payment methods. New digital payment options are now available for your convenience, including mobile money and bank transfers.',
                'type' => 'update',
                'status' => 'active',
                'link_url' => '#services',
                'link_text' => 'View Details',
                'media_type' => 'none',
                'announcement_date' => '2025-01-05',
                'is_featured' => false,
                'sort_order' => 4,
            ],
            [
                'title' => 'Disaster Relief Fund Success',
                'content' => 'Thanks to our members\' generous contributions, we successfully provided emergency assistance to 25 families affected by recent floods. Your support makes a real difference in our community.',
                'type' => 'general',
                'status' => 'active',
                'link_url' => '#donate',
                'link_text' => 'Contribute',
                'media_type' => 'image',
                'image_path' => 'marketing/images/4.jpg',
                'image_alt_text' => 'Community helping hands',
                'announcement_date' => '2025-01-03',
                'is_featured' => false,
                'sort_order' => 5,
            ],
        ];

        foreach ($announcements as $announcementData) {
            $announcementData['created_by'] = $admin->id;
            Announcement::create($announcementData);
        }

        $this->command->info('✅ Sample announcements created successfully!');
        $this->command->info('📊 Total announcements: ' . Announcement::count());
    }
}
