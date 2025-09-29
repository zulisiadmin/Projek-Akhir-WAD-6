import React from "react";
import "../style/categories.css";

// Definisikan tipe untuk category
interface Category {
  id: number;
  name: string;
  icon: React.ReactNode;
}


const Categories: React.FC = () => {
  const categoriesData: Category[] = [
    { id: 1, name: "Elektronik", icon: <i className="bi bi-lightning"></i> },
    { id: 2, name: "Pakaian", icon: <i className="bi bi-person-standing-dress"></i> },
    { id: 3, name: "Makanan", icon: <i className="bi bi-fork-knife"></i> },
    { id: 4, name: "Kecantikan", icon: <i className="bi bi-bluesky"></i> },
    { id: 5, name: "Olahraga", icon: <i className="bi bi-cookie"></i> },
    { id: 6, name: "Aksesoris", icon: <i className="bi bi-cassette"></i> },
  ];

  return (
    <div className="container mt-5">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex flex-column">
          <div className="d-flex align-items-center gap-2">
            <div
              className="bg-danger rounded-1 p-2"
              style={{ width: "10px", height: "32px" }}
            ></div>
            <h6 className="text-danger fw-semibold mb-1">Kategori</h6>
          </div>
          <div className="d-flex gap-4 align-items-center">
            <h2 className="fw-bold me-5">Cari Kategori</h2>
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

      {/* Categories List */}
      <div className="row mb-5">
        {categoriesData.map((category) => (
          <div key={category.id} className="col-6 col-md-4 col-lg-2 mb-4">
            <div className="card card-category h-100 border border-danger p-3">
              <span className="card-icon fs-3 text-danger text-center">
                {category.icon}
              </span>
              <div className="card-body">
                <h5 className="card-title text-center">{category.name}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
      <hr className="text-danger mb-5" />
    </div>
  );
};

export default Categories;
