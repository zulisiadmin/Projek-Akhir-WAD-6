// src/pages/ProductDetail.tsx
import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { publicApi } from '../services/api';

type RouteParams = { id: string };

// --- Types fleksibel ---
type ProductImage = { url: string; is_primary?: boolean; sort?: number };
type ProductVariant = {
  id: number;
  name?: string;
  type?: string;
  price_delta?: number;
  stock?: number | null;
  is_default?: boolean;
  sort?: number;
};
type Category = { id: number; name: string; slug?: string };

interface Product {
  id: number;
  name?: string;
  title?: string;
  slug?: string;
  description?: string | null;
  base_price?: number | null;
  price?: number | null;
  image_url?: string | null;
  images?: ProductImage[];
  variants?: ProductVariant[];
  categories?: Category[];
  stock?: number | null;
  rating?: number;          // kalau ada
  reviews_count?: number;   // kalau ada
  [key: string]: any;
}

export default function ProductDetail() {
  const { id } = useParams<RouteParams>();
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);

  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [thumbIndex, setThumbIndex] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError('ID/slug produk tidak ditemukan di URL.');
      return;
    }
    (async () => {
      try {
        setLoading(true); setError(null);
        const res = await publicApi.get(`/api/products/${encodeURIComponent(id)}`);
        const payload = res.data;
        const p: Product = payload?.data ?? payload;
        setProduct(p);

        // default variant (kalau ada)
        const def = (p.variants || []).find(v => v.is_default) ?? (p.variants || [])[0] ?? null;
        setSelectedVariantId(def ? def.id : null);

        // default image index
        setThumbIndex(0);
      } catch (e: any) {
        setError(e?.response?.status === 404 ? 'Produk tidak ditemukan.' : (e?.message || 'Gagal memuat detail produk.'));
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const selectedVariant = useMemo(
    () => product?.variants?.find(v => v.id === selectedVariantId) ?? null,
    [product?.variants, selectedVariantId]
  );

  const title = product?.name ?? product?.title ?? (product ? `Produk #${product.id}` : '-');

  // Harga: base + delta varian
  const basePrice = product?.base_price ?? product?.price ?? 0;
  const finalPrice = basePrice + (selectedVariant?.price_delta ?? 0);
  const fmtIDR = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(n);

  const images: string[] = (() => {
    if (!product) return [];
    // prioritaskan images[], kalau kosong pakai image_url tunggal
    if (Array.isArray(product.images) && product.images.length) {
      return product.images.map(i => i.url);
    }
    return product.image_url ? [product.image_url] : [];
  })();

  // thumbnails placeholder jika tidak ada gambar
  const thumbsToShow = images.length ? images : Array.from({ length: 4 }, () => '');

  const mainImage = images[thumbIndex] ?? null;

  const decQty = () => setQty(q => Math.max(1, q - 1));
  const incQty = () => setQty(q => q + 1);

  if (loading) return <div className="pd"><div className="container">Memuat data produk…</div></div>;
  if (error)   return (
    <div className="pd">
      <div className="container" style={{color:'#b91c1c'}}>
        Error: {error} <div style={{ marginTop: 8 }}><Link to="/">← Kembali</Link></div>
      </div>
    </div>
  );
  if (!product) return <div className="pd"><div className="container">Tidak ada data. <Link to="/">← Kembali</Link></div></div>;

  return (
    <div className="pd">
      <div className="container">
        {/* Breadcrumbs sederhana */}
        <div className="pd-breadcrumb">
          <Link to="/">Home</Link> / <span>{title}</span>
        </div>

        <div className="pd-grid">
          {/* Thumbs kiri */}
          <div className="pd-thumbs">
            {thumbsToShow.map((url, idx) => (
              <button
                key={idx}
                className={`pd-thumb ${idx === thumbIndex ? 'active' : ''}`}
                onClick={() => setThumbIndex(idx)}
                aria-label={`Gambar ${idx + 1}`}
              >
                {url
                  ? <img src={url} alt={`thumb-${idx}`} />
                  : <div style={{width:'100%',height:'100%',display:'grid',placeItems:'center',color:'#94a3b8'}}>No<br/>Image</div>
                }
              </button>
            ))}
          </div>

          {/* Gambar besar */}
          <div className="pd-mainimg">
            {mainImage
              ? <img src={mainImage} alt={title} />
              : <div style={{color:'#94a3b8'}}>Tidak ada gambar</div>
            }
          </div>

          {/* Info kanan */}
          <div className="pd-info">
            <h1 className="pd-title">{title}</h1>

            <div className="pd-rating">
              <span className="stars">
                <i className="bi bi-star-fill" />
                <i className="bi bi-star-fill" />
                <i className="bi bi-star-fill" />
                <i className="bi bi-star-half" />
                <i className="bi bi-star" />
              </span>
              <span>({product.reviews_count ?? 150} Reviews)</span>
              <span>•</span>
              <span className="pd-stock">In Stock</span>
            </div>

            <div className="pd-price">{fmtIDR(finalPrice)}</div>

            {/* Deskripsi singkat */}
            {product.description && (
              <p className="pd-desc">{product.description}</p>
            )}
            {/* Size dari variants (kalau ada) */}
            {product.variants && product.variants.length > 0 && (
              <div className="pd-opt">
                <div className="label">Size:</div>
                <div className="pd-sizes">
                  {product.variants.map(v => (
                    <button
                      key={v.id}
                      className={`pd-size ${v.id === selectedVariantId ? 'active' : ''}`}
                      onClick={() => setSelectedVariantId(v.id)}
                      title={v.price_delta ? `+${fmtIDR(v.price_delta)}` : undefined}
                    >
                      {v.name || 'Var'}{/* tampilkan nama varian */}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty & actions */}
            <div className="pd-actions">
              <div className="pd-qty">
                <button className="pd-qtybtn" onClick={decQty} aria-label="Kurangi">
                  <i className="bi bi-dash" />
                </button>
                <span className="pd-qtynum">{qty}</span>
                <button className="pd-qtybtn" onClick={incQty} aria-label="Tambah">
                  <i className="bi bi-plus" />
                </button>
              </div>

              <button className="btn-buy" onClick={() => alert(`Beli ${qty} item`)}>
                Buy Now
              </button>

              <button className="btn-like" aria-label="Wishlist">
                <i className="bi bi-heart" />
              </button>
            </div>

            {/* Info pengiriman */}
            <div className="pd-features">
              <div className="pd-feature">
                <div className="pd-feature__row">
                  <div className="ico"><i className="bi bi-truck" /></div>
                  <div>
                    <div className="title">Free Delivery</div>
                    <div className="sub">Enter your postal code for Delivery Availability</div>
                  </div>
                </div>
              </div>
            </div>

          </div>{/* pd-info */}
        </div>{/* pd-grid */}
      </div>{/* container */}
    </div>
  );
}
