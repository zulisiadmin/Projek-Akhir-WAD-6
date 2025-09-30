import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { authApi } from '../../services/api';

// ===== Types =====
type User = {
  id: number;
  name: string;
  email: string;
  role: 'seller' | 'vendor' | 'customer' | 'admin' | string;
};

// ===== kecil-kecil =====
function clsx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

// Ikon sederhana (inline SVG)
const Icon = {
  menu: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/>
      <rect x="14" y="12" width="7" height="9"/><rect x="3" y="15" width="7" height="6"/>
    </svg>
  ),
  products: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 16V8a2 2 0 0 0-1-1.73L13 2.27a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    </svg>
  ),
  orders: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 15V8a2 2 0 0 0-2-2h-3l-2-2H6a2 2 0 0 0-2 2v11"/>
      <path d="M3 21h18"/><path d="M7 13h10"/><path d="M7 17h6"/>
    </svg>
  ),
  inventory: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>
    </svg>
  ),
  promo: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 12l18-9-9 18-2-7-7-2z"/>
    </svg>
  ),
  message: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V5a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>
    </svg>
  ),
  chart: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 3v18h18"/><rect x="7" y="12" width="3" height="6"/>
      <rect x="12" y="7" width="3" height="11"/><rect x="17" y="10" width="3" height="8"/>
    </svg>
  ),
  wallet: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 12H6a2 2 0 0 1-2-2V7a3 3 0 0 1 3-3h11a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5"/>
      <circle cx="16" cy="12" r="1"/>
    </svg>
  ),
  settings: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4 1.65 1.65 0 0 0 14 20a1.65 1.65 0 0 0-.33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 8.6 21a1.65 1.65 0 0 0-1.82-.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-.6-1 1.65 1.65 0 0 0-1.82-.33l-.06.06A2 2 0 1 1-.65 10.19l.06-.06A1.65 1.65 0 0 0 3 8.6c0-.36.1-.7.27-1 .17-.3.4-.6.73-.82.33-.22.53-.6.53-1s-.2-.78-.53-1c-.33-.22-.56-.52-.73-.82A1.65 1.65 0 0 0 8.6 3c.36 0 .7.1 1 .27.3.17.6.4.82.73.22.33.6.53 1 .53s.78-.2 1-.53c.22-.33.52-.56.82-.73.3-.17.64-.27 1-.27a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 21 8.6c0 .36-.1.7-.27 1-.17.3-.4.6-.73.82-.33.22-.53.6-.53 1s.2.78.53 1c.33.22.56.52.73.82.17.3.27.64.27 1z"/>
    </svg>
  ),
  help: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 1 1 5.82 1c0 2-3 2-3 4"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  logout: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
};

// Link sidebar
function SidebarLink(props: { to: string; icon?: React.ReactNode; label: string; onClick?: () => void; }) {
  const { to, icon, label, onClick } = props;
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => clsx('sb__link', isActive && 'sb__link--active')}
    >
      {icon ? <span className="sb__icon">{icon}</span> : null}
      <span className="sb__label">{label}</span>
    </NavLink>
  );
}

