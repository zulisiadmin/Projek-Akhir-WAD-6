<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $perPage   = (int) $request->integer('per_page', 12);
        $search    = $request->string('q')->toString();
        $vendorId  = $request->integer('vendor_id');
        $category  = $request->string('category')->toString(); // id atau slug
        $sort      = $request->string('sort', 'newest')->toString(); // newest|price_asc|price_desc

        $query = Product::query()
            ->with(['images', 'variants'])
            ->where('status', 'active');

        if ($search !== '') {
            $query->where(function (Builder $q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        if ($vendorId) {
            $query->where('vendor_id', $vendorId);
        }

        if ($category !== '') {
            $query->whereHas('categories', function (Builder $q) use ($category) {
                if (is_numeric($category)) {
                    $q->where('categories.id', (int) $category);
                } else {
                    $q->where('categories.slug', $category);
                }
            })->with('categories:id,name,slug');
        }

        // sorting
        $query->when($sort === 'price_asc', fn($q) => $q->orderBy('base_price', 'asc'))
              ->when($sort === 'price_desc', fn($q) => $q->orderBy('base_price', 'desc'))
              ->when($sort === 'newest', fn($q) => $q->orderBy('created_at', 'desc'));

        $products = $query->paginate($perPage)->appends($request->query());

        return ProductResource::collection($products);
    }

    public function show(Request $request, string $idOrSlug)
    {
        $product = Product::query()
            ->with(['images', 'variants', 'categories:id,name,slug'])
            ->when(is_numeric($idOrSlug),
                fn($q) => $q->where('id', (int) $idOrSlug),
                fn($q) => $q->where('slug', $idOrSlug)
            )
            ->firstOrFail();

        return ProductResource::make($product);
    }
    public function store(Request $request)
    {
        $user = $request->user();
        abort_unless($user->role === 'seller', 403);

        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'slug'        => 'nullable|string|max:255|unique:products,slug',
            'base_price'  => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'stock'       => 'nullable|integer|min:0',
        ]);

        // ambil vendor milik user
        $vendorId = \App\Models\Vendor::where('user_id', $user->id)->value('id');
        abort_unless($vendorId, 422, 'Vendor tidak ditemukan untuk user ini.');

        $data['vendor_id'] = $vendorId;

        $product = \App\Models\Product::create($data);

        return response()->json(['data' => $product], 201);
    }

}
