import { useState, useEffect } from "react";
import axios from "axios";

const AddTask = ({ onTaskAdded, user }) => {
  const getNextWholeHour = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    now.setMinutes(0);
    return now.toTimeString().slice(0, 5);
  };

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    urgency: "soon",
    dueDate: "",
    energyPoints: 0,
    notes: "",
  });

  const [showNotesField, setShowNotesField] = useState(false);
  const [syncToGoogle, setSyncToGoogle] = useState(false);
  const [eventTime, setEventTime] = useState("");
  const [duration, setDuration] = useState(30);

  const isGoogleLinked = user?.googleConnected;

  const getSelectedCategoryWeight = () => {
    const found = user?.categories?.find((c) => c.name === formData.category);
    return found ? found.weight : 0;
  };

  useEffect(() => {
    if (formData.dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const due = new Date(formData.dueDate);
      due.setHours(0, 0, 0, 0);

      const diffTime = due - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) {
        setFormData((prev) => ({ ...prev, urgency: "now" }));
      } else if (diffDays <= 3) {
        setFormData((prev) => ({ ...prev, urgency: "soon" }));
      } else {
        setFormData((prev) => ({ ...prev, urgency: "later" }));
      }

      const currentTimePart = eventTime.includes("T")
        ? eventTime.split("T")[1]
        : getNextWholeHour();

      setEventTime(`${formData.dueDate}T${currentTimePart}`);
    }
  }, [formData.dueDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const baseURL = import.meta.env.VITE_API_URL;

    const start = new Date(eventTime);
    const end = new Date(start.getTime() + duration * 60000);
    const taskCost = getSelectedCategoryWeight();

    try {
      const taskRes = await axios.post(
        `${baseURL}/tasks`,
        { ...formData, energyRequired: taskCost },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      let finalTask = taskRes.data;

      if (syncToGoogle && eventTime && isGoogleLinked) {
        const googleRes = await axios.post(
          `${baseURL}/users/calendar/add`,
          {
            title: formData.title,
            description: formData.notes,
            startTime: start.toISOString(),
            endTime: end.toISOString(),
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        const googleId = googleRes.data.id;

        if (googleId) {
          const updateRes = await axios.put(
            `${baseURL}/tasks/${finalTask._id}`,
            { googleEventId: googleId },
            { headers: { Authorization: `Bearer ${token}` } },
          );
          finalTask = updateRes.data;
        }
      }

      onTaskAdded(finalTask);

      setFormData({
        title: "",
        category: "",
        urgency: "soon",
        dueDate: "",
        energyPoints: 0,
        notes: "",
      });
      setSyncToGoogle(false);
      setEventTime("");
      setShowNotesField(false);
    } catch (err) {
      console.error("Task Creation Error:", err);
      alert(err.response?.data?.message || "Failed to create task.");
    }
  };

  const taskCost = getSelectedCategoryWeight();
  const remainingEnergy = (user?.dailyEnergyLimit || 100) - taskCost;

  return (
    <form onSubmit={handleSubmit} className="p-2 bg-white">
      <div className="mb-3">
        <label className="small fw-bold text-muted text-uppercase ls-wide mb-2 d-block">
          Task Description
        </label>
        <input
          className="form-control form-control-lg border-0 bg-light rounded-3 shadow-none"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="What are we doing?"
          required
        />
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <label className="small fw-bold text-muted text-uppercase ls-wide mb-2 d-block">
            Category
          </label>
          <select
            className="form-select border-0 bg-light py-2 shadow-none text-capitalize"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            required
          >
            <option value="" disabled>
              Select intensity...
            </option>
            {user?.categories?.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name} ({cat.weight} pts)
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label className="small fw-bold text-muted text-uppercase ls-wide mb-2 d-block">
            Due Date
          </label>
          <input
            type="date"
            className="form-control border-0 bg-light py-2 shadow-none"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
          />
        </div>

        <div className="col-md-3">
          <label className="small fw-bold text-muted text-uppercase ls-wide mb-2 d-block">
            Urgency
          </label>
          <select
            className="form-select border-0 bg-light py-2 shadow-none"
            value={formData.urgency}
            onChange={(e) =>
              setFormData({ ...formData, urgency: e.target.value })
            }
          >
            <option value="later">Later</option>
            <option value="soon">Soon</option>
            <option value="now">Now</option>
          </select>
        </div>
      </div>

      {!showNotesField ? (
        <button
          type="button"
          className="btn btn-link btn-sm text-decoration-none p-0 mb-3 text-muted fw-bold"
          onClick={() => setShowNotesField(true)}
        >
          + Add notes/details
        </button>
      ) : (
        <div className="mb-3">
          <textarea
            className="form-control border-0 bg-light rounded-3 shadow-none"
            rows="2"
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            placeholder="Add extra context..."
          />
        </div>
      )}

      <div
        className={`p-3 rounded-3 mb-4 border-start border-4 shadow-sm ${isGoogleLinked ? "bg-light border-primary" : "bg-warning-subtle border-warning"}`}
      >
        <div className="form-check form-switch mb-2">
          <input
            className="form-check-input shadow-none"
            type="checkbox"
            id="googleSync"
            checked={syncToGoogle}
            disabled={!isGoogleLinked}
            onChange={(e) => setSyncToGoogle(e.target.checked)}
          />
          <label
            className={`form-check-label fw-bold small ${isGoogleLinked ? "text-dark" : "text-muted"}`}
            htmlFor="googleSync"
          >
            {isGoogleLinked
              ? "SYNC TO GOOGLE CALENDAR"
              : "GOOGLE CALENDAR DISCONNECTED"}
          </label>
        </div>

        {syncToGoogle && isGoogleLinked && (
          <div className="mt-2 row g-2">
            <div className="col-8">
              <label className="small fw-bold text-muted text-uppercase ls-wide mb-1 d-block">
                Start Time
              </label>
              <input
                type="datetime-local"
                className="form-control border-0 bg-white shadow-sm"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                required={syncToGoogle}
              />
            </div>
            <div className="col-4">
              <label className="small fw-bold text-muted text-uppercase ls-wide mb-1 d-block">
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
      </div>

      <button className="btn btn-dark w-100 py-3 rounded-pill fw-bold d-flex justify-content-between align-items-center px-4">
        <span>Create Task</span>
        {taskCost > 0 && (
          <span
            className="badge bg-secondary rounded-pill small"
            style={{ fontSize: "0.7rem" }}
          >
            -{taskCost} pts (Rem: {remainingEnergy})
          </span>
        )}
      </button>
    </form>
  );
};

export default AddTask;