// ====== Main Component (inner) ======
function SellerDashboardInner() {
  // ---- hooks harus selalu di atas (sebelum return kondisi) ----
  const [me, setMe] = useState<User | null | undefined>(undefined);
  const [err, setErr] = useState<string | null>(null);
  const [sbOpen, setSbOpen] = useState(false);
  const nav = useNavigate();

  // menu statik (bukan hook)
  const menus = [
    { to: '/seller',            icon: Icon.dashboard, label: 'Ringkasan' },
    { to: '/seller/products',   icon: Icon.products,  label: 'Produk' },
    { to: '/seller/orders',     icon: Icon.orders,    label: 'Pesanan' },
    { to: '/seller/inventory',  icon: Icon.inventory, label: 'Stok' },
    { to: '/seller/promotions', icon: Icon.promo,     label: 'Promosi' },
    { to: '/seller/messages',   icon: Icon.message,   label: 'Pesan' },
    { to: '/seller/analytics',  icon: Icon.chart,     label: 'Analitik' },
    { to: '/seller/finance',    icon: Icon.wallet,    label: 'Keuangan' },
    { to: '/seller/settings',   icon: Icon.settings,  label: 'Pengaturan' },
    { to: '/help',              icon: Icon.help,      label: 'Bantuan' },
  ];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await authApi.get<User>('/api/user');
        if (!cancelled) setMe(r.data);
      } catch (e: any) {
        if (!cancelled) {
          setErr(e?.response?.status ? `Error ${e.response.status}` : 'Network error');
          setMe(null);
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.get('/sanctum/csrf-cookie');
      await authApi.post('/api/logout');
    } catch (e) {
      console.error('LOGOUT ERROR', e);
    } finally {
      nav('/login', { replace: true });
    }
  };

  // ---- guards (setelah semua hooks) ----
  if (me === undefined) {
    return (
      <div className="screen">
        <div className="card skeleton">
          <div className="sk-title" />
          <div className="sk-line" />
          <div className="sk-line" />
        </div>
      </div>
    );
  }
  if (me === null) {
    return (
      <div className="screen">
        <div className="card error">Harus login sebagai penjual. {err && <span>({err})</span>}</div>
      </div>
    );
  }
  if (!['seller', 'vendor'].includes(me.role)) {
    return (
      <div className="screen">
        <div className="card error">Akses ditolak: akun Anda bukan penjual/vendor.</div>
      </div>
    );
  }

  return (
    <div className={clsx('layout', sbOpen && 'layout--sb-open')}>
      <style>{css}</style>

      {/* Debug mini-panel: aktifkan di URL ?debug=1 */}
      {typeof window !== 'undefined' &&
        new URLSearchParams(window.location.search).get('debug') && (
          <pre className="debug-panel">
            {JSON.stringify({ me, err, sbOpen }, null, 2)}
          </pre>
        )}

      {/* Sidebar */}
      <aside className="sidebar" aria-label="Sidebar">
        <div className="sb__brand">UMKM Cakrawala</div>
        <nav className="sb__nav">
          {menus.map((m) => (
            <SidebarLink
              key={m.to}
              to={m.to}
              icon={m.icon}
              label={m.label}
              onClick={() => setSbOpen(false)}
            />
          ))}
        </nav>
        <div className="sb__footer">
          <button className="btn btn--ghost" onClick={handleLogout}>
            {Icon.logout}<span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="main">
        <header className="topbar" role="banner">
          <button
            className="btn btn--ghost mob-only"
            onClick={() => setSbOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {Icon.menu}
          </button>

          <div className="tb__center">
            <h1 className="tb__title">Dashboard Penjual</h1>
          </div>

          <div className="tb__right">
            <div className="userchip" title={me.email}>
              <div className="userchip__avatar" aria-hidden>
                {me.name.charAt(0).toUpperCase()}
              </div>
              <div className="userchip__meta">
                <div className="userchip__name">{me.name}</div>
                <div className="userchip__role">{me.role}</div>
              </div>
            </div>
          </div>
        </header>

        <div className="content">
          <div className="grid">
            <div className="stat">
              <div className="stat__label">Pendapatan hari ini</div>
              <div className="stat__value">Rp 0</div>
            </div>
            <div className="stat">
              <div className="stat__label">Pesanan baru</div>
              <div className="stat__value">0</div>
            </div>
            <div className="stat">
              <div className="stat__label">Produk aktif</div>
              <div className="stat__value">0</div>
            </div>
          </div>

          <div className="card">
            <h2 className="card__title">Halo, {me.name} ({me.role})</h2>
            <p className="muted">Gunakan menu di kiri untuk mengelola produk, pesanan, promosi, dan lainnya.</p>
          </div>

          {/* Halaman anak dari /seller/* */}
          <Outlet />
        </div>
      </div>

      {sbOpen && <div className="overlay" role="button" aria-label="Close menu" onClick={() => setSbOpen(false)} />}
    </div>
  );
}

// ===== Error Boundary (hindari blank total saat runtime error) =====
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: any) { return { error }; }
  componentDidCatch(error: any, info: any) { console.error('SellerDashboard error:', error, info); }
  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: '100vh', background: '#0b1221', color: '#e8eef9',
          display: 'grid', placeItems: 'center', padding: 24 }}>
          <div style={{ maxWidth: 600, width: '92%', background: '#111a33',
            border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: 16 }}>
            <h2 style={{ marginTop: 0 }}>Terjadi kesalahan di Dashboard</h2>
            <p className="muted">Silakan cek Console (F12) untuk detail error. Komponen ditahan agar tidak blank.</p>
          </div>
        </div>
      );
    }
    return this.props.children as any;
  }
}

// ===== Export utama (dibungkus ErrorBoundary) =====
export default function SellerDashboard() {
  return (
    <ErrorBoundary>
      <SellerDashboardInner />
    </ErrorBoundary>
  );
}

