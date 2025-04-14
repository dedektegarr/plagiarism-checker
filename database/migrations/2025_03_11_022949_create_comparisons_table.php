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
        Schema::create('comparisons', function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->foreignUuid("user_id")->constrained()->onDelete('cascade');
            $table->foreignUuid('group_id')->nullable()->constrained()->nullOnDelete();
            $table->integer("processing_time")->default(0);
            $table->integer("comparison_time")->default(0);
            // $table->enum('status', ['pending', 'processing', 'checked'])->default("pending");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comparisons');
    }
};
