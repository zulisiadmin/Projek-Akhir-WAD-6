

const FeatureSection: React.FC = () => {
  const features = [
    {
      icon: "bi-truck",
      title: "FREE AND FAST DELIVERY",
      desc: "Free delivery for all orders over $140",
    },
    {
      icon: "bi-headset",
      title: "24/7 CUSTOMER SERVICE",
      desc: "Friendly 24/7 customer support",
    },
    {
      icon: "bi-shield-check",
      title: "MONEY BACK GUARANTEE",
      desc: "We return money within 30 days",
    },
  ];

  return (
    <section className="container my-5 py-5 mb-5 mt-5">
      <div className="row text-center">
        {features.map((item, index) => (
          <div key={index} className="col-md-4 mb-4">
            <div
              className="d-flex justify-content-center align-items-center mx-auto mb-3"
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: "#fd3c3cff",
              }}
            >
              <i className={`bi ${item.icon} text-white fs-4`}></i>
            </div>
            <h6 className="fw-bold">{item.title}</h6>
            <p className="text-muted small">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;

