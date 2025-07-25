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
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('category', [
                'meeting_minutes',
                'policies',
                'procedures',
                'financial_reports',
                'legal_documents',
                'forms',
                'announcements',
                'other'
            ])->default('other');
            $table->string('file_name');
            $table->string('file_path');
            $table->string('file_type'); // pdf, doc, docx, etc.
            $table->bigInteger('file_size'); // in bytes
            $table->enum('visibility', ['public', 'members_only', 'admin_only'])->default('members_only');
            $table->enum('status', ['active', 'archived', 'draft'])->default('active');
            $table->date('document_date')->nullable(); // Date of the document content (e.g., meeting date)
            $table->json('tags')->nullable(); // For categorization and search
            $table->integer('download_count')->default(0);
            $table->foreignId('uploaded_by')->constrained('users')->onDelete('cascade');
            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            // Indexes for better performance
            $table->index(['category', 'status']);
            $table->index(['visibility', 'status']);
            $table->index('document_date');
            $table->index('published_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
