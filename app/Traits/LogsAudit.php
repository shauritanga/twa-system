<?php

namespace App\Traits;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

trait LogsAudit
{
    /**
     * Log an audit event
     */
    protected function logAudit(
        string $action,
        $model = null,
        array $oldValues = null,
        array $newValues = null,
        string $description = null,
        string $category = 'general',
        string $severity = 'low',
        array $properties = []
    ) {
        $user = Auth::user();
        
        $data = [
            'user_id' => $user?->id,
            'user_name' => $user?->name,
            'user_email' => $user?->email,
            'user_role' => $user?->role?->name,
            'action' => $action,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'url' => request()->fullUrl(),
            'method' => request()->method(),
            'description' => $description,
            'category' => $category,
            'severity' => $severity,
            'session_id' => session()->getId(),
            'properties' => $properties,
        ];

        if ($model) {
            $data['model_type'] = get_class($model);
            $data['model_id'] = $model->id ?? null;
            $data['model_name'] = $this->getModelName($model);
        }

        if ($oldValues) {
            $data['old_values'] = $oldValues;
        }

        if ($newValues) {
            $data['new_values'] = $newValues;
        }

        return AuditLog::create($data);
    }

    /**
     * Get a human-readable name for the model
     */
    protected function getModelName($model): string
    {
        if (method_exists($model, 'getAuditName')) {
            return $model->getAuditName();
        }

        // Try common name fields
        $nameFields = ['name', 'title', 'account_name', 'entry_number', 'expense_number'];
        
        foreach ($nameFields as $field) {
            if (isset($model->$field)) {
                return $model->$field;
            }
        }

        // Fallback to model class and ID
        return class_basename($model) . ' #' . ($model->id ?? 'unknown');
    }

    /**
     * Log a create action
     */
    protected function logCreate($model, string $description = null, string $category = 'general', array $properties = [])
    {
        return $this->logAudit(
            'created',
            $model,
            null,
            $model->getAttributes(),
            $description ?? class_basename($model) . ' created',
            $category,
            'low',
            $properties
        );
    }

    /**
     * Log an update action
     */
    protected function logUpdate($model, array $oldValues, string $description = null, string $category = 'general', array $properties = [])
    {
        return $this->logAudit(
            'updated',
            $model,
            $oldValues,
            $model->getAttributes(),
            $description ?? class_basename($model) . ' updated',
            $category,
            'low',
            $properties
        );
    }

    /**
     * Log a delete action
     */
    protected function logDelete($model, string $description = null, string $category = 'general', array $properties = [])
    {
        return $this->logAudit(
            'deleted',
            $model,
            $model->getAttributes(),
            null,
            $description ?? class_basename($model) . ' deleted',
            $category,
            'medium',
            $properties
        );
    }

    /**
     * Log a view action
     */
    protected function logView($model, string $description = null, string $category = 'general', array $properties = [])
    {
        return $this->logAudit(
            'viewed',
            $model,
            null,
            null,
            $description ?? class_basename($model) . ' viewed',
            $category,
            'low',
            $properties
        );
    }

    /**
     * Log a custom action
     */
    protected function logCustomAction(
        string $action,
        $model = null,
        string $description = null,
        string $category = 'general',
        string $severity = 'low',
        array $properties = []
    ) {
        return $this->logAudit(
            $action,
            $model,
            null,
            null,
            $description,
            $category,
            $severity,
            $properties
        );
    }
}
