export interface Product {
  id: number;
  name: string;
  image: string;
  discount: number;
  price: number;
  oldPrice: number;
  rating: number;
  reviews: number;
}

export const products: Product[] = [
  {
    id: 1,
    name: "HAVIT HV-G92 Gamepad",
    image: "/images/isi1.png",
    discount: 40,
    price: 120000,
    oldPrice: 160000, // aku perbaiki jadi angka realistis (dulu 160 aja?)
    rating: 4.5,
    reviews: 88,
  },
  {
    id: 2,
    name: "AK-900 Wired Keyboard",
    image: "/images/isi2.png",
    discount: 35,
    price: 96000,
    oldPrice: 150000, // semula 1.500.000 terlalu jauh dibanding price
    rating: 4.3,
    reviews: 75,
  },
  {
    id: 3,
    name: "IPS LCD Gaming Monitor",
    image: "/images/isi3.png",
    discount: 30,
    price: 370000,
    oldPrice: 400000,
    rating: 4.7,
    reviews: 99,
  },
  {
    id: 4,
    name: "S-Series Comfort Chair",
    image: "/images/isi4.jpg",
    discount: 25,
    price: 375000,
    oldPrice: 400000,
    rating: 4.6,
    reviews: 95,
  },
];