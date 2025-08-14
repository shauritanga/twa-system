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
            // Get session ID, fallback to generating one if session not available
            $sessionId = null;
            try {
                $sessionId = session()->getId();
                if (empty($sessionId)) {
                    session()->start();
                    $sessionId = session()->getId();
                }
            } catch (\Exception $e) {
                // If session fails, create a unique identifier based on IP and user agent
                $sessionId = md5($request->ip() . $request->userAgent() . date('Y-m-d'));
            }

            $ipAddress = $request->ip();

            // Check if this session/IP has already been counted today
            $existingVisit = self::where(function($query) use ($sessionId, $ipAddress) {
                    $query->where('session_id', $sessionId)
                          ->orWhere('ip_address', $ipAddress);
                })
                ->whereDate('visited_at', Carbon::today())
                ->first();

            if (!$existingVisit) {
                self::create([
                    'ip_address' => $ipAddress,
                    'user_agent' => $request->userAgent() ?? 'Unknown',
                    'page_url' => $request->fullUrl(),
                    'referrer' => $request->header('referer'),
                    'session_id' => $sessionId,
                    'visited_at' => now(),
                ]);

                return true; // Visit recorded
            }

            return false; // Visit already recorded today
        } catch (\Exception $e) {
            \Log::error('Error recording website visit', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'url' => $request->fullUrl(),
                'ip' => $request->ip(),
            ]);
            return false;
        }
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
