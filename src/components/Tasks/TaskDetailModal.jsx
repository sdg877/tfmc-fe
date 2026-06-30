import React, { useState, useEffect } from "react";
import axios from "axios";

// ─── SUB-COMPONENTS ───

const ViewContent = ({
  task,
  onToggleComplete,
  onClose,
  catStyle,
  handleStar,
  onSwitchMode,
  onDelete,
}) => (
  <>
    <div className="modal-header border-0 p-4 pb-0 d-flex align-items-start justify-content-between">
      <div className="d-flex align-items-center gap-3">
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
          className={`modal-title fw-bold mb-0 ${task.isCompleted ? "text-muted text-decoration-line-through" : ""}`}
        >
          {task.title}
        </h3>
      </div>
      <button
        type="button"
        className="btn-close shadow-none"
        onClick={onClose}
        aria-label="Close"
      />
    </div>

    <div className="modal-body p-4">
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
            📅 {new Date(task.dueDate).toLocaleDateString("en-GB")}
          </span>
        )}
      </div>
      <label className="small fw-bold text-muted text-uppercase mb-1 d-block">
        Notes
      </label>
      <p
        className="bg-light p-3 rounded-3 mb-3"
        style={{ whiteSpace: "pre-wrap", minHeight: "80px" }}
      >
        {task.notes || "No additional notes provided."}
      </p>
      {task.googleEventId && (
        <div className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill">
          ✓ Synced with Google Calendar
        </div>
      )}
    </div>

    <div className="modal-footer border-0 bg-light p-3 d-flex gap-2">
      <button
        type="button"
        className="btn rounded-pill px-3 fw-bold d-flex align-items-center justify-content-center shadow-sm"
        style={{
          backgroundColor: task.isPlannedForToday ? "#ffc107" : "#f8f9fa",
          border: task.isPlannedForToday
            ? "2px solid #ffc107"
            : "2px solid #dee2e6",
          color: task.isPlannedForToday ? "white" : "#6c757d",
          minWidth: "54px",
          height: "42px",
        }}
        onClick={handleStar}
      >
        <span style={{ fontSize: "1.4rem", lineHeight: "1" }}>
          {task.isPlannedForToday ? "★" : "☆"}
        </span>
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

