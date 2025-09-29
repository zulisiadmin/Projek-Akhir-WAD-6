import {Routes, Route} from 'react-router-dom'
import './App.css'
import Register from './pages/Register'
import Login from './pages/Login'
import HomePage from './pages/HomePage'
import About from './pages/About'
import Contact from './pages/Contact'
import Cart from './section/Cart'
import Checkout from './section/Checkout'
import ProductDetail from './section/ProductDetail'
import AccountManagement from './section/AccountManagement'
import NotFound from './pages/NotFound'
import Layout from './layout/Layout'


function App() {
  

  return (
    <>
    <div className="App container-fluid p-0 m-0">
      <Routes>
          <Route path='/register' element= {<Register />} />
          <Route path='/login' element= {<Login />} />
        <Route path='/' element= {<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout/>} />
          <Route path="/detail" element={<ProductDetail/>} />
          <Route path="/account" element={<AccountManagement/>} />
          <Route path="*" element={<NotFound />} />
       </Route>
      </Routes>
    </div>
    </>
  )
}

export default App
