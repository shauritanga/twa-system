<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\WebsiteVisit;
use Carbon\Carbon;

class SeedVisitData extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'visits:seed {--count=50 : Number of visits to create}';

    /**
     * The console command description.
     */
    protected $description = 'Seed the database with sample website visit data';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $count = $this->option('count');
        
        $this->info("Creating {$count} sample website visits...");
        
        $userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
            'Mozilla/5.0 (Android 11; Mobile; rv:68.0) Gecko/68.0 Firefox/88.0',
        ];
        
        $referrers = [
            'https://google.com',
            'https://facebook.com',
            'https://twitter.com',
            'https://linkedin.com',
            null, // Direct visits
        ];
        
        $ips = [
            '192.168.1.' . rand(1, 254),
            '10.0.0.' . rand(1, 254),
            '172.16.0.' . rand(1, 254),
            '203.0.113.' . rand(1, 254),
            '198.51.100.' . rand(1, 254),
        ];
        
        $created = 0;
        
        for ($i = 0; $i < $count; $i++) {
            try {
                $visitDate = Carbon::now()->subDays(rand(0, 30))->subHours(rand(0, 23))->subMinutes(rand(0, 59));
                
                WebsiteVisit::create([
                    'ip_address' => $ips[array_rand($ips)] ?? '127.0.0.1',
                    'user_agent' => $userAgents[array_rand($userAgents)],
                    'page_url' => 'https://tabatawelfare.org',
                    'referrer' => $referrers[array_rand($referrers)],
                    'session_id' => 'seed_' . uniqid() . '_' . $i,
                    'visited_at' => $visitDate,
                ]);
                
                $created++;
                
                if ($created % 10 === 0) {
                    $this->info("Created {$created}/{$count} visits...");
                }
                
            } catch (\Exception $e) {
                $this->error("Failed to create visit {$i}: " . $e->getMessage());
            }
        }
        
        $this->info("✅ Successfully created {$created} sample visits");
        $this->info("📊 Total visits in database: " . WebsiteVisit::count());
        
        return 0;
    }
}
