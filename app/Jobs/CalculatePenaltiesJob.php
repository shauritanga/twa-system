<?php

namespace App\Jobs;

use App\Services\PenaltyService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Mail\PenaltyCalculationReport;

class CalculatePenaltiesJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * The maximum number of seconds the job can run.
     */
    public int $timeout = 300; // 5 minutes

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        // Job can be created without parameters
    }

    /**
     * Execute the job.
     */
    public function handle(PenaltyService $penaltyService): void
    {
        Log::info('Starting penalty calculation job');

        try {
            // Calculate penalties for all members
            $results = $penaltyService->calculatePenaltiesForAllMembers();

            // Log results
            Log::info('Penalty calculation completed', [
                'processed_members' => $results['processed'],
                'penalties_created' => $results['penalties_created'],
                'errors_count' => count($results['errors'])
            ]);

            // Send email report to admins if there were penalties created or errors
            if ($results['penalties_created'] > 0 || !empty($results['errors'])) {
                $this->sendReportToAdmins($results);
            }

            // Update penalty statistics cache
            $this->updatePenaltyStatisticsCache($penaltyService);

        } catch (\Exception $e) {
            Log::error('Penalty calculation job failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // Re-throw to mark job as failed
            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Penalty calculation job failed permanently', [
            'error' => $exception->getMessage(),
            'trace' => $exception->getTraceAsString()
        ]);

        // Notify admins of job failure
        $this->notifyAdminsOfFailure($exception);
    }

    /**
     * Send penalty calculation report to admin users
     */
    private function sendReportToAdmins(array $results): void
    {
        try {
            $adminUsers = User::whereHas('role', function($query) {
                $query->whereIn('name', ['admin', 'secretary']);
            })->get();

            foreach ($adminUsers as $admin) {
                Mail::to($admin->email)->send(new PenaltyCalculationReport($results));
            }

            Log::info('Penalty calculation report sent to admins');
        } catch (\Exception $e) {
            Log::error('Failed to send penalty calculation report', [
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Update penalty statistics in cache
     */
    private function updatePenaltyStatisticsCache(PenaltyService $penaltyService): void
    {
        try {
            $statistics = $penaltyService->getPenaltyStatistics();
            
            // Cache statistics for 1 hour
            cache()->put('penalty_statistics', $statistics, now()->addHour());
            
            Log::info('Penalty statistics cache updated', $statistics);
        } catch (\Exception $e) {
            Log::error('Failed to update penalty statistics cache', [
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Notify admins of job failure
     */
    private function notifyAdminsOfFailure(\Throwable $exception): void
    {
        try {
            $adminUsers = User::whereHas('role', function($query) {
                $query->whereIn('name', ['admin', 'secretary']);
            })->get();

            $errorData = [
                'job_name' => 'Penalty Calculation',
                'error_message' => $exception->getMessage(),
                'failed_at' => now()->format('Y-m-d H:i:s'),
                'attempts' => $this->attempts()
            ];

            foreach ($adminUsers as $admin) {
                // You can create a specific mail class for job failures
                // Mail::to($admin->email)->send(new JobFailureNotification($errorData));
            }

        } catch (\Exception $e) {
            Log::error('Failed to notify admins of job failure', [
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Get the tags that should be assigned to the job.
     */
    public function tags(): array
    {
        return ['penalties', 'calculation', 'monthly'];
    }
}
