<?php

namespace App\Http\Controllers;

use App\Services\SessionTimeoutService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class SessionController extends Controller
{
    public function __construct(
        private SessionTimeoutService $sessionTimeoutService
    ) {}

    /**
     * Get current session status
     *
     * @return JsonResponse
     */
    public function status(): JsonResponse
    {
        if (!Auth::check()) {
            return response()->json([
                'authenticated' => false,
                'message' => 'Not authenticated'
            ], 401);
        }

        return response()->json([
            'authenticated' => true,
            'session' => $this->sessionTimeoutService->getConfigForFrontend(),
        ]);
    }

    /**
     * Extend the current session
     *
     * @return JsonResponse
     */
    public function extend(): JsonResponse
    {
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'Not authenticated'
            ], 401);
        }

        $result = $this->sessionTimeoutService->extendSession();

        return response()->json($result);
    }

    /**
     * Check if session timeout warning should be shown
     *
     * @return JsonResponse
     */
    public function checkWarning(): JsonResponse
    {
        if (!Auth::check()) {
            return response()->json([
                'show_warning' => false,
                'authenticated' => false
            ]);
        }

        $shouldShow = $this->sessionTimeoutService->shouldShowWarning();

        if ($shouldShow) {
            $this->sessionTimeoutService->markWarningShown();
        }

        return response()->json([
            'show_warning' => $shouldShow,
            'remaining_seconds' => $this->sessionTimeoutService->getRemainingSeconds(),
            'timeout_minutes' => $this->sessionTimeoutService->getTimeoutMinutes(),
            'human_readable' => $this->sessionTimeoutService->getHumanReadableTimeRemaining(),
        ]);
    }

    /**
     * Heartbeat endpoint to keep session alive
     *
     * @return JsonResponse
     */
    public function heartbeat(): JsonResponse
    {
        if (!Auth::check()) {
            return response()->json([
                'authenticated' => false
            ], 401);
        }

        // Update last activity
        $this->sessionTimeoutService->updateLastActivity();

        return response()->json([
            'authenticated' => true,
            'remaining_seconds' => $this->sessionTimeoutService->getRemainingSeconds(),
            'timestamp' => now()->toISOString(),
        ]);
    }
}
