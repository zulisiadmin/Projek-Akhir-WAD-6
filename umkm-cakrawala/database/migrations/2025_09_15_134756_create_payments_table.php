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
    Schema::create('payments', function (Blueprint $t) {
        $t->id();
        $t->foreignId('order_id')->constrained()->cascadeOnDelete();
        $t->enum('provider',['midtrans','xendit','tripay','manual']);
        $t->enum('method',['qris','ewallet','va','cc','cod'])->nullable();
        $t->string('external_id',120)->index(); // id/invoice dari PG
        $t->string('reference',120)->nullable(); // VA number/QR string
        $t->unsignedInteger('amount');
        $t->unsignedInteger('fee')->default(0);
        $t->enum('status',['pending','paid','expired','failed','refunded'])->default('pending');
        $t->json('payload')->nullable();  // simpan response/webhook
        $t->timestamp('paid_at')->nullable();
        $t->timestamps();

        $t->unique('order_id'); // satu order satu payment record
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
