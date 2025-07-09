<?php

namespace App\Services;

use App\Models\Member;
use App\Models\Penalty;
use App\Models\Contribution;
use App\Models\Setting;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PenaltyService
{
    /**
     * Calculate penalties for all members
     */
    public function calculatePenaltiesForAllMembers(): array
    {
        $results = [
            'processed' => 0,
            'penalties_created' => 0,
            'errors' => [],
            'summary' => []
        ];

        try {
            DB::beginTransaction();

            $members = Member::with(['contributions', 'penalties'])->get();
            $settings = $this->getSettings();

            foreach ($members as $member) {
                try {
                    $memberResult = $this->calculatePenaltiesForMember($member, $settings);
                    $results['processed']++;
                    $results['penalties_created'] += $memberResult['penalties_created'];
                    
                    if ($memberResult['penalties_created'] > 0) {
                        $results['summary'][] = [
                            'member_id' => $member->id,
                            'member_name' => $member->name,
                            'penalties_created' => $memberResult['penalties_created'],
                            'months' => $memberResult['months']
                        ];
                    }
                } catch (\Exception $e) {
                    $results['errors'][] = [
                        'member_id' => $member->id,
                        'member_name' => $member->name,
                        'error' => $e->getMessage()
                    ];
                    Log::error("Error calculating penalties for member {$member->id}: " . $e->getMessage());
                }
            }

            DB::commit();
            
            Log::info("Penalty calculation completed", $results);
            
        } catch (\Exception $e) {
            DB::rollBack();
            $results['errors'][] = ['general' => $e->getMessage()];
            Log::error("Penalty calculation failed: " . $e->getMessage());
        }

        return $results;
    }

    /**
     * Calculate penalties for a specific member
     */
    public function calculatePenaltiesForMember(Member $member, ?array $settings = null): array
    {
        if (!$settings) {
            $settings = $this->getSettings();
        }

        $results = [
            'penalties_created' => 0,
            'months' => []
        ];

        $missedMonths = $this->getMissedContributionMonths($member);
        
        foreach ($missedMonths as $month) {
            if ($this->createPenaltyForMonth($member, $month, $settings)) {
                $results['penalties_created']++;
                $results['months'][] = $month;
            }
        }

        return $results;
    }

    /**
     * Get months where member missed contributions
     */
    public function getMissedContributionMonths(Member $member): array
    {
        $missedMonths = [];
        
        // Get member's contributions grouped by month
        $contributions = $member->contributions()
            ->selectRaw('DATE_FORMAT(date, "%Y-%m") as month')
            ->groupBy('month')
            ->pluck('month')
            ->toArray();

        // Calculate months since registration (excluding current month)
        $registrationDate = Carbon::parse($member->created_at);
        $startMonth = $registrationDate->copy()->startOfMonth();
        
        // Add grace period - don't penalize for registration month
        if ($registrationDate->day > 15) {
            $startMonth->addMonth();
        }
        
        $endMonth = Carbon::now()->subMonth()->endOfMonth();
        
        $currentMonth = $startMonth->copy();
        while ($currentMonth <= $endMonth) {
            $monthString = $currentMonth->format('Y-m');
            
            if (!in_array($monthString, $contributions)) {
                $missedMonths[] = $monthString;
            }
            
            $currentMonth->addMonth();
        }

        return $missedMonths;
    }

    /**
     * Create penalty for specific month if not exists
     */
    public function createPenaltyForMonth(Member $member, string $month, array $settings): bool
    {
        // Check if penalty already exists
        $existingPenalty = Penalty::forMember($member->id)
            ->forMonth($month)
            ->exists();

        if ($existingPenalty) {
            return false;
        }

        try {
            $penaltyAmount = Penalty::calculatePenaltyAmount(
                $settings['monthly_contribution_amount'],
                $settings['penalty_percentage_rate']
            );

            Penalty::create([
                'member_id' => $member->id,
                'amount' => $penaltyAmount,
                'reason' => Penalty::generateReason($month),
                'penalty_month' => $month,
                'contribution_amount' => $settings['monthly_contribution_amount'],
                'penalty_rate' => $settings['penalty_percentage_rate'],
                'due_date' => Carbon::now()->addDays(30),
                'status' => 'unpaid',
                'calculated_at' => now(),
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error("Failed to create penalty for member {$member->id}, month {$month}: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Recalculate existing unpaid penalties with new rates
     */
    public function recalculateExistingPenalties(float $newContributionAmount, float $newPenaltyRate): array
    {
        $results = [
            'updated' => 0,
            'errors' => []
        ];

        try {
            DB::beginTransaction();

            Penalty::unpaid()->chunk(100, function ($penalties) use ($newContributionAmount, $newPenaltyRate, &$results) {
                foreach ($penalties as $penalty) {
                    try {
                        $newAmount = Penalty::calculatePenaltyAmount($newContributionAmount, $newPenaltyRate);
                        
                        $penalty->update([
                            'amount' => $newAmount,
                            'contribution_amount' => $newContributionAmount,
                            'penalty_rate' => $newPenaltyRate,
                            'calculated_at' => now(),
                        ]);

                        $results['updated']++;
                    } catch (\Exception $e) {
                        $results['errors'][] = [
                            'penalty_id' => $penalty->id,
                            'error' => $e->getMessage()
                        ];
                    }
                }
            });

            DB::commit();
            Log::info("Recalculated {$results['updated']} penalties");

        } catch (\Exception $e) {
            DB::rollBack();
            $results['errors'][] = ['general' => $e->getMessage()];
            Log::error("Penalty recalculation failed: " . $e->getMessage());
        }

        return $results;
    }

    /**
     * Get penalty calculation settings
     */
    private function getSettings(): array
    {
        $monthlyContributionSetting = Setting::where('key', 'monthly_contribution_amount')->first();
        $penaltyRateSetting = Setting::where('key', 'penalty_percentage_rate')->first();

        return [
            'monthly_contribution_amount' => $monthlyContributionSetting ? 
                (float) $monthlyContributionSetting->value : 50000.0,
            'penalty_percentage_rate' => $penaltyRateSetting ? 
                (float) $penaltyRateSetting->value : 10.0,
        ];
    }

    /**
     * Get penalty statistics
     */
    public function getPenaltyStatistics(): array
    {
        return [
            'total_penalties' => Penalty::count(),
            'unpaid_penalties' => Penalty::unpaid()->count(),
            'paid_penalties' => Penalty::paid()->count(),
            'overdue_penalties' => Penalty::overdue()->count(),
            'total_unpaid_amount' => Penalty::unpaid()->sum('amount'),
            'total_paid_amount' => Penalty::paid()->sum('amount'),
            'members_with_penalties' => Penalty::unpaid()->distinct('member_id')->count(),
        ];
    }

    /**
     * Get list of shame data (members with outstanding penalties/contributions)
     */
    public function getListOfShameData(): Collection
    {
        $settings = $this->getSettings();
        
        return Member::with(['contributions', 'penalties' => function($query) {
            $query->unpaid();
        }])
        ->get()
        ->map(function ($member) use ($settings) {
            $missedMonths = $this->getMissedContributionMonths($member);
            $unpaidPenalties = $member->penalties->where('status', 'unpaid');
            
            $totalPenalties = $unpaidPenalties->sum('amount');
            $missedContributionsTotal = count($missedMonths) * $settings['monthly_contribution_amount'];
            $totalOwed = $totalPenalties + $missedContributionsTotal;
            
            return [
                'member' => $member,
                'missed_months_count' => count($missedMonths),
                'missed_months' => $missedMonths,
                'total_penalties' => $totalPenalties,
                'missed_contributions_total' => $missedContributionsTotal,
                'total_owed' => $totalOwed,
                'unpaid_penalties' => $unpaidPenalties,
                'is_defaulter' => $totalOwed > 0,
            ];
        })
        ->filter(function ($item) {
            return $item['is_defaulter'];
        })
        ->sortByDesc('total_owed')
        ->values();
    }
}
