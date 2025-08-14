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
        if (!Schema::hasTable('website_visits')) {
            Schema::create('website_visits', function (Blueprint $table) {
                $table->id();
                $table->string('ip_address', 45)->nullable();
                $table->text('user_agent')->nullable();
                $table->text('page_url')->nullable();
                $table->text('referrer')->nullable();
                $table->string('session_id')->nullable();
                $table->timestamp('visited_at')->nullable();
                $table->timestamps();

                // Indexes for better performance
                $table->index('session_id'); // Primary lookup
                $table->index(['ip_address', 'visited_at']); // IP-based queries
                $table->index('visited_at'); // Date-based queries
                $table->index(['session_id', 'visited_at']); // Combined queries
            });
        } else {
            // If table exists but columns are missing, add them
            Schema::table('website_visits', function (Blueprint $table) {
                if (!Schema::hasColumn('website_visits', 'ip_address')) {
                    $table->string('ip_address', 45)->nullable();
                }
                if (!Schema::hasColumn('website_visits', 'user_agent')) {
                    $table->text('user_agent')->nullable();
                }
                if (!Schema::hasColumn('website_visits', 'page_url')) {
                    $table->text('page_url')->nullable();
                }
                if (!Schema::hasColumn('website_visits', 'referrer')) {
                    $table->text('referrer')->nullable();
                }
                if (!Schema::hasColumn('website_visits', 'session_id')) {
                    $table->string('session_id')->nullable();
                }
                if (!Schema::hasColumn('website_visits', 'visited_at')) {
                    $table->timestamp('visited_at')->nullable();
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('website_visits');
    }
};
