import {Routes, Route} from 'react-router-dom'
import './App.css'
import Register from './pages/Register'
import Login from './pages/Login'
import HomePage from './pages/HomePage'
import About from './pages/About'
import Layout from './layout/Layout'


function App() {
  

  return (
    <>
    <div className="App container-fluid p-0 m-0">
      <Routes>
        <Route path='/register' element= {<Register />} />
        <Route path='/login' element= {<Login />} />
      </Routes>
      <Routes>
        <Route path='/' element= {<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/about" element={<About />} />
       </Route>
      </Routes>
    </div>
    </>
  )
}

export default App
