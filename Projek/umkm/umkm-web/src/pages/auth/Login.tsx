// src/pages/auth/Login.tsx
import { useState } from 'react';
import { authApi } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState<string|null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    try {
      setErr(null);
      // 1) ambil cookie CSRF
      await authApi.get('/sanctum/csrf-cookie');
      // 2) POST ke /api/login
      await authApi.post('/api/login', form);
      // 3) pindah halaman SPA (tidak reload)
      nav('/seller');
    }  catch (e: any) {
      const d = e?.response?.data;
      setErr(d?.errors?.email?.[0] || d?.message || `Login gagal (${e?.response?.status})`);
    }
  };

  return (
    // cegah submit default: action kosong + onSubmit prevent
    <form action="#" onSubmit={(e) => e.preventDefault()} style={{ maxWidth: 360, margin: '40px auto', display: 'grid', gap: 12 }}>
      <h1>Login</h1>
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} required />
      {err && <div style={{color:'#b91c1c'}}>{err}</div>}

      {/* BUKAN type="submit" supaya tidak ada GET default */}
      <button type="button" onClick={handleLogin}>Masuk</button>
    </form>
  );
}
