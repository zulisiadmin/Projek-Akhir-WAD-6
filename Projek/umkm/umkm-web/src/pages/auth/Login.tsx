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
    <div className="py-5 rs">
      <div className="row g-4 align-items-stretch">

        {/* KIRI: gambar (sembunyikan di layar kecil) */}
        <div className="col-lg-7 d-none d-lg-block">
          <div className="h-100 rounded overflow-hidden border">
            <img
              src="register-hero.png" // ganti sesuai lokasi gambar kamu
              alt="Register Illustration"
              className="img-fluid h-100 w-100 object-fit-cover"
            />
          </div>
        </div>

        {/* KANAN: form */}
        <div className="col-lg-5">
          <div className="card shadow-sm h-100">
            <div className="card-body p-4 p-md-5 my-auto">
              <h1 className="h3 fw-bold mb-1">Masuk</h1>
              <p className="text-secondary mb-4">Enter your details below</p>

              <form action="#" onSubmit={(e) => e.preventDefault()}>
                <div className="mb-3 text-start">
                  <label className="form-label">Email or Phone Number</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email} onChange={onChange} required
                    className={`form-control`}
                    placeholder="you@example.com"
                  />
                </div>

                <div className="mb-3 text-start">
                  <label className="form-label">Password</label>
                  <input
                    name="password"
                    type="password"
                    value={form.password} onChange={onChange} required
                    className={`form-control`}
                    placeholder="••••••••"
                  />
                </div>
                  {err && <div style={{color:'#b91c1c'}}>{err}</div>}

                <div className="d-grid gap-2">
                  <button
                    type="button"
                    className="btn btn-danger fw-semibold"
                    onClick={handleLogin}
                  > Masuk
                  </button>
                </div>
                                <div className="text-center mt-3">
                  <small className="text-secondary me-1">Already have account?</small>
                </div>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
