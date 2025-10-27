<?php

namespace App\Repositories\Contracts;

use App\Models\Vendor;

interface VendorRepository
{
    /** Ambil vendor_id milik owner (kolom owner_id pada tabel vendors). */
    public function getVendorIdByOwnerId(int $ownerId): ?int;
    public function createForOwner(int $ownerId, string $name): Vendor;
}
