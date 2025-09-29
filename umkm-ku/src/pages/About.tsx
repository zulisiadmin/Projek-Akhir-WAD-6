import React from "react";
import { FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import FeatureSection from "../section/FeatureSection";

interface StatItem {
  icon: string;
  number: string;
  desc: string;
  highlight?: boolean;
}

const About: React.FC = () => {
  const stats: StatItem[] = [
    {
      icon: "bi-shop",
      number: "10.5k",
      desc: "Penjual aktif di situs kami",
    },
    {
      icon: "bi-cash-coin",
      number: "33k",
      desc: "Penjualan Produk Bulanan",
      highlight: true,
    },
    {
      icon: "bi-bag",
      number: "45.5k",
      desc: "Pelanggan aktif di situs kami",
    },
    {
      icon: "bi-graph-up",
      number: "25k",
      desc: "Penjualan kotor tahunan di situs kami",
    },
  ];



  

  const teamMembers = [
    {
      name: "Zuli Priadi",
      role: "Founder & Chairman",
      img: "./images/zuli.png", 
      socials: {
        twitter: "#",
        instagram: "#",
        linkedin: "#",
      },
    },
    {
      name: "Muhammad Reski",
      role: "Managing Director",
      img: "./images/reski.png",
      socials: {
        twitter: "#",
        instagram: "#",
        linkedin: "#",
      },
    },
    {
      name: "Muhammad Zidan",
      role: "Product Designer",
      img: "./images/zidan.png",
      socials: {
        twitter: "#",
        instagram: "#",
        linkedin: "#",
      },
    },
  ];

  return (
    <div>
      {/* Our Story Section */}
      <section className="container my-5">
        <div className="row align-items-center">
          {/* Text Section */}
          <div className="col-md-6 mb-4 mb-md-0">
            <h2 className="fw-bold mb-4">Perjalanan Kami</h2>
            <p className="text-muted">
              Diluncurkan pada tahun 2025, UMKMKU adalah pasar belanja online di Universitas Cakrawala dengan kehadiran aktifitas belanja online. Didukung oleh berbagai solusi pemasaran, data, dan layanan yang disesuaikan, UMKMKU memiliki 10.500 penjual dan 300 merek serta melayani 3 juta pelanggan di seluruh wilayah Kampus Universitas Cakrawala.
            </p>
            <p className="text-muted">
              UMKMKU memiliki lebih dari 1 juta produk untuk ditawarkan, berkembang dengan sangat cepat. UMKMKU menawarkan berbagai macam kategori mulai dari produk konsumen.
            </p>
          </div>

          {/* Image Section */}
          <div className="col-md-6 text-center">
            <img
              src="/images/about.jpg"
              alt="Our Story"
              className="img-fluid rounded"
              style={{ maxHeight: "400px", objectFit: "cover",}}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container my-5">
        <div className="row g-4 text-center">
          {stats.map((item, index) => (
            <div key={index} className="col-6 col-md-3">
              <div
                className={`p-4 h-100 border rounded d-flex flex-column align-items-center justify-content-center ${
                  item.highlight ? "bg-danger text-white" : "bg-white"
                }`}
              >
                <div
                  className={`d-flex justify-content-center align-items-center mb-3 ${
                    item.highlight ? "bg-white" : "bg-dark"
                  }`}
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                  }}
                >
                  <i
                    className={`bi ${item.icon} ${
                      item.highlight ? "text-danger" : "text-white"
                    } fs-4`}
                  ></i>
                </div>
                <h5 className="fw-bold mb-1">{item.number}</h5>
                <p
                  className={`${
                    item.highlight ? "text-white-50" : "text-muted"
                  } mb-0 small`}
                >
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-5 bg-white">
        <div className="container text-center">
          <h2 className="fw-bold mb-5">Meet Our Team</h2>
          <div className="row g-4">
            {teamMembers.map((member, index) => (
              <div key={index} className="col-md-4">
                <div className="card border-0 shadow h-100">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="card-img-top"
                    style={{ height: "400px", objectFit: "cover", width: "100%", objectPosition: "top" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title fw-bold">{member.name}</h5>
                    <p className="text-muted">{member.role}</p>
                  </div>
                  <div className="card-footer bg-white border-0">
                    <div className="d-flex justify-content-center gap-3">
                      <a href={member.socials.twitter} className="text-dark">
                        <FaTwitter size={20} />
                      </a>
                      <a href={member.socials.instagram} className="text-dark">
                        <FaInstagram size={20} />
                      </a>
                      <a href={member.socials.linkedin} className="text-dark">
                        <FaLinkedin size={20} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <FeatureSection />
    </div>
  );
};

export default About;

