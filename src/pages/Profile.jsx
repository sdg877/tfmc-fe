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
    if (user) {
      setFormData({ name: user.name, email: user.email });
    }
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
    const distanceToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startOfWeek.setDate(now.getDate() - distanceToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let weekCount = 0;
    let monthCount = 0;
    let totalCompleted = 0;

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
      else if (totalEnergy > 0.3 * dailyLimit) level = 2;
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

  const formattedLastLogin = user.lastLogin
    ? new Date(user.lastLogin).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "First Session";

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

      {/* Activity Summary Table */}
      <div className="bg-white border rounded-4 p-4 shadow-sm mb-4">
        <h6 className="text-uppercase fw-bold text-muted small mb-3">
          Activity Summary
        </h6>
        <div className="table-responsive">
          <table className="table table-borderless align-middle mb-0">
            <tbody>
              <tr className="border-bottom">
                <td className="ps-0 text-secondary py-3">Last Logged In</td>
                <td className="pe-0 text-end fw-semibold text-dark py-3">
                  {formattedLastLogin}
                </td>
              </tr>
              <tr className="border-bottom">
                <td className="ps-0 text-secondary py-3">
                  Tasks Completed This Week
                </td>
                <td className="pe-0 text-end fw-bold text-dark py-3">
                  {stats.weekCount}
                </td>
              </tr>
              <tr className="border-bottom">
                <td className="ps-0 text-secondary py-3">
                  Tasks Completed This Month
                </td>
                <td className="pe-0 text-end fw-bold text-dark py-3">
                  {stats.monthCount}
                </td>
              </tr>
              <tr>
                <td className="ps-0 text-secondary py-3">
                  Total Tasks Completed
                </td>
                <td className="pe-0 text-end fw-bold text-dark py-3">
                  {stats.totalCompleted}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Heatmap Section */}
      {showHeatMap && (
        <div className="bg-white border rounded-4 p-4 shadow-sm">
          <HeatMapGrid
            data={heatmapData}
            joinDate={user.createdAt}
            user={user}
            daysToView={28}
          />
        </div>
      )}
    </div>
  );
};

export default Profile;
