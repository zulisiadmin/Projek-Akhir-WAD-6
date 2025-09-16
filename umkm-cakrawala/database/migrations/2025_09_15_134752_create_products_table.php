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
    Schema::create('products', function (Blueprint $t) {
        $t->id();
        $t->foreignId('vendor_id')->constrained()->cascadeOnDelete();
        $t->string('name',150);
        $t->string('slug',200)->unique();
        $t->text('description')->nullable();
        $t->unsignedInteger('base_price');      // rupiah
        $t->string('sku',50)->nullable();
        $t->enum('status',['active','inactive'])->default('active')->index();
        $t->boolean('has_variants')->default(false);
        $t->integer('stock')->nullable();       // kalau tanpa varian
        $t->smallInteger('max_per_order')->nullable();
        $t->softDeletes();
        $t->timestamps();

        $t->unique(['vendor_id','sku']);
        $t->index(['vendor_id','status']);
    });
}



    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
