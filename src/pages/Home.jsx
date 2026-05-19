import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AppLoader from "../components/Layout/AppLoader";
import TaskDetailModal from "../components/Tasks/TaskDetailModal";

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

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalMode, setModalMode] = useState("view");
  const token = localStorage.getItem("token");

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

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

  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        try {
          const baseURL = import.meta.env.VITE_API_URL;
          const [resTasks, resUser] = await Promise.all([
            axios.get(`${baseURL}/tasks`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${baseURL}/users/profile`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

          setTasks(resTasks.data);
          setUser(resUser.data);
          setUserName(resUser.data.name || "");
          setLoading(false);
        } catch (err) {
          console.error("Fetch error", err);
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [token]);

  const handleUpdateTask = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === updatedTask._id ? updatedTask : t)),
    );
    setSelectedTask(updatedTask);
  };

  const handleDeleteTask = async (taskId, googleId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/tasks/${taskId}`, {
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
        `${import.meta.env.VITE_API_URL}/tasks/${task._id}`,
        { isCompleted: !task.isCompleted },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      handleUpdateTask(res.data);
    } catch (err) {
      console.error("Toggle complete failed", err);
    }
  };

  const todayLocal = new Date().toLocaleDateString("sv-SE");

  const overdue = tasks.filter(
    (t) =>
      !t.isCompleted &&
      t.dueDate &&
      new Date(t.dueDate) < new Date().setHours(0, 0, 0, 0),
  );

  const dueToday = tasks.filter(
    (t) =>
      !t.isCompleted &&
      (t.urgency === "now" ||
        t.isPlannedForToday === true ||
        (t.dueDate &&
          new Date(t.dueDate).toLocaleDateString("sv-SE") === todayLocal)),
  );

  const completedToday = tasks.filter(
    (t) =>
      t.isCompleted &&
      t.completedAt &&
      new Date(t.completedAt).toLocaleDateString("sv-SE") === todayLocal,
  );

  if (!token) {
    return (
      <div className="container mt-5 py-5 text-center">
        <h1 className="display-3 fw-bold text-dark mb-4">
          Master your energy.
        </h1>
        <p className="lead text-muted mb-5">
          Track your Brain Load and prevent burnout.
        </p>
        <div className="d-flex gap-3 justify-content-center">
          <Link
            to="/signup"
            className="btn btn-dark btn-lg rounded-pill px-5 fw-bold shadow"
          >
            Join Now
          </Link>
          <Link
            to="/login"
            className="btn btn-outline-dark btn-lg rounded-pill px-5 fw-bold"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <AppLoader message="Just a sec..." />;
  }

  return (
    <div className="container py-4" style={{ maxWidth: "900px" }}>
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

      <header className="mb-5">
        <h1 className="fw-bold text-dark mb-1">
          {greeting}
          {userName ? `, ${userName}` : ""}
        </h1>
        <p className="text-muted small text-uppercase fw-bold">
          Your daily energy overview
        </p>
      </header>

      {/* Stats Row */}
      <div className="row g-3 mb-4">
        <div className="col-4">
          <div
            className="card border-0 shadow-sm rounded-4 p-4 text-center h-100"
            style={{ backgroundColor: "#f3e5f5" }}
          >
            <h1 className="display-5 fw-bold mb-0 text-dark">
              {dueToday.length}
            </h1>
            <small
              className="fw-bold text-uppercase text-muted"
              style={{ fontSize: "10px" }}
            >
              Active Today
            </small>
          </div>
        </div>
        <div className="col-4">
          <div
            className="card border-0 shadow-sm rounded-4 p-4 text-center h-100"
            style={{ backgroundColor: "#fce4ec" }}
          >
            <h1 className="display-5 fw-bold mb-0 text-danger">
              {overdue.length}
            </h1>
            <small
              className="fw-bold text-uppercase text-muted"
              style={{ fontSize: "10px" }}
            >
              Overdue
            </small>
          </div>
        </div>
        <div className="col-4">
          <div
            className="card border-0 shadow-sm rounded-4 p-4 text-center h-100"
            style={{ backgroundColor: "#e8f5e9" }}
          >
            <h1 className="display-5 fw-bold mb-0" style={{ color: "#2e7d32" }}>
              {completedToday.length}
            </h1>
            <small
              className="fw-bold text-uppercase text-muted"
              style={{ fontSize: "10px" }}
            >
              Done Today
            </small>
          </div>
        </div>
      </div>

      {/* Today's Plan */}
      <div className="card border-0 shadow-sm rounded-4 p-4">
        <h6 className="text-dark fw-bold text-uppercase small mb-3">
          📅 Today's Plan
        </h6>

        {overdue.length > 0 && (
          <div className="mb-3">
            {overdue.slice(0, 3).map((t) => (
              <div
                key={t._id}
                className="p-3 mb-2 bg-danger bg-opacity-10 border-start border-danger border-3 rounded small fw-bold text-danger"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setSelectedTask(t);
                  setModalMode("view");
                }}
              >
                ⚠️ {t.title}
              </div>
            ))}
          </div>
        )}

        {dueToday.length > 0 ? (
          dueToday.map((t) => (
            <div
              key={t._id}
              className="p-3 mb-2 bg-light rounded-3 small fw-bold text-dark d-flex justify-content-between align-items-center"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setSelectedTask(t);
                setModalMode("view");
              }}
            >
              <span>{t.title}</span>
              <span
                className="badge rounded-pill px-2"
                style={getCategoryStyle(t.category)}
              >
                {t.category}
              </span>
            </div>
          ))
        ) : (
          <div className="py-5 text-center text-muted border border-dashed rounded-4 d-flex flex-column align-items-center justify-content-center gap-2">
            <span style={{ fontSize: "2rem" }}>☕</span>
            <span className="fw-bold">Clear skies today!</span>
            <Link
              to="/tasks"
              className="btn btn-dark btn-sm rounded-pill px-4 fw-bold mt-2"
            >
              + Add a Task
            </Link>
          </div>
        )}

        {dueToday.length > 0 && (
          <div className="text-end mt-3">
            <Link
              to="/tasks"
              className="btn btn-dark btn-sm rounded-pill px-4 fw-bold"
            >
              Manage Tasks →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
