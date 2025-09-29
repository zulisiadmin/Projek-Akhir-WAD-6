import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(

   <BrowserRouter>
  <StrictMode>
    <App />
  </StrictMode>
</BrowserRouter>
)
