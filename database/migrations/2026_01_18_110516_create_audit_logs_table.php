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
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            
            // User information
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('user_name')->nullable();
            $table->string('user_email')->nullable();
            $table->string('user_role')->nullable();
            
            // Action details
            $table->string('action'); // created, updated, deleted, viewed, etc.
            $table->string('model_type')->nullable(); // App\Models\User, etc.
            $table->unsignedBigInteger('model_id')->nullable();
            $table->string('model_name')->nullable(); // Human-readable name
            
            // Request information
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->text('url')->nullable();
            $table->string('method', 10)->nullable(); // GET, POST, PUT, DELETE
            
            // Change tracking
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->json('properties')->nullable(); // Additional metadata
            
            // Description and categorization
            $table->text('description')->nullable();
            $table->string('category')->nullable(); // auth, member, financial, system, security
            $table->string('severity')->default('low'); // low, medium, high, critical
            
            // Session tracking
            $table->string('session_id')->nullable();
            $table->string('batch_id')->nullable(); // For grouping related actions
            
            $table->timestamps();
            
            // Indexes for better query performance
            $table->index('user_id');
            $table->index('action');
            $table->index('model_type');
            $table->index(['model_type', 'model_id']);
            $table->index('category');
            $table->index('severity');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
