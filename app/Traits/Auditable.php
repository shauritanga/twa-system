<?php

namespace App\Traits;

use App\Services\AuditService;

trait Auditable
{
    /**
     * Boot the auditable trait
     */
    protected static function bootAuditable(): void
    {
        // Log model creation
        static::created(function ($model) {
            AuditService::logModel('create', $model);
        });

        // Log model updates
        static::updated(function ($model) {
            $oldValues = $model->getOriginal();
            $changes = $model->getChanges();
            
            // Only log if there are actual changes
            if (!empty($changes)) {
                AuditService::logModel('update', $model, $oldValues);
            }
        });

        // Log model deletion
        static::deleted(function ($model) {
            $action = $model->isForceDeleting() ? 'force_delete' : 'delete';
            AuditService::logModel($action, $model, $model->getOriginal());
        });

        // Log model restoration (for soft deletes)
        if (method_exists(static::class, 'restored')) {
            static::restored(function ($model) {
                AuditService::logModel('restore', $model);
            });
        }
    }

    /**
     * Get audit name for this model
     */
    public function getAuditName(): string
    {
        if (isset($this->name)) {
            return $this->name;
        }
        
        if (isset($this->title)) {
            return $this->title;
        }
        
        if (isset($this->email)) {
            return $this->email;
        }
        
        return class_basename($this) . ' #' . $this->id;
    }

    /**
     * Get audit logs for this model
     */
    public function auditLogs()
    {
        return \App\Models\AuditLog::where('model_type', get_class($this))
            ->where('model_id', $this->id)
            ->orderBy('created_at', 'desc');
    }

    /**
     * Log a custom audit event for this model
     */
    public function logAudit(string $action, string $description, array $properties = [], string $severity = 'medium'): void
    {
        AuditService::log([
            'action' => $action,
            'model_type' => get_class($this),
            'model_id' => $this->id,
            'model_name' => $this->getAuditName(),
            'category' => $this->getAuditCategory(),
            'severity' => $severity,
            'description' => $description,
            'properties' => $properties,
        ]);
    }

    /**
     * Get the audit category for this model
     */
    protected function getAuditCategory(): string
    {
        $className = class_basename($this);
        
        return match($className) {
            'Member', 'User' => 'member',
            'Contribution', 'Debt', 'Penalty', 'DisasterPayment' => 'financial',
            'Setting' => 'system',
            default => 'general',
        };
    }
}
