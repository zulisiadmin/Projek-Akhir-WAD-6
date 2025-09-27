import { useState } from 'react';
import { authApi } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState<string|null>(null);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setErr(null);
    // sebelum login/register: ambil CSRF cookie
    await authApi.get('/sanctum/csrf-cookie');
    await authApi.post('/api/login', form)
      nav('/seller'); // ke dashboard penjual
    } catch (e: any) {
      setErr(e?.response?.data?.message ?? 'Login gagal');
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 360, margin: '40px auto', display: 'grid', gap: 12 }}>
      <h1>Login</h1>
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} required />
      {err && <div style={{color:'#b91c1c'}}>{err}</div>}
      <button type="submit">Masuk</button>
    </form>
  );
}
