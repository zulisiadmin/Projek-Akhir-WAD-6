<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    protected $fillable = ['user_id','session_id','vendor_id','currency'];
    public function user(){ return $this->belongsTo(User::class); }
    public function vendor(){ return $this->belongsTo(Vendor::class); }
    public function items(){ return $this->hasMany(CartItem::class); }

    public function getTotalAttribute(){
        return $this->items->sum(fn($i) => $i->qty * $i->unit_price);
    }
}

