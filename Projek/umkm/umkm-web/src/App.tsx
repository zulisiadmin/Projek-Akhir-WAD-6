// App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/Applayout';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Contact from './pages/Contact';
import Login from './pages/auth/Login';
import RegisterSeller from './pages/auth/RegisterSeller';
import SellerDashboard from './pages/seller/Dashboard';
import CategoryPage from './pages/CategoryPage';
import './App.css';

export default function App() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/category/:slugOrId" element={<CategoryPage />} /> {/* ← ini */}
      </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register-seller" element={<RegisterSeller />} />

      {/* SELLER (Dashboard berisi <Outlet />) */}
      <Route path="/seller" element={<SellerDashboard />}>
        <Route index element={<div className="card">Ringkasan</div>} />
        <Route path="products" element={<div className="card">Produk</div>} />
        <Route path="orders" element={<div className="card">Pesanan</div>} />
        <Route path="inventory" element={<div className="card">Stok</div>} />
        <Route path="promotions" element={<div className="card">Promosi</div>} />
        <Route path="messages" element={<div className="card">Pesan</div>} />
        <Route path="analytics" element={<div className="card">Analitik</div>} />
        <Route path="finance" element={<div className="card">Keuangan</div>} />
        <Route path="settings" element={<div className="card">Pengaturan</div>} />
        <Route path="*" element={<Navigate to="/seller" replace />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<div style={{ padding: 24 }}>404 — halaman tidak ditemukan</div>} />
    </Routes>
  );
}
