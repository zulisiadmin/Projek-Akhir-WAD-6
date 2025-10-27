// src/pages/Checkout.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ================= ENV & helpers ================ */
const API_BASE =
  (import.meta as any)?.env?.VITE_API_BASE_URL ||
  (import.meta as any)?.env?.VITE_BASE_API_URL ||
  (import.meta as any)?.env?.VITE_API_URL ||
  "";

const LOCATION_URL = `${API_BASE}/api/campus-locations`;

const currency = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(n || 0);

/* ================ Types ================== */
type CartItem = { product_id:number; name:string; price:number; qty:number; image_url?:string|null };
type CampusLocation = { id:number; name:string; code?:string };

/* ================ Cart (anti-flicker) ================ */
function loadCartMap(): Record<number, CartItem> {
  const keys = ["cart:v1", "cart"];
  for (const k of keys) {
    try {
      const raw = localStorage.getItem(k);
      if (!raw) continue;
      const obj = JSON.parse(raw);
      if (obj && typeof obj === "object") return obj as Record<number, CartItem>;
    } catch {}
  }
  return {};
}

/* ================ Parser & extractor ================= */
function extractLocations(payload: any): CampusLocation[] {
  if (typeof payload === "string") {
    try { payload = JSON.parse(payload); } catch { return []; }
  }
  const list = Array.isArray(payload?.data) ? payload.data
             : Array.isArray(payload) ? payload
             : [];
  return list
    .map((x: any) => ({
      id: Number(x?.id),
      name: String(x?.name ?? x?.nama ?? x?.lokasi ?? x?.nama_lokasi ?? "").trim(),
      code: x?.code ?? x?.kode ?? undefined,
    }))
    .filter((v) => v.id && v.name);
}

/* ================ Fallback data (agar dropdown tetap jalan) ================ */
const FALLBACK_LOCATIONS: CampusLocation[] = [
  { id: 4, name: "Gedung F" },
  { id: 1, name: "Kantin A" },
  { id: 2, name: "Kantin B" },
  { id: 3, name: "Lobi Perpustakaan" },
];

