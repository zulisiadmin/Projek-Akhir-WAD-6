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
    Schema::create('orders', function (Blueprint $t) {
        $t->id();
        $t->string('code',20)->unique();           // CAK-YYYYMM-xxxxx
        $t->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
        $t->foreignId('vendor_id')->constrained()->cascadeOnDelete();
        $t->string('customer_name',120);
        $t->string('customer_phone',30);
        $t->foreignId('pickup_location_id')->nullable()->constrained('campus_locations')->nullOnDelete();
        $t->enum('delivery_mode',['pickup','delivery'])->default('pickup');
        $t->string('delivery_note')->nullable();

        $t->unsignedInteger('subtotal');
        $t->unsignedInteger('discount_total')->default(0);
        $t->unsignedInteger('delivery_fee')->default(0);
        $t->unsignedInteger('grand_total');

        $t->enum('status',['pending_payment','paid','processing','ready','completed','canceled','refunded'])
          ->default('pending_payment')->index();
        $t->enum('payment_method',['qris','ewallet','va','cod'])->nullable();
        $t->timestamp('paid_at')->nullable();
        $t->timestamp('expires_at')->nullable();

        $t->string('qr_code')->nullable();  // token pickup
        $t->timestamps();

        $t->index(['vendor_id','status']);
        $t->index('user_id');
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
