<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\WebsiteVisit;

class TrackWebsiteVisits
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Process the request first
        $response = $next($request);

        // Only track visits for successful GET requests to the marketing page
        if ($this->shouldTrackVisit($request, $response)) {
            try {
                WebsiteVisit::recordVisit($request);
            } catch (\Exception $e) {
                // Log error but don't break the request
                \Log::error('Failed to record website visit', [
                    'error' => $e->getMessage(),
                    'url' => $request->fullUrl(),
                    'ip' => $request->ip(),
                ]);
            }
        }

        return $response;
    }

    /**
     * Determine if we should track this visit
     */
    private function shouldTrackVisit(Request $request, Response $response): bool
    {
        // Only track GET requests
        if (!$request->isMethod('GET')) {
            return false;
        }

        // Only track successful responses
        if ($response->getStatusCode() !== 200) {
            return false;
        }

        // Skip tracking for certain paths
        $skipPaths = [
            'admin',
            'member',
            'login',
            'register',
            'password',
            'api',
            'storage',
            'css',
            'js',
            'images',
            'favicon.ico',
        ];

        $path = $request->path();
        foreach ($skipPaths as $skipPath) {
            if (str_starts_with($path, $skipPath)) {
                return false;
            }
        }

        // Skip AJAX requests
        if ($request->ajax() || $request->wantsJson()) {
            return false;
        }

        // Enhanced bot detection
        if ($this->isBot($request)) {
            return false;
        }

        return true;
    }

    /**
     * Enhanced bot detection
     */
    private function isBot(Request $request): bool
    {
        $userAgent = strtolower($request->userAgent() ?? '');

        // Comprehensive bot patterns
        $botPatterns = [
            'bot', 'crawler', 'spider', 'scraper', 'crawl', 'fetch',
            'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider',
            'yandexbot', 'facebookexternalhit', 'twitterbot', 'linkedinbot',
            'whatsapp', 'telegram', 'discord', 'slack', 'skype',
            'curl', 'wget', 'python', 'java', 'php', 'ruby', 'perl',
            'postman', 'insomnia', 'httpie', 'axios', 'requests',
            'headless', 'phantom', 'selenium', 'puppeteer', 'playwright',
            'monitor', 'uptime', 'ping', 'check', 'test', 'scan'
        ];

        foreach ($botPatterns as $pattern) {
            if (stripos($userAgent, $pattern) !== false) {
                return true;
            }
        }

        // Check for missing or suspicious user agents
        if (empty($userAgent) || strlen($userAgent) < 10) {
            return true;
        }

        // Check for suspicious request patterns
        if ($request->header('X-Requested-With') === 'XMLHttpRequest' &&
            !$request->header('Referer')) {
            return true;
        }

        return false;
    }
}
