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
        Schema::create('editions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('disc_id')->constrained('discs');
            $table->string('code', 20)->unique();
            $table->string('name', 50);
            $table->string('display_name', 255)->nullable();
            $table->integer('price')->nullable();
            $table->string('currency', 10);
            $table->text('tracklist')->nullable();
            $table->text('benefit')->nullable();
            $table->text('video_content')->nullable();
            $table->text('remarks')->nullable();
            $table->integer('sort_id')->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('editions');
    }
};
