import React, { useState, useEffect } from "react";
import axios from "axios";

const TaskDetailModal = ({
  task,
  show,
  mode,
  onSwitchMode,
  onClose,
  onUpdate,
  onDelete,
  onToggleComplete,
  getCategoryStyle,
  user,
}) => {
  const [editData, setEditData] = useState({});
  const [eventTime, setEventTime] = useState("");
  const [duration, setDuration] = useState(30);
  const [showGoogleTime, setShowGoogleTime] = useState(false);

  const baseURL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const isGoogleLinked = user?.googleConnected;

  useEffect(() => {
    if (task) {
      setEditData({
        ...task,
        dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
      });
      if (task.dueDate) {
        setEventTime(`${task.dueDate.split("T")[0]}T09:00`);
      }
      setShowGoogleTime(false);
    }
  }, [task]);

  if (!show || !task) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "dueDate" && value) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const due = new Date(value);
      due.setHours(0, 0, 0, 0);
      const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
      const urgency = diffDays <= 0 ? "now" : diffDays <= 3 ? "soon" : "later";
      setEditData((prev) => ({ ...prev, dueDate: value, urgency }));
      const timePart = eventTime.includes("T")
        ? eventTime.split("T")[1]
        : "09:00";
      setEventTime(`${value}T${timePart}`);
      return;
    }

    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const gId = task.googleEventId;

      if (gId && gId !== "undefined" && showGoogleTime && eventTime) {
        const start = new Date(eventTime);
        const end = new Date(start.getTime() + duration * 60000);
        await axios.put(
          `${baseURL}/users/calendar/update`,
          {
            eventId: gId,
            title: editData.title,
            description: editData.notes || "",
            startTime: start.toISOString(),
            endTime: end.toISOString(),
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      }

      const res = await axios.put(
        `${baseURL}/tasks/${task._id}`,
        {
          title: editData.title,
          category: editData.category,
          urgency: editData.urgency,
          dueDate: editData.dueDate,
          notes: editData.notes,
          isStarred: editData.isStarred,
          isPlannedForToday: editData.isPlannedForToday,
          googleEventId: task.googleEventId,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      onUpdate(res.data);
      onSwitchMode("view"); // Return to view mode after saving
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save changes. Check console for details.");
    }
  };

  const handleStar = async (e) => {
    e.stopPropagation();
    const newStatus = !editData.isStarred;
    try {
      const res = await axios.put(
        `${baseURL}/tasks/${task._id}`,
        { isStarred: newStatus, isPlannedForToday: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      onUpdate(res.data);
      setEditData((prev) => ({
        ...prev,
        isStarred: newStatus,
        isPlannedForToday: newStatus,
      }));
    } catch (err) {
      console.error("Star toggle failed", err);
    }
  };

  const categoryOptions = user?.categories?.map((c) => c.name) || [
    "admin",
    "physical",
    "social",
    "focus",
    "stress",
  ];

  const catStyle = getCategoryStyle(task.category);

  // ─── VIEW MODE ────────────────────────────────────────────────────────────
  const ViewContent = () => (
    <>
      <div className="modal-header border-0 p-4 pb-0 d-flex align-items-start justify-content-between">
        <div className="d-flex align-items-center gap-3">
          {/* Complete toggle */}
          <div
            onClick={() => onToggleComplete(task)}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              border: task.isCompleted ? "none" : "2px solid #dee2e6",
              backgroundColor: task.isCompleted ? "#9b5de5" : "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
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
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
          <h3
            className={`modal-title fw-bold mb-0 ${
              task.isCompleted ? "text-muted text-decoration-line-through" : ""
            }`}
          >
            {task.title}
          </h3>
        </div>
        <button className="btn-close shadow-none" onClick={onClose} />
      </div>

      <div className="modal-body p-4">
        {/* Category + Urgency badges */}
        <div className="d-flex gap-2 mb-3 flex-wrap">
          <span
            className="badge border-0 text-capitalize px-3 py-2"
            style={catStyle}
          >
            {task.category}
          </span>
          {task.urgency && (
            <span className="badge bg-light text-dark border text-capitalize px-3 py-2">
              {task.urgency}
            </span>
          )}
          {task.dueDate && (
            <span className="badge bg-light text-dark border px-3 py-2">
              📅{" "}
              {new Date(task.dueDate).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          )}
        </div>

        {/* Notes */}
        <label className="small fw-bold text-muted text-uppercase mb-1 d-block">
          Notes
        </label>
        <p
          className="bg-light p-3 rounded-3 mb-3"
          style={{ whiteSpace: "pre-wrap", minHeight: "80px" }}
        >
          {task.notes || "No additional notes provided."}
        </p>

        {/* Google status */}
        {task.googleEventId && (
          <div className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill">
            ✓ Synced with Google Calendar
          </div>
        )}
      </div>

      <div className="modal-footer border-0 bg-light p-3 d-flex gap-2">
        <button
          className={`btn rounded-pill px-3 fw-bold ${
            task.isStarred ? "btn-warning text-white" : "btn-outline-secondary"
          }`}
          onClick={handleStar}
        >
          {task.isStarred ? "★ Today" : "☆ Today"}
        </button>

        <button
          className="btn btn-dark rounded-pill flex-grow-1 fw-bold"
          onClick={() => onSwitchMode("edit")}
        >
          Edit Details
        </button>

        <button
          className="btn btn-outline-danger border-0"
          onClick={() => onDelete(task._id, task.googleEventId)}
          title="Delete task"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </>
  );

  // ─── EDIT MODE ────────────────────────────────────────────────────────────
  const EditContent = () => (
    <>
      <div className="modal-header border-0 p-4 pb-2 d-flex align-items-center gap-2">
        <input
          name="title"
          className="form-control form-control-lg fw-bold border-0 bg-light shadow-none"
          value={editData.title || ""}
          onChange={handleChange}
          placeholder="Task Title"
        />
        <button
          className="btn-close ms-1 shadow-none flex-shrink-0"
          onClick={onClose}
        />
      </div>

      <div className="modal-body p-4 pt-2">
        {/* Category & Urgency */}
        <div className="row g-2 mb-3">
          <div className="col-6">
            <label className="small fw-bold text-muted text-uppercase mb-1 d-block">
              Category
            </label>
            <select
              name="category"
              className="form-select bg-light border-0 fw-bold shadow-none text-capitalize"
              value={editData.category || ""}
              onChange={handleChange}
            >
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="col-6">
            <label className="small fw-bold text-muted text-uppercase mb-1 d-block">
              Urgency
            </label>
            <select
              name="urgency"
              className="form-select bg-light border-0 fw-bold shadow-none"
              value={editData.urgency || "soon"}
              onChange={handleChange}
            >
              <option value="later">Later</option>
              <option value="soon">Soon</option>
              <option value="now">Now</option>
            </select>
          </div>
        </div>

        {/* Due Date */}
        <div className="mb-3">
          <label className="small fw-bold text-muted text-uppercase mb-1 d-block">
            Due Date
          </label>
          <input
            type="date"
            name="dueDate"
            className="form-control bg-light border-0 shadow-none"
            value={editData.dueDate || ""}
            onChange={handleChange}
          />
        </div>

        {/* Notes */}
        <div className="mb-3">
          <label className="small fw-bold text-muted text-uppercase mb-1 d-block">
            Notes / Description
          </label>
          <textarea
            name="notes"
            className="form-control bg-light border-0 shadow-none"
            rows="4"
            value={editData.notes || ""}
            onChange={handleChange}
            placeholder="Add details or notes here..."
          />
        </div>

        {/* Google Calendar */}
        <div
          className={`p-3 rounded-3 border-start border-4 ${
            task.googleEventId
              ? "bg-success-subtle border-success"
              : isGoogleLinked
                ? "bg-light border-primary"
                : "bg-warning-subtle border-warning"
          }`}
        >
          {task.googleEventId ? (
            <>
              <div className="d-flex align-items-center justify-content-between">
                <span className="small fw-bold text-success">
                  ✓ Synced with Google Calendar
                </span>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-success py-0 px-2"
                  onClick={() => setShowGoogleTime((v) => !v)}
                >
                  {showGoogleTime ? "Cancel" : "Update Time"}
                </button>
              </div>
              {showGoogleTime && (
                <div className="row g-2 mt-2">
                  <div className="col-8">
                    <label className="small fw-bold text-muted text-uppercase mb-1 d-block">
                      New Start Time
                    </label>
                    <input
                      type="datetime-local"
                      className="form-control border-0 bg-white shadow-sm"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                    />
                  </div>
                  <div className="col-4">
                    <label className="small fw-bold text-muted text-uppercase mb-1 d-block">
                      Duration
                    </label>
                    <select
                      className="form-select border-0 bg-white shadow-sm"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                    >
                      <option value={15}>15m</option>
                      <option value={30}>30m</option>
                      <option value={45}>45m</option>
                      <option value={60}>1h</option>
                      <option value={120}>2h</option>
                    </select>
                  </div>
                </div>
              )}
            </>
          ) : (
            <span className="small fw-bold text-muted">
              {isGoogleLinked
                ? "Not synced to Google Calendar"
                : "Google Calendar not connected"}
            </span>
          )}
        </div>
      </div>

      <div className="modal-footer border-0 bg-light p-3 d-flex gap-2">
        {/* Back to view */}
        <button
          className="btn btn-outline-secondary rounded-pill px-3 fw-bold"
          onClick={() => onSwitchMode("view")}
        >
          ← Back
        </button>

        <button
          className="btn btn-dark rounded-pill flex-grow-1 fw-bold"
          onClick={handleSave}
        >
          Save Changes
        </button>

        <button
          className="btn btn-outline-danger border-0"
          onClick={() => onDelete(task._id, task.googleEventId)}
          title="Delete task"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </>
  );

  return (
    <div
      className="modal fade show d-block"
      style={{
        backgroundColor: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        zIndex: 1060,
      }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-dialog-scrollable"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          {mode === "edit" ? <EditContent /> : <ViewContent />}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
