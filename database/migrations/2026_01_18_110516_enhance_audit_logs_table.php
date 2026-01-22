<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Enhance the existing audit_logs table
        Schema::table('audit_logs', function (Blueprint $table) {
            // Change description from string to text and make nullable
            $table->text('description')->nullable()->change();
            
            // Change severity from enum to string (if needed)
            $table->string('severity')->default('low')->change();
            
            // Change url from string to text
            $table->text('url')->nullable()->change();
            
            // Remove default from category (if it exists)
            $table->string('category')->nullable()->change();
        });
        
        // Add any missing indexes (only if they don't exist)
        if (!Schema::hasIndex('audit_logs', 'audit_logs_user_id_index')) {
            Schema::table('audit_logs', function (Blueprint $table) {
                $table->index('user_id');
            });
        }
        
        if (!Schema::hasIndex('audit_logs', 'audit_logs_action_index')) {
            Schema::table('audit_logs', function (Blueprint $table) {
                $table->index('action');
            });
        }
        
        if (!Schema::hasIndex('audit_logs', 'audit_logs_model_type_index')) {
            Schema::table('audit_logs', function (Blueprint $table) {
                $table->index('model_type');
            });
        }
        
        if (!Schema::hasIndex('audit_logs', 'audit_logs_category_index')) {
            Schema::table('audit_logs', function (Blueprint $table) {
                $table->index('category');
            });
        }
        
        if (!Schema::hasIndex('audit_logs', 'audit_logs_severity_index')) {
            Schema::table('audit_logs', function (Blueprint $table) {
                $table->index('severity');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('audit_logs', function (Blueprint $table) {
            // Revert changes
            $table->string('description')->change();
            $table->enum('severity', ['low', 'medium', 'high', 'critical'])->default('medium')->change();
            $table->string('url')->nullable()->change();
            $table->string('category')->default('general')->change();
        });
        
        // Remove added indexes
        Schema::table('audit_logs', function (Blueprint $table) {
            $table->dropIndex(['user_id']);
            $table->dropIndex(['action']);
            $table->dropIndex(['model_type']);
            $table->dropIndex(['category']);
            $table->dropIndex(['severity']);
        });
    }
};
