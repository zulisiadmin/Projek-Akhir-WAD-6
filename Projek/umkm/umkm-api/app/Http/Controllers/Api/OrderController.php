<?php 
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function store(Request $r)
    {
        $data = $r->validate([
            'customer_name'       => 'required|string|max:255',
            'customer_phone'      => 'required|string|max:50',
            'pickup_location_id'  => 'required|integer|exists:campus_locations,id',
            'delivery_mode'       => 'required|in:now,schedule',
            'delivery_time'       => 'nullable|date',         // wajib diisi jika mode=schedule (akan dicek di bawah)
            'payment_method'      => 'required|in:qris',      // sesuai requirement
            'items'               => 'required|array|min:1',
            'items.*.product_id'  => 'required|integer|exists:products,id',
            'items.*.qty'         => 'required|integer|min:1',
        ]);

        if ($data['delivery_mode'] === 'schedule' && empty($data['delivery_time'])) {
            return response()->json(['message' => 'Waktu pengantaran wajib dipilih'], 422);
        }

        // ambil produk & hitung total di SERVER
        $itemsReq   = collect($data['items']);
        $productIds = $itemsReq->pluck('product_id')->all();
        $products   = Product::whereIn('id', $productIds)->get()->keyBy('id');

        $firstProduct = $products->first(); // Ambil produk pertama dari koleksi
        $vendorId = $firstProduct ? $firstProduct->vendor_id : null;

        $lines    = [];
        $subtotal = 0;
        foreach ($itemsReq as $it) {
            $p = $products[$it['product_id']];
            $price = (int) ($p->base_price ?? 0);
            $qty   = (int) $it['qty'];
            $line  = $price * $qty;
            $subtotal += $line;

            $lines[] = [
                'product_id'   => $p->id,
                'product_name' => $p->name,
                'qty'          => $qty,
                'unit_price'        => $price,
                'total_price'   => $line,
            ];
        }

        // kebijakan ongkir: pengantaran di kampus => 0
        $deliveryFee   = 0;
        $discountTotal = 0; // tidak ada kupon
        $grandTotal    = $subtotal + $deliveryFee - $discountTotal;

        $code = 'ORD-'.now()->format('Ymd').'-'.Str::upper(Str::random(6));

        $order = DB::transaction(function () use ($data, $code, $subtotal, $discountTotal, $deliveryFee, $grandTotal, $lines,$vendorId) {
            /** @var Order $order */
            $order = Order::create([
                'code'               => $code,
                'user_id'            => auth()->id(),      // opsional (null kalau guest)
                'vendor_id'          => $vendorId,              // isi kalau kamu butuh (ambil dari produk pertama misalnya)
                'customer_name'      => $data['customer_name'],
                'customer_phone'     => $data['customer_phone'],
                'pickup_location_id' => $data['pickup_location_id'],
                'delivery_mode'      => $data['delivery_mode'],
                'delivery_note'      => $data['delivery_mode'] === 'schedule'
                                         ? ('Jadwal: '.\Carbon\Carbon::parse($data['delivery_time'])->format('Y-m-d H:i'))
                                         : null,
                'subtotal'           => $subtotal,
                'discount_total'     => $discountTotal,
                'delivery_fee'       => $deliveryFee,
                'grand_total'        => $grandTotal,
                'status'             => 'unpaid',
                'payment_method'     => 'qris',
                'paid_at'            => null,
            ]);

            foreach ($lines as $ln) {
                $order->items()->create($ln);
            }

            return $order;
        });

        // jika nanti kamu generate QRIS (static/dynamic), balikin url/qr string di sini
        return response()->json([
            'id'            => $order->id,
            'code'          => $order->code,
            'grand_total'   => $order->grand_total,
            'payment_method'=> $order->payment_method,
            'status'        => $order->status,
        ], 201);
    }
}
