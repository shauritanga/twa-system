<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Contribution;
use App\Models\Payment;
use App\Models\ContributionAllocation;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Migrate existing contributions to the new payment/allocation system
        $contributions = Contribution::orderBy('date')->get();
        
        // Group contributions by member, date, and type to identify actual payments
        $paymentGroups = [];
        
        foreach ($contributions as $contribution) {
            $key = $contribution->member_id . '|' . $contribution->date . '|' . $contribution->type . '|' . $contribution->purpose;
            
            if (!isset($paymentGroups[$key])) {
                $paymentGroups[$key] = [
                    'member_id' => $contribution->member_id,
                    'date' => $contribution->date,
                    'type' => $contribution->type,
                    'purpose' => $contribution->purpose,
                    'notes' => $contribution->notes,
                    'contributions' => [],
                ];
            }
            
            $paymentGroups[$key]['contributions'][] = $contribution;
        }
        
        // Create payments and allocations
        foreach ($paymentGroups as $group) {
            // Calculate total amount for this payment
            $totalAmount = array_sum(array_column($group['contributions'], 'amount'));
            
            // Create payment record
            $payment = Payment::create([
                'member_id' => $group['member_id'],
                'amount' => $totalAmount,
                'payment_date' => $group['date'],
                'payment_type' => $group['type'],
                'purpose' => $group['purpose'],
                'notes' => $group['notes'] . ' (Migrated from old system)',
            ]);
            
            // Create allocations for each contribution
            foreach ($group['contributions'] as $contribution) {
                $allocationType = 'current';
                
                // Determine allocation type based on notes or purpose
                if (strpos($contribution->notes, 'Advance') !== false || strpos($contribution->purpose, 'Advance') !== false) {
                    $allocationType = 'advance';
                } elseif (strpos($contribution->notes, 'Partial') !== false || strpos($contribution->purpose, 'Partial') !== false) {
                    $allocationType = 'partial';
                }
                
                ContributionAllocation::create([
                    'payment_id' => $payment->id,
                    'member_id' => $contribution->member_id,
                    'allocated_amount' => $contribution->amount,
                    'contribution_month' => $contribution->contribution_month ?: date('Y-m', strtotime($contribution->date)),
                    'allocation_type' => $allocationType,
                    'notes' => $contribution->notes ?: $contribution->purpose,
                ]);
            }
        }
        
        \Log::info('Migrated contributions to payment system', [
            'total_contributions' => $contributions->count(),
            'total_payments' => count($paymentGroups),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Clear the new tables (but keep contributions table intact)
        ContributionAllocation::truncate();
        Payment::truncate();
    }
};
