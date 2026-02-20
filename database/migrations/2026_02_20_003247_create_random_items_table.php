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
        Schema::create('random_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('disc_id')->constrained('discs');
            $table->foreignId('edition_id')->constrained('editions');
            $table->string('member_name', 20);
            $table->string('item_type', 50);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('random_items');
    }
};
