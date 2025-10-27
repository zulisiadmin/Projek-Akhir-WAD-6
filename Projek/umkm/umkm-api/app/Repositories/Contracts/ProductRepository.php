<?php

namespace App\Repositories\Contracts;

use App\Models\Product;
use App\Repositories\Filters\ProductFilter;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ProductRepository
{
    /** List + filter + sort + paginate. */
    public function paginate(ProductFilter $filter, int $perPage = 12): LengthAwarePaginator;

    /** Ambil produk (by id atau slug) beserta relasinya. */
    public function findByIdOrSlugWithRelations(string $idOrSlug): Product;

    /** Buat produk untuk owner (seller) tertentu. Repo yang set vendor_id. */
    public function createForOwner(int $ownerId, array $data): Product;
}
