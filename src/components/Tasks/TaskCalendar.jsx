import React, { useState } from "react";
import TaskDetailModal from "../Tasks/TaskDetailModal";
import GoogleEventModal from "../Google/GoogleEventModal";
import axios from "axios";

const pastelPalette = [
  { bg: "#f3e5f5", text: "#7b1fa2", border: "#ce93d8" },
  { bg: "#e8f5e9", text: "#2e7d32", border: "#a5d6a7" },
  { bg: "#e3f2fd", text: "#1565c0", border: "#90caf9" },
  { bg: "#fff3e0", text: "#e65100", border: "#ffcc80" },
  { bg: "#fce4ec", text: "#c2185b", border: "#f48fb1" },
  { bg: "#f1f8e9", text: "#558b2f", border: "#c5e1a5" },
  { bg: "#e0f7fa", text: "#00838f", border: "#b2ebf2" },
  { bg: "#fff9c4", text: "#fbc02d", border: "#fff59d" },
  { bg: "#efebe9", text: "#4e342e", border: "#d7ccc8" },
  { bg: "#ede7f6", text: "#4527a0", border: "#d1c4e9" },
];

const TaskCalendar = ({ tasks, setTasks, googleEvents = [], user }) => {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalMode, setModalMode] = useState("view");
  const [selectedGoogleEvent, setSelectedGoogleEvent] = useState(null);

  const token = localStorage.getItem("token");
  const baseURL = import.meta.env.VITE_API_URL;

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
      const dateVal =
        type === "google"
          ? item.start?.dateTime || item.start?.date
          : item.dueDate;
      if (!dateVal) return false;
      const d = new Date(dateVal);
      return (
        d.getDate() === day &&
        d.getMonth() === month &&
        d.getFullYear() === year
      );
    });
  };

  const getCategoryStyle = (catName) => {
    if (!user?.categories)
      return {
        backgroundColor: "#f5f5f5",
        color: "#757575",
        border: "1px solid #e0e0e0",
      };
    const index = user.categories.findIndex(
      (c) => c.name.toLowerCase() === catName?.toLowerCase(),
    );
    const styleIndex = index !== -1 ? index : 0;
    const colors = pastelPalette[styleIndex % pastelPalette.length];
    return {
      backgroundColor: colors.bg,
      color: colors.text,
      border: `1px solid ${colors.border}`,
    };
  };

  const handleUpdateTask = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === updatedTask._id ? updatedTask : t)),
    );
    setSelectedTask(updatedTask);
  };

  const handleDeleteTask = async (taskId, googleId) => {
    try {
      await axios.delete(`${baseURL}/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { googleEventId: googleId },
      });
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      setSelectedTask(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const res = await axios.put(
        `${baseURL}/tasks/${task._id}`,
        { isCompleted: !task.isCompleted },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      handleUpdateTask(res.data);
    } catch (err) {
      console.error("Toggle complete failed", err);
    }
  };

  return (
    <>
      <TaskDetailModal
        show={!!selectedTask}
        task={selectedTask}
        mode={modalMode}
        user={user}
        onClose={() => setSelectedTask(null)}
        onSwitchMode={(newMode) => setModalMode(newMode)}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
        onToggleComplete={handleToggleComplete}
        getCategoryStyle={getCategoryStyle}
      />

      <GoogleEventModal
        event={selectedGoogleEvent}
        onClose={() => setSelectedGoogleEvent(null)}
      />

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
                        className={`small fw-bold ${
                          new Date().getDate() === day &&
                          new Date().getMonth() === month
                            ? "text-primary"
                            : "text-muted"
                        }`}
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
                            cursor: "pointer",
                          }}
                          title={event.summary}
                          onClick={() => setSelectedGoogleEvent(event)}
                        >
                          <span className="me-1">🗓️</span>
                          <strong>{event.summary}</strong>
                        </div>
                      ))}

                      {dayTasks.map((t) => (
                        <div
                          key={t._id}
                          className={`badge ${t.urgency === "now" ? "bg-danger" : "bg-primary"} text-wrap text-start`}
                          style={{
                            fontSize: "0.6rem",
                            padding: "4px",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setSelectedTask(t);
                            setModalMode("view");
                          }}
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
    </>
  );
};

export default TaskCalendar;
