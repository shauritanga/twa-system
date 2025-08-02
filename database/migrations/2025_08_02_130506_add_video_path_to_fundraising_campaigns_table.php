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
        Schema::table('fundraising_campaigns', function (Blueprint $table) {
            if (!Schema::hasColumn('fundraising_campaigns', 'video_path')) {
                $table->string('video_path')->nullable()->after('image_path');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('fundraising_campaigns', function (Blueprint $table) {
            if (Schema::hasColumn('fundraising_campaigns', 'video_path')) {
                $table->dropColumn('video_path');
            }
        });
    }
};
