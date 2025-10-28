<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class VendorOrderController extends Controller
{
    /**
     * Resolve vendor id yang benar untuk user saat ini.
     * Urutan:
     * 1) $user->vendor_id          (jika kolom ini ada di users)
     * 2) $user->vendor->id         (jika ada relasi vendor())
     * 3) Cari di tabel vendors via user_id (kalau ada tabel vendors)
     * 4) fallback $user->id         (opsi terakhir; hanya jika memang sama)
     */
    private function resolveVendorId($user): ?int
    {
        if (!empty($user->vendor_id)) {
            return (int) $user->vendor_id;
        }

        if (method_exists($user, 'vendor') && $user->vendor) {
            return (int) $user->vendor->id;
        }

        // Jika kamu punya model Vendor dengan kolom user_id:
        // try {
        //     return \App\Models\Vendor::where('user_id', $user->id)->value('id');
        // } catch (\Throwable $e) {}

        // LAST RESORT – hanya jika memang vendor_id == users.id
        return (int) $user->id;
    }

    public function index(Request $request)
    {
        $user = $request->user();
        abort_unless($user && $user->role === 'vendor', 403, 'Hanya vendor.');

        $vendorId = $this->resolveVendorId($user);
        abort_unless($vendorId, 403, 'Vendor tidak dikenali.');

        $status  = $request->string('status')->toString();
        $q       = $request->string('q')->toString();
        $from    = $request->date('from');
        $to      = $request->date('to');
        $perPage = (int) $request->input('per_page', 10);

        // LOG DIAGNOSA (sementara)
        Log::info('vendor_orders_index', [
            'auth_user_id'        => $user->id,
            'role'                => $user->role,
            'user.vendor_id'      => $user->vendor_id ?? null,
            'rel.vendor.id'       => (method_exists($user,'vendor') && $user->vendor) ? $user->vendor->id : null,
            'resolved_vendor_id'  => $vendorId,
            'exists_count'        => Order::where('vendor_id', $vendorId)->count(),
        ]);

        $rows = Order::with('items')
            ->where('vendor_id', $vendorId)
            ->when($status, fn($qq) => $qq->where('status', $status))
            ->when($q, function ($qq) use ($q) {
                $qq->where(function ($w) use ($q) {
                    $w->where('code', 'like', "%{$q}%")
                      ->orWhere('customer_name', 'like', "%{$q}%")
                      ->orWhere('customer_phone', 'like', "%{$q}%");
                });
            })
            ->when($from, fn($qq) => $qq->whereDate('created_at', '>=', $from))
            ->when($to,   fn($qq) => $qq->whereDate('created_at', '<=', $to))
            ->orderByDesc('created_at')
            ->paginate($perPage);

        return OrderResource::collection($rows);
    }

    public function show(Request $request, Order $order)
    {
        $user = $request->user();
        abort_unless($user && $user->role === 'vendor', 403);

        $vendorId = $this->resolveVendorId($user);
        abort_unless($vendorId, 403, 'Vendor tidak dikenali.');

        abort_unless($order->vendor_id === $vendorId, 403, 'Bukan milik vendor ini.');

        $order->load('items');
        return new OrderResource($order);
    }
}
