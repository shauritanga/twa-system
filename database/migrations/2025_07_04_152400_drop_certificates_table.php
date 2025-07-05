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
        Schema::dropIfExists('certificates');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')->constrained()->onDelete('cascade');
            $table->foreignId('dependent_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('file_path');
            $table->string('type')->nullable();
            $table->string('status')->default('pending');
            $table->timestamps();
        });
    }
};
