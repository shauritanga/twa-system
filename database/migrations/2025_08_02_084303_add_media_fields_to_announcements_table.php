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
        Schema::table('announcements', function (Blueprint $table) {
            $table->string('image_path')->nullable()->after('link_text');
            $table->string('video_path')->nullable()->after('image_path');
            $table->string('video_url')->nullable()->after('video_path'); // For YouTube/Vimeo URLs
            $table->enum('media_type', ['none', 'image', 'video', 'video_url'])->default('none')->after('video_url');
            $table->text('image_alt_text')->nullable()->after('media_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('announcements', function (Blueprint $table) {
            $table->dropColumn([
                'image_path',
                'video_path',
                'video_url',
                'media_type',
                'image_alt_text'
            ]);
        });
    }
};
