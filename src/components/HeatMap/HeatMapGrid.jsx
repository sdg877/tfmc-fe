import React from "react";

const HeatMapGrid = ({ data }) => {
  const getLevelColor = (level) => {
    switch (level) {
      case 4:
        return "#9b5de5";
      case 3:
        return "#bc98f3";
      case 2:
        return "#f15bb5";
      case 1:
        return "#fee9f5";
      default:
        return "#f8f9fa";
    }
  };

  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().split("T")[0];
  });

  return (
    <div className="card shadow-sm border-0 rounded-4 p-4">
      <h5 className="fw-bold mb-3 text-dark">Last 30 Days</h5>
      <div className="d-flex flex-wrap gap-2">
        {days.map((date) => {
          const dayData = data[date] || { level: 0, count: 0 };
          return (
            <div
              key={date}
              className="rounded-2 border"
              style={{
                width: "35px",
                height: "35px",
                backgroundColor: getLevelColor(dayData.level),
                borderColor: "#eee !important",
                transition: "transform 0.2s",
              }}
              // Hover text logic
              title={
                dayData.count > 0
                  ? `${date}: ${dayData.count} tasks completed`
                  : `${date}: No activity`
              }
              onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            />
          );
        })}
      </div>

      <div className="mt-4 d-flex gap-3 align-items-center justify-content-center">
        <small className="text-muted">Quiet</small>
        <div className="d-flex gap-1">
          {[1, 2, 3, 4].map((l) => (
            <div
              key={l}
              className="rounded-1"
              style={{
                width: "12px",
                height: "12px",
                backgroundColor: getLevelColor(l),
              }}
            />
          ))}
        </div>
        <small className="text-muted">Busy</small>
      </div>
    </div>
  );
};

export default HeatMapGrid;
