<?php

namespace App\Services;

use App\Helpers\SettingsHelper;
use Illuminate\Support\Facades\Cache;

class MemberConfigService
{
    private const CACHE_KEY = 'member_config';
    private const CACHE_DURATION = 3600; // 1 hour

    /**
     * Get member ID prefix
     */
    public function getIdPrefix(): string
    {
        return Cache::remember(self::CACHE_KEY . '_id_prefix', self::CACHE_DURATION, function () {
            return SettingsHelper::get('member_id_prefix', 'MEM');
        });
    }

    /**
     * Check if auto-approve is enabled
     */
    public function isAutoApproveEnabled(): bool
    {
        return Cache::remember(self::CACHE_KEY . '_auto_approve', self::CACHE_DURATION, function () {
            return SettingsHelper::getBool('auto_approve_members', false);
        });
    }

    /**
     * Generate next member ID
     */
    public function generateMemberId(): string
    {
        $prefix = $this->getIdPrefix();
        $lastMember = \App\Models\Member::orderBy('id', 'desc')->first();
        $nextNumber = $lastMember ? $lastMember->id + 1 : 1;
        
        return $prefix . '-' . str_pad($nextNumber, 5, '0', STR_PAD_LEFT);
    }

    /**
     * Clear cache
     */
    public static function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY . '_id_prefix');
        Cache::forget(self::CACHE_KEY . '_auto_approve');
    }
}
