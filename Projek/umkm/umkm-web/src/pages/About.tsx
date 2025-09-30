// src/pages/About.tsx
import React from "react";

type Member = {
  name: string;
  role?: string;      // opsional: Ketua/Frontend/Backend dll.
  id?: string;        // opsional: NIM
  photo: string;      // URL/relative path ke gambar
};

const members: Member[] = [
  {
    name: "Anggota 1",
    role: "Ketua",
    id: "NIM. 20XXXXXXX",
    photo:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=600&auto=format&fit=crop", // ganti dengan file lokal bila ada
  },
  {
    name: "Anggota 2",
    role: "Frontend",
    id: "NIM. 20XXXXXXX",
    photo:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Anggota 3",
    role: "Backend",
    id: "NIM. 20XXXXXXX",
    photo:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=600&auto=format&fit=crop",
  },
];

export default function About() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
      <style>{`
        .hero {
          display: grid; gap: 20px;
          grid-template-columns: 1fr;
          align-items: center;
        }
        @media (min-width: 900px) {
          .hero { grid-template-columns: 1.3fr 1fr; }
        }
        .title { margin: 0 0 8px; color: #0f172a; }
        .subtitle { margin: 0; color: #475569; }
        .card {
          border: 1px solid #e5e7eb; border-radius: 14px; padding: 16px; background: #fff;
        }
        .muted { color: #64748b; }
        .cover {
          width: 100%; height: 260px; object-fit: cover; border-radius: 12px;
        }
        @media (min-width: 900px) { .cover { height: 320px; } }
        .section-title {
          margin: 0 0 8px; font-size: 18px; color: #0f172a; font-weight: 700;
        }
        .pill {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 10px; border-radius: 999px; background: #eef2ff; color: #3730a3; font-size: 12px; font-weight: 600;
        }
        .grid-2 { display: grid; gap: 14px; grid-template-columns: 1fr; }
        @media (min-width: 720px) { .grid-2 { grid-template-columns: 1fr 1fr; } }
        .grid-3 { display: grid; gap: 14px; grid-template-columns: repeat(1, minmax(0,1fr)); }
        @media (min-width: 720px) { .grid-3 { grid-template-columns: repeat(3, minmax(0,1fr)); } }
        .member {
          border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; background: #fff;
        }
        .member img {
          width: 100%; height: 200px; object-fit: cover; display: block;
        }
        .member .body { padding: 12px; }
        .kpi { display: grid; gap: 8px; }
        .kpi-item { display: grid; gap: 2px; padding: 10px; border: 1px solid #e5e7eb; border-radius: 10px; background: #fafafa; }
        .kpi-item b { font-size: 18px; color: #0f172a; }
        .kpi-item span { font-size: 12px; color: #64748b; }
        .list { margin: 0; padding-left: 18px; color: #0f172a; }
        .cta {
          margin-top: 6px; display: inline-flex; align-items: center; gap: 8px;
          background: #111827; color: #fff; font-weight: 600; border: 0; border-radius: 10px; padding: 10px 14px; cursor: pointer;
          text-decoration: none;
        }
      `}</style>

      {/* HERO */}
      <section className="hero">
        <div>
          <span className="pill">About</span>
          <h1 className="title">Tentang Website Ini</h1>
          <p className="subtitle">
            Website ini dibuat untuk menyelesaikan{" "}
            <b>Mata Kuliah: Web Application Development</b> sebagai{" "}
            <b>proyek Kelompok 6</b> (3 anggota). Tujuan kami adalah
            mengimplementasikan konsep front-end/SPA, routing, integrasi API publik,
            dan UI yang aksesibel serta responsif.
          </p>

          <div className="grid-2" style={{ marginTop: 14 }}>
            <div className="card">
              <h3 className="section-title">Tujuan</h3>
              <ul className="list">
                <li>Menerapkan best practice HTML/CSS/TypeScript & React.</li>
                <li>Mengelola state, routing halaman, dan komunikasi API.</li>
                <li>Menyajikan antarmuka rapi, cepat, dan mobile-friendly.</li>
              </ul>
            </div>
            <div className="card">
              <h3 className="section-title">Keluaran</h3>
              <ul className="list">
                <li>Halaman utama, produk/kategori, kontak, dan about.</li>
                <li>Komponen reusable (kartu, grid, tombol, form).</li>
                <li>Dokumentasi singkat & deployment demo.</li>
              </ul>
            </div>
          </div>

          <div className="kpi" style={{ marginTop: 14 }}>
            <div className="kpi-item">
              <b>Kelompok 6</b>
              <span>Komposisi 3 anggota</span>
            </div>
            <div className="kpi-item">
              <b>Web App</b>
              <span>SPA dengan React + TypeScript</span>
            </div>
          </div>
        </div>

        {/* Cover/Foto */}
        <div>
          <img
            className="cover"
            alt="Ilustrasi proyek mahasiswa"
            src="logo_kawala.png"
          />
        </div>
      </section>

      {/* TIM */}
      <section style={{ marginTop: 24 }}>
        <h2 className="section-title">Anggota Kelompok 6</h2>
        <p className="muted" style={{ margin: "0 0 12px" }}>
          Terdiri dari 3 anggota dengan peran kolaboratif (analisis, desain, frontend, backend).
        </p>

        <div className="grid-3">
          {members.map((m, i) => (
            <article className="member" key={i}>
              <img src={m.photo} alt={`Foto ${m.name}`} />
              <div className="body">
                <div style={{ fontWeight: 700 }}>{m.name}</div>
                {m.role && (
                  <div className="muted" style={{ fontSize: 13 }}>
                    {m.role}
                  </div>
                )}
                {m.id && (
                  <div className="muted" style={{ fontSize: 12 }}>
                    {m.id}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* PENUTUP / CTA */}
      <section className="card" style={{ marginTop: 24 }}>
        <h2 className="section-title">Ringkas</h2>
        <p style={{ marginTop: 6 }}>
          Proyek ini bertujuan menjadi pembuktian praktik pengembangan aplikasi web
          modern—mulai dari perancangan UI, pengelolaan state, hingga integrasi data.
          Kami berharap aplikasi ini layak sebagai portofolio dan pijakan pengembangan
          fitur berikutnya.
        </p>
        <a className="cta" href="/contact">
          Hubungi Kami
          <span aria-hidden>↗</span>
        </a>
      </section>
    </div>
  );
}
