// src/pages/Checkout.tsx
import React, { useMemo, useState } from "react";

type CartItem = { id: number; name: string; price: number; qty: number; image?: string };

const currency = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(n);

const FACULTIES = [
  "Fakultas Ekonomi & Bisnis",
  "Fakultas Ilmu Komputer",
  "Fakultas Teknik",
  "Fakultas Keguruan & Ilmu Pendidikan",
  "Fakultas Hukum",
];

const BUILDINGS = [
  "Rectorate",
  "BAAK / Koperasi",
  "Perpustakaan",
  "FTI A",
  "FTI B",
  "Gedung Ekbis",
  "Asrama Putra",
  "Asrama Putri",
];

export default function Checkout() {
  // --- Dummy cart (ganti dengan state/global cart-mu) ---
  const [items] = useState<CartItem[]>([
    { id: 1, name: "Hoodie KAWALA", price: 165000, qty: 1, image: "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=200" },
    { id: 2, name: "Tumbler Cakrawala", price: 85000, qty: 2, image: "https://images.unsplash.com/photo-1517705008128-361805f42e86?w=200" },
  ]);

  // --- Kupon sederhana ---
  const [coupon, setCoupon] = useState("");
  const [couponPct, setCouponPct] = useState(0); // diskon %

  const subtotal = useMemo(
    () => items.reduce((s, it) => s + it.price * it.qty, 0),
    [items]
  );
  const shipping = 0; // lingkup kampus -> ambil di counter / antar area kampus (gratis)
  const discount = Math.floor((subtotal * couponPct) / 100);
  const total = Math.max(0, subtotal + shipping - discount);

  // --- Form kampus ---
  const [payMethod, setPayMethod] = useState<"cashier" | "bank_va" | "qris">("cashier");
  const [savingInfo, setSavingInfo] = useState(true);

  const [form, setForm] = useState({
    role: "Mahasiswa", // Mahasiswa / Dosen / Tendik
    name: "",
    campusId: "", // NIM/NIP/NIK Kampus
    faculty: "",
    program: "",
    building: "",
    room: "",
    phone: "",
    email: "",
    notes: "",
    pickup: "Ambil di Koperasi/BAAK", // atau "Antar area kampus"
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (code === "KAWALA10") setCouponPct(10);
    else if (code === "STUDENT5") setCouponPct(5);
    else setCouponPct(0);
  };

  const validate = () => {
    const er: typeof errors = {};
    if (!form.name.trim()) er.name = "Nama wajib diisi.";
    if (!form.campusId.trim()) er.campusId = "NIM/NIP wajib diisi.";
    if (!form.faculty.trim()) er.faculty = "Pilih fakultas.";
    if (!form.program.trim()) er.program = "Isi prodi/jurusan.";
    if (!form.building.trim()) er.building = "Pilih gedung/lokasi.";
    if (!form.phone.trim()) er.phone = "Nomor HP wajib diisi.";
    if (!form.email.trim()) er.email = "Email kampus wajib diisi.";
    else if (!/@cakrawala\.ac\.id$/i.test(form.email))
      er.email = "Gunakan email @cakrawala.ac.id";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const placeOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // TODO: kirim ke API order-mu
    alert(
      `Pesanan dibuat!\nMetode: ${payMethod}\nTotal: ${currency(total)}\nPickup: ${form.pickup}`
    );
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
      <style>{`
        .grid {
          display: grid; gap: 24px; grid-template-columns: 1fr;
        }
        @media (min-width: 980px) {
          .grid { grid-template-columns: 1.3fr 1fr; }
        }
        .title { margin: 0 0 18px; font-size: 28px; color: #111827; }
        .card { border: 1px solid #e5e7eb; border-radius: 14px; background: #fff; padding: 16px; }
        .row { display: grid; gap: 10px; }
        .label { font-size: 13px; color: #374151; font-weight: 600; }
        .input, .select, .textarea {
          width: 100%; border: 1px solid #cbd5e1; border-radius: 10px; padding: 10px 12px; font: inherit; outline: none; background: #fff;
        }
        .input:focus, .select:focus, .textarea:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,.15); }
        .grid-2 { display: grid; gap: 10px; grid-template-columns: 1fr; }
        @media (min-width: 680px) { .grid-2 { grid-template-columns: 1fr 1fr; } }
        .muted { color: #6b7280; font-size: 13px; }
        .price-row { display: flex; justify-content: space-between; gap: 8px; padding: 8px 0; }
        .divider { border: 0; border-top: 1px solid #e5e7eb; margin: 8px 0; }
        .btn {
          display: inline-flex; align-items: center; justify-content: center;
          background: #d32f2f; color: #fff; font-weight: 700; border: 0; border-radius: 10px; padding: 12px 16px; cursor: pointer;
        }
        .btn-secondary {
          background: #ef4444; color: #fff; font-weight: 700; border: 0; border-radius: 10px; padding: 10px 14px;
        }
        .error { color: #b91c1c; font-size: 12px; }
        .payopt { display: flex; align-items: center; gap: 10px; margin: 10px 0; }
        .coupon { display: grid; gap: 10px; grid-template-columns: 1fr auto; }
        .item { display: grid; grid-template-columns: 52px 1fr auto; gap: 10px; align-items: center; padding: 8px 0; }
        .item img { width: 52px; height: 52px; object-fit: cover; border-radius: 8px; border: 1px solid #e5e7eb; }
      `}</style>

      <div className="muted" style={{ marginBottom: 8 }}>
        Account / My Account / Cart / <b>Checkout</b>
      </div>

      <div className="grid">
        {/* Left: Billing Details (Campus scope) */}
        <section>
          <h1 className="title">Billing Details</h1>
          <form className="card" onSubmit={placeOrder}>
            <div className="grid-2">
              <div className="row">
                <label className="label">Peran*</label>
                <select
                  className="select"
                  name="role"
                  value={form.role}
                  onChange={onChange}
                >
                  <option>Mahasiswa</option>
                  <option>Dosen</option>
                  <option>Tendik</option>
                </select>
              </div>
              <div className="row">
                <label className="label">NIM / NIP*</label>
                <input
                  className="input"
                  name="campusId"
                  value={form.campusId}
                  onChange={onChange}
                  placeholder="Contoh: 21.11.1234"
                />
                {errors.campusId && <span className="error">{errors.campusId}</span>}
              </div>
            </div>

            <div className="row">
              <label className="label">Nama Lengkap*</label>
              <input className="input" name="name" value={form.name} onChange={onChange} />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>

            <div className="grid-2">
              <div className="row">
                <label className="label">Fakultas*</label>
                <select className="select" name="faculty" value={form.faculty} onChange={onChange}>
                  <option value="">Pilih Fakultas</option>
                  {FACULTIES.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
                {errors.faculty && <span className="error">{errors.faculty}</span>}
              </div>

              <div className="row">
                <label className="label">Program Studi / Jurusan*</label>
                <input className="input" name="program" value={form.program} onChange={onChange} />
                {errors.program && <span className="error">{errors.program}</span>}
              </div>
            </div>

            <div className="grid-2">
              <div className="row">
                <label className="label">Gedung / Lokasi*</label>
                <select className="select" name="building" value={form.building} onChange={onChange}>
                  <option value="">Pilih Gedung/Lokasi</option>
                  {BUILDINGS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
                {errors.building && <span className="error">{errors.building}</span>}
              </div>

              <div className="row">
                <label className="label">Ruangan / Kamar (opsional)</label>
                <input className="input" name="room" value={form.room} onChange={onChange} placeholder="Contoh: FTI A-302 / A-Putra 2-14" />
              </div>
            </div>

            <div className="grid-2">
              <div className="row">
                <label className="label">Nomor HP*</label>
                <input className="input" name="phone" value={form.phone} onChange={onChange} placeholder="08xxxxxxxxxx" />
                {errors.phone && <span className="error">{errors.phone}</span>}
              </div>
              <div className="row">
                <label className="label">Email Kampus (@cakrawala.ac.id)*</label>
                <input className="input" name="email" value={form.email} onChange={onChange} placeholder="nama@cakrawala.ac.id" />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>
            </div>

            <div className="row">
              <label className="label">Metode Pengambilan*</label>
              <select className="select" name="pickup" value={form.pickup} onChange={onChange}>
                <option>Ambil di Koperasi/BAAK</option>
                <option>Antar area kampus</option>
              </select>
            </div>

            <div className="row">
              <label className="label">Catatan (opsional)</label>
              <textarea className="textarea" rows={4} name="notes" value={form.notes} onChange={onChange} placeholder="Instruksi khusus untuk pengambilan/antar..." />
            </div>

            <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
              <input type="checkbox" checked={savingInfo} onChange={(e) => setSavingInfo(e.target.checked)} />
              <span className="muted">Simpan data ini untuk checkout berikutnya</span>
            </label>

            <div style={{ marginTop: 16 }}>
              <button type="submit" className="btn">Place Order</button>
            </div>
          </form>
        </section>

        {/* Right: Order Summary */}
        <aside className="card">
          <div style={{ display: "grid", gap: 8 }}>
            {items.map((it) => (
              <div key={it.id} className="item">
                <img src={it.image} alt={it.name} />
                <div>
                  <div style={{ fontWeight: 600 }}>{it.name}</div>
                  <div className="muted">x{it.qty}</div>
                </div>
                <div style={{ fontWeight: 600 }}>{currency(it.price * it.qty)}</div>
              </div>
            ))}
          </div>

          <hr className="divider" />
          <div className="price-row"><span>Subtotal:</span><b>{currency(subtotal)}</b></div>
          <div className="price-row"><span>Shipping:</span><b>Free</b></div>
          {discount > 0 && (
            <div className="price-row"><span>Discount:</span><b>-{currency(discount)}</b></div>
          )}
          <hr className="divider" />
          <div className="price-row" style={{ fontSize: 18 }}>
            <span><b>Total:</b></span><b>{currency(total)}</b>
          </div>

          <div style={{ marginTop: 14 }}>
            <div className="payopt">
              <input
                type="radio"
                id="pay-cashier"
                name="pay"
                checked={payMethod === "cashier"}
                onChange={() => setPayMethod("cashier")}
              />
              <label htmlFor="pay-cashier">Bayar di Koperasi/BAAK (Cash on Campus)</label>
            </div>
            <div className="payopt">
              <input
                type="radio"
                id="pay-bank"
                name="pay"
                checked={payMethod === "bank_va"}
                onChange={() => setPayMethod("bank_va")}
              />
              <label htmlFor="pay-bank">Virtual Account Kampus</label>
            </div>
            <div className="payopt">
              <input
                type="radio"
                id="pay-qris"
                name="pay"
                checked={payMethod === "qris"}
                onChange={() => setPayMethod("qris")}
              />
              <label htmlFor="pay-qris">QRIS Koperasi</label>
            </div>
          </div>

          <div style={{ marginTop: 10 }} className="coupon">
            <input
              className="input"
              placeholder="Coupon Code (mis. KAWALA10)"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />
            <button className="btn-secondary" onClick={applyCoupon} type="button">
              Apply Coupon
            </button>
          </div>

          <div className="muted" style={{ marginTop: 10 }}>
            *Lingkup kampus: pengambilan di koperasi/BAAK atau antar area kampus (gratis).
          </div>
        </aside>
      </div>
    </div>
  );
}
