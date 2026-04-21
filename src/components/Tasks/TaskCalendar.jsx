import React from "react";

const TaskCalendar = ({ tasks }) => {
  const today = new Date();
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0,
  ).getDate();
  const firstDayOfMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1,
  ).getDay();

  const calendarDays = Array(firstDayOfMonth)
    .fill(null)
    .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  const getTasksForDay = (day) => {
    if (!day) return [];
    return tasks.filter((t) => {
      if (!t.dueDate) return false;
      const d = new Date(t.dueDate);
      return d.getDate() === day && d.getMonth() === today.getMonth();
    });
  };

  return (
    <div className="card p-3 shadow-sm mb-4">
      <h5 className="text-center mb-3">
        {today.toLocaleString("default", { month: "long" })}{" "}
        {today.getFullYear()}
      </h5>
      <div
        className="d-grid shadow-sm border rounded"
        style={{
          gridTemplateColumns: "repeat(7, 1fr)",
          backgroundColor: "#fff",
        }}
      >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div
            key={d}
            className="text-center fw-bold p-2 border-bottom bg-light small"
          >
            {d}
          </div>
        ))}
        {calendarDays.map((day, idx) => {
          const dayTasks = getTasksForDay(day);
          return (
            <div
              key={idx}
              className="border-end border-bottom p-1"
              style={{ minHeight: "80px", position: "relative" }}
            >
              <span className="small text-muted">{day}</span>
              <div className="d-flex flex-column gap-1">
                {dayTasks.slice(0, 2).map((t) => (
                  <div
                    key={t._id}
                    className={`badge truncate small ${t.urgency === "now" ? "bg-danger" : "bg-primary"}`}
                    style={{
                      fontSize: "0.65rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {t.title}
                  </div>
                ))}
                {dayTasks.length > 2 && (
                  <small className="text-muted" style={{ fontSize: "0.6rem" }}>
                    +{dayTasks.length - 2} more
                  </small>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskCalendar;
