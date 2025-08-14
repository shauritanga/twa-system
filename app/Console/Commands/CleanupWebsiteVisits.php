<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\WebsiteVisit;
use Carbon\Carbon;

class CleanupWebsiteVisits extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'visits:cleanup {--days=90 : Number of days to keep}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean up old website visit records';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $days = $this->option('days');
        $cutoffDate = Carbon::now()->subDays($days);

        $this->info("Cleaning up website visits older than {$days} days...");

        $deletedCount = WebsiteVisit::where('visited_at', '<', $cutoffDate)->delete();

        $this->info("Deleted {$deletedCount} old visit records.");
        $this->info("Remaining visits: " . WebsiteVisit::count());

        return 0;
    }
}
