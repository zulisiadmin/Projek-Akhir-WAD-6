import React, { useState } from "react";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

// ✅ Formatter untuk Rupiah
const formatRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "LCD Monitor",
      price: 6500000,
      quantity: 1,
      image: "./images/monitor.jpg",
    },
    {
      id: 2,
      name: "HI Gamepad",
      price: 550000,
      quantity: 2,
      image: "./images/gampad2.jpg",
    },
  ]);

  const handleQuantityChange = (id: number, value: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: value } : item
      )
    );
  };

  const handleRemove = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="container my-5 mb-5">
      {/* Breadcrumb */}
      <p className="text-muted">
        Home / <span className="fw-semibold">Kranjang</span>
      </p>

      <div className="row">
        {/* Cart Table */}
        <div className="col-lg-8">
          <table className="table align-middle">
            <thead className="table-light">
              <tr>
                <th>Barang</th>
                <th>Harga</th>
                <th style={{ width: "120px" }}>Jumlah</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <button
                        className="btn btn-sm btn-outline-danger me-2"
                        onClick={() => handleRemove(item.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="me-2"
                        style={{ width: "60px", height: "50px" }}
                      />
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td>{formatRupiah(item.price)}</td>
                  <td>
                    <select
                      className="form-select"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, Number(e.target.value))
                      }
                    >
                      {[...Array(10).keys()].map((n) => (
                        <option key={n + 1} value={n + 1}>
                          {n + 1}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{formatRupiah(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Action buttons */}
          <div className="d-flex justify-content-between">
            <button className="btn btn-outline-dark">Kembali ke Toko</button>
            <button className="btn btn-outline-dark">Perbarui Keranjang</button>
          </div>

          {/* Coupon section */}
          <div className="d-flex mt-4">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Kode Kupon"
            />
            <button className="btn btn-danger">Tambahkan Kupon</button>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="col-lg-4 mt-4 mt-lg-0">
          <div className="border rounded p-4">
            <h5 className="mb-3">Cart Total</h5>
            <div className="d-flex justify-content-between">
              <span>Subtotal:</span>
              <span>{formatRupiah(subtotal)}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Shipping:</span>
              <span>Gratis</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold">
              <span>Total:</span>
              <span>{formatRupiah(subtotal)}</span>
            </div>
            <button className="btn btn-danger w-100 mt-3">
               Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
