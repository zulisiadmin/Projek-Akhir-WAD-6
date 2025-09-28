// src/pages/auth/RegisterSeller.tsx
import { useState } from 'react';
import { authApi } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function RegisterSeller() {
  const nav = useNavigate();
  const [f, setF] = useState({
    name:'', email:'', password:'', password_confirmation:'', vendor_name:''
  });
  const [msg, setMsg] = useState<string|null>(null);
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setF({ ...f, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    try {
      setMsg(null); setErrors(null);
      await authApi.get('/sanctum/csrf-cookie');         // GET cookie
      await authApi.post('/api/register', {
        name: f.name,
        email: f.email,
        password: f.password,
        password_confirmation: f.password_confirmation,
        as_seller: true,                // ⬅️ ini wajib ada
        vendor_name: f.vendor_name,     // ⬅️ nama toko
      });
      nav('/seller');
    } catch (e: any) {
      const data = e?.response?.data;
      setMsg(data?.message || 'Registrasi gagal');
      setErrors(data?.errors || null);
      console.error('REGISTER ERROR', e?.response || e);
    }
  };

  const err = (k: keyof typeof f) => errors?.[k]?.[0] && (
    <div style={{ color:'#ef4444', fontSize:12 }}>{errors![k][0]}</div>
  );

  return (
    // cegah submit default apapun
    <form onSubmit={(e) => e.preventDefault()} action="#" style={{ maxWidth: 420, margin:'40px auto', display:'grid', gap:10 }}>
      <h1 style={{fontSize:42, fontWeight:800}}>Daftar Penjual</h1>

      <input name="name" value={f.name} onChange={onChange} placeholder="Nama" required /> {err('name')}
      <input name="email" type="email" value={f.email} onChange={onChange} placeholder="Email" required /> {err('email')}
      <input name="password" type="password" value={f.password} onChange={onChange} placeholder="Password" required /> {err('password')}
      <input name="password_confirmation" type="password" value={f.password_confirmation} onChange={onChange} placeholder="Konfirmasi Password" required />
      <input name="vendor_name" value={f.vendor_name} onChange={onChange} placeholder="Nama Toko / Vendor" required /> {err('vendor_name')}

      {msg && <div style={{color:'#ef4444'}}>{msg}</div>}

      {/* <- tombol manual, TIDAK submit form */}
      <button type="button" onClick={handleRegister}>Daftar & Masuk</button>
    </form>
  );
}
