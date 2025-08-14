<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\WebsiteVisit;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Artisan;

class FixVisitTracking extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'visits:fix {--force : Force fixes without confirmation}';

    /**
     * The console command description.
     */
    protected $description = 'Fix common website visit tracking issues';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔧 Fixing Website Visit Tracking Issues');
        $this->info('======================================');

        $force = $this->option('force');

        // 1. Check and run migrations
        $this->info('1. Checking migrations...');
        if (!Schema::hasTable('website_visits')) {
            $this->warn('   ⚠️  website_visits table missing');
            if ($force || $this->confirm('Run migrations?')) {
                $this->info('   🔄 Running migrations...');
                Artisan::call('migrate', ['--force' => true]);
                $this->info('   ✅ Migrations completed');
            }
        } else {
            $this->info('   ✅ Table exists');
        }

        // 2. Clear caches
        $this->info('2. Clearing caches...');
        if ($force || $this->confirm('Clear application caches?')) {
            Artisan::call('cache:clear');
            Artisan::call('config:clear');
            Artisan::call('route:clear');
            $this->info('   ✅ Caches cleared');
        }

        // 3. Check current count
        $this->info('3. Checking current visit count...');
        try {
            $count = WebsiteVisit::count();
            $this->info("   📊 Current visits: {$count}");
            
            if ($count === 0) {
                $this->warn('   ⚠️  No visits recorded');
                if ($force || $this->confirm('Add sample visit data?')) {
                    $this->info('   🌱 Adding sample data...');
                    Artisan::call('visits:seed', ['--count' => 50]);
                    $newCount = WebsiteVisit::count();
                    $this->info("   ✅ Added sample data. New count: {$newCount}");
                }
            }
        } catch (\Exception $e) {
            $this->error("   ❌ Error: {$e->getMessage()}");
        }

        // 4. Test visit creation
        $this->info('4. Testing visit creation...');
        try {
            $testVisit = WebsiteVisit::create([
                'ip_address' => '127.0.0.1',
                'user_agent' => 'Fix Command Test',
                'page_url' => 'http://test-fix.com',
                'session_id' => 'fix_test_' . time(),
                'visited_at' => now(),
            ]);
            
            $this->info('   ✅ Test visit created successfully');
            $testVisit->delete();
            $this->info('   🧹 Test visit cleaned up');
            
        } catch (\Exception $e) {
            $this->error("   ❌ Failed to create test visit: {$e->getMessage()}");
        }

        // 5. Final check
        $this->info('5. Final verification...');
        $finalCount = WebsiteVisit::count();
        $this->info("   📊 Final visit count: {$finalCount}");
        
        if ($finalCount > 0) {
            $this->info('   ✅ Visit tracking is now working!');
        } else {
            $this->error('   ❌ Visit tracking still not working');
            $this->info('   💡 Check Laravel logs: storage/logs/laravel.log');
            $this->info('   💡 Check web server error logs');
            $this->info('   💡 Verify database permissions');
        }

        return $finalCount > 0 ? 0 : 1;
    }
}
