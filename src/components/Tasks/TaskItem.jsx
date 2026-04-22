import { useState, useEffect } from "react";
import axios from "axios";

const TaskItem = ({ task, setTasks }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    category: task.category || "admin",
    urgency: task.urgency,
    dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
  });

  const token = localStorage.getItem("token");
  const baseURL = import.meta.env.VITE_API_URL;

  const getCalculatedUrgency = (targetDate, manualUrgency) => {
    if (!targetDate) return manualUrgency;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(targetDate);
    due.setHours(0, 0, 0, 0);

    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return "now";
    if (diffDays <= 3) return "soon";
    return manualUrgency;
  };

  const [previewUrgency, setPreviewUrgency] = useState(() =>
    getCalculatedUrgency(task.dueDate, task.urgency),
  );

  useEffect(() => {
    setPreviewUrgency(getCalculatedUrgency(editData.dueDate, editData.urgency));
  }, [editData.dueDate, editData.urgency]);

  const displayUrgency = getCalculatedUrgency(task.dueDate, task.urgency);

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
    try {
      await axios.delete(`${baseURL}/tasks/${task._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) => prev.filter((t) => t._id !== task._id));
    } catch (err) {
      console.error(err);
    }
  };

  if (isEditing) {
    return (
      <form
        onSubmit={handleUpdate}
        className="list-group-item p-3 border-primary shadow-sm bg-light mb-2 rounded"
      >
        <div className="d-flex justify-content-between align-items-center mb-2">
          <input
            className="form-control me-2"
            value={editData.title}
            onChange={(e) =>
              setEditData({ ...editData, title: e.target.value })
            }
            required
          />
          <span
            className={`badge ${
              previewUrgency === "now"
                ? "bg-danger"
                : previewUrgency === "soon"
                  ? "bg-warning text-dark"
                  : "bg-secondary"
            }`}
          >
            Urgency: {previewUrgency}
          </span>
        </div>

        <div className="row g-2 mb-3">
          <div className="col-4">
            <label className="small fw-bold d-block">Category</label>
            <select
              className="form-select form-select-sm"
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
          <div className="col-4">
            <label className="small fw-bold d-block">Urgency</label>
            <select
              className="form-select form-select-sm"
              value={editData.urgency}
              onChange={(e) =>
                setEditData({ ...editData, urgency: e.target.value })
              }
            >
              <option value="later">later</option>
              <option value="soon">soon</option>
              <option value="now">now</option>
            </select>
          </div>
          <div className="col-4">
            <label className="small fw-bold d-block">Due Date</label>
            <input
              type="date"
              className="form-control form-select-sm"
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
            className="btn btn-success btn-sm flex-grow-1 fw-bold"
          >
            Save Changes
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
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
      className={`list-group-item d-flex justify-content-between align-items-center mb-2 shadow-sm border rounded p-3 ${task.isCompleted ? "bg-light opacity-75" : ""}`}
    >
      <div className="d-flex align-items-center gap-3">
        <input
          type="checkbox"
          className="form-check-input mt-0"
          style={{ width: "1.3rem", height: "1.3rem", cursor: "pointer" }}
          checked={task.isCompleted}
          onChange={() => toggleStatus("isCompleted", !task.isCompleted)}
        />

        <div>
          <h6
            className={`mb-0 fw-bold ${task.isCompleted ? "text-decoration-line-through text-muted" : ""}`}
          >
            {task.title}
          </h6>
          <div className="d-flex flex-wrap gap-2 mt-1">
            <span className="badge bg-info text-dark small text-capitalize">
              {task.category || "admin"}
            </span>

            <span
              className={`badge small ${
                displayUrgency === "now"
                  ? "bg-danger"
                  : displayUrgency === "soon"
                    ? "bg-warning text-dark"
                    : "bg-secondary"
              }`}
            >
              {displayUrgency}
            </span>

            {task.dueDate && (
              <small className="text-muted">
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
            className={`btn btn-sm ${task.isPlannedForToday ? "btn-warning shadow-sm" : "btn-outline-secondary border-0"}`}
            title="Do Today"
          >
            ⚡
          </button>
        )}
        <button
          onClick={() => setIsEditing(true)}
          className="btn btn-sm btn-outline-primary border-0 ms-1"
        >
          Edit
        </button>
        <button
          onClick={deleteTask}
          className="btn btn-sm btn-outline-danger border-0"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
