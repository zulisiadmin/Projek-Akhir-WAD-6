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
        Schema::create('carts', function (Blueprint $t) {
            $t->id();
            $t->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $t->string('session_id',100)->nullable();     // untuk guest
            $t->foreignId('vendor_id')->nullable()->constrained()->cascadeOnDelete(); // cart per vendor
            $t->char('currency',3)->default('IDR');
            $t->timestamps();

            $t->index('user_id');
            $t->index('session_id');
            $t->index('vendor_id');
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('carts');
    }
};
