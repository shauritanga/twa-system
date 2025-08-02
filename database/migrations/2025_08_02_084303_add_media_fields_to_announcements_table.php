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
            if (!Schema::hasColumn('announcements', 'image_path')) {
                $table->string('image_path')->nullable()->after('link_text');
            }
            if (!Schema::hasColumn('announcements', 'video_path')) {
                $table->string('video_path')->nullable()->after('image_path');
            }
            if (!Schema::hasColumn('announcements', 'video_url')) {
                $table->string('video_url')->nullable()->after('video_path'); // For YouTube/Vimeo URLs
            }
            if (!Schema::hasColumn('announcements', 'media_type')) {
                $table->enum('media_type', ['none', 'image', 'video', 'video_url'])->default('none')->after('video_url');
            }
            if (!Schema::hasColumn('announcements', 'image_alt_text')) {
                $table->text('image_alt_text')->nullable()->after('media_type');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('announcements', function (Blueprint $table) {
            $columnsToDrop = [];
            $columns = ['image_path', 'video_path', 'video_url', 'media_type', 'image_alt_text'];

            foreach ($columns as $column) {
                if (Schema::hasColumn('announcements', $column)) {
                    $columnsToDrop[] = $column;
                }
            }

            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }
};
