import React from "react";
import "../style/contact.css";

const Contact: React.FC = () => {
  return (
    <section className="container contact my-5 justify-content-center align-items-center">
        <h2 className="text-center mb-4 fw-bold">Kontak Kami</h2>
      <div className="row g-4">
        {/* Contact Info */}
        <div className="col-md-4">
          <div className="p-4 shadow rounded bg-white">
            <div className="d-flex align-items-start mb-4">
              <div className="me-3">
                <i className="bi bi-telephone-fill text-danger fs-3"></i>
              </div>
              <div>
                <h5 className="fw-bold">Hubungi Kami</h5>
                <p className="text-muted mb-1">
                  Kami tersedia 24/7, 7 hari seminggu.
                </p>
                <p className="text-muted mb-0">Telepon: +62 082 1234 5678</p>
              </div>
            </div>
            <hr />
            <div className="d-flex align-items-start">
              <div className="me-3">
                <i className="bi bi-envelope-fill text-danger fs-3"></i>
              </div>
              <div>
                <h5 className="fw-bold">Tulis Sesuatu</h5>
                <p className="text-muted mb-1">
                  Isi formulir kami dan kami akan menghubungi Anda dalam 24 jam.
                </p>
                <p className="text-muted mb-0">
                  Email: customer@umkmku.com
                </p>
                <p className="text-muted mb-0">
                  Email: support@umkmku.com
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="col-md-8">
          <div className="p-4 shadow rounded bg-white">
            <form>
              <div className="row g-3">
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nama Lengkap"
                    required
                  />
                </div>
                <div className="col-md-4">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Alamat Email *"
                    required
                  />
                </div>
                <div className="col-md-4">
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="Nomor Telepon"
                    required
                  />
                </div>
                <div className="col-12">
                  <textarea
                    className="form-control"
                    rows={5}
                    placeholder="Pesan"
                  ></textarea>
                </div>
                <div className="col-12 text-end">
                  <button type="submit" className="btn btn-danger px-4">
                    Kirim
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

