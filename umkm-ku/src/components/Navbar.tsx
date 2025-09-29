import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <a className="navbar-brand fw-bold" href="#">
          UMKM KU
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">
                Beranda
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="about">
                Tentang
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="#">
                Kontak
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="#">
                Sign Up
              </Link>
            </li>
          </ul>

          {/* Search Form */}
          <form className="d-flex position-relative">
            <input
              className="form-control me-2 rounded-pill ps-3 pe-5"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <span className="border-0 bg-transparent position-absolute top-50 end-0 translate-middle-y me-4">
              <i className="bi bi-search text-dark"></i>
            </span>
          </form>

          {/* Icons */}
          <div className="d-flex ms-3 gap-3">
            <Link className="text-dark me-2" to="#">
              <i className="bi bi-heart fw-bold fs-4"></i>
            </Link>
            <button className="text-dark border-0 bg-transparent" type="button">
              <i className="bi bi-cart fw-bold fs-4"></i>
            </button>
          </div>

          {/* Login Button */}
          <Link className="btn btn-danger ms-3" to="/login" role="button">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
