<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\OrganizationConfigService;

class ShareOrganizationData
{
    protected $organizationService;

    public function __construct(OrganizationConfigService $organizationService)
    {
        $this->organizationService = $organizationService;
    }

    public function handle(Request $request, Closure $next)
    {
        // Share organization data with all Inertia pages
        Inertia::share([
            'organization' => function () {
                return $this->organizationService->getAll();
            },
        ]);

        return $next($request);
    }
}
