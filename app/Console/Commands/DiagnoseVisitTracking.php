<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\WebsiteVisit;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class DiagnoseVisitTracking extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'visits:diagnose';

    /**
     * The console command description.
     */
    protected $description = 'Diagnose website visit tracking issues';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔍 Website Visit Tracking Diagnostics');
        $this->info('=====================================');

        // 1. Check if table exists
        $this->info('1. Checking database table...');
        if (Schema::hasTable('website_visits')) {
            $this->info('   ✅ Table "website_visits" exists');
            
            // Check table structure
            $columns = Schema::getColumnListing('website_visits');
            $this->info('   📋 Columns: ' . implode(', ', $columns));
            
            // Check if required columns exist
            $requiredColumns = ['id', 'ip_address', 'session_id', 'visited_at'];
            foreach ($requiredColumns as $column) {
                if (in_array($column, $columns)) {
                    $this->info("   ✅ Column '{$column}' exists");
                } else {
                    $this->error("   ❌ Column '{$column}' missing");
                }
            }
        } else {
            $this->error('   ❌ Table "website_visits" does not exist');
            $this->info('   💡 Run: php artisan migrate');
            return 1;
        }

        // 2. Check record count
        $this->info('2. Checking records...');
        try {
            $totalCount = WebsiteVisit::count();
            $this->info("   📊 Total visits in database: {$totalCount}");
            
            if ($totalCount > 0) {
                $todayCount = WebsiteVisit::whereDate('visited_at', today())->count();
                $this->info("   📅 Visits today: {$todayCount}");
                
                $latest = WebsiteVisit::latest()->first();
                if ($latest) {
                    $this->info("   🕐 Latest visit: {$latest->visited_at} from {$latest->ip_address}");
                }
            } else {
                $this->warn('   ⚠️  No visits recorded yet');
            }
        } catch (\Exception $e) {
            $this->error("   ❌ Error querying database: {$e->getMessage()}");
        }

        // 3. Check middleware registration
        $this->info('3. Checking middleware...');
        $middlewareFile = base_path('bootstrap/app.php');
        if (file_exists($middlewareFile)) {
            $content = file_get_contents($middlewareFile);
            if (strpos($content, 'TrackWebsiteVisits') !== false) {
                $this->info('   ✅ TrackWebsiteVisits middleware is registered');
            } else {
                $this->error('   ❌ TrackWebsiteVisits middleware not found in bootstrap/app.php');
            }
        }

        // 4. Check cache
        $this->info('4. Checking cache...');
        try {
            Cache::put('visit_test', 'working', 60);
            if (Cache::get('visit_test') === 'working') {
                $this->info('   ✅ Cache is working');
                Cache::forget('visit_test');
            } else {
                $this->warn('   ⚠️  Cache may not be working properly');
            }
        } catch (\Exception $e) {
            $this->warn("   ⚠️  Cache error: {$e->getMessage()}");
        }

        // 5. Test visit recording
        $this->info('5. Testing visit recording...');
        try {
            $testVisit = WebsiteVisit::create([
                'ip_address' => '127.0.0.1',
                'user_agent' => 'Test Agent',
                'page_url' => 'http://test.com',
                'session_id' => 'test_' . time(),
                'visited_at' => now(),
            ]);
            
            $this->info('   ✅ Test visit created successfully');
            $this->info("   🆔 Test visit ID: {$testVisit->id}");
            
            // Clean up test visit
            $testVisit->delete();
            $this->info('   🧹 Test visit cleaned up');
            
        } catch (\Exception $e) {
            $this->error("   ❌ Failed to create test visit: {$e->getMessage()}");
        }

        // 6. Check queue configuration
        $this->info('6. Checking queue configuration...');
        $queueDriver = config('queue.default');
        $this->info("   🔧 Queue driver: {$queueDriver}");
        
        if ($queueDriver === 'sync') {
            $this->info('   ℹ️  Using sync queue (immediate processing)');
        } else {
            $this->info("   ℹ️  Using {$queueDriver} queue (background processing)");
            $this->info('   💡 Make sure queue workers are running: php artisan queue:work');
        }

        // 7. Production recommendations
        $this->info('7. Production recommendations...');
        if (app()->environment('production')) {
            $this->info('   🚀 Production environment detected');
            $this->info('   💡 Recommendations:');
            $this->info('      - Ensure migrations are run: php artisan migrate');
            $this->info('      - Clear cache: php artisan cache:clear');
            $this->info('      - Restart queue workers if using queues');
            $this->info('      - Check web server logs for errors');
        }

        $this->info('');
        $this->info('🎯 Summary:');
        $currentCount = WebsiteVisit::count();
        $this->info("   Current visit count: {$currentCount}");
        
        if ($currentCount === 0) {
            $this->warn('   ⚠️  Visit count is zero - check the issues above');
        } else {
            $this->info('   ✅ Visit tracking appears to be working');
        }

        return 0;
    }
}
