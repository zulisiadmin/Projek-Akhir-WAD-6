import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * UMKM Kawala — Cart Page
 *
 * ✔️ Mendukung localStorage key: 'cart:v1' (utama) & 'cart' (fallback)
 * ✔️ Struktur item: { id, name, price, qty, image }
 * ✔️ Update qty, hapus item, apply kupon (contoh: DISKON10 = 10%)
 * ✔️ Tampil subtotal per item & ringkasan total (dengan Free Shipping)
 * ✔️ Simpan perubahan kembali ke localStorage
 * ✔️ Desain mirip contoh: tabel + panel ringkasan di kanan
 *
 * Catatan: Gaya menggunakan Tailwind CSS. Jika proyek Anda belum memakai Tailwind,
 * Anda bisa mengganti className dengan CSS Anda sendiri atau utility yang ada.
 */

// ----- helper -----
const formatIDR = (n) =>
  (n ?? 0).toLocaleString("id-ID", { style: "currency", currency: "IDR" });

const QTY_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1);

export default function CartPage() {
  const navigate = useNavigate?.() ?? null; // fallback kalau tidak pakai react-router

  // state
  const [items, setItems] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null); // {code, percent}

  // load cart dari localStorage
  useEffect(() => {
    try {
      const raw =
        localStorage.getItem("cart:v1") ?? localStorage.getItem("cart");
      if (raw) {
        const parsed = JSON.parse(raw);
        // handle jika format bukan array
        const arr = Array.isArray(parsed) ? parsed : parsed?.items ?? [];
        setItems(
          arr.map((it) => ({
            id: it.id ?? it.product_id ?? crypto.randomUUID(),
            name: it.name ?? it.title ?? "Produk",
            price: Number(it.price ?? it.base_price ?? 0),
            qty: Number(it.qty ?? it.quantity ?? 1),
            image:
              it.image ??
              it.thumbnail ??
              "https://via.placeholder.com/60x60.png?text=IMG",
          }))
        );
      } else {
        // contoh dummy bila cart kosong (bisa dihapus)
        setItems([]);
      }
    } catch (e) {
      console.error("Failed to read cart:", e);
      setItems([]);
    }
  }, []);

  // hitung subtotal, diskon, total
  const { subtotal, discount, shipping, total } = useMemo(() => {
    const sub = items.reduce((acc, it) => acc + it.price * it.qty, 0);
    const disc = appliedCoupon ? Math.round((sub * appliedCoupon.percent) / 100) : 0;
    // contoh: free shipping selalu 0
    const ship = 0;
    const ttl = Math.max(sub - disc + ship, 0);
    return { subtotal: sub, discount: disc, shipping: ship, total: ttl };
  }, [items, appliedCoupon]);

  const saveCart = (next) => {
    setItems(next);
    localStorage.setItem("cart:v1", JSON.stringify(next));
  };

  const updateQty = (id, qty) => {
    const next = items.map((it) => (it.id === id ? { ...it, qty } : it));
    saveCart(next);
  };

  const removeItem = (id) => {
    const next = items.filter((it) => it.id !== id);
    saveCart(next);
  };

  const onApplyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (!code) return;
    // contoh kupon
    const known = {
      DISKON10: 10,
      HEMAT20: 20,
      KAWALA5: 5,
    };
    if (known[code]) {
      setAppliedCoupon({ code, percent: known[code] });
    } else {
      setAppliedCoupon(null);
      alert("Kode kupon tidak dikenal.");
    }
  };

  const onUpdateCart = () => {
    // sudah otomatis tersimpan saat updateQty/remove, ini hanya feedback UX
    alert("Keranjang diperbarui.");
  };

  const goTo = (path) => {
    if (navigate) navigate(path);
    else window.location.href = path;
  };

  const onCheckout = () => {
    // simpan state checkout sementara (opsional), atau langsung navigasi
    goTo("/checkout");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <ol className="flex items-center gap-2">
          <li>
            <button
              className="hover:text-gray-800"
              onClick={() => goTo("/")}
            >
              Home
            </button>
          </li>
          <li className="opacity-60">/</li>
          <li className="text-gray-800">Cart</li>
        </ol>
      </nav>

      {/* container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* table */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white">
            <div className="grid grid-cols-12 px-6 py-4 text-sm font-semibold text-gray-500">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-right">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Subtotal</div>
            </div>

            <div className="divide-y">
              {items.length === 0 && (
                <div className="px-6 py-10 text-center text-gray-500">
                  Keranjang masih kosong.
                </div>
              )}

              {items.map((it) => (
                <div key={it.id} className="grid grid-cols-12 items-center px-6 py-5">
                  <div className="col-span-6 flex items-center gap-4">
                    <img
                      src={it.image}
                      alt={it.name}
                      className="h-12 w-12 rounded-lg object-cover border"
                    />
                    <div>
                      <div className="font-medium text-gray-800">{it.name}</div>
                      <button
                        className="text-xs text-red-500 hover:text-red-600"
                        onClick={() => removeItem(it.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="col-span-2 text-right font-medium">
                    {formatIDR(it.price)}
                  </div>

                  <div className="col-span-2 flex justify-center">
                    <select
                      className="w-20 rounded-lg border border-gray-300 px-2 py-1"
                      value={it.qty}
                      onChange={(e) => updateQty(it.id, Number(e.target.value))}
                    >
                      {QTY_OPTIONS.map((q) => (
                        <option key={q} value={q}>
                          {q.toString().padStart(2, "0")}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2 text-right font-semibold">
                    {formatIDR(it.price * it.qty)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* actions below table */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <button
                className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
                onClick={() => goTo("/shop")}
              >
                Return To Shop
              </button>

              <button
                className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
                onClick={onUpdateCart}
                disabled={items.length === 0}
              >
                Update Cart
              </button>
            </div>

            <div className="flex gap-2 sm:gap-3">
              <input
                type="text"
                placeholder="Coupon Code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="w-48 rounded-lg border px-3 py-2"
              />
              <button
                className="rounded-lg bg-rose-500 px-4 py-2 text-white hover:bg-rose-600 disabled:opacity-50"
                onClick={onApplyCoupon}
                disabled={items.length === 0}
              >
                Apply Coupon
              </button>
            </div>
          </div>
        </div>

        {/* summary */}
        <aside className="lg:col-span-1">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="mb-4 text-lg font-semibold">Cart Total</div>
            <div className="space-y-3 text-sm">
              <Row label="Subtotal" value={formatIDR(subtotal)} />
              {appliedCoupon && (
                <Row
                  label={`Discount (${appliedCoupon.code})`}
                  value={"-" + formatIDR(discount)}
                />
              )}
              <Row label="Shipping" value="Free" />
              <div className="border-t pt-3 font-semibold">
                <Row label="Total" value={formatIDR(total)} />
              </div>
            </div>

            <button
              className="mt-5 w-full rounded-lg bg-rose-500 px-4 py-3 font-medium text-white hover:bg-rose-600 disabled:opacity-50"
              onClick={onCheckout}
              disabled={items.length === 0}
            >
              Proceed to checkout
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-600">{label}</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );
}
