import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

type TopBarProps = {
  promoText?: string;
  langLabel?: string;
  showPromo?: boolean;
  onSearchSubmit?: (q: string) => void; // opsional: kirim ke halaman search
};

export default function TopBar({
  promoText = 'Summer Sale for All Swim Suits And Free Express Delivery – OFF 50%!',
  langLabel = 'English',
  showPromo = true,
  onSearchSubmit,
}: TopBarProps) {
  const [q, setQ] = useState('');
  const nav = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit) onSearchSubmit(q);
    else nav(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <>
      {/* TOP PROMO BAR */}
      {showPromo && (
        <div className="promo">
          <div className="container promo__wrap">
            <span>{promoText}</span>
            <Link to="#" className="promo__cta">ShopNow</Link>
            <div className="promo__lang">
              <span>{langLabel} <i className="bi bi-caret-down-fill" /></span>
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <header className="nav mx-auto">
        <div className="container nav__wrap">
          <Link to="/" className="brand"><img src="logo-kawala.png" alt="" /></Link>

          <nav className="nav__links">
            <NavLink to="/" className={({isActive}) => isActive ? 'active' : ''} end>Beranda</NavLink>
            <NavLink to="/contact" className={({isActive}) => isActive ? 'active' : ''}>Kontak</NavLink>
            <NavLink to="/about" className={({isActive}) => isActive ? 'active' : ''}>Tentang</NavLink>
            <NavLink to="/login" className={({isActive}) => isActive ? 'active' : ''}>Masuk</NavLink>
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
