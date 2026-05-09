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
    <div className="card shadow-sm border-0 rounded-4 bg-white h-100">
      <div className="card-body p-4 text-center">
        <h5 className="fw-bold text-dark mb-1">Your Wins</h5>
        <p className="text-muted small mb-4">Last 4 weeks</p>

        <div className="d-flex justify-content-center">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "10px",
              width: "100%",
              maxWidth: "280px",
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
                    borderRadius: "6px",
                    border: isJoinDate
                      ? "2px solid #4cc9f0"
                      : "1px solid #f4f4f4",
                    boxSizing: "border-box",
                    cursor: isBeforeJoining ? "default" : "pointer",
                    opacity: isBeforeJoining ? 0.5 : 1,
                  }}
                />
              );
            })}
          </div>
        </div>

        <div className="mt-3" style={{ height: "24px" }}>
          {hoveredDay ? (
            <p className="text-dark fw-bold small m-0">
              {hoveredDay.date}: {hoveredDay.count}{" "}
              {hoveredDay.count === 1 ? "task" : "tasks"}
            </p>
          ) : (
            <p className="text-muted small m-0">Consistency is key ✨</p>
          )}
        </div>

        {joinDateObj && (
          <p className="text-muted small mt-2 pt-2 border-top">
            Joined: <strong>{formatDisplay(joinDateObj)}</strong>
          </p>
        )}
      </div>
    </div>
  );
};

export default HeatMapGrid;
