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
        Schema::table('website_visits', function (Blueprint $table) {
            // Add missing columns if they don't exist
            if (!Schema::hasColumn('website_visits', 'ip_address')) {
                $table->string('ip_address', 45)->nullable()->after('id');
            }
            if (!Schema::hasColumn('website_visits', 'user_agent')) {
                $table->text('user_agent')->nullable()->after('ip_address');
            }
            if (!Schema::hasColumn('website_visits', 'page_url')) {
                $table->text('page_url')->nullable()->after('user_agent');
            }
            if (!Schema::hasColumn('website_visits', 'referrer')) {
                $table->text('referrer')->nullable()->after('page_url');
            }
            if (!Schema::hasColumn('website_visits', 'session_id')) {
                $table->string('session_id')->nullable()->after('referrer');
            }
            if (!Schema::hasColumn('website_visits', 'visited_at')) {
                $table->timestamp('visited_at')->nullable()->after('session_id');
            }
        });

        // Add indexes if they don't exist
        try {
            Schema::table('website_visits', function (Blueprint $table) {
                $table->index('session_id');
                $table->index(['ip_address', 'visited_at']);
                $table->index('visited_at');
                $table->index(['session_id', 'visited_at']);
            });
        } catch (\Exception $e) {
            // Indexes might already exist, ignore errors
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('website_visits', function (Blueprint $table) {
            $table->dropColumn([
                'ip_address',
                'user_agent',
                'page_url',
                'referrer',
                'session_id',
                'visited_at'
            ]);
        });
    }
};
