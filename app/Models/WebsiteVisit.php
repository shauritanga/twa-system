<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class WebsiteVisit extends Model
{
    protected $fillable = [
        'ip_address',
        'user_agent',
        'page_url',
        'referrer',
        'session_id',
        'visited_at',
    ];

    protected $casts = [
        'visited_at' => 'datetime',
    ];

    /**
     * Record a new visit
     */
    public static function recordVisit($request)
    {
        try {
            // Get real IP address (handle proxies/CDNs)
            $ipAddress = self::getRealIpAddress($request);

            // Generate session identifier
            $sessionId = self::getSessionIdentifier($request);

            // Use cache to check recent visits (performance optimization)
            $cacheKey = "visit_check_{$sessionId}";
            if (\Cache::has($cacheKey)) {
                return false; // Already recorded recently
            }

            // Option 1: Count every page view (uncomment to enable)
            // $existingVisit = false;

            // Option 2: Count unique sessions per hour (more frequent counting)
            // $existingVisit = self::where('session_id', $sessionId)
            //     ->where('visited_at', '>=', now()->subHours(1))
            //     ->exists();

            // Option 3: Count unique sessions per day (current - recommended)
            $existingVisit = self::where('session_id', $sessionId)
                ->where('visited_at', '>=', now()->subHours(24))
                ->exists();

            if (!$existingVisit) {
                $visitData = [
                    'ip_address' => $ipAddress,
                    'user_agent' => substr($request->userAgent() ?? 'Unknown', 0, 500),
                    'page_url' => substr($request->fullUrl(), 0, 500),
                    'referrer' => substr($request->header('referer'), 0, 500),
                    'session_id' => $sessionId,
                    'visited_at' => now(),
                ];

                // Try to queue the write, fallback to direct write
                try {
                    if (config('queue.default') !== 'sync') {
                        \Queue::push(function() use ($visitData) {
                            self::create($visitData);
                        });
                    } else {
                        // Direct write if queue is sync or not available
                        self::create($visitData);
                    }
                } catch (\Exception $e) {
                    // Fallback to direct write if queue fails
                    try {
                        self::create($visitData);
                    } catch (\Exception $e2) {
                        \Log::error('Failed to record visit', [
                            'error' => $e2->getMessage(),
                            'session_id' => $sessionId,
                        ]);
                        return false;
                    }
                }

                // Cache the visit to prevent duplicates
                \Cache::put($cacheKey, true, now()->addHours(24));

                return true; // Visit recorded
            }

            return false; // Visit already recorded
        } catch (\Exception $e) {
            \Log::error('Error recording website visit', [
                'error' => $e->getMessage(),
                'url' => $request->fullUrl(),
                'ip' => $request->ip(),
            ]);
            return false;
        }
    }

    /**
     * Get real IP address handling proxies and CDNs
     */
    private static function getRealIpAddress($request)
    {
        // Check for IP from shared internet
        if (!empty($request->server('HTTP_CLIENT_IP'))) {
            return $request->server('HTTP_CLIENT_IP');
        }
        // Check for IP passed from proxy
        elseif (!empty($request->server('HTTP_X_FORWARDED_FOR'))) {
            // Can contain multiple IPs, get the first one
            $ips = explode(',', $request->server('HTTP_X_FORWARDED_FOR'));
            return trim($ips[0]);
        }
        // Check for IP from remote address
        else {
            return $request->ip();
        }
    }

    /**
     * Generate session identifier with fallbacks
     */
    private static function getSessionIdentifier($request)
    {
        try {
            $sessionId = session()->getId();
            if (!empty($sessionId)) {
                return $sessionId;
            }

            // Try to start session
            session()->start();
            $sessionId = session()->getId();
            if (!empty($sessionId)) {
                return $sessionId;
            }
        } catch (\Exception $e) {
            // Session failed, create fingerprint
        }

        // Fallback: Create unique identifier based on IP, user agent, and date
        $fingerprint = $request->ip() .
                      substr($request->userAgent() ?? '', 0, 100) .
                      date('Y-m-d');

        return 'fp_' . md5($fingerprint);
    }

    /**
     * Get total unique visits
     */
    public static function getTotalVisits()
    {
        return self::count();
    }

    /**
     * Get unique visits today
     */
    public static function getTodayVisits()
    {
        return self::whereDate('visited_at', Carbon::today())->count();
    }

    /**
     * Get unique visits this month
     */
    public static function getMonthlyVisits()
    {
        return self::whereMonth('visited_at', Carbon::now()->month)
            ->whereYear('visited_at', Carbon::now()->year)
            ->count();
    }
}
