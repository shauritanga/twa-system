<?php

namespace App\Console\Commands;

use App\Services\PenaltyService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class CalculatePenalties extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'penalties:calculate
                            {--member= : Calculate penalties for a specific member ID}
                            {--force : Force calculation even if not the 5th of the month}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Calculate penalties for members who missed last month\'s contribution';

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
    public function handle()
    {
        $today = now();
        $isForced = $this->option('force');
        $memberId = $this->option('member');

        // Check if it's the 5th of the month (unless forced)
        if (!$isForced && $today->day != 5) {
            $this->warn("Penalty calculation is scheduled for the 5th of each month.");
            $this->info("Current date: {$today->format('Y-m-d')}");
            $this->info("Use --force flag to run calculation anyway.");
            return 0;
        }

        $this->info("Starting penalty calculation...");
        $this->info("Date: {$today->format('Y-m-d H:i:s')}");
        $this->newLine();

        try {
            if ($memberId) {
                // Calculate for specific member
                $member = \App\Models\Member::findOrFail($memberId);
                $this->info("Calculating penalties for member: {$member->name}");
                
                $results = $this->penaltyService->calculatePenaltiesForMember($member);
                
                $this->displayMemberResults($member, $results);
            } else {
                // Calculate for all members
                $this->info("Calculating penalties for all members...");
                $this->newLine();
                
                $results = $this->penaltyService->calculatePenaltiesForAllMembers();
                
                $this->displayResults($results);
            }

            Log::info("Penalty calculation completed successfully", [
                'date' => $today->format('Y-m-d H:i:s'),
                'forced' => $isForced,
                'member_id' => $memberId
            ]);

            return 0;
        } catch (\Exception $e) {
            $this->error("Error calculating penalties: {$e->getMessage()}");
            Log::error("Penalty calculation failed", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return 1;
        }
    }

    /**
     * Display results for a single member
     */
    private function displayMemberResults($member, array $results)
    {
        if ($results['penalties_created'] > 0) {
            $this->info("✓ Created {$results['penalties_created']} penalties for {$member->name}");
            
            if (!empty($results['months'])) {
                $this->table(
                    ['Month'],
                    array_map(fn($month) => [$month], $results['months'])
                );
            }
        } else {
            $this->info("✓ No new penalties needed for {$member->name}");
        }
    }

    /**
     * Display results for all members
     */
    private function displayResults(array $results)
    {
        $this->info("Penalty Calculation Summary");
        $this->info("==========================");
        $this->newLine();

        $this->table(
            ['Metric', 'Value'],
            [
                ['Members Processed', $results['processed']],
                ['Penalties Created', $results['penalties_created']],
                ['Errors', count($results['errors'])],
            ]
        );

        if ($results['penalties_created'] > 0) {
            $this->newLine();
            $this->info("Members with New Penalties:");
            $this->info("===========================");
            
            $tableData = [];
            foreach ($results['summary'] as $item) {
                $tableData[] = [
                    $item['member_name'],
                    $item['penalties_created'],
                    implode(', ', $item['months'])
                ];
            }
            
            $this->table(
                ['Member', 'Penalties', 'Months'],
                $tableData
            );
        }

        if (!empty($results['errors'])) {
            $this->newLine();
            $this->error("Errors Encountered:");
            $this->error("==================");
            
            foreach ($results['errors'] as $error) {
                if (isset($error['member_name'])) {
                    $this->error("• {$error['member_name']}: {$error['error']}");
                } else {
                    $this->error("• General Error: {$error['general']}");
                }
            }
        }

        $this->newLine();
        
        if ($results['penalties_created'] > 0) {
            $this->info("✓ Penalty calculation completed successfully!");
        } else {
            $this->info("✓ No new penalties needed at this time.");
        }
    }
}
