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
        Schema::table('dependents', function (Blueprint $table) {
            $table->date('date_of_birth')->nullable()->after('relationship');
            $table->string('tribe')->nullable()->after('date_of_birth');
            $table->string('residence')->nullable()->after('tribe');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dependents', function (Blueprint $table) {
            $table->dropColumn(['date_of_birth', 'tribe', 'residence']);
        });
    }
};
