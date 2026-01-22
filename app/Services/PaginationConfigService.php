<?php

namespace App\Services;

use App\Helpers\SettingsHelper;
use Illuminate\Support\Facades\Cache;

class PaginationConfigService
{
    private const CACHE_KEY = 'pagination_config';
    private const CACHE_DURATION = 3600; // 1 hour

    /**
     * Get items per page
     */
    public function getItemsPerPage(): int
    {
        return Cache::remember(self::CACHE_KEY . '_items_per_page', self::CACHE_DURATION, function () {
            return SettingsHelper::getInt('items_per_page', 20);
        });
    }

    /**
     * Clear cache
     */
    public static function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY . '_items_per_page');
    }
}
