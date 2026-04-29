import React from "react";

const HeatMapGrid = ({ data, joinDate }) => {
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

  const generateDays = () => {
    const start = new Date(joinDate);
    const today = new Date();
    const days = [];

    const diffTime = Math.abs(today - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const daysToShow = Math.max(diffDays, 1);
    const windowSize = Math.min(daysToShow, 30);

    for (let i = 0; i < windowSize; i++) {
      const d = new Date();
      d.setDate(today.getDate() - (windowSize - 1 - i));
      days.push(d.toISOString().split("T")[0]);
    }
    return days;
  };

  const activeDays = generateDays();

  return (
    <div className="card shadow-sm border-0 rounded-4 p-4">
      <h5 className="fw-bold mb-3 text-dark">Activity Tracking</h5>

      <div
        className="d-flex flex-nowrap gap-2 overflow-x-auto pb-2"
        style={{ scrollbarWidth: "thin" }}
      >
        {activeDays.map((date) => {
          const dayData = data[date] || { level: 0, count: 0 };
          return (
            <div
              key={date}
              className="rounded-2 border flex-shrink-0"
              style={{
                width: "35px",
                height: "35px",
                backgroundColor: getLevelColor(dayData.level),
                borderColor: "#eee !important",
              }}
              title={
                dayData.count > 0
                  ? `${date}: ${dayData.count} tasks completed`
                  : `${date}: No tasks completed`
              }
            />
          );
        })}
      </div>

      <div className="mt-4 d-flex gap-3 align-items-center justify-content-center">
        <small className="text-muted small fw-bold">LOW</small>
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
        <small className="text-muted small fw-bold">HIGH</small>
      </div>
    </div>
  );
};

export default HeatMapGrid;
