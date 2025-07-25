<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Auth\Events\Failed;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Auth\Events\Lockout;
use App\Services\AuditService;

class AuditAuthenticationListener
{
    /**
     * Handle user login events
     */
    public function handleLogin(Login $event): void
    {
        AuditService::logAuth('login', $event->user, [
            'guard' => $event->guard,
            'remember' => $event->remember,
        ]);
    }

    /**
     * Handle user logout events
     */
    public function handleLogout(Logout $event): void
    {
        AuditService::logAuth('logout', $event->user, [
            'guard' => $event->guard,
        ]);
    }

    /**
     * Handle failed login attempts
     */
    public function handleFailed(Failed $event): void
    {
        // Create a temporary user object for logging
        $tempUser = (object) [
            'id' => null,
            'name' => 'Unknown',
            'email' => $event->credentials['email'] ?? 'unknown',
            'role' => null,
        ];

        AuditService::logAuth('login_failed', $tempUser, [
            'guard' => $event->guard,
            'credentials' => array_keys($event->credentials),
        ]);
    }

    /**
     * Handle password reset events
     */
    public function handlePasswordReset(PasswordReset $event): void
    {
        AuditService::logAuth('password_reset', $event->user);
    }

    /**
     * Handle account lockout events
     */
    public function handleLockout(Lockout $event): void
    {
        AuditService::logSecurity('account_lockout',
            "Account lockout triggered for request from IP: " . request()->ip(),
            [
                'request' => $event->request->all(),
            ],
            'critical'
        );
    }

    /**
     * Register the listeners for the subscriber
     */
    public function subscribe($events): void
    {
        $events->listen(Login::class, [AuditAuthenticationListener::class, 'handleLogin']);
        $events->listen(Logout::class, [AuditAuthenticationListener::class, 'handleLogout']);
        $events->listen(Failed::class, [AuditAuthenticationListener::class, 'handleFailed']);
        $events->listen(PasswordReset::class, [AuditAuthenticationListener::class, 'handlePasswordReset']);
        $events->listen(Lockout::class, [AuditAuthenticationListener::class, 'handleLockout']);
    }
}
