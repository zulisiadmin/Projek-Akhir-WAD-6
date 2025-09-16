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
        Schema::create('vendors', function (Blueprint $t) {
            $t->id();
            $t->foreignId('owner_id')->constrained('users');
            $t->string('name',120);
            $t->string('slug',140)->unique();
            $t->text('description')->nullable();
            $t->string('logo_url')->nullable();
            $t->string('cover_url')->nullable();
            $t->enum('status',['active','inactive'])->default('active')->index();
            $t->time('open_time')->nullable();
            $t->time('close_time')->nullable();
            $t->boolean('is_open_now')->default(true);
            $t->string('location_note',150)->nullable();
            $t->softDeletes();
            $t->timestamps();
        });
    }



    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendors');
    }
};
