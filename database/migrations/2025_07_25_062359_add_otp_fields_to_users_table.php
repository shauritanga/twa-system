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
            $table->string('otp_secret')->nullable()->after('remember_token');
            $table->boolean('otp_enabled')->default(false)->after('otp_secret');
            $table->timestamp('otp_verified_at')->nullable()->after('otp_enabled');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['otp_secret', 'otp_enabled', 'otp_verified_at']);
        });
    }
};
