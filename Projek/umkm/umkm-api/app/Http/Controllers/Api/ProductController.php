<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Repositories\Contracts\ProductRepository;
use App\Repositories\Filters\ProductFilter;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class ProductController extends Controller
{
    public function __construct(
        private readonly ProductRepository $products,
    ) {}

    public function index(Request $request)
    {
        $perPage = (int) $request->integer('per_page', 12);
        $filter  = ProductFilter::fromRequest($request);

        $paginated = $this->products->paginate($filter, $perPage);
        $paginated->appends($request->query()); // keep query string

        return ProductResource::collection($paginated);
    }

    public function show(Request $request, string $idOrSlug)
    {
        $product = $this->products->findByIdOrSlugWithRelations($idOrSlug);
        return ProductResource::make($product);
    }



public function store(Request $request)
{
    $user = $request->user();
    abort_unless($user && $user->role === 'vendor', 403, 'Hanya penjual yang boleh menambah produk.');

    $data = $request->validate([
        'name'        => 'required|string|max:255',
        'slug'        => 'nullable|string|max:255|unique:products,slug',
        'base_price'  => 'required|numeric|min:0',
        'description' => 'nullable|string',
        'stock'       => 'nullable|integer|min:0',

        // tambahan yang ikut terkirim dari form, TAPI JANGAN dimasukkan ke create():
        'category_ids'    => 'array',
        'category_ids.*'  => 'integer|exists:categories,id',
        'variants'        => 'nullable|string',   // JSON
        'images.*'        => 'image|max:2048',
    ]);

    // ⬅️ ambil hanya kolom yang benar2 ada di tabel products
    $base = Arr::only($data, ['name','slug','base_price','description','stock']);

    // buat product-nya dulu (repository kamu)
    $product = $this->products->createForOwner($user->id, $base);

    // ====== BARU sesudah itu tangani relasi/pelengkap ======
    // kategori
    if ($request->filled('category_ids')) {
        $product->categories()->sync($request->input('category_ids'));
    }

    // varian
    if ($request->filled('variants')) {
        foreach (json_decode($request->string('variants'), true) ?: [] as $v) {
            $product->variants()->create([
                'name'        => $v['name'] ?? '',
                'type'        => $v['type'] ?? 'option',
                'price_delta' => $v['price_delta'] ?? 0,
                'stock'       => $v['stock'] ?? null,
                'is_default'  => !empty($v['is_default']),
                'sort'        => 0,
            ]);
        }
    }

    // gambar
    if ($request->hasFile('images')) {
        foreach ($request->file('images') as $i => $file) {
            $path = $file->store('products','public');
            $product->images()->create([
                'url' => $path, // contoh: "products/abc123.jpg"
                'is_primary' => $i === 0 ? 1 : 0,
                'sort' => $i,
            ]);
        }
    }

    return response()->json(['data' => new \App\Http\Resources\ProductResource(
        $product->load(['images','variants','categories'])
    )], 201);
}


    public function sellerIndex(Request $request)
    {
        $user = $request->user();

        $vendorId = \App\Models\Vendor::where('owner_id', $user->id)->value('id');
        abort_unless($vendorId, 422, 'Vendor tidak ditemukan untuk user ini.');

        $request->merge(['vendor_id' => $vendorId]);

        return $this->index($request);
    }

}
