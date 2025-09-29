import React from "react";
import HeroSection from "../section/HeroSection";
import FlashSale from "../section/FlashSale";
import Categories from "../section/Categories";
import FeatureSection from "../section/FeatureSection";

const HomePage: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <FlashSale />
      <Categories />
      <FeatureSection />
    </div>
  );
};

export default HomePage;
