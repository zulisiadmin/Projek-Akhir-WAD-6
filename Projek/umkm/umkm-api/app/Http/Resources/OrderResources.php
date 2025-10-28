<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'code'            => $this->code,
            'customer_name'   => $this->customer_name,
            'customer_phone'  => $this->customer_phone,

            'subtotal'        => (int) $this->subtotal,
            'discount_total'  => (int) $this->discount_total,
            'delivery_fee'    => (int) $this->delivery_fee,
            'grand_total'     => (int) $this->grand_total,

            'status'          => $this->status,
            'payment_method'  => $this->payment_method,
            'delivery_mode'   => $this->delivery_mode,

            'paid_at'         => optional($this->paid_at)->toIso8601String(),
            'created_at'      => optional($this->created_at)->toIso8601String(),

            'items' => $this->whenLoaded('items', function () {
                return $this->items->map(fn ($it) => [
                    'id'           => $it->id,
                    'product_id'   => $it->product_id,
                    'product_name' => $it->product_name,
                    'variant_name' => $it->variant_name,
                    'qty'          => (int) $it->qty,
                    'unit_price'   => (int) $it->unit_price,
                    // DB kamu pakai total_price (bukan line_total)
                    'total_price'  => (int) $it->total_price,
                ]);
            }),
        ];
    }
}
