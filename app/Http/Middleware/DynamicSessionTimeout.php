<?php

namespace App\Http\Middleware;

use App\Services\SessionConfigService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Symfony\Component\HttpFoundation\Response;

class DynamicSessionTimeout
{
    /**
     * The session config service instance.
     */
    protected SessionConfigService $sessionConfigService;

    /**
     * Create a new middleware instance.
     */
    public function __construct(SessionConfigService $sessionConfigService)
    {
        $this->sessionConfigService = $sessionConfigService;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Apply dynamic session timeout before processing the request
        $this->applyDynamicSessionTimeout();

        return $next($request);
    }

    /**
     * Apply dynamic session timeout from database settings
     * 
     * @return void
     */
    protected function applyDynamicSessionTimeout(): void
    {
        try {
            // Get session timeout from database
            $timeout = $this->sessionConfigService->getSessionTimeout();
            
            // Apply to current session configuration
            Config::set('session.lifetime', $timeout);
            
            // If session is already started, we need to update the session configuration
            if (session()->isStarted()) {
                // Set the session timeout for the current session
                ini_set('session.gc_maxlifetime', $timeout * 60); // Convert minutes to seconds
            }
            
        } catch (\Exception $e) {
            // Log error but don't break the application
            \Log::warning('Failed to apply dynamic session timeout: ' . $e->getMessage());
            
            // Fallback to default configuration
            Config::set('session.lifetime', 120);
        }
    }
}
