<?php

namespace App\Repositories\Filters;

use Illuminate\Http\Request;

class ProductFilter
{
    public ?string $search;
    public ?int $vendorId;
    public ?string $category; // id (numeric) atau slug (string)
    public string $sort;

    public function __construct(?string $search, ?int $vendorId, ?string $category, string $sort)
    {
        $this->search   = $search !== '' ? $search : null;
        $this->vendorId = $vendorId ?: null;
        $this->category = $category !== '' ? $category : null;
        $this->sort     = $sort ?: 'newest';
    }

    public static function fromRequest(Request $request): self
    {
        return new self(
            $request->string('q')->toString(),
            $request->integer('vendor_id'),
            $request->string('category')->toString(),
            $request->string('sort', 'newest')->toString(),
        );
    }
}
