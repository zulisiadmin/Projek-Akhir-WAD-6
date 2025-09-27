import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Contact from './pages/Contact'
import Login from './pages/auth/Login'
import RegisterSeller from './pages/auth/RegisterSeller'
import SellerDashboard from './pages/seller/Dashboard'
import './App.css'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/contact" element={<Contact />} /> 
      <Route path="/login" element={<Login />} />
      <Route path="/register-seller" element={<RegisterSeller />} />
      <Route path="/seller" element={<SellerDashboard />} />
      <Route path="*" element={<div>404</div>} />
    </Routes>
  )
}
