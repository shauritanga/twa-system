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
        Schema::table('members', function (Blueprint $table) {
            $table->string('tribe')->nullable()->after('date_of_birth');
            $table->string('occupation')->nullable()->after('tribe');
            $table->text('reason_for_membership')->nullable()->after('occupation');
            $table->date('applicant_date')->nullable()->after('reason_for_membership');
            $table->string('declaration_name')->nullable()->after('applicant_date');
            $table->string('witness_name')->nullable()->after('declaration_name');
            $table->date('witness_date')->nullable()->after('witness_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('members', function (Blueprint $table) {
            $table->dropColumn(['tribe', 'occupation', 'reason_for_membership', 'applicant_date', 'declaration_name', 'witness_name', 'witness_date']);
        });
    }
};
