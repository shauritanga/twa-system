<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\ContributionAllocation;
use App\Models\Setting;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentService
{
    /**
     * Process a payment and create allocations
     */
    public function processPayment(array $paymentData)
    {
        return DB::transaction(function () use ($paymentData) {
            // Create the payment record
            $payment = Payment::create([
                'member_id' => $paymentData['member_id'],
                'amount' => $paymentData['amount'],
                'payment_date' => $paymentData['payment_date'],
                'payment_type' => $paymentData['payment_type'],
                'purpose' => $paymentData['purpose'],
                'notes' => $paymentData['notes'] ?? null,
                'payment_method' => $paymentData['payment_method'] ?? null,
                'reference_number' => $paymentData['reference_number'] ?? null,
            ]);

            // Create allocations based on payment type
            if ($paymentData['payment_type'] === 'monthly') {
                $this->allocateMonthlyPayment($payment, $paymentData);
            } else {
                $this->allocateOtherPayment($payment, $paymentData);
            }

            return $payment->load('allocations');
        });
    }

    /**
     * Allocate a monthly payment across months
     */
    private function allocateMonthlyPayment(Payment $payment, array $paymentData)
    {
        $monthlyAmount = $this->getMonthlyContributionAmount();
        $remainingAmount = $payment->amount;
        $startMonth = $paymentData['contribution_month'] ?? date('Y-m', strtotime($payment->payment_date));
        $currentMonth = $startMonth;

        Log::info('Starting monthly payment allocation', [
            'payment_id' => $payment->id,
            'total_amount' => $payment->amount,
            'monthly_amount' => $monthlyAmount,
            'start_month' => $startMonth,
        ]);

        // First, check if current month has partial payments and complete it
        $existingForCurrentMonth = $this->getMonthTotal($payment->member_id, $currentMonth);
        
        if ($existingForCurrentMonth > 0 && $existingForCurrentMonth < $monthlyAmount) {
            // Complete the current month
            $neededForCurrentMonth = $monthlyAmount - $existingForCurrentMonth;
            $amountForCurrentMonth = min($remainingAmount, $neededForCurrentMonth);

            ContributionAllocation::create([
                'payment_id' => $payment->id,
                'member_id' => $payment->member_id,
                'allocated_amount' => $amountForCurrentMonth,
                'contribution_month' => $currentMonth,
                'allocation_type' => 'current',
                'notes' => "Completing partial payment for " . date('F Y', strtotime($currentMonth)),
            ]);

            $remainingAmount -= $amountForCurrentMonth;
            $currentMonth = date('Y-m', strtotime($currentMonth . ' +1 month'));
            
            Log::info('Completed partial month', [
                'month' => $startMonth,
                'allocated' => $amountForCurrentMonth,
                'remaining' => $remainingAmount,
            ]);
        } elseif ($existingForCurrentMonth == 0) {
            // No existing contributions for current month, fill it first
            $amountForCurrentMonth = min($remainingAmount, $monthlyAmount);

            ContributionAllocation::create([
                'payment_id' => $payment->id,
                'member_id' => $payment->member_id,
                'allocated_amount' => $amountForCurrentMonth,
                'contribution_month' => $currentMonth,
                'allocation_type' => $amountForCurrentMonth >= $monthlyAmount ? 'current' : 'partial',
                'notes' => date('F Y', strtotime($currentMonth)),
            ]);

            $remainingAmount -= $amountForCurrentMonth;
            
            if ($amountForCurrentMonth >= $monthlyAmount) {
                $currentMonth = date('Y-m', strtotime($currentMonth . ' +1 month'));
            }
            
            Log::info('Allocated to current month', [
                'month' => $startMonth,
                'allocated' => $amountForCurrentMonth,
                'remaining' => $remainingAmount,
            ]);
        } else {
            // Current month is already complete, move to next month
            $currentMonth = date('Y-m', strtotime($currentMonth . ' +1 month'));
        }

        // Distribute remaining amount across future months
        while ($remainingAmount > 0) {
            $existingForMonth = $this->getMonthTotal($payment->member_id, $currentMonth);

            if ($existingForMonth >= $monthlyAmount) {
                // This month is already complete, skip to next
                $currentMonth = date('Y-m', strtotime($currentMonth . ' +1 month'));
                continue;
            }

            $neededForMonth = $monthlyAmount - $existingForMonth;
            $amountForMonth = min($remainingAmount, $neededForMonth);
            $allocationType = $amountForMonth >= $neededForMonth ? 'advance' : 'partial';

            ContributionAllocation::create([
                'payment_id' => $payment->id,
                'member_id' => $payment->member_id,
                'allocated_amount' => $amountForMonth,
                'contribution_month' => $currentMonth,
                'allocation_type' => $allocationType,
                'notes' => "Advance payment for " . date('F Y', strtotime($currentMonth)),
            ]);

            $remainingAmount -= $amountForMonth;
            
            Log::info('Allocated to future month', [
                'month' => $currentMonth,
                'allocated' => $amountForMonth,
                'type' => $allocationType,
                'remaining' => $remainingAmount,
            ]);

            if ($amountForMonth >= $neededForMonth) {
                $currentMonth = date('Y-m', strtotime($currentMonth . ' +1 month'));
            } else {
                // Partial payment, stay on this month for next payment
                break;
            }
        }

        Log::info('Completed monthly payment allocation', [
            'payment_id' => $payment->id,
            'allocations_created' => $payment->allocations()->count(),
        ]);
    }

    /**
     * Allocate an "other" type payment (no month distribution)
     */
    private function allocateOtherPayment(Payment $payment, array $paymentData)
    {
        ContributionAllocation::create([
            'payment_id' => $payment->id,
            'member_id' => $payment->member_id,
            'allocated_amount' => $payment->amount,
            'contribution_month' => date('Y-m', strtotime($payment->payment_date)),
            'allocation_type' => 'current',
            'notes' => $paymentData['purpose'],
        ]);
    }

    /**
     * Get total allocated amount for a member in a specific month
     */
    private function getMonthTotal($memberId, $month)
    {
        return ContributionAllocation::where('member_id', $memberId)
            ->where('contribution_month', $month)
            ->sum('allocated_amount');
    }

    /**
     * Get monthly contribution amount from settings
     */
    private function getMonthlyContributionAmount()
    {
        $setting = Setting::where('key', 'monthly_contribution_amount')->first();
        return $setting ? (float)$setting->value : 50000;
    }

    /**
     * Get member's payment history with allocations
     */
    public function getMemberPaymentHistory($memberId, $year = null)
    {
        $query = Payment::with('allocations')
            ->where('member_id', $memberId)
            ->orderBy('payment_date', 'desc');

        if ($year) {
            $query->whereYear('payment_date', $year);
        }

        return $query->get();
    }

    /**
     * Get member's monthly allocations grouped by month
     */
    public function getMemberMonthlyAllocations($memberId, $year = null)
    {
        $query = ContributionAllocation::with('payment')
            ->where('member_id', $memberId);

        if ($year) {
            // contribution_month is stored as 'YYYY-MM' string, so use LIKE
            $query->where('contribution_month', 'LIKE', $year . '-%');
        }

        $allocations = $query->orderBy('contribution_month', 'asc')->get();

        // Group by month
        $grouped = [];
        foreach ($allocations as $allocation) {
            $month = $allocation->contribution_month;
            if (!isset($grouped[$month])) {
                $grouped[$month] = [];
            }
            $grouped[$month][] = $allocation;
        }

        return $grouped;
    }
}
