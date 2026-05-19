import React, { useState, useEffect } from "react";
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
    if (user) {
      setFormData({ name: user.name, email: user.email });
    }
  }, [user]);

  // Fetch tasks independently
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

      if (!dayStats[dateKey]) {
        dayStats[dateKey] = { totalEnergy: 0, count: 0 };
      }
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
    return <div className="p-5 text-center text-muted">Loading...</div>;

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
      console.error("Full Error Object:", err.response || err);
      alert(`Update failed: ${err.response?.data?.msg || "Check console"}`);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "800px" }}>
      <header className="mb-5 border-bottom pb-4 d-flex justify-content-between align-items-end">
        <div>
          <h2 className="fw-bold text-dark mb-1">Hello, {user.name}</h2>
          <p className="text-secondary mb-0">Your Account Identity</p>
        </div>
        <div className="d-flex gap-2">
          <button
            onClick={() => navigate("/settings")}
            className="btn btn-outline-dark rounded-pill px-4 fw-bold"
          >
            Settings
          </button>
          <Logout />
        </div>
      </header>

      <div className="bg-white border rounded-4 p-4 shadow-sm mb-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h6 className="text-uppercase fw-bold text-muted small mb-0">
            Identity Details
          </h6>
          <button
            className="btn btn-sm btn-dark rounded-pill px-3"
            onClick={() => (isEditing ? handleUpdate() : setIsEditing(true))}
          >
            {isEditing ? "Save Changes" : "Edit Profile"}
          </button>
        </div>

        <div className="row">
          <div className="col-md-6 mb-4">
            <label className="text-muted small d-block mb-1">
              REGISTERED NAME
            </label>
            {isEditing ? (
              <input
                className="form-control"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            ) : (
              <div className="h6 fw-bold mb-0 text-dark">{user.name}</div>
            )}
          </div>
          <div className="col-md-6 mb-4">
            <label className="text-muted small d-block mb-1">
              EMAIL ADDRESS
            </label>
            {isEditing ? (
              <input
                className="form-control"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            ) : (
              <div className="h6 fw-bold mb-0 text-dark">{user.email}</div>
            )}
          </div>
        </div>

        {isEditing && (
          <button
            className="btn btn-link btn-sm text-muted p-0"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
        )}
      </div>

      {showHeatMap && (
        <div className="bg-white border rounded-4 p-4 shadow-sm">
          <HeatMapGrid
            data={heatmapData}
            joinDate={user.createdAt}
            daysToView={28}
          />
        </div>
      )}
    </div>
  );
};

export default Profile;
