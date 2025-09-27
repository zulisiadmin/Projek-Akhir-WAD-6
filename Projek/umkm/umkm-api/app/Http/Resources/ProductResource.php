<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray($request)
    {
        $primaryImage = optional($this->images->first())->url;

        return [
            'id'            => $this->id,
            'vendor_id'     => $this->vendor_id,
            'name'          => $this->name,
            'slug'          => $this->slug,
            'description'   => $this->description,
            'base_price'    => $this->base_price,
            'sku'           => $this->sku,
            'status'        => $this->status,
            'has_variants'  => (bool) $this->has_variants,
            'stock'         => $this->stock,
            'max_per_order' => $this->max_per_order,
            'image_url'     => $primaryImage,
            'images'        => $this->images->map(fn($img) => [
                'url' => $img->url,
                'is_primary' => (bool) $img->is_primary,
                'sort' => $img->sort
            ]),
            'variants'      => $this->variants->map(fn($v) => [
                'id' => $v->id,
                'name' => $v->name,
                'type' => $v->type,
                'price_delta' => $v->price_delta,
                'stock' => $v->stock,
                'is_default' => (bool) $v->is_default,
                'sort' => $v->sort
            ]),
            'categories'    => $this->whenLoaded('categories', fn() => $this->categories->map(
                fn($c) => ['id' => $c->id, 'name' => $c->name, 'slug' => $c->slug]
            )),
            'created_at'    => $this->created_at,
            'updated_at'    => $this->updated_at,
        ];
    }
}
