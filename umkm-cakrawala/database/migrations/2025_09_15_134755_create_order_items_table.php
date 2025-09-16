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
    Schema::create('order_items', function (Blueprint $t) {
        $t->id();
        $t->foreignId('order_id')->constrained()->cascadeOnDelete();
        $t->foreignId('product_id')->constrained()->restrictOnDelete();
        $t->string('product_name',150);
        $t->string('variant_name',100)->nullable();
        $t->unsignedSmallInteger('qty');
        $t->unsignedInteger('unit_price');
        $t->string('notes',150)->nullable();
        $t->unsignedInteger('total_price');
        $t->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
