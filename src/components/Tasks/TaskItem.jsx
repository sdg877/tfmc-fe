import { useState } from "react";
import axios from "axios";
import DeleteTask from "./DeleteTask";

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

const TaskItem = ({ task, setTasks, onSelect, user }) => {
  const token = localStorage.getItem("token");
  const baseURL = import.meta.env.VITE_API_URL;

  const toggleStatus = async (e, field, value) => {
    e.stopPropagation();
    try {
      const res = await axios.put(
        `${baseURL}/tasks/${task._id}`,
        { [field]: value },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setTasks((prev) => prev.map((t) => (t._id === task._id ? res.data : t)));
    } catch (err) {
      console.error("Toggle failed", err);
    }
  };

  const handleToggleStar = async (e) => {
    e.stopPropagation();
    try {
      const res = await axios.put(
        `${baseURL}/tasks/${task._id}`,
        { isPlannedForToday: !task.isPlannedForToday },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setTasks((prev) => prev.map((t) => (t._id === task._id ? res.data : t)));
    } catch (err) {
      console.error("Star toggle failed", err);
    }
  };

  const getStyle = () => {
    if (!user || !user.categories) {
      return {
        backgroundColor: "#f8f9fa",
        color: "#6c757d",
        border: "1px solid #dee2e6",
      };
    }
    const index = user.categories.findIndex(
      (c) => c.name.toLowerCase() === task.category?.toLowerCase(),
    );
    const styleIndex = index !== -1 ? index : 0;
    const colors =
      pastelPalette[styleIndex % pastelPalette.length] || pastelPalette[0];

    return {
      backgroundColor: colors.bg,
      color: colors.text,
      border: `1px solid ${colors.border}`,
    };
  };
  const currentStyle = getStyle();

  // Clean evaluation for overdue state
  const isOverdue =
    task.dueDate &&
    !task.isCompleted &&
    new Date(task.dueDate) < new Date().setHours(0, 0, 0, 0);

  const syncToGoogle = async (e) => {
    e.stopPropagation();
    try {
      const res = await axios.post(
        `${baseURL}/users/add-google-event`,
        {
          title: task.title,
          description: task.notes,
          startTime: task.dueDate || new Date().toISOString(),
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const googleId = res.data.id;
      if (!googleId) return;

      const updateRes = await axios.put(
        `${baseURL}/tasks/${task._id}`,
        { googleEventId: googleId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? updateRes.data : t)),
      );
    } catch (err) {
      console.error("Sync Error:", err);
    }
  };

  return (
    // Restricted max-width layout wrapper to make items sleek instead of screen-wide
    <div className="w-100 px-2 d-flex justify-content-center">
      <div
        className={`list-group-item d-flex justify-content-between align-items-center mb-2 shadow-sm border rounded-4 p-3 w-100 ${
          task.isCompleted ? "bg-light opacity-75" : "bg-white"
        }`}
        onClick={() => onSelect(task, "view")}
        style={{ cursor: "pointer", maxWidth: "680px" }}
      >
        <div className="d-flex align-items-center gap-3">
          <div
            onClick={(e) => toggleStatus(e, "isCompleted", !task.isCompleted)}
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              border: task.isCompleted ? "none" : "2px solid #e9ecef",
              backgroundColor: task.isCompleted ? "#9b5de5" : "#f8f9fa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {task.isCompleted && (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="4"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            )}
          </div>

          <div>
            <h6
              className={`mb-0 fw-bold ${task.isCompleted ? "text-decoration-line-through text-muted" : "text-dark"}`}
            >
              {task.title}
            </h6>
            <div className="d-flex align-items-center gap-2 mt-1">
              <span
                className="badge small border-0 text-capitalize"
                style={currentStyle}
              >
                {task.category}
              </span>
              {task.dueDate && (
                <small
                  className={`fw-semibold px-2 py-0.5 rounded ${
                    isOverdue
                      ? "text-warning bg-warning bg-opacity-10 border border-warning border-opacity-20"
                      : "text-muted"
                  }`}
                  style={{ fontSize: "0.78rem" }}
                >
                  📅 {new Date(task.dueDate).toLocaleDateString("en-GB")}{" "}
                  {isOverdue && "• Overdue"}
                </small>
              )}
            </div>
          </div>
        </div>

        <div className="d-flex gap-1 align-items-center">
          <button
            className="btn btn-sm shadow-none p-0 px-2"
            style={{
              color: task.isPlannedForToday ? "#ffc107" : "#dee2e6",
              fontSize: "1.2rem",
            }}
            onClick={handleToggleStar}
          >
            {task.isPlannedForToday ? "★" : "☆"}
          </button>

          {!task.isCompleted && !task.googleEventId && (
            <button
              onClick={syncToGoogle}
              className="btn btn-sm text-success border-0 p-0 px-2"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(task, "edit");
            }}
            className="btn btn-sm text-primary border-0 p-0 px-2"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>

          <DeleteTask
            taskId={task._id}
            googleEventId={task.googleEventId}
            setTasks={setTasks}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
