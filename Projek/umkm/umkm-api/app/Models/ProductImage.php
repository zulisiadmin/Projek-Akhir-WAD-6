<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductImage extends Model
{
    protected $fillable = ['product_id','url','is_primary','sort'];

    // Selalu kirimkan URL absolut siap pakai ke FE
    public function getFullUrlAttribute(): ?string
    {
        $u = $this->url;
        if (!$u) return null;

        // Jika sudah URL absolut (CDN/S3), kembalikan apa adanya
        if (Str::startsWith($u, ['http://','https://','//'])) {
            return $u;
        }

        // Jika data lama masih pakai "/storage/..." → jadikan absolut
        if (Str::startsWith($u, ['/storage/','storage/'])) {
            $u = '/'.ltrim($u, '/'); // pastikan 1 leading slash
            return url($u);
        }

        // Kasus normal: path relatif di disk "public" (products/abc.jpg)
        return url(Storage::url($u)); // → https://api.domainmu.com/storage/products/abc.jpg
    }
}
