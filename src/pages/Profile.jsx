
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logout from "../components/Layout/Logout";
import HeatMapGrid from "../components/HeatMap/HeatMapGrid";

const Profile = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [heatmapData, setHeatmapData] = useState({});
  const [tasks, setTasks] = useState([]);

  const baseURL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const showHeatMap = JSON.parse(
    localStorage.getItem("showHeatMap") !== null
      ? localStorage.getItem("showHeatMap")
      : "true",
  );

  useEffect(() => {
    if (user) setFormData({ name: user.name, email: user.email });
  }, [user]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(`${baseURL}/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(res.data);
      } catch (err) {
        console.error("Failed to fetch tasks", err);
      }
    };
    if (token) fetchTasks();
  }, [baseURL, token]);

  const stats = useMemo(() => {
    if (!tasks.length)
      return { weekCount: 0, monthCount: 0, totalCompleted: 0 };
    const now = new Date();
    const startOfWeek = new Date(now);
    const dayOfWeek = now.getDay();
    startOfWeek.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    let weekCount = 0,
      monthCount = 0,
      totalCompleted = 0;
    tasks.forEach((task) => {
      if (!task.isCompleted) return;
      totalCompleted++;
      const dateToUse = task.completedAt || task.updatedAt;
      if (!dateToUse) return;
      const taskDate = new Date(dateToUse);
      if (taskDate >= startOfWeek) weekCount++;
      if (taskDate >= startOfMonth) monthCount++;
    });
    return { weekCount, monthCount, totalCompleted };
  }, [tasks]);

  useEffect(() => {
    if (!tasks.length || !user) return;
    const dayStats = {};
    tasks.forEach((task) => {
      const dateToUse = task.completedAt || task.updatedAt;
      if (!task.isCompleted || !dateToUse) return;
      const dateKey = new Date(dateToUse).toLocaleDateString("sv-SE");
      const catWeight = user.categories?.find(
        (c) => c.name.toLowerCase() === task.category?.toLowerCase(),
      )?.weight;
      const fallbackWeights = {
        social: 10,
        physical: 15,
        admin: 20,
        focus: 25,
        stress: 35,
      };
      const energy =
        catWeight ?? fallbackWeights[task.category?.toLowerCase()] ?? 10;
      if (!dayStats[dateKey]) dayStats[dateKey] = { totalEnergy: 0, count: 0 };
      dayStats[dateKey].totalEnergy += energy;
      dayStats[dateKey].count += 1;
    });
    const dailyLimit = user.dailyEnergyLimit || 100;
    const finalizedMap = {};
    Object.keys(dayStats).forEach((date) => {
      const { totalEnergy, count } = dayStats[date];
      const isOverloaded = totalEnergy > dailyLimit;
      let level = 0;
      if (totalEnergy > dailyLimit) level = 4;
      else if (totalEnergy > dailyLimit * 0.6) level = 3;
      else if (totalEnergy > dailyLimit * 0.3) level = 2;
      else if (totalEnergy > 0) level = 1;
      finalizedMap[date] = {
        level,
        count,
        energyUsed: totalEnergy,
        dailyLimit,
        isOverloaded,
      };
    });
    setHeatmapData(finalizedMap);
  }, [tasks, user]);

  if (!user)
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "#aaa" }}>
        Loading...
      </div>
    );

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `${baseURL}/users/profile/identity`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.status === 200) {
        setUser(res.data);
        setIsEditing(false);
      }
    } catch (err) {
      alert(`Update failed: ${err.response?.data?.msg || "Check console"}`);
    }
  };

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div style={{ backgroundColor: "#faf9f7", paddingBottom: "5rem" }}>
      {/* Hero */}
      <div
        style={{
          background:
            "linear-gradient(160deg, #f3e5f5 0%, #e3f2fd 60%, #e8f5e9 100%)",
          padding: "1.5rem 1.25rem 3rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "0.65rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "2px",
                color: "#b0b0b0",
                marginBottom: "0.15rem",
              }}
            >
              Your profile
            </p>
            <h1
              style={{
                fontSize: "1.6rem",
                fontWeight: 800,
                color: "#1a1a2e",
                letterSpacing: "-0.5px",
                marginBottom: "0.1rem",
              }}
            >
              {user.name}
            </h1>
            <p style={{ color: "#aaa", fontSize: "0.78rem", margin: 0 }}>
              Member since {memberSince}
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
            <button
              onClick={() => navigate("/settings")}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "white",
                border: "1.5px solid #e0e0e0",
                borderRadius: "100px",
                fontWeight: 700,
                fontSize: "0.78rem",
                cursor: "pointer",
                color: "#1a1a2e",
              }}
            >
              Settings
            </button>
            <Logout />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "0 1rem" }}>
        {/* Stats row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "0.6rem",
            marginTop: "-1.5rem",
            marginBottom: "1.25rem",
          }}
        >
          {[
            {
              value: stats.weekCount,
              label: "This week",
              textColor: "#7b1fa2",
            },
            {
              value: stats.monthCount,
              label: "This month",
              textColor: "#1565c0",
            },
            {
              value: stats.totalCompleted,
              label: "All time",
              textColor: "#2e7d32",
            },
          ].map(({ value, label, textColor }) => (
            <div
              key={label}
              style={{
                backgroundColor: "white",
                borderRadius: "16px",
                padding: "0.85rem 0.5rem",
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
                  fontSize: "0.58rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  color: "#bbb",
                  marginTop: "0.2rem",
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Identity details */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "1.25rem",
            marginBottom: "0.75rem",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            border: "1px solid #f0f0f0",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <p
              style={{
                fontSize: "0.65rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                color: "#bbb",
                margin: 0,
              }}
            >
              Identity
            </p>
            <button
              onClick={() => (isEditing ? handleUpdate() : setIsEditing(true))}
              style={{
                padding: "0.35rem 0.9rem",
                backgroundColor: isEditing ? "#1a1a2e" : "transparent",
                border: `1.5px solid ${isEditing ? "#1a1a2e" : "#e0e0e0"}`,
                borderRadius: "100px",
                fontWeight: 700,
                fontSize: "0.75rem",
                cursor: "pointer",
                color: isEditing ? "white" : "#1a1a2e",
              }}
            >
              {isEditing ? "Save" : "Edit"}
            </button>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            <div>
              <p
                style={{
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: "#ccc",
                  marginBottom: "0.2rem",
                }}
              >
                Name
              </p>
              {isEditing ? (
                <input
                  style={{
                    width: "100%",
                    border: "1.5px solid #e8e8e8",
                    borderRadius: "10px",
                    padding: "0.5rem 0.75rem",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    outline: "none",
                    backgroundColor: "#faf9f7",
                  }}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              ) : (
                <p
                  style={{
                    fontWeight: 700,
                    color: "#1a1a2e",
                    margin: 0,
                    fontSize: "0.9rem",
                  }}
                >
                  {user.name}
                </p>
              )}
            </div>
            <div>
              <p
                style={{
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: "#ccc",
                  marginBottom: "0.2rem",
                }}
              >
                Email
              </p>
              {isEditing ? (
                <input
                  style={{
                    width: "100%",
                    border: "1.5px solid #e8e8e8",
                    borderRadius: "10px",
                    padding: "0.5rem 0.75rem",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    outline: "none",
                    backgroundColor: "#faf9f7",
                  }}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              ) : (
                <p
                  style={{
                    fontWeight: 600,
                    color: "#666",
                    margin: 0,
                    fontSize: "0.9rem",
                  }}
                >
                  {user.email}
                </p>
              )}
            </div>
          </div>

          {isEditing && (
            <button
              onClick={() => setIsEditing(false)}
              style={{
                marginTop: "0.75rem",
                background: "none",
                border: "none",
                color: "#aaa",
                fontSize: "0.78rem",
                cursor: "pointer",
                padding: 0,
              }}
            >
              Cancel
            </button>
          )}
        </div>

        {/* Integrations */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "1.25rem",
            marginBottom: "0.75rem",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            border: "1px solid #f0f0f0",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.75rem",
            }}
          >
            <p
              style={{
                fontSize: "0.65rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                color: "#bbb",
                margin: 0,
              }}
            >
              Integrations
            </p>
            <button
              onClick={() => navigate("/settings")}
              style={{
                background: "none",
                border: "none",
                color: "#aaa",
                fontSize: "0.75rem",
                fontWeight: 700,
                cursor: "pointer",
                padding: 0,
              }}
            >
              Manage →
            </button>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {[
              { label: "Google Calendar", connected: user.googleConnected },
              { label: "iCal Feed", connected: user.icalConnected },
            ].map(({ label, connected }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.65rem 0.75rem",
                  backgroundColor: "#faf9f7",
                  borderRadius: "12px",
                }}
              >
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    color: "#1a1a2e",
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    padding: "0.2rem 0.65rem",
                    borderRadius: "100px",
                    backgroundColor: connected ? "#e8f5e9" : "#f5f5f5",
                    color: connected ? "#2e7d32" : "#bbb",
                  }}
                >
                  {connected ? "✓ Connected" : "Not connected"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Heatmap */}
        {showHeatMap && (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "1.25rem",
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              border: "1px solid #f0f0f0",
            }}
          >
            <HeatMapGrid
              data={heatmapData}
              joinDate={user.createdAt}
              user={user}
              daysToView={28}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
