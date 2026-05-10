import React, { useState } from "react";

const TaskCalendar = ({ tasks, googleEvents = [] }) => {
  const [viewDate, setViewDate] = useState(new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const changeMonth = (offset) => {
    setViewDate(new Date(year, month + offset, 1));
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const calendarDays = Array(firstDayOfMonth)
    .fill(null)
    .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  const getItemsForDay = (day, items, type) => {
    if (!day) return [];
    return items.filter((item) => {
      let dateVal;

      if (type === "google") {
        dateVal = item.start?.dateTime || item.start?.date;
      } else {
        dateVal = item.dueDate;
      }

      if (!dateVal) return false;
      const d = new Date(dateVal);
      return (
        d.getDate() === day &&
        d.getMonth() === month &&
        d.getFullYear() === year
      );
    });
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="d-flex justify-content-between align-items-center p-3 bg-white border-bottom">
        <button
          className="btn btn-outline-dark btn-sm rounded-pill px-3"
          onClick={() => changeMonth(-1)}
        >
          ← Previous
        </button>
        <h4
          className="fw-bold mb-0 text-uppercase"
          style={{ letterSpacing: "1px" }}
        >
          {viewDate.toLocaleString("default", { month: "long" })} {year}
        </h4>
        <button
          className="btn btn-outline-dark btn-sm rounded-pill px-3"
          onClick={() => changeMonth(1)}
        >
          Next →
        </button>
      </div>

      <div
        className="d-grid"
        style={{
          gridTemplateColumns: "repeat(7, 1fr)",
          backgroundColor: "#dee2e6",
          gap: "1px",
        }}
      >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div
            key={d}
            className="bg-light text-center py-2 fw-bold small text-muted border-bottom"
          >
            {d}
          </div>
        ))}

        {calendarDays.map((day, idx) => {
          const dayTasks = getItemsForDay(day, tasks, "task");
          const dayEvents = getItemsForDay(day, googleEvents, "google");

          return (
            <div
              key={idx}
              className="bg-white p-1"
              style={{ minHeight: "120px" }}
            >
              {day && (
                <>
                  <div className="text-end pe-1">
                    <span
                      className={`small fw-bold ${new Date().getDate() === day && new Date().getMonth() === month ? "text-primary" : "text-muted"}`}
                    >
                      {day}
                    </span>
                  </div>
                  <div className="d-flex flex-column gap-1 mt-1">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className="border-start border-3 border-secondary bg-light text-dark px-1 py-1"
                        style={{
                          fontSize: "0.55rem",
                          borderRadius: "2px",
                          lineHeight: "1.1",
                        }}
                        title={event.summary}
                      >
                        <span className="me-1">🗓️</span>
                        <strong>{event.summary}</strong>
                      </div>
                    ))}

                    {dayTasks.map((t) => (
                      <div
                        key={t._id}
                        className={`badge ${t.urgency === "now" ? "bg-danger" : "bg-primary"} text-wrap text-start`}
                        style={{ fontSize: "0.6rem", padding: "4px" }}
                      >
                        {t.title}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskCalendar;
