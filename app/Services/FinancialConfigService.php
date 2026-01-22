<?php

namespace App\Services;

use App\Helpers\SettingsHelper;
use Illuminate\Support\Facades\Cache;

class FinancialConfigService
{
    private const CACHE_KEY = 'financial_config';
    private const CACHE_DURATION = 3600; // 1 hour

    /**
     * Get fiscal year start month
     */
    public function getFiscalYearStartMonth(): int
    {
        return Cache::remember(self::CACHE_KEY . '_fiscal_year_start', self::CACHE_DURATION, function () {
            return SettingsHelper::getInt('fiscal_year_start_month', 1);
        });
    }

    /**
     * Get receipt number prefix
     */
    public function getReceiptPrefix(): string
    {
        return Cache::remember(self::CACHE_KEY . '_receipt_prefix', self::CACHE_DURATION, function () {
            return SettingsHelper::get('receipt_number_prefix', 'RCP');
        });
    }

    /**
     * Get invoice number prefix
     */
    public function getInvoicePrefix(): string
    {
        return Cache::remember(self::CACHE_KEY . '_invoice_prefix', self::CACHE_DURATION, function () {
            return SettingsHelper::get('invoice_number_prefix', 'INV');
        });
    }

    /**
     * Get tax rate
     */
    public function getTaxRate(): float
    {
        return Cache::remember(self::CACHE_KEY . '_tax_rate', self::CACHE_DURATION, function () {
            return SettingsHelper::getFloat('tax_rate', 0.0);
        });
    }

    /**
     * Generate next receipt number
     */
    public function generateReceiptNumber(): string
    {
        $prefix = $this->getReceiptPrefix();
        $year = date('Y');
        $month = date('m');
        
        // Get last receipt for this month
        $lastReceipt = \App\Models\Contribution::whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->orderBy('id', 'desc')
            ->first();
        
        $nextNumber = $lastReceipt ? ($lastReceipt->id % 10000) + 1 : 1;
        
        return $prefix . '-' . $year . $month . '-' . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
    }

    /**
     * Generate next invoice number
     */
    public function generateInvoiceNumber(): string
    {
        $prefix = $this->getInvoicePrefix();
        $year = date('Y');
        $month = date('m');
        
        $nextNumber = rand(1000, 9999); // Simplified for now
        
        return $prefix . '-' . $year . $month . '-' . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
    }

    /**
     * Calculate tax amount
     */
    public function calculateTax(float $amount): float
    {
        $taxRate = $this->getTaxRate();
        return $amount * ($taxRate / 100);
    }

    /**
     * Clear cache
     */
    public static function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY . '_fiscal_year_start');
        Cache::forget(self::CACHE_KEY . '_receipt_prefix');
        Cache::forget(self::CACHE_KEY . '_invoice_prefix');
        Cache::forget(self::CACHE_KEY . '_tax_rate');
    }
}
