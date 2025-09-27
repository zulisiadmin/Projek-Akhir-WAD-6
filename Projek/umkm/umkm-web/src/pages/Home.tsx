import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { publicApi } from '../services/api';

type Item = {
  id: number; name: string; slug?: string; base_price: number; image_url?: string;
};

export default function Home() {
  const [items, setItems]   = useState<Item[]>([]);
  const [loading, setLoad]  = useState(true);
  const [error, setError]   = useState<string|null>(null);
  const [raw, setRaw]       = useState<any>(null); // debug

  useEffect(() => {
    (async () => {
      try {
        setLoad(true); setError(null);
        const res = await publicApi.get('/api/products', { params: { per_page: 12 } });
        setRaw(res.data); // simpan buat debug

        const payload = res.data;
        const list: Item[] =
          Array.isArray(payload)               ? payload :
          Array.isArray(payload?.data)         ? payload.data :
          Array.isArray(payload?.results)      ? payload.results :
          [];

        setItems(list);
      } catch (e: any) {
        console.error('GET /api/products err:', e?.response ?? e);
        setError(e?.message || 'Gagal memuat produk');
      } finally {
        setLoad(false);
      }
    })();
  }, []);

  if (loading) return <div style={{padding:16}}>Memuat produk…</div>;
  if (error)   return <div style={{padding:16, color:'#b91c1c'}}>Error: {error}</div>;
  if (items.length === 0) {
    return (
      <div style={{padding:16}}>
        Tidak ada produk.
        {/* DEBUG: buka sementara untuk cek shape respons */}
        <pre style={{marginTop:12, background:'#111', color:'#eee', padding:12, borderRadius:8, overflow:'auto'}}>
{JSON.stringify(raw, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:12,padding:16}}>
      {items.map(p => (
        <Link key={p.id} to={`/products/${p.slug || p.id}`} style={{textDecoration:'none',color:'inherit'}}>
          <div style={{border:'1px solid #eee', borderRadius:8, padding:12}}>
            {p.image_url && <img src={p.image_url} alt={p.name} style={{width:'100%',borderRadius:6,marginBottom:8}}/>}
            <div style={{fontWeight:600}}>{p.name}</div>
            <div>{new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR'}).format(p.base_price ?? 0)}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