const EditContent = ({
  editData,
  handleChange,
  onClose,
  categoryOptions,
  showGoogleTime,
  setShowGoogleTime,
  eventTime,
  setEventTime,
  duration,
  setDuration,
  onSwitchMode,
  handleSave,
  task,
  user,
  syncToGoogle,
  setSyncToGoogle,
}) => (
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
        type="button"
        className="btn-close ms-1 shadow-none flex-shrink-0"
        onClick={onClose}
        aria-label="Close"
      />
    </div>

    <div className="modal-body p-4 pt-2">
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
                {cat}
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
        />
      </div>

      {/* CASE 1: Task is already linked to Google Calendar */}
      {task.googleEventId && (
        <div className="p-3 rounded-3 border-start border-4 bg-success-subtle border-success">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="small fw-bold text-success">
              ✓ Google Calendar Sync Active
            </span>
            <button
              type="button"
              className="btn btn-sm btn-outline-success"
              onClick={() => setShowGoogleTime(!showGoogleTime)}
            >
              {showGoogleTime ? "Cancel" : "Update Time/Duration"}
            </button>
          </div>
          {showGoogleTime && (
            <div className="row g-2">
              <div className="col-8">
                <input
                  type="datetime-local"
                  className="form-control form-control-sm"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                />
              </div>
              <div className="col-4">
                <select
                  className="form-select form-select-sm"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                >
                  <option value={15}>15m</option>
                  <option value={30}>30m</option>
                  <option value={60}>1h</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CASE 2: Task has no event yet, but Google account is connected */}
      {!task.googleEventId && user?.googleConnected && (
        <div className="p-3 rounded-3 border-start border-4 bg-light border-primary shadow-sm">
          <div className="form-check form-switch mb-2">
            <input
              className="form-check-input shadow-none"
              type="checkbox"
              id="modalGoogleSync"
              checked={syncToGoogle}
              onChange={(e) => setSyncToGoogle(e.target.checked)}
            />
            <label
              className="form-check-label fw-bold small text-dark"
              htmlFor="modalGoogleSync"
            >
              SYNC TO GOOGLE CALENDAR
            </label>
          </div>

          {syncToGoogle && (
            <div className="mt-2 row g-2">
              <div className="col-8">
                <label
                  className="small fw-bold text-muted text-uppercase mb-1 d-block"
                  style={{ fontSize: "0.7rem" }}
                >
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  className="form-control form-control-sm"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                />
              </div>
              <div className="col-4">
                <label
                  className="small fw-bold text-muted text-uppercase mb-1 d-block"
                  style={{ fontSize: "0.7rem" }}
                >
                  Duration
                </label>
                <select
                  className="form-select form-select-sm"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                >
                  <option value={15}>15m</option>
                  <option value={30}>30m</option>
                  <option value={60}>1h</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}
    </div>

    <div className="modal-footer border-0 bg-light p-3 d-flex gap-2">
      <button
        type="button"
        className="btn btn-outline-secondary rounded-pill px-3 fw-bold"
        onClick={() => onSwitchMode("view")}
      >
        ← Back
      </button>
      <button
        type="button"
        className="btn btn-dark rounded-pill flex-grow-1 fw-bold"
        onClick={handleSave}
      >
        Save Changes
      </button>
    </div>
  </>
);

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
  const [syncToGoogle, setSyncToGoogle] = useState(false); // Added missing hook

  const baseURL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (task) {
      const formattedDate = task.dueDate ? task.dueDate.split("T")[0] : "";
      setEditData({ ...task, dueDate: formattedDate });
      setSyncToGoogle(false); // Reset toggle state per task selection

      if (formattedDate) {
        setEventTime(`${formattedDate}T09:00`);
      }
    }
  }, [task]);

  if (!show || !task) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...editData, [name]: value };

    if (name === "dueDate") {
      const timePart = eventTime.includes("T")
        ? eventTime.split("T")[1]
        : "09:00";
      setEventTime(`${value}T${timePart}`);

      const today = new Date().toISOString().split("T")[0];
      if (value === today) {
        updatedData.urgency = "now";
      }
    }

    setEditData(updatedData);
  };

  const handleSave = async () => {
    try {
      let updatedGoogleEventId = editData.googleEventId;

      // Scenario A: Existing sync setup being edited
      if (task.googleEventId) {
        let start, end;
        if (showGoogleTime && eventTime) {
          start = new Date(eventTime);
          end = new Date(start.getTime() + duration * 60000);
        } else {
          start = new Date(`${editData.dueDate}T09:00`);
          end = new Date(start.getTime() + 30 * 60000);
        }

        await axios.put(
          `${baseURL}/users/calendar/update`,
          {
            eventId: task.googleEventId,
            title: editData.title,
            startTime: start.toISOString(),
            endTime: end.toISOString(),
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      }
      // Scenario B: Quick added task now generating its initial sync event
      else if (syncToGoogle && eventTime && user?.googleConnected) {
        const start = new Date(eventTime);
        const end = new Date(start.getTime() + duration * 60000);

        const googleRes = await axios.post(
          `${baseURL}/users/calendar/add`,
          {
            title: editData.title,
            description: editData.notes,
            startTime: start.toISOString(),
            endTime: end.toISOString(),
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (googleRes.data?.id) {
          updatedGoogleEventId = googleRes.data.id;
        }
      }

      const res = await axios.put(
        `${baseURL}/tasks/${task._id}`,
        {
          ...editData,
          googleEventId: updatedGoogleEventId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      onUpdate(res.data);
      onSwitchMode("view");
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const handleStar = async () => {
    try {
      const res = await axios.put(
        `${baseURL}/tasks/${task._id}`,
        { isPlannedForToday: !task.isPlannedForToday },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      onUpdate(res.data);
    } catch (err) {
      console.error("Modal star failed", err);
    }
  };

  const categoryOptions = user?.categories?.map((c) => c.name) || [
    "admin",
    "physical",
    "social",
    "focus",
    "stress",
  ];

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
          {mode === "edit" ? (
            <EditContent
              editData={editData}
              handleChange={handleChange}
              onClose={onClose}
              categoryOptions={categoryOptions}
              showGoogleTime={showGoogleTime}
              setShowGoogleTime={setShowGoogleTime}
              eventTime={eventTime}
              setEventTime={setEventTime}
              duration={duration}
              setDuration={setDuration}
              onSwitchMode={onSwitchMode}
              handleSave={handleSave}
              task={task}
              user={user}
              syncToGoogle={syncToGoogle}
              setSyncToGoogle={setSyncToGoogle} // Passed required props down
            />
          ) : (
            <ViewContent
              task={task}
              onToggleComplete={onToggleComplete}
              onClose={onClose}
              catStyle={getCategoryStyle(task.category)}
              handleStar={handleStar}
              onSwitchMode={onSwitchMode}
              onDelete={onDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
