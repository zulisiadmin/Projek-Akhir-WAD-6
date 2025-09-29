import React, { useState } from "react";

type RelatedItem = {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  discount?: number;
  rating: number;
};

const ProductDetail: React.FC = () => {
  const [mainImage, setMainImage] = useState<string>(
    "https://via.placeholder.com/400x300.png?text=Main+Product"
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [color, setColor] = useState<string>("red");
  const [size, setSize] = useState<string>("M");

  const thumbnails = [
    "https://via.placeholder.com/100x80.png?text=Img1",
    "https://via.placeholder.com/100x80.png?text=Img2",
    "https://via.placeholder.com/100x80.png?text=Img3",
    "https://via.placeholder.com/100x80.png?text=Img4",
  ];

  const relatedItems: RelatedItem[] = [
    {
      id: 1,
      name: "HAVIT HV-G92 Gamepad",
      price: 120,
      oldPrice: 160,
      discount: 40,
      image: "https://via.placeholder.com/150.png?text=Gamepad",
      rating: 4,
    },
    {
      id: 2,
      name: "AK-900 Wired Keyboard",
      price: 550,
      oldPrice: 1180,
      discount: 25,
      image: "https://via.placeholder.com/150.png?text=Keyboard",
      rating: 5,
    },
    {
      id: 3,
      name: "IPS LCD Gaming Monitor",
      price: 370,
      oldPrice: 400,
      discount: 30,
      image: "https://via.placeholder.com/150.png?text=Monitor",
      rating: 5,
    },
    {
      id: 4,
      name: "RGB Liquid CPU Cooler",
      price: 160,
      oldPrice: 170,
      discount: 10,
      image: "https://via.placeholder.com/150.png?text=Cooler",
      rating: 4,
    },
  ];

  return (
    <div className="container my-5">
      {/* Breadcrumb */}
      <p className="text-muted">
        Account / Gaming / <span className="fw-semibold">Havic HV G-92 Gamepad</span>
      </p>

      <div className="row">
        {/* Left Image Gallery */}
        <div className="col-md-6">
          <div className="row">
            <div className="col-3">
              {thumbnails.map((thumb, index) => (
                <img
                  key={index}
                  src={thumb}
                  alt="thumb"
                  className="img-fluid mb-2 border rounded cursor-pointer"
                  onClick={() => setMainImage(thumb)}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </div>
            <div className="col-9">
              <img
                src={mainImage}
                alt="main"
                className="img-fluid border rounded"
              />
            </div>
          </div>
        </div>

        {/* Right Product Details */}
        <div className="col-md-6">
          <h4>Havic HV G-92 Gamepad</h4>
          <div className="d-flex align-items-center mb-2">
            <span className="text-warning me-2">★★★★☆</span>
            <small className="text-muted">(150 Reviews)</small>
            <span className="ms-3 text-success fw-semibold">In Stock</span>
          </div>
          <h3 className="fw-bold mb-3">$192.00</h3>
          <p className="text-muted">
            PlayStation 5 Controller Skin High quality vinyl with air channel adhesive for easy bubble free install & mess free removal Pressure sensitive.
          </p>

          {/* Colours */}
          <div className="mb-3">
            <span className="fw-semibold me-2">Colours:</span>
            <div className="d-inline-block">
              <button
                className={`btn rounded-circle me-2 ${
                  color === "red" ? "border border-dark" : ""
                }`}
                style={{ backgroundColor: "red", width: "25px", height: "25px" }}
                onClick={() => setColor("red")}
              />
              <button
                className={`btn rounded-circle me-2 ${
                  color === "black" ? "border border-dark" : ""
                }`}
                style={{ backgroundColor: "black", width: "25px", height: "25px" }}
                onClick={() => setColor("black")}
              />
            </div>
          </div>

          {/* Sizes */}
          <div className="mb-3">
            <span className="fw-semibold me-2">Size:</span>
            {["XS", "S", "M", "L", "XL"].map((s) => (
              <button
                key={s}
                className={`btn btn-outline-secondary me-2 ${
                  size === s ? "active" : ""
                }`}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Quantity & Buy */}
          <div className="d-flex align-items-center mb-3">
            <div className="input-group" style={{ width: "120px" }}>
              <button
                className="btn btn-outline-secondary"
                onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
              >
                -
              </button>
              <input
                type="text"
                className="form-control text-center"
                value={quantity}
                readOnly
              />
              <button
                className="btn btn-outline-secondary"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
            <button className="btn btn-danger ms-3">Buy Now</button>
          </div>

          {/* Delivery Info */}
          <div className="border p-3 rounded">
            <p className="mb-1">
              🚚 <strong>Free Delivery</strong>
              <br />
              Enter your postal code for Delivery Availability
            </p>
            <hr />
            <p className="mb-0">
              ↩️ <strong>Return Delivery</strong>
              <br />
              Free 30 Days Delivery Returns. <a href="#">Details</a>
            </p>
          </div>
        </div>
      </div>

      {/* Related Items */}
      <div className="mt-5">
        <h5 className="mb-3">Related Item</h5>
        <div className="row">
          {relatedItems.map((item) => (
            <div key={item.id} className="col-md-3 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <img src={item.image} className="card-img-top" alt={item.name} />
                <div className="card-body text-center">
                  {item.discount && (
                    <span className="badge bg-danger me-2">
                      -{item.discount}%
                    </span>
                  )}
                  <h6 className="card-title mt-2">{item.name}</h6>
                  <p className="mb-1 text-danger fw-bold">${item.price}</p>
                  {item.oldPrice && (
                    <small className="text-muted text-decoration-line-through">
                      ${item.oldPrice}
                    </small>
                  )}
                  <div className="text-warning">{"★".repeat(item.rating)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

