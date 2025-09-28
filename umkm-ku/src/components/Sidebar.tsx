import React from "react";
import "../style/sidebar.css";

const SideBar: React.FC = () => {
  const categories: string[] = [
    "Makanan dan Minuman",
    "Alat Tulis",
    "Aksesoris",
    "Home & Lifestyle",
    "Medicine",
    "Sports & Outdoor",
    "Baby’s & Toys",
    "Groceries & Pets",
    "Health & Beauty",
  ];

  return (
    <>
    <aside className="col-3 bg-white">
      <ul className="list-group">
        {categories.map((item: string, index: number) => (
          <li key={index} className="list-group-item border-0">{item}
          
           <span className="text-dark float-end">
          <i className="bi bi-caret-right-fill"></i>
        </span>
          
          </li>
        ))}
      </ul>
    </aside>
    </>
  );
};

export default SideBar;
