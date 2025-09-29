import React from "react";
import "../style/footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer bg-dark text-white text-center p-3 pt-5">
      <div className="container items-center">
        <div className="row text-start">
          <div className="col-3 gap-y-2">
            <h5>UMKM KU</h5>
            <p className="text-white fw-semibold">Subscribe</p>
            <p className="text-white">Get 10% off your first order</p>
            <div className="position-relative">
              <input
                type="email"
                className="custom-input form-control bg-dark text-light pe-5"
                id="exampleInputEmail1"
                placeholder="Enter your email "
              />
              <i className="bi bi-send position-absolute top-50 end-0 translate-middle-y me-3 text-white"></i>
            </div>
          </div>

          <div className="col-2">
            <p className="mb-3 fw-semibold">Support</p>
            <ul className="list-unstyled">
              <li className="mb-3">
                <a href="#" className="text-white text-decoration-none">
                  Jl.Kemang Timur No. 1 Pejaten Barat
                </a>
              </li>
              <li className="mb-3">
                <a href="#" className="text-white text-decoration-none">
                  umkm.ku@gmail.com
                </a>
              </li>
              <p>+62 812-3456-7890</p>
            </ul>
          </div>

          <div className="col-2">
            <p className="mb-3 fw-semibold">Account</p>
            <ul className="list-unstyled">
              <li className="mb-3">
                <a href="#" className="text-white text-decoration-none">
                  My Account
                </a>
              </li>
              <li className="mb-3">
                <a href="#" className="text-white text-decoration-none">
                  Login/Registrasi
                </a>
              </li>
              <li className="mb-3">
                <a href="#" className="text-white text-decoration-none">
                  Keranjang
                </a>
              </li>
              <li className="mb-3">
                <a href="#" className="text-white text-decoration-none">
                  Whislist
                </a>
              </li>
              <li className="mb-3">
                <a href="#" className="text-white text-decoration-none">
                  Shop
                </a>
              </li>
            </ul>
          </div>

          <div className="col-2">
            <p className="mb-3 fw-semibold">Quick Link</p>
            <ul className="list-unstyled">
              <li className="mb-3">
                <a href="#" className="text-white text-decoration-none">
                  Privacy Policy
                </a>
              </li>
              <li className="mb-3">
                <a href="#" className="text-white text-decoration-none">
                  Terms Of Use
                </a>
              </li>
              <li className="mb-3">
                <a href="#" className="text-white text-decoration-none">
                  FAQ
                </a>
              </li>
              <li className="mb-3">
                <a href="#" className="text-white text-decoration-none">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div className="col-3">
            <h6 className="fw-semibold mb-3">Download App</h6>
            <p className="mb-3">Save $3 with App New User Only</p>
            <p>Telp: +62 812-3456-7890</p>
          </div>
        </div>

        <hr className="bg-white" />
        <p className="mb-0">© 2025 UMKM KU. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
