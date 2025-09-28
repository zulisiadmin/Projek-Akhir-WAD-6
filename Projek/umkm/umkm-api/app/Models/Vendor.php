<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vendor extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'owner_id',
        'name',
        'slug',
        'description',
        'logo_url',
        'cover_url',
        'status',
        'open_time',
        'close_time',
        'is_open_now',
        'location_note',
    ];

    // Relasi: Vendor dimiliki oleh User (owner)
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    // Relasi: Vendor bisa punya banyak produk
    public function products()
    {
        return $this->hasMany(Product::class);
    }

    // Relasi: vendor_users (staff/owner tambahan)
    public function vendorUsers()
    {
        return $this->hasMany(VendorUser::class);
    }

    // Relasi: vendor bisa punya banyak order
    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
