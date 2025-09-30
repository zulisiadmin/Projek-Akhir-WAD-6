// src/pages/Home.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { publicApi } from '../services/api';
import bannerImg from '../assets/banner/banner.png'; // dari src/pages ke src/assets

// ===== Types =====
type Category = {
  id: number;
  name: string;
  slug?: string;
  parent_id?: number | null;
  children?: Category[];
};

type Product = {
  id: number;
  name: string;
  slug?: string;
  base_price: number;
  image_url?: string | null;
};

// ==== UTIL ====
function currency(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(n ?? 0);
}

// beberapa path umum untuk kategori (fallback)
const CAT_PATHS = [
  '/api/categories',
  '/api/v1/categories',
  '/categories',
  '/api/product-categories',
  '/api/category',
];

// ekstrak array kategori dari payload bentuk apa pun
function extractCategories(payload: any): Category[] {
  const cands = [payload, payload?.data, payload?.results, payload?.categories, payload?.data?.data];
  for (const c of cands) if (Array.isArray(c)) return c as Category[];
  return [];
}

// ekstrak array produk dari payload bentuk apa pun
function extractProducts(payload: any): Product[] {
  const arr =
    Array.isArray(payload) ? payload :
    Array.isArray(payload?.data) ? payload.data :
    Array.isArray(payload?.results) ? payload.results : [];
  return arr.map((p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    base_price: Number(p.base_price ?? p.price ?? 0),
    image_url: p.image_url ?? p.image ?? null,
  })) as Product[];
}

// coba GET kategori ke beberapa path sampai ada yang berhasil
async function fetchCategories() {
  let lastErr: any = null;
  for (const path of CAT_PATHS) {
    try {
      const r = await publicApi.get(path, { params: { per_page: 50 } });
      return r.data;
    } catch (e: any) {
      lastErr = e;
      if (e?.response?.status && e.response.status !== 404) break;
    }
  }
  throw lastErr || new Error('No categories endpoint found');
}