/* ================ Komponen ================= */
export default function Checkout() {
  const navigate = useNavigate();

  // Cart
  const [cart] = useState<Record<number, CartItem>>(() => loadCartMap());
  const items = useMemo(() => Object.values(cart), [cart]);

  // Form
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [pickupLocationId, setPickupLocationId] = useState<string>("");
  const [deliveryMode, setDeliveryMode] = useState<"now" | "schedule">("now");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const paymentMethod = "qris" as const;

  // Lokasi
  const [locations, setLocations] = useState<CampusLocation[]>([]);
  const [locLoading, setLocLoading] = useState(true);
  const [locErr, setLocErr] = useState<string | null>(null);
  const [locDbg, setLocDbg] = useState<any>(null);

  // Ringkasan
  const subtotal = useMemo(() => items.reduce((s, it) => s + it.qty * (it.price || 0), 0), [items]);
  const deliveryFee = 0;
  const total = subtotal + deliveryFee;

  // Loader lokasi super-tahan banting
  async function fetchLocationsStrict() {
    setLocLoading(true);
    setLocErr(null);
    setLocDbg(null);

    const url = `${LOCATION_URL}?_ts=${Date.now()}`;
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
        cache: "no-store",
      });

      const ct = res.headers.get("content-type") || "";
      const text = await res.text();

      setLocDbg({
        url,
        status: res.status,
        contentType: ct,
        rawPreview: text.slice(0, 250),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const low = text.trim().toLowerCase();
      if (low.startsWith("<!doctype") || low.startsWith("<html")) {
        throw new Error("Server mengirim HTML (kemungkinan route /api ketelan SPA).");
      }

      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Server tidak mengirim JSON valid.");
      }

      const arr = extractLocations(data);
      if (!arr.length) throw new Error("Data lokasi kosong / tidak terbaca.");

      setLocations(arr);
      setLocErr(null);
    } catch (e: any) {
      // fallback supaya dropdown tetap hidup
      setLocations(FALLBACK_LOCATIONS);
      setLocErr(e?.message || "Gagal memuat lokasi, gunakan fallback.");
    } finally {
      setLocLoading(false);
    }
  }

  useEffect(() => {
    fetchLocationsStrict();
    window.scrollTo(0, 0);
  }, []);

  const canSubmit =
    items.length > 0 &&
    customerName.trim() &&
    customerPhone.trim() &&
    pickupLocationId &&
    (deliveryMode === "now" || (scheduleDate && scheduleTime));

  async function placeOrder() {
    if (!canSubmit) return;
    try {
      const delivery_time =
        deliveryMode === "schedule"
          ? new Date(`${scheduleDate}T${scheduleTime}:00`).toISOString()
          : null;

      const payload = {
        customer_name: customerName,
        customer_phone: customerPhone,
        pickup_location_id: Number(pickupLocationId),
        delivery_mode: deliveryMode,
        delivery_time,
        payment_method: paymentMethod,
        items: items.map((i) => ({ product_id: i.product_id, qty: i.qty })),
      };

      const res = await fetch(`${API_BASE}/api/orders?_ts=${Date.now()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      if (!res.ok) {
        let msg = "Gagal membuat pesanan";
        try {
          const j = JSON.parse(text);
          msg = j?.message || msg;
        } catch {}
        alert(msg);
        return;
      }

      let data: any = {};
      try { data = JSON.parse(text); } catch {}

      // Bersihkan cart
      localStorage.removeItem("cart:v1");
      localStorage.removeItem("cart");

      // Redirect payment jika ada
      if (data?.payment_url) {
        window.location.href = data.payment_url as string;
        return;
      }

      // Fallback ke success page
      const inv = encodeURIComponent(
        data?.invoice_number || data?.code || String(data?.id || "")
      );
      navigate(`/orders/success?invoice=${inv}`);
    } catch (e: any) {
      alert(e?.message || "Gagal membuat pesanan");
    }
  }

  return (
    <div className="checkout container">
      <style>{styles}</style>

      <nav className="breadcrumb">
        <span>Account</span> / <span>My Account</span> / <span>Product</span> / <span>View Cart</span> /{" "}
        <strong>CheckOut</strong>
      </nav>

      <div className="grid">
        {/* LEFT: Billing */}
        <section className="left">
          <h2>Billing Details</h2>

          <label className="lbl">Nama Pembeli*</label>
          <input
            className="inp"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Nama lengkap"
            autoComplete="name"
          />

          <div className="row2">
            <div>
              <label className="lbl">
                Lokasi Kampus*{" "}
                {locLoading ? <span className="muted">(memuat…)</span> : locErr ? <span className="errtxt"></span> : null}
              </label>
              <select
                className="inp"
                value={pickupLocationId}
                onChange={(e) => setPickupLocationId(e.target.value)}
                disabled={locLoading}
              >
                <option value="">{locLoading ? "Memuat…" : "— Pilih lokasi —"}</option>
                {locations.map((l) => (
                  <option key={l.id} value={String(l.id)}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="lbl">No. HP / WhatsApp*</label>
              <input
                className="inp"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="08xxxxxxxxxx"
                inputMode="tel"
                autoComplete="tel"
              />
            </div>
          </div>

          <label className="lbl">Pilihan Antar</label>
          <div className="row2">
            <label className="radio">
              <input
                type="radio"
                name="deliv"
                checked={deliveryMode === "now"}
                onChange={() => setDeliveryMode("now")}
              />
              <span> Antar sekarang</span>
            </label>
            <label className="radio">
              <input
                type="radio"
                name="deliv"
                checked={deliveryMode === "schedule"}
                onChange={() => setDeliveryMode("schedule")}
              />
              <span> Jadwalkan</span>
            </label>
          </div>

          {deliveryMode === "schedule" && (
            <div className="row2">
              <div>
                <label className="lbl">Tanggal</label>
                <input
                  type="date"
                  className="inp"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                />
              </div>
              <div>
                <label className="lbl">Jam</label>
                <input
                  type="time"
                  className="inp"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                />
              </div>
            </div>
          )}

          <label className="lbl">Metode Pembayaran</label>
          <div className="paybox">
            <label className="radio">
              <input type="radio" checked readOnly />
              <span> QRIS (satu-satunya metode)</span>
            </label>
            <div className="qris-icons">
              <img
                src="/qris.svg"
                alt="QRIS"
                onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
              />
            </div>
          </div>
        </section>

        {/* RIGHT: Ringkasan */}
        <aside className="right">
          <ul className="items">
            {items.map((it) => (
              <li className="item" key={it.product_id}>
                <img
                  src={it.image_url || "/placeholder.png"}
                  alt={it.name}
                  className="thumb"
                  onError={(e) => ((e.currentTarget as HTMLImageElement).src = "/placeholder.png")}
                />
                <div className="name">
                  {it.name} <span className="muted">× {it.qty}</span>
                </div>
                <div className="price">{currency(it.price)}</div>
              </li>
            ))}
            {items.length === 0 && <li className="item">Keranjang kosong.</li>}
          </ul>

          <div className="row">
            <span>Subtotal:</span>
            <span>{currency(subtotal)}</span>
          </div>

          <div className="row">
            <span>Shipping:</span>
            <span>{deliveryFee === 0 ? "Free" : currency(deliveryFee)}</span>
          </div>

          <div className="row total">
            <span>Total:</span>
            <span>{currency(total)}</span>
          </div>

          <button className="btn primary" disabled={!canSubmit} onClick={placeOrder}>
            Place Order
          </button>
        </aside>
      </div>
    </div>
  );
}

/* ================ Minimal CSS ================ */
const styles = `
.checkout .container{max-width:1140px;margin:0 auto;padding:24px}
.breadcrumb{font-size:12px;color:#999;margin-bottom:12px}
.grid{display:grid;grid-template-columns:1fr 420px;gap:32px}
.left h2{font-size:32px;margin:8px 0 16px}
.lbl{display:block;font-size:14px;margin:12px 0 6px}
.inp{width:100%;padding:12px 14px;border:1px solid #e5e7eb;border-radius:6px;background:#fff;color:#333}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.right{border:1px solid #eee;border-radius:10px;padding:16px;align-self:start;background:#fff}
.items{list-style:none;margin:0;padding:0}
.item{display:grid;grid-template-columns:56px 1fr auto;gap:12px;align-items:center;padding:8px 0;border-bottom:1px solid #f2f2f2}
.item:last-child{border-bottom:none}
.thumb{width:56px;height:56px;object-fit:cover;border-radius:8px;background:#f3f4f6}
.name{font-size:14px}
.name .muted{opacity:.6}
.price{font-weight:600}
.row{display:flex;justify-content:space-between;align-items:center;margin:8px 0;color:#555}
.total{font-weight:700;color:#111}
.radio{display:flex;align-items:center;gap:10px;margin:8px 0}
.paybox{border:1px dashed #e5e7eb;border-radius:8px;padding:10px 12px;display:flex;justify-content:space-between;align-items:center;background:#fff}
.qris-icons img{height:24px}
.btn{padding:12px 16px;border-radius:6px;border:1px solid transparent;cursor:pointer}
.btn.ghost{border-color:#e5e7eb;background:#fff}
.btn.primary{background:#dc3545;color:#fff;width:100%;margin-top:12px}
.errtxt{color:#b91c1c;font-weight:600}
@media (max-width: 992px){.grid{grid-template-columns:1fr}}
`;
