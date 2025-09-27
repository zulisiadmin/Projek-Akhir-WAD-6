// src/pages/Contact.tsx
import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Terima kasih, ${form.name}! (contoh submit dummy)`);
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: 16 }}>
      <h1>Contact</h1>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <div>
          <label>Nama</label><br/>
          <input name="name" value={form.name} onChange={onChange} />
        </div>
        <div>
          <label>Email</label><br/>
          <input type="email" name="email" value={form.email} onChange={onChange} />
        </div>
        <div>
          <label>Pesan</label><br/>
          <textarea name="message" rows={4} value={form.message} onChange={onChange} />
        </div>
        <button type="submit">Kirim</button>
      </form>
    </div>
  );
}
