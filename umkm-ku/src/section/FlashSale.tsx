import React, { useRef } from "react";
import Countdown from "../components/Countdown";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";
import type { Product } from "../data/products";
import "../style/flashsale.css";

const FlashSale: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const itemsPerPage = 4;
  const cardWidth = 250; 

  const handlePrev = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -cardWidth * itemsPerPage, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: cardWidth * itemsPerPage, behavior: "smooth" });
    }
  };

  return (
    <section className="container py-5 px-3">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex flex-column">
          <div className="d-flex align-items-center gap-2">
            <div
              className="bg-danger rounded-1 p-2"
              style={{ width: "10px", height: "32px" }}
            ></div>
            <h6 className="text-danger fw-semibold mb-1">Today’s</h6>
          </div>
          <div className="d-flex gap-4 align-items-center">
            <h2 className="fw-bold me-5">Flash Sales</h2>
            <Countdown />
          </div>
        </div>

        {/* Arrows */}
        <div className="d-flex gap-2 align-items-center mb-0">
          <button
            className="btn btn-outline-danger rounded-circle p-0 d-flex align-items-center justify-content-center"
            style={{ width: "32px", height: "32px" }}
            onClick={handlePrev}
          >
            <i className="bi bi-arrow-left fw-bold"></i>
          </button>
          <button
            className="btn btn-outline-danger rounded-circle p-0 d-flex align-items-center justify-content-center"
            style={{ width: "32px", height: "32px" }}
            onClick={handleNext}
          >
            <i className="bi bi-arrow-right fw-bold"></i>
          </button>
        </div>
      </div>

      {/* Products */}
      <div
    ref={scrollRef}
    className="d-flex gap-4 overflow-auto hide-scrollbar"
    style={{ scrollBehavior: "smooth" }}
    >

        {products.map((product: Product) => (
          <div key={product.id} style={{ minWidth: "250px", flexShrink: 0 }}>
            <ProductCard {...product} />
          </div>
        ))}
      </div>

      {/* View All */}
      <div className="d-flex justify-content-center mt-4">
        <button className="btn btn-danger px-4 py-2">Lihat Semua Produk</button>
      </div>
    </section>
  );
};

export default FlashSale;
