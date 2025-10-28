import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';

type TopBarProps = {
  promoText?: string;
  langLabel?: string;
  showPromo?: boolean;
  onSearchSubmit?: (q: string) => void;
};

type Me = {
  id: number;
  name: string;
  email: string;
  role?: string | null;     // 'vendor' | 'admin' | 'user' | dll
  vendor_id?: number | null;
};

export default function TopBar({ onSearchSubmit }: TopBarProps) {
  const [q, setQ] = useState('');
  const [me, setMe] = useState<Me | null>(null);
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Ambil profil user untuk menentukan login state
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await authApi.get<Me>('/api/user');
        if (mounted) setMe(res.data);
      } catch {
        if (mounted) setMe(null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit) onSearchSubmit(q);
    else nav(`/search?q=${encodeURIComponent(q)}`);
  };

  const logout = async () => {
    try {
      await authApi.get('/sanctum/csrf-cookie');
      // ambil XSRF token dari cookie (opsional, biasanya axios set otomatis)
      const xsrf =
        decodeURIComponent(
          document.cookie
            .split('; ')
            .find((r) => r.startsWith('XSRF-TOKEN='))?.split('=')[1] || ''
        ) || undefined;

      await authApi.post(
        '/logout',
        {},
        xsrf ? { headers: { 'X-XSRF-TOKEN': xsrf } } : undefined
      );
    } catch {
      // abaikan error
    } finally {
      setMe(null);
      setOpen(false);
      nav('/');
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <header className="nav mx-auto">
        <div className="container nav__wrap">
          <Link to="/" className="brand">
            <img src="logo-kawala.png" alt="" />
          </Link>

          <nav className="nav__links">
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} end>
              Beranda
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active' : '')}>
              Kontak
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>
              Tentang
            </NavLink>

            {/* Auth area */}
            {!me ? (
              <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>
                Masuk
              </NavLink>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setOpen((v) => !v)}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-100"
                  aria-haspopup="menu"
                  aria-expanded={open}
                >
                  <span className="font-medium">{me.name}</span>
                  <i className="bi bi-caret-down-fill text-xs" />
                </button>

                {open && (
                  <div
                    className="absolute right-0 mt-2 w-52 rounded-lg border bg-white shadow-lg z-50"
                    role="menu"
                  >
                    <div className="px-3 py-2 text-xs text-gray-500 border-b">
                      Masuk sebagai <span className="font-medium text-gray-700">{me.name}</span>
                    </div>

                    {/* Arahkan sesuai role */}
                    {String(me.role || '').toLowerCase() === 'vendor' ? (
                      <Link
                        to="/sellerdashboard"
                        className="block px-4 py-2 hover:bg-gray-50"
                        onClick={() => setOpen(false)}
                        role="menuitem"
                      >
                        Dashboard Vendor
                      </Link>
                    ) : String(me.role || '').toLowerCase() === 'admin' ? (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 hover:bg-gray-50"
                        onClick={() => setOpen(false)}
                        role="menuitem"
                      >
                        Dashboard Admin
                      </Link>
                    ) : (
                      <Link
                        to="/account"
                        className="block px-4 py-2 hover:bg-gray-50"
                        onClick={() => setOpen(false)}
                        role="menuitem"
                      >
                        Akun Saya
                      </Link>
                    )}

                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600"
                      role="menuitem"
                    >
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>

          <div className="nav__right">
            <form className="search" onSubmit={submit}>
              <input
                placeholder="What are you looking for?"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <button type="submit" className="icon" aria-label="Search">
                <i className="bi bi-search" />
              </button>
            </form>

            <Link to="/wishlist" className="icon-btn" title="Wishlist">
              <i className="bi bi-heart" />
            </Link>
            <Link to="/cart" className="icon-btn" title="Cart">
              <i className="bi bi-cart3" />
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
