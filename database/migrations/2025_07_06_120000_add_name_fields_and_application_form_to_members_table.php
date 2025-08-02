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
            if (!Schema::hasColumn('members', 'first_name')) {
                $table->string('first_name')->nullable()->after('name');
            }
            if (!Schema::hasColumn('members', 'middle_name')) {
                $table->string('middle_name')->nullable()->after('first_name');
            }
            if (!Schema::hasColumn('members', 'surname')) {
                $table->string('surname')->nullable()->after('middle_name');
            }

            // Add place of birth and sex
            if (!Schema::hasColumn('members', 'place_of_birth')) {
                $table->string('place_of_birth')->nullable()->after('address');
            }
            if (!Schema::hasColumn('members', 'sex')) {
                $table->enum('sex', ['Male', 'Female'])->nullable()->after('place_of_birth');
            }

            // Add application form file path
            if (!Schema::hasColumn('members', 'application_form_path')) {
                $table->string('application_form_path')->nullable()->after('image_path');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('members', function (Blueprint $table) {
            $columnsToDrop = [];
            $columns = ['first_name', 'middle_name', 'surname', 'place_of_birth', 'sex', 'application_form_path'];

            foreach ($columns as $column) {
                if (Schema::hasColumn('members', $column)) {
                    $columnsToDrop[] = $column;
                }
            }

            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }
};
