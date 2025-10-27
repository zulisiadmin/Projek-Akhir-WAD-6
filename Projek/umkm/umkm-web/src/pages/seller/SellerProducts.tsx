import React, { useEffect, useMemo, useState } from "react";
import { authApi } from "../../services/api";

// ==== Types ====
export type Product = {
  id: number;
  name: string;
  slug: string;
  base_price: number;
  stock: number;
  status: string;
  created_at: string;
};

type Category = { id: number; name: string };

type VariantDraft = {
  name: string; // mis. Regular / Large
  type?: string; // opsional, kalau backend pakai kolom ini
  price_delta: number; // selisih harga
  stock: number | null; // stok varian (boleh null)
  is_default: boolean;
};

export default function SellerProducts() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // query state
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  // ====== Create form state ======
  const [openCreate, setOpenCreate] = useState(false);
  const [fName, setFName] = useState("");
  const [fPrice, setFPrice] = useState<number | "">("");
  const [fStock, setFStock] = useState<number | "">("");
  const [fDesc, setFDesc] = useState("");

  // categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCats, setSelectedCats] = useState<number[]>([]);

  // images
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // variants
  const [variants, setVariants] = useState<VariantDraft[]>([
    { name: "Regular", type: "option", price_delta: 0, stock: null, is_default: true },
  ]);

  const canCreate = useMemo(
    () => fName.trim() && fPrice !== "" && fStock !== "",
    [fName, fPrice, fStock]
  );

  // ====== Load list & categories ======
  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        await authApi.get("/sanctum/csrf-cookie");
        const [list, cats] = await Promise.all([
          authApi.get(`/api/seller/products`, { params: { q, page, per_page: perPage, sort: "newest" } }),
          authApi.get(`/api/categories`, { params: { fields: "id,name", per_page: 100 } }).catch(() => ({ data: [] })),
        ]);
        if (cancel) return;
        const data = list.data;
        setItems(data.data ?? data);
        setTotal(data?.meta?.total ?? data?.total ?? (data.data?.length || 0));
        setCategories(cats.data?.data ?? cats.data ?? []);
      } catch (e: any) {
        if (cancel) return;
        setErr(e?.response?.status ? `Error ${e.response.status}` : "Network error");
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [q, page, perPage]);

  // preview images
  useEffect(() => {
    const urls = images.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [images]);

  const resetForm = () => {
    setFName("");
    setFPrice("");
    setFStock("");
    setFDesc("");
    setImages([]);
    setPreviews([]);
    setSelectedCats([]);
    setVariants([{ name: "Regular", type: "option", price_delta: 0, stock: null, is_default: true }]);
  };

  const handleCreate = async () => {
    if (!canCreate) return;
    try {
      setErr(null);
      await authApi.get("/sanctum/csrf-cookie");

      const fd = new FormData();
      fd.append("name", fName);
      fd.append("base_price", String(fPrice));
      fd.append("stock", String(fStock));
      if (fDesc) fd.append("description", fDesc);
      // categories: kirim array id
      selectedCats.forEach((id) => fd.append("category_ids[]", String(id)));
      // variants: kirim sebagai JSON
      fd.append("variants", JSON.stringify(variants));
      // images: multiple
      images.forEach((file) => fd.append("images[]", file));

      const r = await authApi.post("/api/seller/products", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setItems((prev) => [r.data?.data ?? r.data, ...prev]);
      setOpenCreate(false);
      resetForm();
    } catch (e: any) {
      const d = e?.response?.data;
      setErr(
        d?.message ||
          d?.errors?.name?.[0] ||
          d?.errors?.images?.[0] ||
          `Gagal membuat produk (${e?.response?.status || "network"})`
      );
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus produk ini?")) return;
    try {
      await authApi.get("/sanctum/csrf-cookie");
      await authApi.delete(`/api/seller/products/${id}`);
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (e: any) {
      alert(`Gagal menghapus (${e?.response?.status || "network"})`);
    }
  };

  // helpers variants
  const addVariant = () => setVariants((v) => [...v, { name: "", type: "option", price_delta: 0, stock: null, is_default: false }]);
  const removeVariant = (idx: number) => setVariants((v) => v.filter((_, i) => i !== idx));
  const setDefaultVariant = (idx: number) => setVariants((v) => v.map((it, i) => ({ ...it, is_default: i === idx })));

  // ===== UI =====
  return (
    <div className="sp-wrap">
      <style>{css}</style>

      <header className="sp-top">
        <h1>Produk Saya</h1>
        <div className="grow" />
        <div className="sp-actions">
          <input
            className="sp-input"
            placeholder="Cari nama / SKU"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
          />
          <button className="sp-btn" onClick={() => setOpenCreate(true)}>
            + Produk
          </button>
        </div>
      </header>

      {err && <div className="sp-alert sp-alert--error">{err}</div>}

      {loading ? (
        <div className="sp-card">Memuat…</div>
      ) : items.length === 0 ? (
        <div className="sp-card">Belum ada produk.</div>
      ) : (
        <div className="sp-card">
          <table className="sp-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama</th>
                <th>Harga</th>
                <th>Stok</th>
                <th>Status</th>
                <th>Dibuat</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>Rp {Number(p.base_price).toLocaleString("id-ID")}</td>
                  <td>{p.stock}</td>
                  <td>{p.status}</td>
                  <td>{new Date(p.created_at).toLocaleString()}</td>
                  <td className="sp-td-actions">
                    <button className="sp-btn sp-btn--danger" onClick={() => handleDelete(p.id)}>
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="sp-pagination">
            <div>Jumlah: {total}</div>
            <div className="grow" />
            <button className="sp-btn" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Prev
            </button>
            <span className="sp-page">Hal {page}</span>
            <button className="sp-btn" onClick={() => setPage((p) => p + 1)}>
              Next
            </button>
            <select
              className="sp-input sp-select"
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>
      )}

      {openCreate && (
        <div className="sp-modal">
          <div className="sp-modal__card">
            <h3>Tambah Produk</h3>

            <label>Nama</label>
            <input className="sp-input" value={fName} onChange={(e) => setFName(e.target.value)} />

            <label>Deskripsi</label>
            <textarea className="sp-input" rows={3} value={fDesc} onChange={(e) => setFDesc(e.target.value)} />

            <div className="sp-row-2">
              <div>
                <label>Harga</label>
                <input
                  className="sp-input"
                  type="number"
                  value={String(fPrice)}
                  onChange={(e) => setFPrice(e.target.value === "" ? "" : Number(e.target.value))}
                />
              </div>
              <div>
                <label>Stok</label>
                <input
                  className="sp-input"
                  type="number"
                  value={String(fStock)}
                  onChange={(e) => setFStock(e.target.value === "" ? "" : Number(e.target.value))}
                />
              </div>
            </div>

            {/* Categories */}
            <label>Kategori</label>
            <div className="sp-chipbox">
              {categories.length === 0 && <span className="muted">Belum ada kategori</span>}
              {categories.map((c) => {
                const active = selectedCats.includes(c.id);
                return (
                  <button
                    type="button"
                    key={c.id}
                    className={`sp-chip ${active ? "sp-chip--on" : ""}`}
                    onClick={() =>
                      setSelectedCats((prev) =>
                        prev.includes(c.id) ? prev.filter((x) => x !== c.id) : [...prev, c.id]
                      )
                    }
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>

            {/* Images */}
            <label>Gambar Produk</label>
            <input
              className="sp-input"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setImages(Array.from(e.target.files || []))}
            />
            {previews.length > 0 && (
              <div className="sp-previews">
                {previews.map((src, i) => (
                  <div className="sp-preview" key={i}>
                    <img src={src} alt="preview" />
                  </div>
                ))}
              </div>
            )}

            {/* Variants */}
            <div className="sp-variants">
              <div className="sp-variants__top">
                <h4>Varian</h4>
                <button className="sp-btn" onClick={addVariant} type="button">
                  + Varian
                </button>
              </div>
              {variants.map((v, idx) => (
                <div className="sp-varrow" key={idx}>
                  <input
                    className="sp-input"
                    placeholder="Nama varian (mis. Regular)"
                    value={v.name}
                    onChange={(e) =>
                      setVariants((arr) => arr.map((it, i) => (i === idx ? { ...it, name: e.target.value } : it)))
                    }
                  />
                  <input
                    className="sp-input"
                    type="number"
                    placeholder="Harga +/−"
                    value={String(v.price_delta)}
                    onChange={(e) =>
                      setVariants((arr) =>
                        arr.map((it, i) => (i === idx ? { ...it, price_delta: Number(e.target.value || 0) } : it))
                      )
                    }
                  />
                  <input
                    className="sp-input"
                    type="number"
                    placeholder="Stok (opsional)"
                    value={v.stock === null ? "" : String(v.stock)}
                    onChange={(e) =>
                      setVariants((arr) =>
                        arr.map((it, i) =>
                          i === idx ? { ...it, stock: e.target.value === "" ? null : Number(e.target.value) } : it
                        )
                      )
                    }
                  />
                  <label className="sp-check">
                    <input
                      type="radio"
                      name="defaultVariant"
                      checked={v.is_default}
                      onChange={() => setDefaultVariant(idx)}
                    />
                    Default
                  </label>
                  <button className="sp-btn sp-btn--ghost" onClick={() => removeVariant(idx)} type="button">
                    Hapus
                  </button>
                </div>
              ))}
            </div>

            <div className="sp-row">
              <button className="sp-btn" disabled={!canCreate} onClick={handleCreate}>
                Simpan
              </button>
              <button
                className="sp-btn sp-btn--ghost"
                onClick={() => {
                  setOpenCreate(false);
                  resetForm();
                }}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const css = `
.sp-wrap{ padding:18px; color:#e8eef9; }
.sp-top{ display:flex; align-items:center; gap:10px; margin-bottom:12px; }
.sp-top h1{ font-size:18px; margin:0; }
.grow{ flex:1; }
.sp-card{ background:#111a33; border:1px solid rgba(255,255,255,.12); border-radius:12px; padding:12px; }
.sp-alert{ margin-bottom:10px; padding:10px; border-radius:10px; }
.sp-alert--error{ background:rgba(255,90,90,.08); border:1px solid rgba(255,90,90,.35); color:#ffd2d2; }
.sp-input{ padding:8px 10px; border-radius:10px; border:1px solid rgba(255,255,255,.15); background:#0e1730; color:#e8eef9; width:100%; }
.sp-select{ margin-left:8px; }
.sp-btn{ padding:8px 12px; border-radius:10px; border:1px solid rgba(108,162,255,.35); background:rgba(108,162,255,.15); color:#e8eef9; cursor:pointer; }
.sp-btn--danger{ border-color:rgba(255,90,90,.35); background:rgba(255,90,90,.15); }
.sp-btn--ghost{ background:transparent; border-color:rgba(255,255,255,.15); }
.sp-actions{ display:flex; gap:8px; align-items:center; }
.sp-table{ width:100%; border-collapse:collapse; font-size:14px; }
.sp-table th, .sp-table td{ padding:8px; border-bottom:1px solid rgba(255,255,255,.08); text-align:left; }
.sp-td-actions{ text-align:right; }
.sp-pagination{ display:flex; align-items:center; gap:8px; padding-top:8px; }
.sp-page{ opacity:.8; }
.sp-modal{ position:fixed; inset:0; background:rgba(0,0,0,.45); display:grid; place-items:center; z-index:50; }
.sp-modal__card{ width:95%; max-width:640px; background:#111a33; border:1px solid rgba(255,255,255,.12); border-radius:12px; padding:14px; display:grid; gap:10px; }
.sp-row{ display:flex; gap:8px; margin-top:6px; }
.sp-row-2{ display:grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap:8px; }

/* categories chip */
.sp-chipbox{ display:flex; flex-wrap:wrap; gap:6px; }
.sp-chip{ padding:6px 10px; border-radius:999px; border:1px solid rgba(255,255,255,.15); background:transparent; color:#e8eef9; cursor:pointer; }
.sp-chip--on{ background:rgba(108,162,255,.15); border-color:rgba(108,162,255,.35); }

/* previews */
.sp-previews{ display:flex; gap:8px; flex-wrap:wrap; }
.sp-preview{ width:88px; height:88px; border-radius:10px; overflow:hidden; border:1px solid rgba(255,255,255,.12); }
.sp-preview img{ width:100%; height:100%; object-fit:cover; }

/* variants */
.sp-variants{ border-top:1px solid rgba(255,255,255,.12); padding-top:10px; }
.sp-variants__top{ display:flex; align-items:center; justify-content:space-between; margin-bottom:6px; }
.sp-varrow{ display:grid; grid-template-columns: 1.2fr .6fr .6fr auto auto; gap:8px; align-items:center; margin-bottom:6px; }
.sp-check{ display:flex; align-items:center; gap:6px; opacity:.9; }
`;
