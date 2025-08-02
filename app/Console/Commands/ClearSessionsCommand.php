<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Artisan;

class ClearSessionsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sessions:clear {--force : Force clear without confirmation}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clear all sessions and cache to fix login issues';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if (!$this->option('force') && !$this->confirm('This will clear all active sessions and cache. Continue?')) {
            $this->info('Operation cancelled.');
            return 0;
        }

        $this->info('Clearing sessions and cache...');

        // Clear sessions table
        try {
            $sessionCount = DB::table('sessions')->count();
            DB::table('sessions')->truncate();
            $this->info("✅ Cleared {$sessionCount} sessions from database");
        } catch (\Exception $e) {
            $this->warn("⚠️  Could not clear sessions table: " . $e->getMessage());
        }

        // Clear cache
        try {
            Cache::flush();
            $this->info('✅ Cache cleared');
        } catch (\Exception $e) {
            $this->warn("⚠️  Could not clear cache: " . $e->getMessage());
        }

        // Clear config cache
        try {
            Artisan::call('config:clear');
            $this->info('✅ Config cache cleared');
        } catch (\Exception $e) {
            $this->warn("⚠️  Could not clear config cache: " . $e->getMessage());
        }

        // Clear route cache
        try {
            Artisan::call('route:clear');
            $this->info('✅ Route cache cleared');
        } catch (\Exception $e) {
            $this->warn("⚠️  Could not clear route cache: " . $e->getMessage());
        }

        // Clear view cache
        try {
            Artisan::call('view:clear');
            $this->info('✅ View cache cleared');
        } catch (\Exception $e) {
            $this->warn("⚠️  Could not clear view cache: " . $e->getMessage());
        }

        $this->info('🎉 Session and cache cleanup completed!');
        $this->info('💡 Users will need to log in again.');

        return 0;
    }
}
