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
        // Check if table already exists
        if (!Schema::hasTable('audit_logs')) {
            Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();

            // User information
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('user_name')->nullable();
            $table->string('user_email')->nullable();
            $table->string('user_role')->nullable();

            // Activity information
            $table->string('action'); // create, update, delete, login, logout, etc.
            $table->string('model_type')->nullable(); // Member, Contribution, etc.
            $table->unsignedBigInteger('model_id')->nullable();
            $table->string('model_name')->nullable(); // Human readable name

            // Request information
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->string('url')->nullable();
            $table->string('method', 10)->nullable(); // GET, POST, PUT, DELETE

            // Change tracking
            $table->json('old_values')->nullable(); // Before changes
            $table->json('new_values')->nullable(); // After changes
            $table->json('properties')->nullable(); // Additional metadata

            // Context and description
            $table->string('description'); // Human readable description
            $table->string('category')->default('general'); // auth, member, financial, system
            $table->enum('severity', ['low', 'medium', 'high', 'critical'])->default('medium');

            // Session and batch tracking
            $table->string('session_id')->nullable();
            $table->string('batch_id')->nullable(); // For bulk operations

            $table->timestamps();

            // Indexes for performance
            $table->index(['user_id', 'created_at']);
            $table->index(['model_type', 'model_id']);
            $table->index(['action', 'created_at']);
            $table->index(['category', 'created_at']);
            $table->index(['ip_address', 'created_at']);

            // Foreign key constraint
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
