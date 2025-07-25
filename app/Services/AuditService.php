<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class AuditService
{
    /**
     * Log an audit event
     */
    public static function log(array $data): AuditLog
    {
        $user = Auth::user();
        $request = request();

        $auditData = array_merge([
            'user_id' => $user ? $user->id : null,
            'user_name' => $user ? $user->name : null,
            'user_email' => $user ? $user->email : null,
            'user_role' => $user && $user->role ? $user->role->name : null,
            'ip_address' => $request ? $request->ip() : null,
            'user_agent' => $request ? $request->userAgent() : null,
            'url' => $request ? $request->fullUrl() : null,
            'method' => $request ? $request->method() : null,
            'session_id' => session()->getId(),
            'batch_id' => null,
        ], $data);

        return AuditLog::create($auditData);
    }

    /**
     * Log authentication events
     */
    public static function logAuth(string $action, ?object $user = null, array $properties = []): AuditLog
    {
        $user = $user ?? Auth::user();
        
        return self::log([
            'action' => $action,
            'category' => 'auth',
            'severity' => $action === 'login_failed' ? 'high' : 'medium',
            'description' => self::getAuthDescription($action, $user),
            'properties' => $properties,
            'user_id' => $user ? $user->id : null,
            'user_name' => $user ? $user->name : null,
            'user_email' => $user ? $user->email : null,
            'user_role' => $user && $user->role ? $user->role->name : null,
        ]);
    }

    /**
     * Log model events (create, update, delete)
     */
    public static function logModel(string $action, object $model, array $oldValues = [], array $properties = []): AuditLog
    {
        $modelName = self::getModelName($model);
        
        return self::log([
            'action' => $action,
            'model_type' => get_class($model),
            'model_id' => $model->id ?? null,
            'model_name' => $modelName,
            'old_values' => $oldValues,
            'new_values' => $model->toArray(),
            'category' => self::getModelCategory($model),
            'severity' => $action === 'delete' ? 'high' : 'medium',
            'description' => self::getModelDescription($action, $model, $modelName),
            'properties' => $properties,
        ]);
    }

    /**
     * Log financial events
     */
    public static function logFinancial(string $action, object $model, array $properties = []): AuditLog
    {
        $modelName = self::getModelName($model);
        
        return self::log([
            'action' => $action,
            'model_type' => get_class($model),
            'model_id' => $model->id ?? null,
            'model_name' => $modelName,
            'category' => 'financial',
            'severity' => in_array($action, ['delete', 'force_delete']) ? 'high' : 'medium',
            'description' => self::getFinancialDescription($action, $model, $modelName),
            'properties' => $properties,
        ]);
    }

    /**
     * Log system events
     */
    public static function logSystem(string $action, string $description, array $properties = [], string $severity = 'medium'): AuditLog
    {
        return self::log([
            'action' => $action,
            'category' => 'system',
            'severity' => $severity,
            'description' => $description,
            'properties' => $properties,
        ]);
    }

    /**
     * Log security events
     */
    public static function logSecurity(string $action, string $description, array $properties = [], string $severity = 'high'): AuditLog
    {
        return self::log([
            'action' => $action,
            'category' => 'security',
            'severity' => $severity,
            'description' => $description,
            'properties' => $properties,
        ]);
    }

    /**
     * Log bulk operations with batch ID
     */
    public static function logBulk(string $action, array $items, string $description, array $properties = []): string
    {
        $batchId = Str::uuid()->toString();
        
        foreach ($items as $item) {
            self::log([
                'action' => $action,
                'model_type' => is_object($item) ? get_class($item) : null,
                'model_id' => is_object($item) ? ($item->id ?? null) : null,
                'model_name' => is_object($item) ? self::getModelName($item) : (string)$item,
                'category' => 'system',
                'severity' => 'medium',
                'description' => $description,
                'properties' => $properties,
                'batch_id' => $batchId,
            ]);
        }
        
        return $batchId;
    }

    /**
     * Get human-readable model name
     */
    private static function getModelName(object $model): string
    {
        if (method_exists($model, 'getAuditName')) {
            return $model->getAuditName();
        }
        
        if (isset($model->name)) {
            return $model->name;
        }
        
        if (isset($model->title)) {
            return $model->title;
        }
        
        if (isset($model->email)) {
            return $model->email;
        }
        
        return class_basename($model) . ' #' . ($model->id ?? 'unknown');
    }

    /**
     * Get model category
     */
    private static function getModelCategory(object $model): string
    {
        $className = class_basename($model);
        
        return match($className) {
            'Member', 'User' => 'member',
            'Contribution', 'Debt', 'Penalty', 'DisasterPayment' => 'financial',
            'Setting' => 'system',
            default => 'general',
        };
    }

    /**
     * Get authentication description
     */
    private static function getAuthDescription(string $action, ?object $user): string
    {
        $userName = $user && isset($user->name) ? $user->name : 'Unknown User';
        $userEmail = $user && isset($user->email) ? $user->email : 'unknown';

        return match($action) {
            'login' => "User '{$userName}' logged in successfully",
            'logout' => "User '{$userName}' logged out",
            'login_failed' => "Failed login attempt for '{$userEmail}'",
            'password_reset' => "Password reset requested for '{$userEmail}'",
            'password_changed' => "Password changed for user '{$userName}'",
            'account_locked' => "Account locked for user '{$userName}'",
            default => "Authentication action '{$action}' for user '{$userName}'",
        };
    }

    /**
     * Get model description
     */
    private static function getModelDescription(string $action, object $model, string $modelName): string
    {
        $modelType = class_basename($model);
        
        return match($action) {
            'create' => "{$modelType} '{$modelName}' was created",
            'update' => "{$modelType} '{$modelName}' was updated",
            'delete' => "{$modelType} '{$modelName}' was deleted",
            'restore' => "{$modelType} '{$modelName}' was restored",
            'force_delete' => "{$modelType} '{$modelName}' was permanently deleted",
            default => "{$modelType} '{$modelName}' - {$action}",
        };
    }

    /**
     * Get financial description
     */
    private static function getFinancialDescription(string $action, object $model, string $modelName): string
    {
        $modelType = class_basename($model);
        $amount = isset($model->amount) ? number_format($model->amount) . ' TZS' : '';
        
        return match($action) {
            'create' => "{$modelType} '{$modelName}' created" . ($amount ? " for {$amount}" : ''),
            'update' => "{$modelType} '{$modelName}' updated" . ($amount ? " (amount: {$amount})" : ''),
            'delete' => "{$modelType} '{$modelName}' deleted" . ($amount ? " (amount: {$amount})" : ''),
            'approve' => "{$modelType} '{$modelName}' approved" . ($amount ? " for {$amount}" : ''),
            'reject' => "{$modelType} '{$modelName}' rejected" . ($amount ? " for {$amount}" : ''),
            default => "{$modelType} '{$modelName}' - {$action}" . ($amount ? " ({$amount})" : ''),
        };
    }
}
