<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $guarded = [];

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class)->orderByDesc('is_primary')->orderBy('sort');
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class)->orderByDesc('is_default')->orderBy('sort');
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'category_product');
    }
}
