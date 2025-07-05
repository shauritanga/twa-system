<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IsAdmin
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        if (Auth::check() && Auth::user()->role && in_array(Auth::user()->role->name, ['admin', 'secretary'])) {
            return $next($request);
        }
        abort(403, 'Unauthorized');
    }
}
