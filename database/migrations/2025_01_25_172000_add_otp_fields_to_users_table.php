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
        Schema::table('users', function (Blueprint $table) {
            // Check if columns don't exist before adding them
            if (!Schema::hasColumn('users', 'otp_secret')) {
                $table->string('otp_secret')->nullable()->after('remember_token');
            }
            if (!Schema::hasColumn('users', 'otp_enabled')) {
                $table->boolean('otp_enabled')->default(false)->after('otp_secret');
            }
            if (!Schema::hasColumn('users', 'otp_verified_at')) {
                $table->timestamp('otp_verified_at')->nullable()->after('otp_enabled');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Check if columns exist before dropping them
            $columnsToDrop = [];
            if (Schema::hasColumn('users', 'otp_secret')) {
                $columnsToDrop[] = 'otp_secret';
            }
            if (Schema::hasColumn('users', 'otp_enabled')) {
                $columnsToDrop[] = 'otp_enabled';
            }
            if (Schema::hasColumn('users', 'otp_verified_at')) {
                $columnsToDrop[] = 'otp_verified_at';
            }

            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }
};
