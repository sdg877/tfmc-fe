
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
  const greeting = hour < 12 ? "Morning" : hour < 18 ? "Afternoon" : "Evening";

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
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#faf9f7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            maxWidth: "380px",
            width: "100%",
            padding: "2rem",
            textAlign: "center",
          }}
        >

          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "#1a1a2e",
              letterSpacing: "-0.5px",
              marginBottom: "0.5rem",
            }}
          >
            The Fast Minds Club
          </h1>
          <p
            style={{
              color: "#aaa",
              marginBottom: "2rem",
              fontSize: "0.9rem",
              lineHeight: 1.6,
            }}
          >
            A calmer way to manage your energy, not just your tasks.
          </p>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}
          >
            <Link
              to="/signup"
              style={{
                display: "block",
                padding: "0.85rem",
                backgroundColor: "#1a1a2e",
                color: "white",
                borderRadius: "100px",
                fontWeight: 700,
                textDecoration: "none",
                fontSize: "0.9rem",
              }}
            >
              Get started
            </Link>
            <Link
              to="/login"
              style={{
                display: "block",
                padding: "0.85rem",
                backgroundColor: "transparent",
                color: "#1a1a2e",
                borderRadius: "100px",
                fontWeight: 700,
                textDecoration: "none",
                border: "1.5px solid #e0e0e0",
                fontSize: "0.9rem",
              }}
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return <AppLoader message="Just a sec..." />;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#faf9f7",
        paddingBottom: "5rem",
      }}
    >
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

      {/* Compact hero */}
      <div
        style={{
          background:
            "linear-gradient(160deg, #f3e5f5 0%, #e3f2fd 60%, #e8f5e9 100%)",
          padding: "1.5rem 1.25rem 3rem",
        }}
      >
        <p
          style={{
            fontSize: "0.65rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "2px",
            color: "#b0b0b0",
            marginBottom: "0.2rem",
          }}
        >
          {greeting}
        </p>
        <h1
          style={{
            fontSize: "1.6rem",
            fontWeight: 800,
            color: "#1a1a2e",
            letterSpacing: "-0.5px",
            marginBottom: "0.15rem",
          }}
        >
          {userName || "Welcome back"}
        </h1>
        <p style={{ color: "#aaa", fontSize: "0.8rem", margin: 0 }}>
          {dueToday.length === 0 && overdue.length === 0
            ? "You're all clear today ✨"
            : `${dueToday.length} task${dueToday.length !== 1 ? "s" : ""} on your plate`}
        </p>
      </div>

      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "0 1rem" }}>
        {/* Stats — overlapping gradient */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "0.6rem",
            marginTop: "-1.75rem",
            marginBottom: "1.25rem",
          }}
        >
          {[
            { value: dueToday.length, label: "Today", textColor: "#7b1fa2" },
            { value: overdue.length, label: "Overdue", textColor: "#c2185b" },
            {
              value: completedToday.length,
              label: "Done",
              textColor: "#2e7d32",
            },
          ].map(({ value, label, textColor }) => (
            <div
              key={label}
              style={{
                backgroundColor: "white",
                borderRadius: "16px",
                padding: "0.9rem 0.5rem",
                textAlign: "center",
                boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
                border: "1px solid #f0f0f0",
              }}
            >
              <div
                style={{
                  fontSize: "1.4rem",
                  fontWeight: 800,
                  color: textColor,
                  lineHeight: 1,
                }}
              >
                {value}
              </div>
              <div
                style={{
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  color: "#bbb",
                  marginTop: "0.25rem",
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Overdue */}
        {overdue.length > 0 && (
          <div style={{ marginBottom: "1.25rem" }}>
            <p
              style={{
                fontSize: "0.65rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                color: "#c2185b",
                marginBottom: "0.6rem",
                paddingLeft: "0.25rem",
              }}
            >
              ⚠️ Overdue
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.4rem",
              }}
            >
              {overdue.slice(0, 3).map((t) => (
                <div
                  key={t._id}
                  onClick={() => {
                    setSelectedTask(t);
                    setModalMode("view");
                  }}
                  style={{
                    backgroundColor: "#fff5f5",
                    border: "1.5px solid #fca5a5",
                    borderRadius: "14px",
                    padding: "0.75rem 1rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 700,
                      color: "#b91c1c",
                      fontSize: "0.85rem",
                    }}
                  >
                    {t.title}
                  </span>
                  <span
                    style={{
                      fontSize: "0.65rem",
                      color: "#ef4444",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {new Date(t.dueDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Today's plan */}
        <div>
          <p
            style={{
              fontSize: "0.65rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              color: "#bbb",
              marginBottom: "0.6rem",
              paddingLeft: "0.25rem",
            }}
          >
            Today's plan
          </p>

          {dueToday.length > 0 ? (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4rem",
                  marginBottom: "1rem",
                }}
              >
                {dueToday.map((t) => (
                  <div
                    key={t._id}
                    onClick={() => {
                      setSelectedTask(t);
                      setModalMode("view");
                    }}
                    style={{
                      backgroundColor: "white",
                      borderRadius: "14px",
                      padding: "0.85rem 1rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                      border: "1px solid #f0f0f0",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          flexShrink: 0,
                          backgroundColor: getCategoryStyle(t.category).color,
                        }}
                      />
                      <span
                        style={{
                          fontWeight: 600,
                          color: "#1a1a2e",
                          fontSize: "0.85rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {t.title}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        padding: "0.2rem 0.6rem",
                        borderRadius: "100px",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                        ...getCategoryStyle(t.category),
                      }}
                    >
                      {t.category}
                    </span>
                  </div>
                ))}
              </div>
              <Link
                to="/tasks"
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "0.8rem",
                  backgroundColor: "#1a1a2e",
                  color: "white",
                  borderRadius: "100px",
                  fontWeight: 700,
                  textDecoration: "none",
                  fontSize: "0.85rem",
                }}
              >
                Manage tasks →
              </Link>
            </>
          ) : (
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "18px",
                padding: "2rem 1.5rem",
                textAlign: "center",
                border: "1.5px dashed #e8e8e8",
              }}
            >
              <p style={{ fontSize: "1.75rem", marginBottom: "0.4rem" }}>☕</p>
              <p
                style={{
                  fontWeight: 700,
                  color: "#1a1a2e",
                  marginBottom: "0.2rem",
                  fontSize: "0.95rem",
                }}
              >
                All clear!
              </p>
              <p
                style={{
                  color: "#bbb",
                  fontSize: "0.8rem",
                  marginBottom: "1.25rem",
                }}
              >
                Nothing on the list for today.
              </p>
              <Link
                to="/tasks"
                style={{
                  display: "inline-block",
                  padding: "0.6rem 1.5rem",
                  backgroundColor: "#1a1a2e",
                  color: "white",
                  borderRadius: "100px",
                  fontWeight: 700,
                  textDecoration: "none",
                  fontSize: "0.8rem",
                }}
              >
                + Add a task
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