// ===== CSS (scoped) =====
const css = `
:root {
  --bg: #0b1221; --card: #111a33; --muted: #9bb0d1; --text: #e8eef9;
  --brand: #6ca2ff; --line: rgba(255,255,255,0.08);
}
* { box-sizing: border-box; }
html, body, #root { height: 100%; }
body { margin: 0; background: var(--bg); color: var(--text); font: 14px/1.55 system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, 'Helvetica Neue', Arial; }

/* Layout */
.layout { display: grid; grid-template-columns: 260px 1fr; min-height: 100vh; }
.layout .mob-only { display: none; }
.layout--sb-open .sidebar { transform: translateX(0); }

.sidebar { position: sticky; top: 0; height: 100vh; border-right: 1px solid var(--line);
  background: #0e1730; padding: 16px; display: flex; flex-direction: column; gap: 16px; }
.sb__brand { font-weight: 700; letter-spacing: .3px; color: var(--brand); }
.sb__nav { display: grid; gap: 6px; }
.sb__link { display: flex; align-items: center; gap: 10px; padding: 10px 12px;
  color: var(--text); text-decoration: none; border-radius: 10px; border: 1px solid transparent; }
.sb__link:hover { background: rgba(255,255,255,0.04); border-color: var(--line); }
.sb__link--active { background: rgba(108,162,255,0.12); border-color: rgba(108,162,255,0.3); }
.sb__icon { width: 20px; display: inline-grid; place-items: center; opacity: .9; }
.sb__label { font-weight: 500; }
.sb__footer { margin-top: auto; }

.btn { display: inline-flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 10px;
  border: 1px solid var(--line); background: transparent; color: var(--text); cursor: pointer; }
.btn:hover { background: rgba(255,255,255,0.04); }
.btn--ghost { border-color: transparent; }

.main { display: grid; grid-template-rows: auto 1fr; min-height: 100vh; }
.topbar { height: 56px; display: grid; grid-template-columns: auto 1fr auto; align-items: center;
  padding: 0 16px; border-bottom: 1px solid var(--line); position: sticky; top: 0; backdrop-filter: blur(6px);
  background: rgba(11,18,33,0.65); }
.tb__title { margin: 0; font-size: 16px; font-weight: 700; }
.tb__center { display: flex; justify-content: center; }
.tb__right { display: flex; align-items: center; gap: 12px; }

.userchip { display: grid; grid-template-columns: 32px auto; gap: 10px; align-items: center; padding: 6px 8px;
  border-radius: 12px; background: rgba(255,255,255,0.04); border: 1px solid var(--line); }
.userchip__avatar { width: 32px; height: 32px; border-radius: 50%; display: grid; place-items: center;
  background: #1a2752; color: #6ca2ff; font-weight: 800; }
.userchip__name { font-weight: 700; font-size: 13px; }
.userchip__role { color: var(--muted); font-size: 12px; }

.content { padding: 18px; max-width: 1100px; margin: 0 auto; display: grid; gap: 16px; }
.grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px; }
.stat { background: var(--card); border: 1px solid var(--line); border-radius: 14px; padding: 14px; }
.stat__label { color: var(--muted); font-size: 12px; margin-bottom: 6px; }
.stat__value { font-size: 22px; font-weight: 800; letter-spacing: .3px; }

.card { background: var(--card); border: 1px solid var(--line); border-radius: 14px; padding: 16px; }
.card__title { margin: 0 0 4px; font-size: 16px; }
.muted { color: var(--muted); }

/* State */
.screen { min-height: 100vh; display: grid; place-items: center; padding: 24px; }
.card.error { border-color: rgba(255,90,90,.3); background: rgba(255,90,90,.06); }

.skeleton { width: 640px; max-width: 92vw; }
.skeleton .sk-title { height: 18px; width: 60%; border-radius: 6px;
  background: linear-gradient(90deg, #141b33, #1b2444, #141b33); animation: shimmer 1.2s infinite; }
.skeleton .sk-line { height: 12px; width: 100%; margin-top: 10px; border-radius: 6px;
  background: linear-gradient(90deg, #141b33, #1b2444, #141b33); animation: shimmer 1.2s infinite; }
@keyframes shimmer { 0%{ background-position:-200px 0; } 100%{ background-position:200px 0;} }

/* Responsive */
@media (max-width: 920px) {
  .grid { grid-template-columns: 1fr; }
}
@media (max-width: 760px) {
  .layout { grid-template-columns: 1fr; }
  .layout .mob-only { display: inline-flex; }
  .sidebar { position: fixed; left: 0; top: 0; width: 260px; transform: translateX(-102%); transition: transform .2s ease; z-index: 20; }
  .overlay { position: fixed; inset: 0; background: rgba(0,0,0,.35); z-index: 10; }
}

/* Debug panel */
.debug-panel {
  position: fixed; bottom: 12px; right: 12px; z-index: 50;
  max-width: 50vw; max-height: 40vh; overflow: auto; padding: 10px;
  border-radius: 10px; border: 1px solid var(--line);
  background: rgba(0,0,0,.6); color: var(--text);
}
`;
