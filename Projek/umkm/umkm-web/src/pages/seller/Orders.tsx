import React, { useEffect, useMemo, useState } from "react";

/**
 * Seller Dashboard – Orders Page (TypeScript, React, Tailwind)
 * URL: /sellerdashboard/orders
 * Endpoint: GET /api/vendor/orders
 * Env: VITE_API_BASE_URL (contoh: http://127.0.0.1:8000)
 */

// ========================= Helpers & Types =========================
const API_BASE =
  (import.meta as any).env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

// Helper token & headers
const getToken = () => localStorage.getItem("token") ?? "";

const buildHeaders = (): Record<string, string> => {
  const t = getToken();
  return {
    Accept: "application/json",
    ...(t ? { Authorization: `Bearer ${t}` } : {}),
  };
};

const fmtIDR = (n?: number | null) =>
  (n ?? 0).toLocaleString("id-ID", { style: "currency", currency: "IDR" });

const cls = (...xs: Array<string | false | null | undefined>) =>
  xs.filter(Boolean).join(" ");

// Sesuaikan dengan enum status di DB Anda
const STATUS_BADGE: Record<string, string> = {
  pending_payment: "bg-yellow-100 text-yellow-700",
  paid: "bg-green-100 text-green-700",
  processing: "bg-blue-100 text-blue-700",
  ready: "bg-cyan-100 text-cyan-700",
  shipped: "bg-indigo-100 text-indigo-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-rose-100 text-rose-700",
  refund: "bg-gray-100 text-gray-700",
};

interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  variant_name?: string | null;
  qty: number;
  unit_price: number;
  total_price: number;
}

interface Order {
  id: number;
  code: string;
  customer_name: string;
  customer_phone: string;
  subtotal: number;
  discount_total: number;
  delivery_fee: number;
  grand_total: number;
  status: string;
  payment_method?: string | null;
  delivery_mode?: string | null;
  paid_at?: string | null;
  created_at: string;
  items?: OrderItem[];
}

interface Paginated<T> {
  data: T[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page?: number;
    total?: number;
  };
}

