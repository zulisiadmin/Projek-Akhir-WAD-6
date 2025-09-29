import React from "react";
import Countdown from "../components/Countdown";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";
import type { Product } from "../data/products";


const FlashSale: React.FC = () => {
  return (
    <section className="container py-5 px-3">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex flex-column">

        <div className="d-flex align-items-center gap-2">
            <div className="bg-danger rounded-1 p-2" style={{width: "10px", height: "32px"}}></div>
                <h6 className="text-danger fw-semibold mb-1">Today’s</h6>
            </div>
        <div className="d-flex gap-4 align-items-center">
            <h2 className="fw-bold me-5">Flash Sales</h2>
                <Countdown />
        </div>
        </div>


       <div className="d-flex gap-2 align-items-center mb-0">
        <button
            className="btn btn-outline-danger rounded-circle p-0 d-flex align-items-center justify-content-center"
            style={{ width: "32px", height: "32px" }}
        >
            <i className="bi bi-arrow-left fw-bold"></i>
        </button>
        <button
            className="btn btn-outline-danger rounded-circle p-0 d-flex align-items-center justify-content-center"
            style={{ width: "32px", height: "32px" }}
        >
            <i className="bi bi-arrow-right fw-bold"></i>
        </button>
    </div>

      </div>

      {/* Products */}
      <div className="row g-4">
        {products.map((product: Product) => (
          <div key={product.id} className="col-12 col-sm-6 col-md-3">
            <ProductCard {...product} />
          </div>
        ))}
      </div>

      {/* View All */}
      <div className="d-flex justify-content-center mt-4">
        <button className="btn btn-danger px-4 py-2">
          Lihat Semua Produk
        </button>
      </div>
    </section>
  );
};

export default FlashSale;

