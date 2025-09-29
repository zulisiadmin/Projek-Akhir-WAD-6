import React from "react";

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
  return (
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
        style={{ height: "160px", objectFit: "contain" }}
      />

      {/* Body */}
      <div className="card-body d-flex flex-column">
        <h6 className="card-title mb-2">{name}</h6>

        {/* Price */}
        <div className="d-flex align-items-center gap-2 mb-2">
          <span className="text-danger fw-bold">Rp.{price}</span>
          <span className="text-muted text-decoration-line-through small">
            Rp.{oldPrice}
          </span>
        </div>

        {/* Rating */}
        <div className="d-flex align-items-center text-warning small mb-3">
          ★ {rating}
          <span className="text-muted ms-1">({reviews})</span>
        </div>

        {/* Add to Cart dan chek out*/}
        <div className="d-flex gap-2 justify-content-between mt-auto">
        <button className="btn btn-danger w-100 mt-auto">
         Beli Sekarang
        </button>
        <button className="btn btn-outline-danger mt-auto">
          <i className="bi bi-cart fw-bold"></i>
        </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
