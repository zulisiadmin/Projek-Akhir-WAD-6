<?php

namespace App\Repositories\Eloquent;

use App\Models\Vendor;
use App\Repositories\Contracts\VendorRepository;

class EloquentVendorRepository implements VendorRepository
{
    public function getVendorIdByOwnerId(int $ownerId): ?int
    {
        return Vendor::where('owner_id', $ownerId)->value('id');
    }
    public function createForOwner(int $ownerId, string $name): Vendor
    {
        $base = Str::slug($name);
        $slug = $base; $i = 1;
        while (Vendor::where('slug', $slug)->exists()) {
            $slug = $base.'-'.$i++;
        }

        return Vendor::create([
            'owner_id' => $ownerId,
            'name'     => $name,
            'slug'     => $slug,
        ]);
    }
}
