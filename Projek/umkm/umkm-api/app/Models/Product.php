<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    protected $guarded = [];

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class)->orderByDesc('is_default')->orderBy('sort');
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'category_product');
    }

    public function images() {
        return $this->hasMany(ProductImage::class);
    }

    public function getPrimaryImageUrlAttribute(): ?string
    {
        $img = $this->images
            ? $this->images->sortByDesc('is_primary')->sortBy('sort')->first()
            : $this->images()->orderByDesc('is_primary')->orderBy('sort')->first();

        return $img?->full_url;
    }

}
