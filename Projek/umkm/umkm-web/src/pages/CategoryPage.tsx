import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { publicApi } from '../services/api';

type RouteParams = { slugOrId: string };

type Product = {
  id: number;
  name?: string;
  slug?: string;
  base_price?: number | null;
  price?: number | null;
  image_url?: string | null;
  [k: string]: any;
};

type Category = {
  id: number;
  name: string;
  slug?: string;
};

const currency = (n: number | null | undefined) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(n ?? 0);

export default function CategoryPage() {
  const { slugOrId } = useParams<RouteParams>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Record<number, number>>({});

  const isNumeric = useMemo(() => /^\d+$/.test(slugOrId || ''), [slugOrId]);

  // --- Cart helpers (PINDAH ke scope komponen) ---
  const qty = (id: number) => cart[id] || 0;
  const addToCart = (id: number) =>
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const inc = (id: number) =>
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const dec = (id: number) =>
    setCart((c) => {
      const next = (c[id] || 0) - 1;
      if (next > 0) return { ...c, [id]: next };
      const { [id]: _, ...rest } = c;
      return rest;
    });
      // ringkasan untuk sticky bar
  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = products.reduce(
    (sum, p) => sum + (cart[p.id] || 0) * (p.base_price ?? 0),
    0
  );

  useEffect(() => {
    if (!slugOrId) return;

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        // --- 1) Ambil detail kategori (opsional; untuk judul) ---
        const catPaths = [
          `/api/categories/${encodeURIComponent(slugOrId)}`,
          `/api/category/${encodeURIComponent(slugOrId)}`,
        ];
        let gotCategory = false;
        for (const p of catPaths) {
          try {
            const r = await publicApi.get(p);
            const d = r.data?.data ?? r.data;
            if (d && typeof d === 'object') {
              if (!cancelled) {
                setCategory({
                  id: d.id ?? 0,
                  name: d.name ?? String(slugOrId),
                  slug: d.slug ?? undefined,
                });
              }
              gotCategory = true;
              break;
            }
          } catch {
            // abaikan; lanjut coba endpoint berikutnya
          }
        }
        if (!gotCategory && !cancelled) {
          // fallback judul kategori dari slug/id
          setCategory({ id: 0, name: String(slugOrId) });
        }

        // --- 2) Ambil produk dalam kategori ---
        const tries = [
          `/api/categories/${encodeURIComponent(slugOrId)}/products`,
          `/api/category/${encodeURIComponent(slugOrId)}/products`,
          `/api/products?category=${encodeURIComponent(slugOrId)}`,
          !isNumeric ? `/api/products?category_slug=${encodeURIComponent(slugOrId)}` : '',
          isNumeric ? `/api/products?category_id=${slugOrId}` : '',
        ].filter(Boolean) as string[];

        let got: any = null;
        let lastErr: any = null;

        for (const path of tries) {
          try {
            const r = await publicApi.get(path);
            got = r.data;
            break;
          } catch (e) {
            lastErr = e;
          }
        }
        if (!got) throw lastErr ?? new Error('Tidak ada endpoint kategori yang cocok.');

        // normalisasi list produk dari berbagai bentuk payload
        const candidates = [got, got?.data, got?.results, got?.products, got?.data?.data];
        const list = (candidates.find(Array.isArray) as any[]) || [];

        const mapped: Product[] = list.map((p: any) => ({
          id: p.id,
          name: p.name ?? p.title ?? `Produk #${p.id}`,
          slug: p.slug,
          base_price: p.base_price ?? p.price ?? 0,
          price: p.price,
          image_url: p.image_url ?? p.image?.url ?? null,
          ...p,
        }));

        if (!cancelled) setProducts(mapped);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Gagal memuat kategori/produk');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slugOrId, isNumeric]);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '16px' }}>
      <div style={{ marginBottom: 12, fontSize: 14, color: '#64748b' }}>
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
          Home
        </Link>{' '}
        / <span>{category?.name ?? slugOrId}</span>
      </div>

      <h1 style={{ margin: '0 0 16px' }}>{category?.name ?? 'Kategori'}</h1>

      {loading && <div>Memuat produk…</div>}
      {!loading && error && <div style={{ color: '#b91c1c' }}>Error: {error}</div>}
      {!loading && !error && products.length === 0 && (
        <div>Tidak ada produk pada kategori ini.</div>
      )}

      {!loading && !error && products.length > 0 && (
        <ul className="grid">
          {products.map((p) => (
            <li key={p.id}>
              <article className="card">
                <div className="card__imgwrap">
                  {/* badge NEW (opsional) */}
                  {Boolean((p as any)?.is_new) && <span className="badge">NEW</span>}

                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="card__img" />
                  ) : (
                    <div className="card__placeholder">No Image</div>
                  )}

                  <div className="card__actions">
                    <button className="iconbtn btn-love" title="Wishlist">
                      <i className="bi bi-heart" />
                    </button>
                    <Link to={`/products/${p.slug || p.id}`} className="iconbtn" title="Detail">
                      <i className="bi bi-eye" />
                    </Link>
                  </div>

                  {/* Add To Cart -> kontrol qty */}
                  {qty(p.id) === 0 ? (
                    <button className="addbtn" onClick={() => addToCart(p.id)}>
                      <i className="bi bi-cart-plus" /> Add To Cart
                    </button>
                  ) : (
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

                <Link to={`/products/${p.slug || p.id}`} className="card__name text-start">
                  {p.name}
                </Link>

                <div className="card__price">
                  {(p as any)?.sale_price ? (
                    <>
                      <span className="sale">{currency((p as any).sale_price)}</span>
                      <span className="strike">{currency(p.base_price)}</span>
                    </>
                  ) : (
                    <span className="sale">{currency(p.base_price ?? (p as any).price)}</span>
                  )}
                </div>

                {((p as any)?.avg_rating !== undefined ||
                  (p as any)?.reviews_count !== undefined) && (
                  <div className="card__rating">
                    <i className="bi bi-star-fill text-warning" />
                    <i className="bi bi-star-fill text-warning" />
                    <i className="bi bi-star-fill text-warning" />
                    <i className="bi bi-star text-warning" />
                    <i className="bi bi-star text-warning" />
                    <span className="muted">({(p as any)?.reviews_count ?? 0})</span>
                  </div>
                )}
              </article>
            </li>
          ))}
        </ul>
      )}
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
    </div>
  );
}
