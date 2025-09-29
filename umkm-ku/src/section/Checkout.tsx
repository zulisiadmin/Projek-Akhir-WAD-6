import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

type OrderItem = {
  id: number;
  name: string;
  price: number;
  image: string;
};

const Checkout: React.FC = () => {
  const [orderItems] = useState<OrderItem[]>([
    {
      id: 1,
      name: "LCD Monitor",
      price: 650000,
      image: "./images/monitor.jpg",
    },
    {
      id: 2,
      name: "HI Gamepad",
      price: 1100000,
      image: "./images/gampad2.jpg",
    },
  ]);

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const subtotal = orderItems.reduce((acc, item) => acc + item.price, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  // Fungsi format Rupiah
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="container my-5">
      {/* Breadcrumb */}
      <p className="text-muted">
        Account / My Account / Product / View Cart /{" "}
        <span className="fw-semibold">CheckOut</span>
      </p>

      <div className="row">
        {/* Billing Form */}
        <div className="col-lg-7">
          <h4 className="mb-4">Rincian Tagihan</h4>
          <form>
            <div className="mb-3">
              <label className="form-label">Nama Lengkap</label>
              <input type="text" className="form-control" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Alamat</label>
              <input type="text" className="form-control" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Apartment, Lantai, etc. (opsional)</label>
              <input type="text" className="form-control" />
            </div>
            <div className="mb-3">
              <label className="form-label">Kota</label>
              <input type="text" className="form-control" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Nomor Telepon</label>
              <input type="text" className="form-control" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Alamat Email</label>
              <input type="email" className="form-control" required />
            </div>
            <div className="form-check">
              <input type="checkbox" className="form-check-input" id="saveInfo" />
              <label htmlFor="saveInfo" className="form-check-label">
                Simpan informasi ini untuk checkout lebih cepat lain kali
              </label>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="col-lg-5 mt-4 mt-lg-0">
          <div className="border rounded p-4">
            {orderItems.map((item) => (
              <div key={item.id} className="d-flex justify-content-between mb-2">
                <div className="d-flex align-items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="me-2"
                    style={{ width: "50px", height: "40px" }}
                  />
                  <span>{item.name}</span>
                </div>
                <span>{formatRupiah(item.price)}</span>
              </div>
            ))}
            <hr />
            <div className="d-flex justify-content-between">
              <span>Subtotal:</span>
              <span>{formatRupiah(subtotal)}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Shipping:</span>
              <span>{shipping === 0 ? "Gratis" : formatRupiah(shipping)}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold">
              <span>Total:</span>
              <span>{formatRupiah(total)}</span>
            </div>

            {/* Payment Method */}
            <div className="mt-3">
              <div className="form-check">
                <input
                  type="radio"
                  id="bank"
                  value="bank"
                  checked={paymentMethod === "bank"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="form-check-input"
                />
                <label htmlFor="bank" className="form-check-label">
                  Transfer Bank{" "}
                  <img
                    src="https://via.placeholder.com/80x20.png?text=VISA+MC"
                    alt="cards"
                  />
                </label>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  id="cod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="form-check-input"
                />
                <label htmlFor="cod" className="form-check-label">
                  Bayar di Tempat (COD)
                </label>
              </div>
            </div>

            {/* Kupon */}
            <div className="d-flex mt-3">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Kode Kupon"
              />
              <button className="btn btn-danger">Tambahkan Kupon</button>
            </div>

            {/* Pesan Sekarang */}
            <button className="btn btn-danger w-100 mt-3">Pesan sekarang</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
