import React from 'react'
import '../style/notfound.css'
import { Link } from 'react-router-dom'

const NotFound: React.FC = () => {
  return (
    <div className='not-found-screen h-screen flex justify-center items-center'>
      <h1 className='text-center not-found-title'>404 - Not Found</h1>
      <p className='text-center not-found-message fw-semibold'>Maaf, halaman yang Anda cari tidak ditemukan.</p>
      <Link to='/' className='btn btn-danger'>Kembali ke Beranda</Link>
    </div>
  )
}

export default NotFound
