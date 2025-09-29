import React from "react";
import { Link } from "react-router-dom";

interface ProductCardProps {
  name: string;
  image: string;
  discount: number;
  price: number;
  oldPrice: number;
  rating: number;
  reviews: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  image,
  discount,
  price,
  oldPrice,
  rating,
  reviews,
}) => {
  // Fungsi format ke Rupiah
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Link to="/detail" className="text-decoration-none text-dark">
      <div className="card position-relative h-100 border-0 shadow-sm">
        {/* Discount Badge */}
        <span className="badge bg-danger position-absolute top-0 start-0 m-2">
          -{discount}%
        </span>

        {/* Wishlist */}
        <span
          className="position-absolute top-0 end-0 m-2 bg-light rounded-circle px-2"
          style={{ cursor: "pointer", fontSize: "1.2rem" }}
        >
          ♡
        </span>

        {/* Image */}
        <img
          src={image}
          alt={name}
          className="card-img-top object-fit-cover"
          style={{ height: "160px", objectFit: "contain", maxWidth: "250px" }}
        />

        {/* Body */}
        <div className="card-body d-flex flex-column" style={{ maxHeight: "150px" }}>
          <h6 className="card-title mb-2">{name}</h6>

          {/* Price */}
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="text-danger fw-bold">{formatRupiah(price)}</span>
            <span className="text-muted text-decoration-line-through small">
              {formatRupiah(oldPrice)}
            </span>
          </div>

          {/* Rating */}
          <div className="d-flex align-items-center text-warning small mb-3">
            ★ {rating}
            <span className="text-muted ms-1">({reviews})</span>
          </div>

          {/* Add to Cart dan Checkout */}
          <div className="d-flex gap-2 justify-content-between mt-auto">
            <Link className="btn btn-danger w-100 mt-auto" to="/checkout" role="button">
              Beli Sekarang
            </Link>
            <button className="btn btn-outline-danger mt-auto">
              <i className="bi bi-cart fw-bold"></i>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
