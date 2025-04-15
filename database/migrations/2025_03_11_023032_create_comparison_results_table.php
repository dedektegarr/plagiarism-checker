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
        Schema::create('comparison_results', function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->foreignUuid('comparison_id')->constrained()->onDelete("cascade");
            $table->foreignUuid('document_1_id')->nullable()->references("id")->on("documents")->nullOnDelete();
            $table->foreignUuid('document_2_id')->nullable()->references("id")->on("documents")->nullOnDelete();
            $table->double('similarity_score');
            $table->timestamps();

            $table->unique(['comparison_id', 'document_1_id', 'document_2_id'], 'comparison_document_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comparison_results');
    }
};
