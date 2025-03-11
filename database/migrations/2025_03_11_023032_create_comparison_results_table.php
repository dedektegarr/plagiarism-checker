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
            $table->foreignUuid('comparison_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('document_1_id')->references("id")->on("documents")->onDelete('cascade');
            $table->foreignUuid('document_2_id')->references("id")->on("documents")->onDelete('cascade');
            $table->double('similarity_score');
            $table->timestamps();
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
