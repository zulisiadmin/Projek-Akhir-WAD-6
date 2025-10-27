// App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import React, { Suspense, lazy } from "react";
import AppLayout from './layouts/Applayout';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Contact from './pages/Contact';
import Login from './pages/auth/Login';
import RegisterSeller from './pages/auth/RegisterSeller';
import SellerDashboard from './pages/seller/Dashboard';
import CategoryPage from './pages/CategoryPage';
import About from './pages/About';
import SellerHello from './pages/SellerHello';
import SellerProducts from './pages/seller/SellerProducts';
import Checkout from './pages/Checkout';
import './App.css';

export default function App() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/category/:slugOrId" element={<CategoryPage />} /> {/* ← ini */}
        <Route path="/Checkout" element={<Checkout/>} />
      </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register-seller" element={<RegisterSeller />} />
        <Route path="/seller" element={<SellerHello />}  />

      {/* SELLER (Dashboard berisi <Outlet />) */}
      <Route path="/sellerdashboard" element={<SellerDashboard />}>
        <Route index element={<div className="card">Ringkasan</div>} />
        <Route path="products" element={<SellerProducts/>} />
        <Route path="orders" element={<div className="card">Pesanan</div>} />
        <Route path="inventory" element={<div className="card">Stok</div>} />
        <Route path="promotions" element={<div className="card">Promosi</div>} />
        <Route path="messages" element={<div className="card">Pesan</div>} />
        <Route path="analytics" element={<div className="card">Analitik</div>} />
        <Route path="finance" element={<div className="card">Keuangan</div>} />
        <Route path="settings" element={<div className="card">Pengaturan</div>} />
        <Route path="*" element={<Navigate to="/seller" replace />} />
      </Route>
      <Route path="/dashboard/products" element={<SellerProducts />} />

      {/* 404 */}
      <Route path="*" element={<div style={{ padding: 24 }}>404 — halaman tidak ditemukan</div>} />
    </Routes>
  );
}
