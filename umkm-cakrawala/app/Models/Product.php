<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes; // ✅ ini yang benar

class Product extends Model
{
    use SoftDeletes;
    protected $fillable = ['vendor_id','name','slug','description','base_price','sku','status','has_variants','stock','max_per_order'];

    public function vendor(){ return $this->belongsTo(Vendor::class); }
    public function images(){ return $this->hasMany(ProductImage::class)->orderBy('sort'); }
    public function variants(){ return $this->hasMany(ProductVariant::class)->orderBy('sort'); }
    public function categories(){ return $this->belongsToMany(Category::class); }

    public function scopeActive($q){ return $q->where('status','active'); }
}

