import Navbar from '../components/Navbar'
import HeroBanner from '../components/HeroBanner'
import Sidebar from '../components/Sidebar'

const HeroSection = () => {
  return (
    <>
    <Navbar />
    <div className='container d-grid mt-4 gap-4 justify-content-center items-center'>
      <div className='row'> 
      <Sidebar />
      <HeroBanner />
      </div>
    </div>
    </>
  )
}

export default HeroSection
