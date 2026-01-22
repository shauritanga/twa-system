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
        Schema::create('assets', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('category');
            $table->string('asset_code')->unique();
            $table->decimal('purchase_cost', 15, 2);
            $table->date('purchase_date');
            $table->decimal('current_value', 15, 2)->nullable();
            $table->string('location')->nullable();
            $table->string('condition')->nullable();
            $table->enum('status', ['active', 'under_maintenance', 'disposed', 'sold'])->default('active');
            $table->integer('useful_life_years')->nullable();
            $table->decimal('depreciation_rate', 5, 2)->nullable();
            $table->string('supplier')->nullable();
            $table->string('serial_number')->nullable();
            $table->string('photo_path')->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assets');
    }
};
