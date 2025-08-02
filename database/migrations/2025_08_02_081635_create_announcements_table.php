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
        if (!Schema::hasTable('announcements')) {
            Schema::create('announcements', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->text('content');
                $table->enum('type', ['important', 'event', 'update', 'general'])->default('general');
                $table->enum('status', ['active', 'inactive', 'draft'])->default('active');
                $table->string('link_url')->nullable();
                $table->string('link_text')->nullable();
                $table->date('announcement_date');
                $table->date('expires_at')->nullable();
                $table->boolean('is_featured')->default(false);
                $table->integer('sort_order')->default(0);
                $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
                $table->timestamps();

                // Indexes for better performance
                $table->index(['status', 'announcement_date']);
                $table->index(['type', 'status']);
                $table->index('is_featured');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('announcements');
    }
};