// ========================= Main Component =========================
const SellerOrdersPage: React.FC = () => {
  const [rows, setRows] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1 });

  // filters
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  // expanded rows (show items)
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const query = useMemo(() => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (status) p.set("status", status);
    if (from) p.set("from", from);
    if (to) p.set("to", to);
    p.set("page", String(page));
    p.set("per_page", String(perPage));
    return p.toString();
  }, [q, status, from, to, page]);

  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/vendor/orders?${query}`, {
          signal: ac.signal,
          headers: buildHeaders(),
        });

        // bantu debug jika salah base url atau route
        if (!res.ok) {
          console.warn(
            "GET /api/vendor/orders failed:",
            res.status,
            res.statusText
          );
        }

        const data: Paginated<Order> = await res.json();
        if (Array.isArray(data?.data)) {
          setRows(data.data);
          setMeta({
            current_page: data.meta?.current_page ?? 1,
            last_page: data.meta?.last_page ?? 1,
          });
        } else {
          setRows([]);
          setMeta({ current_page: 1, last_page: 1 });
        }
      } catch (err) {
        if (!(err instanceof DOMException && err.name === "AbortError")) {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [query]);

  const resetFilters = () => {
    setQ("");
    setStatus("");
    setFrom("");
    setTo("");
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-2xl font-semibold">Orders Saya</h1>
        <div className="text-sm text-gray-400">Seller Dashboard</div>
      </div>

      {/* Filters */}
      <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-5">
        <input
          className="rounded-lg border px-3 py-2 bg-transparent"
          placeholder="Cari kode / nama / telp"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className="rounded-lg border px-3 py-2 bg-transparent"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Semua Status</option>
          <option value="pending_payment">Pending Payment</option>
          <option value="paid">Paid</option>
          <option value="processing">Processing</option>
          <option value="ready">Ready</option>
          <option value="shipped">Shipped</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="refund">Refund</option>
        </select>
        <input
          type="date"
          className="rounded-lg border px-3 py-2 bg-transparent"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <input
          type="date"
          className="rounded-lg border px-3 py-2 bg-transparent"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            onClick={() => setPage(1)}
            className="rounded-lg border px-3 py-2 hover:bg-gray-50"
          >
            Terapkan
          </button>
          <button
            onClick={resetFilters}
            className="rounded-lg border px-3 py-2 hover:bg-gray-50"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border bg-white/5">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50/10 text-gray-400">
            <tr>
              <th className="px-4 py-3 text-left">Order</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-right">Subtotal</th>
              <th className="px-4 py-3 text-right">Diskon</th>
              <th className="px-4 py-3 text-right">Ongkir</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Metode</th>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3 text-center">Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/20">
            {loading && (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-gray-400">
                  Memuat…
                </td>
              </tr>
            )}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-gray-400">
                  Belum ada pesanan.
                </td>
              </tr>
            )}

            {rows.map((row) => (
              <React.Fragment key={row.id}>
                <tr className="hover:bg-white/5">
                  <td className="px-4 py-3 font-medium">{row.code}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{row.customer_name}</div>
                    <div className="text-gray-400">{row.customer_phone}</div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {fmtIDR(row.subtotal)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {fmtIDR(row.discount_total)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {fmtIDR(row.delivery_fee)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {fmtIDR(row.grand_total)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cls(
                        "inline-block rounded-full px-2 py-1 text-xs",
                        STATUS_BADGE[row.status] ||
                          "bg-gray-100 text-gray-700"
                      )}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {row.payment_method?.toUpperCase?.() || "-"}
                  </td>
                  <td className="px-4 py-3">
                    {row.created_at
                      ? new Date(row.created_at).toLocaleString("id-ID")
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      className="rounded-lg border px-3 py-1 text-xs hover:bg-gray-50"
                      onClick={() =>
                        setExpanded((ex) => ({ ...ex, [row.id]: !ex[row.id] }))
                      }
                    >
                      {expanded[row.id] ? "Sembunyikan" : "Lihat"}
                    </button>
                  </td>
                </tr>
                {/* Detail Row */}
                {expanded[row.id] && (
                  <tr>
                    <td colSpan={10} className="px-4 pb-4">
                      <div className="rounded-xl bg-gray-50 p-3">
                        {(row.items ?? []).length === 0 && (
                          <div className="text-gray-500">Tidak ada item.</div>
                        )}
                        {(row.items ?? []).length > 0 && (
                          <div className="grid grid-cols-12 px-2 py-1 text-xs font-semibold text-gray-600">
                            <div className="col-span-6">Produk</div>
                            <div className="col-span-2 text-center">Qty</div>
                            <div className="col-span-2 text-right">Harga</div>
                            <div className="col-span-2 text-right">Subtotal</div>
                          </div>
                        )}
                        {(row.items ?? []).map((it) => (
                          <div
                            key={it.id}
                            className="grid grid-cols-12 items-center px-2 py-1"
                          >
                            <div className="col-span-6">
                              <div className="font-medium">
                                {it.product_name}
                              </div>
                              {it.variant_name && (
                                <div className="text-gray-500">
                                  Varian: {it.variant_name}
                                </div>
                              )}
                            </div>
                            <div className="col-span-2 text-center">
                              {it.qty}
                            </div>
                            <div className="col-span-2 text-right">
                              {fmtIDR(it.unit_price)}
                            </div>
                            <div className="col-span-2 text-right">
                              {fmtIDR(it.total_price)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <button
          className="rounded-lg border px-3 py-2 disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={meta.current_page <= 1}
        >
          Prev
        </button>
        <div>
          Page {meta.current_page} / {meta.last_page}
        </div>
        <button
          className="rounded-lg border px-3 py-2 disabled:opacity-50"
          onClick={() => setPage((p) => p + 1)}
          disabled={meta.current_page >= meta.last_page}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SellerOrdersPage;
