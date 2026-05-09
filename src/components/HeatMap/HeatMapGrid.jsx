import React, { useState } from "react";

const HeatMapGrid = ({ data, joinDate, daysToView = 28 }) => {
  const [hoveredDay, setHoveredDay] = useState(null);

  const formatInternal = (d) => d.toLocaleDateString("sv-SE");
  const formatDisplay = (d) => d.toLocaleDateString("en-GB");

  const getLevelColor = (level, isBeforeJoining) => {
    if (isBeforeJoining) return "#f1f3f5";
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
  const joinDateObj = joinDate ? new Date(joinDate) : null;
  const joinDateKey = joinDateObj ? formatInternal(joinDateObj) : null;

  const days = Array.from({ length: daysToView }, (_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(today.getDate() - (daysToView - 1 - i));
    return {
      key: formatInternal(d),
      display: formatDisplay(d),
      dateObj: new Date(d),
    };
  });

  return (
    <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-2">
      <div className="text-center mb-4">
        <h5 className="fw-bold text-dark mb-1">Your Wins</h5>
        <p className="text-muted small">Last 4 weeks</p>
      </div>

      <div className="d-flex justify-content-center w-100">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "12px",
            width: "100%",
            maxWidth: "500px",
          }}
          onMouseLeave={() => setHoveredDay(null)}
        >
          {days.map((day) => {
            const dayInfo =
              data && data[day.key] ? data[day.key] : { level: 0, count: 0 };
            const isJoinDate = day.key === joinDateKey;
            const isBeforeJoining =
              joinDateObj && day.dateObj < joinDateObj.setHours(0, 0, 0, 0);

            return (
              <div
                key={day.key}
                onMouseEnter={() =>
                  !isBeforeJoining &&
                  setHoveredDay({
                    date: day.display,
                    count: dayInfo.count,
                  })
                }
                style={{
                  aspectRatio: "1 / 1",
                  backgroundColor: getLevelColor(
                    dayInfo.level,
                    isBeforeJoining,
                  ),
                  borderRadius: "8px",
                  border: isJoinDate ? "3px solid #4cc9f0" : "1px solid #eee",
                  boxSizing: "border-box",
                  cursor: isBeforeJoining ? "default" : "pointer",
                  opacity: isBeforeJoining ? 0.4 : 1,
                  transition: "transform 0.2s ease-in-out",
                }}
                className="heatmap-square"
              />
            );
          })}
        </div>
      </div>

      <div className="mt-4 text-center" style={{ minHeight: "24px" }}>
        {hoveredDay ? (
          <p className="text-dark fw-bold m-0 animate-fade-in">
            {hoveredDay.date}: {hoveredDay.count}{" "}
            {hoveredDay.count === 1 ? "task" : "tasks"}
          </p>
        ) : (
          <p className="text-muted m-0">Consistency is key ✨</p>
        )}
      </div>

      {joinDateObj && (
        <p className="text-muted small mt-3 pt-3 border-top w-75 text-center">
          Joined: <strong>{formatDisplay(joinDateObj)}</strong>
        </p>
      )}
    </div>
  );
};

export default HeatMapGrid;
