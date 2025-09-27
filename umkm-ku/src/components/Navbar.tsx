const Navbar = () => {
  return (
    <>
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
  <div className="container">
    <a className="navbar-brand fw-bold" href="#">UMKM KU</a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <a className="nav-link active" aria-current="page" href="#">Beranda</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Tentang</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Kontak</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Sign Up</a>
        </li>
        {/* <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Dropdown
          </a>
          <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
            <li><a className="dropdown-item" href="#">Action</a></li>
            <li><a className="dropdown-item" href="#">Another action</a></li>
            <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item" href="#">Something else here</a></li>
          </ul>
        </li> */}
      </ul>
      <form className="d-flex position-relative">
        <input className="form-control me-2 rounded-pill ps-3 pe-5" type="search" placeholder="Search" aria-label="Search" />
        <span className="border-0 bg-transparent position-absolute top-50 end-0 translate-middle-y me-3">
            <i className="bi bi-search text-dark"></i>
        </span>
      </form>

      <div className="d-flex ms-3">
        <a className="btn btn-outline-primary me-2" type="button">

        </a>
        <a className="btn btn-primary" type="button">

        </a>
      </div>
    </div>
  </div>
</nav>
</>
  );
};

export default Navbar
