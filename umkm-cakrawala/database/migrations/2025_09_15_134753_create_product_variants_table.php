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
        Schema::create('product_variants', function (Blueprint $t) {
            $t->id();
            $t->foreignId('product_id')->constrained()->cascadeOnDelete();
            $t->string('name',80);                        // Large / Level 3 / +Keju
            $t->enum('type',['option','addon'])->default('option');
            $t->integer('price_delta')->default(0);       // bisa negatif/positif
            $t->integer('stock')->nullable();
            $t->boolean('is_default')->default(false);
            $t->smallInteger('sort')->default(0);
            $t->timestamps();
        });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};
