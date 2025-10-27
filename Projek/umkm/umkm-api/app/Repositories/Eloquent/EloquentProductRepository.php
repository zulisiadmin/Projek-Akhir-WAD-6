<?php

namespace App\Repositories\Eloquent;

use App\Models\Product;
use App\Repositories\Contracts\ProductRepository;
use App\Repositories\Contracts\VendorRepository;
use App\Repositories\Filters\ProductFilter;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

class EloquentProductRepository implements ProductRepository
{
    public function __construct(
        private readonly VendorRepository $vendors
    ) {}

    public function paginate(ProductFilter $f, int $perPage = 12): LengthAwarePaginator
    {
        $query = Product::query()
            ->with(['images', 'variants'])
            ->where('status', 'active');

        // Search
        if ($f->search) {
            $search = $f->search;
            $query->where(function (Builder $q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        // Vendor filter
        if ($f->vendorId) {
            $query->where('vendor_id', $f->vendorId);
        }

        // Category filter
        if ($f->category) {
            $query->whereHas('categories', function (Builder $q) use ($f) {
                if (is_numeric($f->category)) {
                    $q->where('categories.id', (int) $f->category);
                } else {
                    $q->where('categories.slug', $f->category);
                }
            })->with('categories:id,name,slug');
        }

        // Sort
        $query
            ->when($f->sort === 'price_asc',  fn($q) => $q->orderBy('base_price', 'asc'))
            ->when($f->sort === 'price_desc', fn($q) => $q->orderBy('base_price', 'desc'))
            ->when($f->sort === 'newest',     fn($q) => $q->orderBy('created_at', 'desc'));

        return $query->paginate($perPage);
    }

    public function findByIdOrSlugWithRelations(string $idOrSlug): Product
    {
        return Product::query()
            ->with(['images', 'variants', 'categories:id,name,slug'])
            ->when(is_numeric($idOrSlug),
                fn($q) => $q->where('id', (int) $idOrSlug),
                fn($q) => $q->where('slug', $idOrSlug)
            )
            ->firstOrFail();
    }

    public function createForOwner(int $ownerId, array $data): Product
    {
        // Map owner -> vendor_id
        $vendorId = $this->vendors->getVendorIdByOwnerId($ownerId);
        abort_unless($vendorId, 422, 'Vendor tidak ditemukan untuk user ini.');

        // Generate slug jika kosong
        if (empty($data['slug']) && !empty($data['name'])) {
            $base = Str::slug($data['name']);
            $slug = $base; $i = 1;
            while (Product::where('slug', $slug)->exists()) {
                $slug = $base.'-'.$i++;
            }
            $data['slug'] = $slug;
        }

        $data['vendor_id'] = $vendorId;

        return Product::create($data);
    }
}
