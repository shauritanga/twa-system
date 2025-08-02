<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Symfony\Component\HttpFoundation\Response;

class EnsureSessionIntegrity
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Skip session integrity checks for logout route to avoid CSRF conflicts
        if ($request->routeIs('logout')) {
            return $next($request);
        }

        // Only apply session integrity checks to auth routes to avoid performance impact
        if ($this->isAuthRoute($request)) {
            // Check for session integrity issues
            if ($this->hasSessionIssues($request)) {
                $this->fixSessionIssues($request);
            }
        }

        // Process the request
        $response = $next($request);

        // Add cache control headers to prevent caching of auth pages
        if ($this->isAuthRoute($request)) {
            $response->headers->set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
            $response->headers->set('Pragma', 'no-cache');
            $response->headers->set('Expires', 'Thu, 01 Jan 1970 00:00:00 GMT');
        }

        return $response;
    }

    /**
     * Check if there are session integrity issues
     */
    private function hasSessionIssues(Request $request): bool
    {
        // Skip CSRF checks for logout route
        if ($request->routeIs('logout')) {
            return false;
        }

        // Check for authentication state mismatch
        if (Auth::check() && $request->routeIs('login')) {
            return true;
        }

        return false;
    }

    /**
     * Fix session integrity issues
     */
    private function fixSessionIssues(Request $request): void
    {
        // Regenerate session to fix CSRF token issues
        if ($request->isMethod('get')) {
            Session::regenerate();
        }

        // Clear authentication state if on login page
        if ($request->routeIs('login') && Auth::check()) {
            Auth::logout();
            Session::invalidate();
            Session::regenerateToken();
        }
    }

    /**
     * Check if this is an authentication-related route
     */
    private function isAuthRoute(Request $request): bool
    {
        return $request->routeIs([
            'login',
            'register',
            'password.*',
            'otp.*',
            'verification.*'
        ]);
    }
}
