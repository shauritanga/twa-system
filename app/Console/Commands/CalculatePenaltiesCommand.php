<?php

namespace App\Console\Commands;

use App\Services\PenaltyService;
use App\Jobs\CalculatePenaltiesJob;
use Illuminate\Console\Command;

class CalculatePenaltiesCommand extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'penalties:calculate 
                            {--member= : Calculate penalties for specific member ID}
                            {--queue : Run calculation in background queue}
                            {--dry-run : Show what would be calculated without actually creating penalties}
                            {--recalculate : Recalculate existing unpaid penalties with current rates}';

    /**
     * The console command description.
     */
    protected $description = 'Calculate penalties for missed contributions';

    protected PenaltyService $penaltyService;

    /**
     * Create a new command instance.
     */
    public function __construct(PenaltyService $penaltyService)
    {
        parent::__construct();
        $this->penaltyService = $penaltyService;
    }

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('🚀 Starting penalty calculation...');

        // Handle queue option
        if ($this->option('queue')) {
            return $this->handleQueuedCalculation();
        }

        // Handle recalculation option
        if ($this->option('recalculate')) {
            return $this->handleRecalculation();
        }

        // Handle specific member option
        if ($memberId = $this->option('member')) {
            return $this->handleSingleMemberCalculation($memberId);
        }

        // Handle dry run
        if ($this->option('dry-run')) {
            return $this->handleDryRun();
        }

        // Default: calculate for all members
        return $this->handleAllMembersCalculation();
    }

    /**
     * Handle queued calculation
     */
    private function handleQueuedCalculation(): int
    {
        $this->info('📤 Dispatching penalty calculation job to queue...');
        
        CalculatePenaltiesJob::dispatch();
        
        $this->info('✅ Job dispatched successfully!');
        $this->line('You can monitor the job progress in the queue dashboard or logs.');
        
        return 0;
    }

    /**
     * Handle penalty recalculation
     */
    private function handleRecalculation(): int
    {
        $this->info('🔄 Recalculating existing unpaid penalties...');

        // Get current settings
        $monthlyContribution = \App\Models\Setting::where('key', 'monthly_contribution_amount')->first();
        $penaltyRate = \App\Models\Setting::where('key', 'penalty_percentage_rate')->first();

        $contributionAmount = $monthlyContribution ? (float) $monthlyContribution->value : 50000.0;
        $penaltyRateValue = $penaltyRate ? (float) $penaltyRate->value : 10.0;

        $this->line("Using rates: Contribution = {$contributionAmount} TZS, Penalty = {$penaltyRateValue}%");

        if (!$this->confirm('Do you want to proceed with recalculation?')) {
            $this->info('Recalculation cancelled.');
            return 0;
        }

        $results = $this->penaltyService->recalculateExistingPenalties($contributionAmount, $penaltyRateValue);

        $this->displayRecalculationResults($results);

        return empty($results['errors']) ? 0 : 1;
    }

    /**
     * Handle single member calculation
     */
    private function handleSingleMemberCalculation(int $memberId): int
    {
        $this->info("👤 Calculating penalties for member ID: {$memberId}");

        $member = \App\Models\Member::find($memberId);
        if (!$member) {
            $this->error("Member with ID {$memberId} not found!");
            return 1;
        }

        $this->line("Member: {$member->name}");

        try {
            $results = $this->penaltyService->calculatePenaltiesForMember($member);
            
            if ($results['penalties_created'] > 0) {
                $this->info("✅ Created {$results['penalties_created']} penalties for months: " . implode(', ', $results['months']));
            } else {
                $this->info("✅ No new penalties needed for this member.");
            }

            return 0;
        } catch (\Exception $e) {
            $this->error("Error calculating penalties for member: " . $e->getMessage());
            return 1;
        }
    }

    /**
     * Handle dry run
     */
    private function handleDryRun(): int
    {
        $this->info('🔍 Dry run - showing what would be calculated...');

        // This would need to be implemented in the service
        $this->warn('Dry run functionality not yet implemented.');
        $this->line('This would show which members would get penalties without actually creating them.');

        return 0;
    }

    /**
     * Handle calculation for all members
     */
    private function handleAllMembersCalculation(): int
    {
        $this->info('👥 Calculating penalties for all members...');

        $progressBar = $this->output->createProgressBar();
        $progressBar->setFormat('verbose');

        try {
            $results = $this->penaltyService->calculatePenaltiesForAllMembers();
            $progressBar->finish();
            $this->newLine(2);

            $this->displayCalculationResults($results);

            return empty($results['errors']) ? 0 : 1;
        } catch (\Exception $e) {
            $progressBar->finish();
            $this->newLine();
            $this->error('Calculation failed: ' . $e->getMessage());
            return 1;
        }
    }

    /**
     * Display calculation results
     */
    private function displayCalculationResults(array $results): void
    {
        $this->info('📊 Calculation Results:');
        $this->table(
            ['Metric', 'Value'],
            [
                ['Members Processed', $results['processed']],
                ['Penalties Created', $results['penalties_created']],
                ['Errors', count($results['errors'])],
            ]
        );

        if ($results['penalties_created'] > 0) {
            $this->info('👤 Members with new penalties:');
            foreach ($results['summary'] as $member) {
                $this->line("  • {$member['member_name']} ({$member['penalties_created']} penalties)");
            }
        }

        if (!empty($results['errors'])) {
            $this->error('❌ Errors encountered:');
            foreach ($results['errors'] as $error) {
                if (isset($error['member_name'])) {
                    $this->line("  • {$error['member_name']}: {$error['error']}");
                } else {
                    $this->line("  • General: {$error['general']}");
                }
            }
        }
    }

    /**
     * Display recalculation results
     */
    private function displayRecalculationResults(array $results): void
    {
        $this->info('📊 Recalculation Results:');
        $this->table(
            ['Metric', 'Value'],
            [
                ['Penalties Updated', $results['updated']],
                ['Errors', count($results['errors'])],
            ]
        );

        if (!empty($results['errors'])) {
            $this->error('❌ Errors encountered:');
            foreach ($results['errors'] as $error) {
                if (isset($error['penalty_id'])) {
                    $this->line("  • Penalty ID {$error['penalty_id']}: {$error['error']}");
                } else {
                    $this->line("  • General: {$error['general']}");
                }
            }
        }
    }
}
