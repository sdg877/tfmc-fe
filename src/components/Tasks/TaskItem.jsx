import { useState } from "react";
import axios from "axios";

const categoryStyles = {
  admin: {
    backgroundColor: "#f3e5f5",
    color: "#7b1fa2",
    border: "1px solid #ce93d8",
  },
  physical: {
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
    border: "1px solid #a5d6a7",
  },
  social: {
    backgroundColor: "#e3f2fd",
    color: "#1565c0",
    border: "1px solid #90caf9",
  },
  focus: {
    backgroundColor: "#fff3e0",
    color: "#e65100",
    border: "1px solid #ffcc80",
  },
  stress: {
    backgroundColor: "#fce4ec",
    color: "#c2185b",
    border: "1px solid #f48fb1",
  },
  default: {
    backgroundColor: "#f5f5f5",
    color: "#757575",
    border: "1px solid #e0e0e0",
  },
};

const TaskItem = ({ task, setTasks, showEnergyBar }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    category: task.category || "admin",
    urgency: task.urgency,
    dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
    energyPoints: task.energyPoints || 1,
  });

  const token = localStorage.getItem("token");
  const baseURL = import.meta.env.VITE_API_URL;

  const toggleStatus = async (field, value) => {
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${baseURL}/tasks/${task._id}`, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) => prev.map((t) => (t._id === task._id ? res.data : t)));
      setIsEditing(false);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const deleteTask = async () => {
    if (window.confirm("Delete this task?")) {
      try {
        await axios.delete(`${baseURL}/tasks/${task._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks((prev) => prev.filter((t) => t._id !== task._id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (isEditing) {
    return (
      <form
        onSubmit={handleUpdate}
        className="list-group-item p-3 border-primary shadow-sm bg-light mb-2 rounded-4"
      >
        <input
          className="form-control mb-2 rounded-3"
          value={editData.title}
          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
          required
        />
        <div className="row g-2 mb-3">
          <div className="col-6">
            <select
              className="form-select form-select-sm rounded-3"
              value={editData.category}
              onChange={(e) =>
                setEditData({ ...editData, category: e.target.value })
              }
            >
              <option value="admin">Admin</option>
              <option value="physical">Physical</option>
              <option value="social">Social</option>
              <option value="focus">Focus</option>
              <option value="stress">Stress</option>
            </select>
          </div>
          <div className="col-6">
            <input
              type="date"
              className="form-control form-select-sm rounded-3"
              value={editData.dueDate}
              onChange={(e) =>
                setEditData({ ...editData, dueDate: e.target.value })
              }
            />
          </div>
        </div>
        <div className="d-flex gap-2">
          <button
            type="submit"
            className="btn btn-success btn-sm flex-grow-1 rounded-3 fw-bold"
          >
            Save
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm rounded-3"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div
      className={`list-group-item d-flex justify-content-between align-items-center mb-2 shadow-sm border rounded-4 p-3 ${task.isCompleted ? "bg-light opacity-75" : "bg-white"}`}
    >
      <div className="d-flex align-items-center gap-3">
        <div
          onClick={() => toggleStatus("isCompleted", !task.isCompleted)}
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            border: task.isCompleted ? "none" : "2px solid #e9ecef",
            backgroundColor: task.isCompleted ? "#9b5de5" : "#f8f9fa",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: task.isCompleted
              ? "0 4px 12px rgba(155, 93, 229, 0.3)"
              : "inset 0 1px 2px rgba(0,0,0,0.05)",
          }}
        >
          {task.isCompleted ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : (
            <div
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                backgroundColor: "#dee2e6",
              }}
            ></div>
          )}
        </div>

        <div>
          <h6
            className={`mb-0 fw-bold ${task.isCompleted ? "text-decoration-line-through text-muted" : "text-dark"}`}
          >
            {task.title}
          </h6>
          <div className="d-flex flex-wrap gap-2 mt-1">
            <span
              className="badge small border-0"
              style={categoryStyles[task.category] || categoryStyles.default}
            >
              {task.category}
            </span>
            {task.dueDate && (
              <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                📅 {new Date(task.dueDate).toLocaleDateString("en-GB")}
              </small>
            )}
          </div>
        </div>
      </div>

      <div className="d-flex gap-1 align-items-center">
        {!task.isCompleted && (
          <button
            onClick={() =>
              toggleStatus("isPlannedForToday", !task.isPlannedForToday)
            }
            className="btn btn-sm border-0 fs-5 p-0 px-2"
            style={{ color: task.isPlannedForToday ? "#ffc107" : "#e0e0e0" }}
            title="Star this for today"
          >
            {task.isPlannedForToday ? "★" : "☆"}
          </button>
        )}

        {/* ICON BUTTON FOR EDIT */}
        <button
          onClick={() => setIsEditing(true)}
          className="btn btn-sm text-primary border-0 opacity-50 p-0 px-2"
          title="Edit task"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>

        <button
          onClick={deleteTask}
          className="btn btn-sm text-danger border-0 opacity-50 p-0 px-2"
          title="Delete task"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
