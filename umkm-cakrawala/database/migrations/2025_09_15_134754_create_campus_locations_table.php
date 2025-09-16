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
        Schema::create('campus_locations', function (Blueprint $t) {
            $t->id();
            $t->string('name',120);
            $t->string('code',50)->unique();
            $t->string('description')->nullable();
            $t->boolean('is_active')->default(true);
            $t->smallInteger('sort')->default(0);
            $t->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campus_locations');
    }
};
