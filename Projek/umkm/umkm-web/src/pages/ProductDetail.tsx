// src/pages/ProductDetail.tsx
import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { publicApi } from '../services/api'

type RouteParams = { id: string };

// --- Types yang fleksibel dengan API kamu ---
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
type Category = { id: number; name: string; slug: string };

interface Product {
  id: number;
  name?: string;
  title?: string;
  slug?: string;
  description?: string | null;
  base_price?: number | null; // API kamu pakai base_price
  price?: number | null;      // fallback jika nanti ada
  image_url?: string | null;
  images?: ProductImage[];
  variants?: ProductVariant[];
  categories?: Category[];
  stock?: number | null;
  [key: string]: any;
}

export default function ProductDetail() {
  const { id } = useParams<RouteParams>();
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError('ID/slug produk tidak ditemukan di URL.');
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await publicApi.get(`/api/products/${encodeURIComponent(id)}`);
        // Laravel JsonResource bisa membungkus data di { data: {...} }
        const payload = res.data;
        const p: Product = payload?.data ?? payload;

        setProduct(p);

        // Pilih varian default bila ada
        const def = (p.variants || []).find(v => v.is_default) ?? (p.variants || [])[0] ?? null;
        setSelectedVariantId(def ? def.id : null);
      } catch (e: any) {
        if (e?.response?.status === 404) setError('Produk tidak ditemukan.');
        else setError(e?.message || 'Gagal memuat detail produk.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const selectedVariant = useMemo(
    () => product?.variants?.find(v => v.id === selectedVariantId) ?? null,
    [product?.variants, selectedVariantId]
  );

  const finalName = product?.name ?? product?.title ?? (product ? `Produk #${product.id}` : '-');

  // Harga = base_price (atau price) + price_delta varian
  const basePrice = product?.base_price ?? product?.price ?? 0;
  const finalPrice = basePrice + (selectedVariant?.price_delta ?? 0);
  const fmtIDR = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(n);

  // Gambar utama: image_url atau gambar pertama di images[]
  const mainImage =
    product?.image_url ||
    (product?.images && product.images.length > 0 ? product.images[0].url : null);

  if (loading) return <div style={{ padding: 16 }}>Memuat data produk…</div>;
  if (error)
    return (
      <div style={{ color: '#b91c1c', padding: 16 }}>
        Error: {error} <div style={{ marginTop: 8 }}><Link to="/">← Kembali</Link></div>
      </div>
    );
  if (!product) return <div style={{ padding: 16 }}>Tidak ada data. <Link to="/">← Kembali</Link></div>;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
      <p style={{ marginBottom: 12 }}>
        <Link to="/">← Kembali</Link>
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24 }}>
        <div>
          {mainImage ? (
            <img
              src={mainImage}
              alt={finalName}
              style={{ width: '100%', borderRadius: 8, display: 'block' }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                aspectRatio: '1 / 1',
                borderRadius: 8,
                background: '#f3f4f6',
                display: 'grid',
                placeItems: 'center',
                color: '#6b7280',
              }}
            >
              Tidak ada gambar
            </div>
          )}

          {/* Thumbnail kecil (jika ada) */}
          {product.images && product.images.length > 1 && (
            <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  alt={`thumb-${i}`}
                  style={{
                    width: 64,
                    height: 64,
                    objectFit: 'cover',
                    borderRadius: 6,
                    border: img.url === mainImage ? '2px solid #10b981' : '1px solid #e5e7eb',
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    // ganti mainImage dengan cara sederhana: set product.image_url
                    setProduct(p => (p ? { ...p, image_url: img.url } : p));
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 style={{ margin: '0 0 8px' }}>{finalName}</h1>

          {/* Kategori (jika ada) */}
          {product.categories && product.categories.length > 0 && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
              {product.categories.map((c) => (
                <span
                  key={c.id}
                  style={{
                    fontSize: 12,
                    background: '#f1f5f9',
                    padding: '4px 8px',
                    borderRadius: 999,
                  }}
                >
                  {c.name}
                </span>
              ))}
            </div>
          )}

          {/* Varian (jika ada) */}
          {product.variants && product.variants.length > 0 && (
            <div style={{ margin: '12px 0' }}>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Pilih Varian</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariantId(v.id)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: 8,
                      border: v.id === selectedVariantId ? '2px solid #10b981' : '1px solid #e5e7eb',
                      background: v.id === selectedVariantId ? '#ecfdf5' : '#fff',
                      cursor: 'pointer',
                    }}
                    title={
                      v.price_delta
                        ? `+ ${fmtIDR(v.price_delta)}`
                        : undefined
                    }
                  >
                    {v.name ?? 'Varian'}{v.price_delta ? ` (+${fmtIDR(v.price_delta)})` : ''}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ fontSize: 28, fontWeight: 700, margin: '12px 0' }}>
            {fmtIDR(finalPrice)}
          </div>

          <dl
            style={{
              display: 'grid',
              gridTemplateColumns: '120px 1fr',
              gap: '6px 12px',
              marginTop: 12,
            }}
          >
            <dt>Stok</dt>
            <dd>{product.stock ?? selectedVariant?.stock ?? '-'}</dd>
            <dt>Deskripsi</dt>
            <dd>{product.description ?? '-'}</dd>
          </dl>

          <div style={{ marginTop: 16 }}>
            <button
              type="button"
              style={{
                padding: '10px 14px',
                borderRadius: 10,
                border: 'none',
                background: '#111827',
                color: '#fff',
                cursor: 'pointer',
              }}
              onClick={() => alert('Contoh: tambah ke keranjang')}
            >
              Tambah ke Keranjang
            </button>
          </div>
        </div>
      </div>

      {/* Debug bentuk data dari API (aktifkan jika perlu) */}
      {/* <pre style={{marginTop:16, background:'#111827', color:'#e5e7eb', padding:12, borderRadius:8}}>
        {JSON.stringify(product, null, 2)}
      </pre> */}
    </div>
  );
}
