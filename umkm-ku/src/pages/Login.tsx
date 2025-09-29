import React from "react";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      {/* Kolom gambar */}
      <div className="flex-grow-1 p-0">
        <img
          src="./images/login.jpg"
          alt="Login Banner"
          className="w-100 h-100"
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* Kolom form */}
      <div className="d-flex flex-column justify-content-center align-items-center flex-grow-1 bg-white">
        <h1 className="text-center mb-4">Login</h1>
        <form className="d-flex flex-column gap-3" style={{ width: "400px" }}>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Alamat Email
            </label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
            />
            <div id="emailHelp" className="form-text">
              Masukkan email yang sudah terdaftar
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Kata Sandi
            </label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
            />
            <div id="passwordHelp" className="form-text">
              Minimal 8 karakter
            </div>
          </div>

          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="exampleCheck1"
            />
            <label className="form-check-label" htmlFor="exampleCheck1">
              Ingatkan Saya
            </label>
          </div>

          <div className="d-flex gap-5 justify-content-between align-items-center">
            <Link to="/" className="btn btn-danger px-5 py-2">
              Masuk
            </Link>
            <Link to="/" className="text-danger">
              Lupa Kata Sandi ?
            </Link>
          </div>

          <hr />
          <p className="text-center">
            Belum Punya Akun ?{" "}
            <Link to="/register" className="text-danger">
              Buat Akun
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
