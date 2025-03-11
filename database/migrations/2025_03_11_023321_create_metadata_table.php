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
        Schema::create('metadata', function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->foreignUUID('document_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->string("author");
            $table->integer('pages');
            $table->integer('size');
            $table->text("preprocessed_text");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('metadata');
    }
};
