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
        $sessionId = session()->getId();
        $ipAddress = $request->ip();

        // Check if this session has already been counted today
        $existingVisit = self::where('session_id', $sessionId)
            ->where('ip_address', $ipAddress)
            ->whereDate('visited_at', Carbon::today())
            ->first();

        if (!$existingVisit) {
            self::create([
                'ip_address' => $ipAddress,
                'user_agent' => $request->userAgent(),
                'page_url' => $request->fullUrl(),
                'referrer' => $request->header('referer'),
                'session_id' => $sessionId,
                'visited_at' => now(),
            ]);
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
