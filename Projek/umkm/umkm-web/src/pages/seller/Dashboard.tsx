import { useEffect, useState } from 'react';
import { authApi } from '../../services/api';

export default function SellerDashboard() {
  const [me, setMe] = useState<any>(null);
  const [form, setForm] = useState({ name:'', base_price:0, slug:'', description:'', stock:0 });
  const [msg, setMsg] = useState<string| null>(null);

  useEffect(() => {
    authApi.get('/api/me').then(r => setMe(r.data)).catch(() => setMe(null));
  }, []);

  const onChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setMsg(null);
    try {
      await authApi.post('/api/seller/products', form);
      setMsg('Produk berhasil ditambahkan!');
      setForm({ name:'', base_price:0, slug:'', description:'', stock:0 });
    } catch (e: any) {
      setMsg(e?.response?.data?.message ?? 'Gagal menambah produk');
    }
  };

  if (me === null) return <div style={{padding:16}}>Harus login sebagai penjual.</div>;

  return (
    <div style={{ maxWidth: 640, margin:'24px auto' }}>
      <h1>Dashboard Penjual</h1>
      <p>Halo, {me.name} ({me.role})</p>

      <h2 style={{marginTop:16}}>Tambah Produk</h2>
      <form onSubmit={onSubmit} style={{display:'grid', gap:8}}>
        <input name="name" placeholder="Nama Produk" value={form.name} onChange={onChange} required />
        <input name="slug" placeholder="Slug (opsional)" value={form.slug} onChange={onChange} />
        <input name="base_price" type="number" placeholder="Harga dasar" value={form.base_price} onChange={onChange} />
        <input name="stock" type="number" placeholder="Stok" value={form.stock} onChange={onChange} />
        <textarea name="description" placeholder="Deskripsi" value={form.description} onChange={onChange} />
        <button type="submit">Simpan</button>
        {msg && <div>{msg}</div>}
      </form>
    </div>
  );
}
