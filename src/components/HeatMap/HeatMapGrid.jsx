import React from "react";

const HeatMapGrid = ({ data, joinDate, daysToView = 28 }) => {
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

  const today = new Date();
  const joinDateStr = joinDate
    ? new Date(joinDate).toISOString().split("T")[0]
    : null;

  const days = Array.from({ length: daysToView }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (daysToView - 1 - i));
    return d.toISOString().split("T")[0];
  });

  const isYearly = daysToView > 30;

  return (
    <div className="card shadow-sm border-0 rounded-4 bg-white h-100">
      <div className="card-body p-4 text-center">
        <div className="mb-4">
          <h5 className="fw-bold text-dark mb-1">Your Wins</h5>
          <p className="text-muted small mb-0">
            {isYearly ? "One year of growth" : "Last 4 weeks"}
          </p>
        </div>

        <div
          className={
            isYearly ? "overflow-x-auto pb-2" : "d-flex justify-content-center"
          }
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isYearly ? "none" : "repeat(7, 1fr)",
              gridTemplateRows: isYearly ? "repeat(7, 1fr)" : "none",
              gridAutoFlow: isYearly ? "column" : "row",
              gap: isYearly ? "6px" : "10px",
              width: isYearly ? "max-content" : "100%",
              maxWidth: isYearly ? "none" : "280px",
              margin: "0 auto",
            }}
          >
            {days.map((date) => {
              const dayInfo = data?.[date] || { level: 0, count: 0 };
              const isJoinDate = date === joinDateStr;

              const hoverText =
                dayInfo.count === 1
                  ? `${dayInfo.count} task successfully completed`
                  : dayInfo.count > 1
                    ? `${dayInfo.count} tasks successfully completed`
                    : `No tasks completed yet`;

              return (
                <div
                  key={date}
                  className="rounded-2 border flex-shrink-0"
                  title={`${date}: ${hoverText}`}
                  style={{
                    aspectRatio: "1 / 1",
                    backgroundColor: getLevelColor(dayInfo.level),
                    borderColor: isJoinDate ? "#9b5de5" : "#f4f4f4",
                    borderWidth: isJoinDate ? "2px" : "1px",
                    width: isYearly ? "14px" : "auto",
                    cursor: "pointer",
                  }}
                >
                  {isJoinDate && (
                    <span style={{ fontSize: isYearly ? "6px" : "12px" }}>
                      ✨
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 d-flex justify-content-center align-items-center gap-2">
          <div className="d-flex gap-1">
            {[1, 2, 3, 4].map((l) => (
              <div
                key={l}
                className="rounded-circle"
                style={{
                  width: "8px",
                  height: "8px",
                  backgroundColor: getLevelColor(l),
                }}
              />
            ))}
          </div>
          <small className="text-muted fw-bold" style={{ fontSize: "0.6rem" }}>
            CONSISTENCY
          </small>
        </div>
      </div>
    </div>
  );
};

export default HeatMapGrid;
