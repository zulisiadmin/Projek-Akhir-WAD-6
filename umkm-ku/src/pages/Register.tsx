import React from "react";
import { Link } from "react-router-dom";

const Register: React.FC = () => {
  return (
    <div>
      <div className="d-flex" style={{ height: "100vh" }}>
        {/* Kolom gambar */}
        <div className="flex-grow-1 p-0">
          <img
            src="./images/login.jpg"
            alt="Register Banner"
            className="w-100 h-100"
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* Kolom form */}
        <div className="d-flex flex-column justify-content-center align-items-center flex-grow-1 bg-white">
          <div className="header">
            <h1 className="text-start mb-4">Buat Akun</h1>
          </div>
          <form className="d-flex flex-column gap-3" style={{ width: "400px" }}>
            <div className="mb-3">
              <label htmlFor="registerEmail" className="form-label">
                Alamat Email
              </label>
              <input
                type="email"
                className="form-control"
                id="registerEmail"
                aria-describedby="emailHelp"
              />
              <div id="emailHelp" className="form-text">
                Masukkan email aktif
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="registerPassword" className="form-label">
                Kata Sandi
              </label>
              <input
                type="password"
                className="form-control"
                id="registerPassword"
              />
              <div id="passwordHelp" className="form-text">
                Minimal 8 karakter
              </div>
            </div>

            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="rememberMe"
              />
              <label className="form-check-label" htmlFor="rememberMe">
                Ingatkan Saya
              </label>
            </div>

            <div className="d-flex gap-5 justify-content-between align-items-center">
              <button
                type="submit"
                className="btn btn-danger px-5 py-2 w-100"
              >
                Buat Akun
              </button>
            </div>

            <hr />
            <p className="text-center">
              Sudah Punya Akun?{" "}
              <Link to="/login" className="text-danger">
                Masuk
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
