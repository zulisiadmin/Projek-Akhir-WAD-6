// src/pages/Contact.tsx
import { useState } from 'react';

type FormState = { name: string; email: string; message: string };
type Errors = Partial<Record<keyof FormState, string>>;

export default function Contact() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: undefined })); // bersihkan error saat mengetik
  };

  const validate = (data: FormState): Errors => {
    const er: Errors = {};
    if (!data.name.trim()) er.name = 'Nama wajib diisi.';
    if (!data.email.trim()) {
      er.email = 'Email wajib diisi.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      er.email = 'Format email tidak valid.';
    }
    if (!data.message.trim()) er.message = 'Pesan wajib diisi.';
    return er;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const er = validate(form);
    if (Object.keys(er).length) {
      setErrors(er);
      return;
    }
    setSending(true);
    setDone(false);
    try {
      // TODO: ganti ke submit API-mu
      await new Promise((r) => setTimeout(r, 900)); // simulasi kirim
      setDone(true);
      setForm({ name: '', email: '', message: '' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 16 }}>
      {/* style ringan agar rapi tanpa ketergantungan */}
      <style>{`
        .contact-head { margin-bottom: 12px; color: #334155; }
        .contact-sub  { margin: 0 0 24px; color: #64748b; }
        .contact-grid {
          display: grid; gap: 16px;
          grid-template-columns: 1fr;
        }
        @media (min-width: 900px) {
          .contact-grid { grid-template-columns: 2fr 1fr; }
        }
        .card {
          border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px;
          background: #fff;
        }
        .form-row { display: grid; gap: 6px; }
        .label {
          font-size: 14px; color: #334155; font-weight: 600;
        }
        .input, .textarea {
          border: 1px solid #cbd5e1; border-radius: 10px;
          padding: 10px 12px; font: inherit; width: 100%;
          outline: none; background: #fff;
        }
        .input:focus, .textarea:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,.15); }
        .error { color: #b91c1c; font-size: 12px; }
        .muted { color: #64748b; font-size: 14px; }
        .btn {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 10px 14px; border-radius: 10px; border: none; cursor: pointer;
          background: #111827; color: #fff; font-weight: 600;
        }
        .btn[disabled] { opacity: .6; cursor: not-allowed; }
        .success {
          padding: 10px 12px; border-radius: 10px; background: #ecfdf5; color: #065f46; font-size: 14px;
        }
        .info-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 10px; }
        .info-item { display: grid; gap: 4px; }
        .info-k { font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: .06em; }
        .info-v { color: #0f172a; }
      `}</style>

      <h1 className="contact-head">Hubungi Kami</h1>
      <p className="contact-sub">
        Ada pertanyaan, saran, atau kebutuhan kerja sama? Kirim pesanmu melalui formulir ini.
      </p>

      <div className="contact-grid">
        {/* Kolom kiri: Form */}
        <section className="card" aria-labelledby="contact-form-title">
          <h2 id="contact-form-title" style={{ marginTop: 0, marginBottom: 12 }}>Form Kontak</h2>

          {done && (
            <div className="success" role="status" aria-live="polite">
              Terima kasih! Pesanmu sudah terkirim.
            </div>
          )}

          <form onSubmit={onSubmit} noValidate style={{ display: 'grid', gap: 14, marginTop: 8 }}>
            {/* Nama */}
            <div className="form-row">
              <label htmlFor="name" className="label">Nama</label>
              <input
                id="name"
                name="name"
                className="input"
                placeholder="Nama lengkap"
                value={form.name}
                onChange={onChange}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'err-name' : undefined}
                autoComplete="name"
              />
              {errors.name && <span id="err-name" className="error">{errors.name}</span>}
            </div>

            {/* Email */}
            <div className="form-row">
              <label htmlFor="email" className="label">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                className="input"
                placeholder="nama@email.com"
                value={form.email}
                onChange={onChange}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'err-email' : undefined}
                autoComplete="email"
              />
              {errors.email && <span id="err-email" className="error">{errors.email}</span>}
            </div>

            {/* Pesan */}
            <div className="form-row">
              <label htmlFor="message" className="label">Pesan</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="textarea"
                placeholder="Tuliskan pesanmu…"
                value={form.message}
                onChange={onChange}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? 'err-message' : undefined}
              />
              {errors.message && <span id="err-message" className="error">{errors.message}</span>}
              <p className="muted" style={{ marginTop: 4 }}>
                Kami biasanya membalas dalam 1×24 jam kerja.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="btn" disabled={sending}>
                {sending ? 'Mengirim…' : 'Kirim Pesan'}
              </button>
            </div>
          </form>
        </section>

        {/* Kolom kanan: Info Kontak */}
        <aside className="card" aria-labelledby="contact-info-title">
          <h2 id="contact-info-title" style={{ marginTop: 0, marginBottom: 12 }}>Info Kontak</h2>
          <ul className="info-list">
            <li className="info-item">
              <span className="info-k">Email</span>
              <span className="info-v">
                <a href="mailto:halo@domainkamu.id" style={{ color: 'inherit', textDecoration: 'none' }}>
                  halo@domainkamu.id
                </a>
              </span>
            </li>
            <li className="info-item">
              <span className="info-k">WhatsApp</span>
              <span className="info-v">
                <a href="https://wa.me/6281234567890" style={{ color: 'inherit', textDecoration: 'none' }}>
                  +62 812-3456-7890
                </a>
              </span>
            </li>
            <li className="info-item">
              <span className="info-k">Alamat</span>
              <span className="info-v">Jl. Contoh No. 123, Depok, Jawa Barat</span>
            </li>
            <li className="info-item">
              <span className="info-k">Jam Operasional</span>
              <span className="info-v">Senin–Jumat, 09.00–17.00 WIB</span>
            </li>
          </ul>
          <p className="muted" style={{ marginTop: 12 }}>
            Lebih suka email? Kirim langsung ke alamat di atas, dan sertakan detail yang kamu perlukan.
          </p>
        </aside>
      </div>
    </div>
  );
}
