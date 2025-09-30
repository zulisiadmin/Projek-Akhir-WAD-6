import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../services/api';
// Jika gambarnya di public: /auth/register-hero.png
// Atau kalau di src/assets, import: import hero from '../../assets/auth/register-hero.png';

export default function RegisterSeller() {
  const nav = useNavigate();
  const [f, setF] = useState({
    name: '', email: '', password: '', password_confirmation: '', vendor_name: ''
  });
  const [msg, setMsg] = useState<string|null>(null);
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setF({ ...f, [e.target.name]: e.target.value });

  const invalid = (k: keyof typeof f) => !!errors?.[k]?.length;
  const firstErr = (k: keyof typeof f) => errors?.[k]?.[0];

  const handleRegister = async () => {
    try {
      setSubmitting(true);
      setMsg(null); setErrors(null);
      await authApi.get('/sanctum/csrf-cookie');
      await authApi.post('/api/register', {
        name: f.name,
        email: f.email,
        password: f.password,
        password_confirmation: f.password_confirmation,
        as_seller: true,
        vendor_name: f.vendor_name,
      });
      nav('/seller');
    } catch (e: any) {
      const data = e?.response?.data;
      setMsg(data?.message || 'Registrasi gagal');
      setErrors(data?.errors || null);
      console.error('REGISTER ERROR', e?.response || e);
    } finally {
      setSubmitting(false);
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
              <h1 className="h3 fw-bold mb-1">Create an account</h1>
              <p className="text-secondary mb-4">Enter your details below</p>

              <form onSubmit={(e) => e.preventDefault()} noValidate>
                <div className="mb-3 text-start">
                  <label className="form-label">Name</label>
                  <input
                    name="name"
                    value={f.name}
                    onChange={onChange}
                    className={`form-control ${invalid('name') ? 'is-invalid' : ''}`}
                    placeholder="Full name"
                    required
                  />
                  {invalid('name') && <div className="invalid-feedback">{firstErr('name')}</div>}
                </div>

                <div className="mb-3 text-start">
                  <label className="form-label">Email or Phone Number</label>
                  <input
                    name="email"
                    type="email"
                    value={f.email}
                    onChange={onChange}
                    className={`form-control ${invalid('email') ? 'is-invalid' : ''}`}
                    placeholder="you@example.com"
                    required
                  />
                  {invalid('email') && <div className="invalid-feedback">{firstErr('email')}</div>}
                </div>

                <div className="mb-3 text-start">
                  <label className="form-label">Password</label>
                  <input
                    name="password"
                    type="password"
                    value={f.password}
                    onChange={onChange}
                    className={`form-control ${invalid('password') ? 'is-invalid' : ''}`}
                    placeholder="••••••••"
                    required
                  />
                  {invalid('password') && <div className="invalid-feedback">{firstErr('password')}</div>}
                </div>

                <div className="mb-3 text-start">
                  <label className="form-label">Confirm Password</label>
                  <input
                    name="password_confirmation"
                    type="password"
                    value={f.password_confirmation}
                    onChange={onChange}
                    className="form-control"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="mb-3 text-start">
                  <label className="form-label">Store / Vendor Name</label>
                  <input
                    name="vendor_name"
                    value={f.vendor_name}
                    onChange={onChange}
                    className={`form-control ${invalid('vendor_name') ? 'is-invalid' : ''}`}
                    placeholder="Nama Toko"
                    required
                  />
                  {invalid('vendor_name') && <div className="invalid-feedback">{firstErr('vendor_name')}</div>}
                </div>

                {msg && (
                  <div className="alert alert-danger py-2" role="alert">
                    {msg}
                  </div>
                )}

                <div className="d-grid gap-2">
                  <button
                    type="button"
                    className="btn btn-danger fw-semibold"
                    onClick={handleRegister}
                    disabled={submitting}
                  >
                    {submitting ? 'Processing…' : 'Create Account'}
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2"
                  >
                    <i className="bi bi-google"></i>
                    <span>Sign up with Google</span>
                  </button>
                </div>

                <div className="text-center mt-3">
                  <small className="text-secondary me-1">Already have account?</small>
                  <Link to="/login" className="fw-semibold text-decoration-none">Log in</Link>
                </div>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
