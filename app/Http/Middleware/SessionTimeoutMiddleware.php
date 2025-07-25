<?php

namespace App\Http\Middleware;

use App\Services\SessionTimeoutService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class SessionTimeoutMiddleware
{
    public function __construct(
        private SessionTimeoutService $sessionTimeoutService
    ) {}

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only apply to authenticated users
        if (!Auth::check()) {
            return $next($request);
        }

        // Skip timeout check for certain routes
        if ($this->shouldSkipTimeoutCheck($request)) {
            return $next($request);
        }

        // Check if session timeout is enabled
        if (!$this->sessionTimeoutService->isEnabled()) {
            return $next($request);
        }

        // Check if session has timed out
        if ($this->sessionTimeoutService->hasTimedOut()) {
            // Logout user due to timeout
            $this->sessionTimeoutService->logoutDueToTimeout();

            // Handle different request types
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'message' => 'Session expired due to inactivity',
                    'redirect' => route('login'),
                    'timeout' => true,
                ], 401);
            }

            // For Inertia requests
            if ($request->header('X-Inertia')) {
                return redirect()->route('login')->with('message', 'Your session has expired due to inactivity. Please log in again.');
            }

            // Regular web requests
            return redirect()->route('login')->with('message', 'Your session has expired due to inactivity. Please log in again.');
        }

        // Update last activity for valid requests
        if ($this->shouldUpdateActivity($request)) {
            $this->sessionTimeoutService->updateLastActivity();
        }

        return $next($request);
    }

    /**
     * Determine if timeout check should be skipped for this request
     *
     * @param Request $request
     * @return bool
     */
    private function shouldSkipTimeoutCheck(Request $request): bool
    {
        $skipRoutes = [
            'logout',
            'session.extend',
            'session.status',
        ];

        $skipPaths = [
            'api/session/*',
            'heartbeat',
            'health-check',
        ];

        // Skip for specific routes
        if (in_array($request->route()?->getName(), $skipRoutes)) {
            return true;
        }

        // Skip for specific paths
        foreach ($skipPaths as $path) {
            if ($request->is($path)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Determine if this request should update the last activity timestamp
     *
     * @param Request $request
     * @return bool
     */
    private function shouldUpdateActivity(Request $request): bool
    {
        // Don't update activity for these request types
        $skipMethods = ['HEAD', 'OPTIONS'];

        if (in_array($request->method(), $skipMethods)) {
            return false;
        }

        // Don't update for asset requests
        $assetPaths = [
            'css/*',
            'js/*',
            'images/*',
            'fonts/*',
            'favicon.ico',
        ];

        foreach ($assetPaths as $path) {
            if ($request->is($path)) {
                return false;
            }
        }

        return true;
    }
}
