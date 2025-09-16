<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'code','user_id','vendor_id','customer_name','customer_phone','pickup_location_id',
        'delivery_mode','delivery_note','subtotal','discount_total','delivery_fee','grand_total',
        'status','payment_method','paid_at','expires_at','qr_code'
    ];

    public function user(){ return $this->belongsTo(User::class); }
    public function vendor(){ return $this->belongsTo(Vendor::class); }
    public function items(){ return $this->hasMany(OrderItem::class); }
    public function payment(){ return $this->hasOne(Payment::class); }
    public function statusLogs(){ return $this->hasMany(OrderStatusLog::class); }
    public function pickupLocation(){ return $this->belongsTo(CampusLocation::class,'pickup_location_id'); }
}

