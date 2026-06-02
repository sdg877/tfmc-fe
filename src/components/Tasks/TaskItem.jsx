import { useState } from "react";
import axios from "axios";
import DeleteTask from "./DeleteTask";

const pastelPalette = [
  { bg: "#f3e5f5", text: "#7b1fa2", border: "#ce93d8" },
  { bg: "#e8f5e9", text: "#2e7d32", border: "#a5d6a7" },
  { bg: "#e3f2fd", text: "#1565c0", border: "#90caf9" },
  { bg: "#fff3e0", text: "#e65100", border: "#ffcc80" },
  { bg: "#fce4ec", text: "#c2185b", border: "#f48fb1" },
  { bg: "#e0f7fa", text: "#00838f", border: "#4dd0e1" },
  { bg: "#fff9c4", text: "#fbc02d", border: "#fff176" },
  { bg: "#fbe9e7", text: "#d84315", border: "#ffab91" },
  { bg: "#ede7f6", text: "#4527a0", border: "#b39ddb" },
  { bg: "#f1f8e9", text: "#33691e", border: "#9ccc65" },
];

const TaskItem = ({ task, setTasks, onSelect, user }) => {
  const token = localStorage.getItem("token");
  const baseURL = import.meta.env.VITE_API_URL;
  const [syncing, setSyncing] = useState(false);

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
        borderColor: "#dee2e6",
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
      borderColor: colors.border,
    };
  };
  const currentStyle = getStyle();

  const isOverdue =
    task.dueDate &&
    !task.isCompleted &&
    new Date(task.dueDate) < new Date().setHours(0, 0, 0, 0);

  const syncToGoogle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (syncing) return;

    try {
      setSyncing(true);
      const res = await axios.post(
        `${baseURL}/users/add-google-event`,
        {
          title: task.title,
          description: task.notes || "Added from The Fast Minds Club",
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
    } finally {
      setSyncing(false);
    }
  };

  const postItStyle = {
    cursor: "pointer",
    backgroundColor: task.isCompleted
      ? "#e9ecef"
      : currentStyle.backgroundColor,
    color: task.isCompleted ? "#6c757d" : currentStyle.color,
    // Restored the dynamic border line to map cleanly to category properties
    border: `2px solid ${task.isCompleted ? "#ced4da" : currentStyle.borderColor}`,
    boxShadow: "2px 4px 10px rgba(0, 0, 0, 0.06)",
    aspectRatio: "1 / 1",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    opacity: task.isCompleted ? 0.6 : 1,
    transform: task.isCompleted ? "none" : "rotate(-1deg)",
    fontFamily: "var(--bs-font-sans-serif)",
  };

  return (
    <div
      className="p-3 rounded-3"
      onClick={() => onSelect(task, "view")}
      style={postItStyle}
    >
      <div className="d-flex justify-content-between align-items-start w-100">
        <div
          onClick={(e) => toggleStatus(e, "isCompleted", !task.isCompleted)}
          style={{
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            border: task.isCompleted ? "none" : "2px solid currentColor",
            backgroundColor: task.isCompleted ? "#6b7280" : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "all 0.2s ease",
          }}
        >
          {task.isCompleted && (
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="4"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          )}
        </div>

        <button
          className="btn btn-link btn-sm shadow-none p-0 border-0 text-decoration-none"
          style={{
            color: task.isPlannedForToday ? "#e65100" : "rgba(0,0,0,0.15)",
            fontSize: "1.2rem",
            lineHeight: "1",
            marginTop: "-6px",
          }}
          onClick={handleToggleStar}
        >
          {task.isPlannedForToday ? "★" : "☆"}
        </button>
      </div>

      <div className="flex-grow-1 overflow-hidden my-2 w-100">
        <h6
          className={`fw-bold text-dark mb-1 lh-sm ${task.isCompleted ? "text-decoration-line-through text-muted" : ""}`}
          style={{
            display: "-webkit-box",
            WebkitLineClamp: "3",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            fontSize: "0.95rem",
          }}
        >
          {task.title}
        </h6>
      </div>

      <div className="w-100 mt-auto">
        {task.dueDate && (
          <div className="mb-2">
            <small
              className={`fw-bold px-1.5 py-0.5 rounded ${
                isOverdue
                  ? "text-danger bg-danger bg-opacity-10"
                  : "text-muted opacity-75"
              }`}
              style={{ fontSize: "0.68rem" }}
            >
              📅 {new Date(task.dueDate).toLocaleDateString("en-GB")}
              {isOverdue && " • Overdue"}
            </small>
          </div>
        )}

        <div
          className="d-flex justify-content-end align-items-center gap-2 border-top pt-2"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {!task.isCompleted && (
            <button
              onClick={syncToGoogle}
              disabled={syncing}
              className={`btn btn-link btn-sm p-0 border-0 ${task.googleEventId ? "text-success opacity-50" : "text-muted"}`}
              style={{ color: "inherit" }}
              title={task.googleEventId ? "Synced" : "Sync Calendar"}
            >
              <svg
                width="14"
                height="14"
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
              e.preventDefault();
              onSelect(task, "edit");
            }}
            className="btn btn-link btn-sm text-muted p-0 border-0"
            style={{ color: "inherit" }}
          >
            <svg
              width="14"
              height="14"
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
