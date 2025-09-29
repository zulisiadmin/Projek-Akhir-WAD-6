import React from "react";

type TimeBoxProps = {
  label: string;
  value: string | number;
};

const Countdown: React.FC = () => {
  return (
    <div className="d-flex align-items-center gap-2 text-center">
      <TimeBox label="Hari" value="03" />
      <span className="text-danger fw-bold">:</span>
      <TimeBox label="Jam" value="23" />
      <span className="text-danger fw-bold">:</span>
      <TimeBox label="Menit" value="19" />
      <span className="text-danger fw-bold">:</span>
      <TimeBox label="Detik" value="56" />
    </div>
  );
};

const TimeBox: React.FC<TimeBoxProps> = ({ label, value }) => (
  <div>
    <p className="fs-4 fw-bold mb-0">{value}</p>
    <p className="small text-secondary mb-0">{label}</p>
  </div>
);

export default Countdown;

