<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes; // ✅ ini yang benar

class Vendor extends Model
{
    use SoftDeletes;
    protected $fillable = ['owner_id','name','slug','description','logo_url','cover_url','status','open_time','close_time','is_open_now','location_note'];

    public function owner(){ return $this->belongsTo(User::class,'owner_id'); }
    public function staffs(){ return $this->belongsToMany(User::class,'vendor_users')->withPivot('role')->withTimestamps(); }
    public function products(){ return $this->hasMany(Product::class); }
    public function orders(){ return $this->hasMany(Order::class); }
}
