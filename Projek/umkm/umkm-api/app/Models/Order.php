<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'code','user_id','vendor_id','customer_name','customer_phone',
        'pickup_location_id','delivery_mode','delivery_note',
        'subtotal','discount_total','delivery_fee','grand_total',
        'status','payment_method','paid_at'
    ];

    public function items() { return $this->hasMany(OrderItem::class); }
}