export default function Home() {
  // state kategori
  const [cats, setCats] = useState<Category[]>([]);
  const [catsLoad, setCatsLoad] = useState(true);
  const [catsErr, setCatsErr] = useState<string | null>(null);

  // state produk
  const [prods, setProds] = useState<Product[]>([]);
  const [prodsLoad, setProdsLoad] = useState(true);
  const [prodsErr, setProdsErr] = useState<string | null>(null);

  // keranjang: productId -> qty
  const [cart, setCart] = useState<Record<number, number>>({});

  const qty = (id: number) => cart[id] || 0;

  const addToCart = (id: number) => {
    setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  };
  const inc = (id: number) => {
    setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  };
  const dec = (id: number) => {
    setCart(c => {
      const next = (c[id] || 0) - 1;
      if (next > 0) return { ...c, [id]: next };
      // jika qty jadi 0, hapus key-nya
      const { [id]: _omit, ...rest } = c;
      return rest;
    });
  };

  // ringkasan untuk sticky bar
  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = prods.reduce(
    (sum, p) => sum + (cart[p.id] || 0) * (p.base_price ?? 0),
    0
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // --- kategori ---
      try {
        setCatsLoad(true); setCatsErr(null);
        const payload = await fetchCategories();
        const list = extractCategories(payload);
        if (!cancelled) setCats(list);
      } catch (e: any) {
        if (!cancelled) setCatsErr(e?.message || 'Gagal memuat kategori');
      } finally {
        if (!cancelled) setCatsLoad(false);
      }

      // --- produk ---
      try {
        setProdsLoad(true); setProdsErr(null);
        const res = await publicApi.get('/api/products', { params: { per_page: 8 } });
        const list = extractProducts(res.data);
        if (!cancelled) setProds(list);
      } catch (e: any) {
        if (!cancelled) setProdsErr(e?.message || 'Gagal memuat produk');
      } finally {
        if (!cancelled) setProdsLoad(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <style>{css}</style>

      {/* HERO + CATEGORIES */}
      <section className="hero">
        <div className="container hero__grid">
          {/* contoh render kategori sederhana */}
          <aside className="categories">
            {catsLoad && <div>Memuat kategori…</div>}
            {!catsLoad && catsErr && <div style={{ color: '#b91c1c' }}>Tidak bisa memuat kategori. ({catsErr})</div>}
            {!catsLoad && !catsErr && cats.length === 0 && <div>Belum ada kategori.</div>}
            {!catsLoad && !catsErr && cats.map(c => (
              <div key={c.id}>
                <Link to={`/category/${c.slug || c.id}`} className="cat__item">
                  {c.name}
                  <i className="bi bi-chevron-right chev" />
                </Link>
              </div>
            ))}
          </aside>

          {/* <aside className="categories">
            {CATEGORIES.map((c, i) => (
              <Link key={i} to={`/category/${encodeURIComponent(c.toLowerCase())}`} className="cat__item">
                <span>{c}</span>
                <i className="bi bi-chevron-right chev" />
              </Link>
            ))}
          </aside> */}


          {/* Banner full image */}
          <div className="banner">
            <button className="chev-btn chev-left" aria-label="Prev">
              <i className="bi bi-chevron-left" />
            </button>

            <img
              className="banner__img--full"
              src={bannerImg}
              alt="Promo iPhone 14"
              loading="lazy"
            />

            <button className="chev-btn chev-right" aria-label="Next">
              <i className="bi bi-chevron-right" />
            </button>
          </div>
        </div>
      </section>

      <section className="products">
        <div className="prod__head container">
          <div className="prod__eyebrow"><span className="dot" /> Our Products</div>
          <h2 className="prod__title">Explore Our Products</h2>
        </div>

        <div className="container">
          {prodsLoad && <div className="muted">Memuat produk…</div>}
          {!prodsLoad && prodsErr && <div className="error">Gagal memuat produk. ({prodsErr})</div>}
          {!prodsLoad && !prodsErr && prods.length === 0 && <div className="muted">Belum ada produk.</div>}

          {!prodsLoad && !prodsErr && prods.length > 0 && (
            <ul className="grid">
              {prods.map(p => (
                <li key={p.id}>
                  <article className="card">
                    <div className="card__imgwrap">
                      {/* badge NEW kalau kamu punya flag di data (opsional) */}
                      {Boolean((p as any)?.is_new) && <span className="badge">NEW</span>}

                      {p.image_url
                        ? <img src={p.image_url} alt={p.name} className="card__img" />
                        : <div className="card__placeholder">No Image</div>
                      }

                      <div className="card__actions">
                        <button className="iconbtn btn-love" title="Wishlist">
                          <i className="bi bi-heart" />
                        </button>
                        <Link to={`/products/${p.slug || p.id}`} className="iconbtn" title="Detail">
                          <i className="bi bi-eye" />
                        </Link>
                      </div>

                      {/* Kalau belum ada di cart → tombol Add To Cart */}
                      {qty(p.id) === 0 ? (
                        <button className="addbtn" onClick={() => addToCart(p.id)}>
                          <i className="bi bi-cart-plus" /> Add To Cart
                        </button>
                      ) : (
                        // Sudah ada → tampilkan kontrol qty (– qty +)
                        <div className="qtybar">
                          <button className="qtybtn" onClick={() => dec(p.id)} aria-label="Kurangi">
                            <i className="bi bi-dash" />
                          </button>
                          <span className="qty">{qty(p.id)}</span>
                          <button className="qtybtn" onClick={() => inc(p.id)} aria-label="Tambah">
                            <i className="bi bi-plus" />
                          </button>
                        </div>
                      )}
                    </div>

                    <Link to={`/products/${p.slug || p.id}`} className="card__name text-start">{p.name}</Link>

                    <div className="card__price">
                      {/* jika punya sale_price, tampilkan coret (opsional) */}
                      {(p as any)?.sale_price
                        ? <>
                            <span className="sale">{currency((p as any).sale_price)}</span>
                            <span className="strike">{currency(p.base_price)}</span>
                          </>
                        : <span className="sale">{currency(p.base_price)}</span>
                      }
                    </div>

                    {/* rating opsional jika ada di payload */}
                    {(p as any)?.avg_rating !== undefined || (p as any)?.reviews_count !== undefined ? (
                      <div className="card__rating">
                        {/* placeholder bintang sederhana; ganti sesuai kebutuhan */}
                        <i className="bi bi-star-fill text-warning" />
                        <i className="bi bi-star-fill text-warning" />
                        <i className="bi bi-star-fill text-warning" />
                        <i className="bi bi-star text-warning" />
                        <i className="bi bi-star text-warning" />
                        <span className="muted">({(p as any)?.reviews_count ?? 0})</span>
                      </div>
                    ) : null}
                  </article>
                </li>
              ))}
            </ul>
          )}

          {!prodsLoad && !prodsErr && prods.length > 0 && (
            <div className="prod__cta">
              <Link to="/products" className="viewall">View All Products</Link>
            </div>
          )}
        </div>
      </section>
      {totalItems > 0 && (
        <div className="checkout-sticky">
          <div className="container chk__wrap">
            <div className="chk__summary">
              <strong>{totalItems}</strong> item · <strong>{currency(totalPrice)}</strong>
            </div>
            <Link to="/cart" className="btn btn-danger btn-lg">Checkout</Link>
          </div>
        </div>
      )}

      {/* ---- (Optional) Produk di bawah hero — buka kalau mau tampil) ---- */}
      {/* 
      <section className="container" style={{paddingTop: 24, paddingBottom: 32}}>
        {loading && <div className="muted">Memuat produk…</div>}
        {error && <div className="error">Error: {error}</div>}
        {!loading && !error && (
          <div className="grid">
            {items.map(p => (
              <Link key={p.id} to={`/products/${p.slug || p.id}`} className="card">
                {p.image_url && <img src={p.image_url} alt={p.name} className="card__img" />}
                <div className="card__name">{p.name}</div>
                <div className="card__price">
                  {new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR'}).format(p.base_price ?? 0)}
                </div>
              </Link>
            ))}
          </div>
        )}
        {(!loading && !error && items.length === 0) && (
          <pre className="debug">{JSON.stringify(raw, null, 2)}</pre>
        )}
      </section>
      */}
    </>
  );
}

const css = `

/* hero */
.hero{background:#fff}
.hero__grid{display:grid;grid-template-columns:260px 1fr;gap:20px;padding:18px 0;width:90%}

/* categories */
.categories{border-right:1px solid var(--line);padding-right:16px}
.cat__item{display:flex;align-items:center;justify-content:space-between;padding:10px 6px;border-radius:8px;color:#111}
.cat__item:hover{background:#f8fafc}
.chev{font-size:18px;line-height:0}
.chev--muted{opacity:.3}

.banner {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  min-height: 260px;
  display: grid;
  place-items: center;
}

.banner__img--full {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
}

.chev-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,.3);
  background: rgba(0,0,0,.4);
  color: #fff;
  display: grid;
  padding: 0;
  place-items: center;
}
.chev-left { left: 10px; }
.chev-right { right: 10px; }

/* responsive */
@media (max-width: 1000px) {
  .hero__grid{grid-template-columns:1fr}
  .categories{border-right:0;border-bottom:1px solid var(--line);padding:0 0 12px 0;display:grid;grid-template-columns:1fr 1fr;gap:6px}
  .cat__item{background:#fff;border:1px solid var(--line)}
  .banner__img{opacity:.8}
}
@media (max-width: 720px) {
  .nav__links{display:none}
  .search input{width:200px}
  .banner__title{font-size:32px}
}
`;
