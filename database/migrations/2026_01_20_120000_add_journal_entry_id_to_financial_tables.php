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
        // Add journal_entry_id to contributions table
        Schema::table('contributions', function (Blueprint $table) {
            $table->unsignedBigInteger('journal_entry_id')->nullable()->after('id');
            $table->foreign('journal_entry_id')->references('id')->on('journal_entries')->onDelete('set null');
        });

        // Add journal_entry_id to expenses table
        Schema::table('expenses', function (Blueprint $table) {
            $table->unsignedBigInteger('journal_entry_id')->nullable()->after('id');
            $table->foreign('journal_entry_id')->references('id')->on('journal_entries')->onDelete('set null');
        });

        // Add journal_entry_id to disaster_payments table
        Schema::table('disaster_payments', function (Blueprint $table) {
            $table->unsignedBigInteger('journal_entry_id')->nullable()->after('id');
            $table->foreign('journal_entry_id')->references('id')->on('journal_entries')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contributions', function (Blueprint $table) {
            $table->dropForeign(['journal_entry_id']);
            $table->dropColumn('journal_entry_id');
        });

        Schema::table('expenses', function (Blueprint $table) {
            $table->dropForeign(['journal_entry_id']);
            $table->dropColumn('journal_entry_id');
        });

        Schema::table('disaster_payments', function (Blueprint $table) {
            $table->dropForeign(['journal_entry_id']);
            $table->dropColumn('journal_entry_id');
        });
    }
};