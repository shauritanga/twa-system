<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Services\AuditService;
use Illuminate\Support\Facades\Auth;

class AuditMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Only audit authenticated requests
        if (Auth::check()) {
            $this->auditRequest($request, $response);
        }

        return $response;
    }

    /**
     * Audit the request
     */
    private function auditRequest(Request $request, Response $response): void
    {
        // Skip certain routes to avoid noise
        if ($this->shouldSkipAudit($request)) {
            return;
        }

        $action = $this->getActionFromRequest($request);
        $category = $this->getCategoryFromRequest($request);
        $severity = $this->getSeverityFromRequest($request, $response);

        // Log page access
        AuditService::log([
            'action' => $action,
            'category' => $category,
            'severity' => $severity,
            'description' => $this->getDescription($request, $action),
            'properties' => [
                'route' => $request->route() ? $request->route()->getName() : null,
                'parameters' => $request->route() ? $request->route()->parameters() : [],
                'status_code' => $response->getStatusCode(),
            ],
        ]);
    }

    /**
     * Determine if we should skip auditing this request
     */
    private function shouldSkipAudit(Request $request): bool
    {
        $skipRoutes = [
            'debugbar.*',
            '*.css',
            '*.js',
            '*.png',
            '*.jpg',
            '*.jpeg',
            '*.gif',
            '*.svg',
            '*.ico',
            'livewire.*',
        ];

        $currentRoute = $request->route() ? $request->route()->getName() : null;

        foreach ($skipRoutes as $pattern) {
            if (fnmatch($pattern, $currentRoute)) {
                return true;
            }
        }

        // Skip GET requests to certain paths to reduce noise
        if ($request->isMethod('GET')) {
            $skipPaths = [
                '/admin/audit-logs',
                '/admin/dashboard',
            ];

            foreach ($skipPaths as $path) {
                if (str_starts_with($request->path(), trim($path, '/'))) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Get action from request
     */
    private function getActionFromRequest(Request $request): string
    {
        $method = strtolower($request->method());
        $route = $request->route() ? $request->route()->getName() : null;

        if ($route) {
            // Extract action from route name
            $parts = explode('.', $route);
            $action = end($parts);

            if (in_array($action, ['index', 'show', 'create', 'store', 'edit', 'update', 'destroy'])) {
                return $action;
            }
        }

        return match($method) {
            'get' => 'view',
            'post' => 'create',
            'put', 'patch' => 'update',
            'delete' => 'delete',
            default => 'access',
        };
    }

    /**
     * Get category from request
     */
    private function getCategoryFromRequest(Request $request): string
    {
        $path = $request->path();

        if (str_contains($path, 'member')) {
            return 'member';
        }

        if (str_contains($path, 'financial') || str_contains($path, 'contribution') || str_contains($path, 'debt')) {
            return 'financial';
        }

        if (str_contains($path, 'setting') || str_contains($path, 'admin')) {
            return 'system';
        }

        if (str_contains($path, 'auth') || str_contains($path, 'login') || str_contains($path, 'logout')) {
            return 'auth';
        }

        return 'general';
    }

    /**
     * Get severity from request and response
     */
    private function getSeverityFromRequest(Request $request, Response $response): string
    {
        $statusCode = $response->getStatusCode();

        if ($statusCode >= 500) {
            return 'critical';
        }

        if ($statusCode >= 400) {
            return 'high';
        }

        if ($request->isMethod('DELETE')) {
            return 'high';
        }

        if (in_array($request->method(), ['POST', 'PUT', 'PATCH'])) {
            return 'medium';
        }

        return 'low';
    }

    /**
     * Get description for the request
     */
    private function getDescription(Request $request, string $action): string
    {
        $route = $request->route() ? $request->route()->getName() : null;
        $path = $request->path();
        $method = strtoupper($request->method());

        if ($route) {
            return "Accessed route '{$route}' ({$method})";
        }

        return "Accessed '{$path}' ({$method})";
    }
}
