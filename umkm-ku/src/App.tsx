import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css'
import Register from './pages/Register'
import Login from './pages/Login'
import HomeSection from './pages/HomeSection'


function App() {
  

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/register' element={<Register />} />
    </Routes>

    <Routes>
      <Route path='/login' element={<Login />} />
    </Routes>

      <Routes>
        <Route path='/' element={<HomeSection />} />
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
