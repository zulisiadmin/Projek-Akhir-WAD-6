import React from "react";
import HeroBanner from "../components/HeroBanner";
import Sidebar from "../components/Sidebar";

const HeroSection: React.FC = () => {
  return (
    <>
      <div className="container d-grid mt-4 gap-4 justify-content-center items-center">
        <div className="row">
          <Sidebar />
          <HeroBanner />
        </div>
      </div>
    </>
  );
};

export default HeroSection;
