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
            // Add new name fields
            $table->string('first_name')->nullable()->after('name');
            $table->string('middle_name')->nullable()->after('first_name');
            $table->string('surname')->nullable()->after('middle_name');
            
            // Add place of birth and sex
            $table->string('place_of_birth')->nullable()->after('address');
            $table->enum('sex', ['Male', 'Female'])->nullable()->after('place_of_birth');
            
            // Add application form file path
            $table->string('application_form_path')->nullable()->after('image_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('members', function (Blueprint $table) {
            $table->dropColumn([
                'first_name', 
                'middle_name', 
                'surname', 
                'place_of_birth', 
                'sex', 
                'application_form_path'
            ]);
        });
    }
};
