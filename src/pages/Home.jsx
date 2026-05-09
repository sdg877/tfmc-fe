import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import HeatMapGrid from "../components/HeatMap/HeatMapGrid";

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

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [userName, setUserName] = useState("");
  const [joinDate, setJoinDate] = useState(null);
  const [heatmapData, setHeatmapData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const token = localStorage.getItem("token");

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

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
          setUserName(resUser.data.name || "");
          setJoinDate(resUser.data.createdAt);

          const weights = {
            admin: 10,
            physical: 20,
            social: 30,
            focus: 40,
            stress: 45,
          };
          const dayStats = {};

          resTasks.data.forEach((task) => {
            const dateToUse = task.completedAt || task.updatedAt;
            if (task.isCompleted && dateToUse) {
              const d = new Date(dateToUse);
              const dateKey = d.toLocaleDateString("sv-SE");
              const energy = weights[task.category] || 10;
              if (!dayStats[dateKey])
                dayStats[dateKey] = { totalEnergy: 0, count: 0 };
              dayStats[dateKey].totalEnergy += energy;
              dayStats[dateKey].count += 1;
            }
          });

          const finalizedMap = {};
          Object.keys(dayStats).forEach((date) => {
            const { totalEnergy, count } = dayStats[date];
            let level = 1;
            if (totalEnergy > 90) level = 4;
            else if (totalEnergy > 60) level = 3;
            else if (totalEnergy > 30) level = 2;
            finalizedMap[date] = { level, count };
          });

          setHeatmapData(finalizedMap);
          setLoading(false);
        } catch (err) {
          console.error("Fetch error", err);
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [token]);

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
            to="/register"
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

  if (loading)
    return (
      <div className="container py-5 text-center text-muted">
        Loading dashboard...
      </div>
    );

  return (
    <div className="container-fluid mt-4 px-lg-5">
      <header className="mb-5 text-center">
        <h1 className="display-5 fw-bold text-dark mb-1">
          {greeting}
          {userName ? `, ${userName}` : ""}
        </h1>
        <p className="text-muted small text-uppercase fw-bold ls-wide">
          Your daily energy overview
        </p>
      </header>

      {selectedTask && (
        <div
          className="modal fade show d-block"
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 1050,
          }}
          onClick={() => setSelectedTask(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header border-0 p-4 pb-0 d-flex justify-content-between align-items-start">
                <div>
                  <span
                    className="badge mb-2 text-uppercase"
                    style={
                      categoryStyles[selectedTask.category] ||
                      categoryStyles.default
                    }
                  >
                    {selectedTask.category}
                  </span>
                  <h3 className="modal-title fw-bold text-dark">
                    {selectedTask.title}
                  </h3>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedTask(null)}
                ></button>
              </div>
              <div className="modal-body p-4">
                {selectedTask.notes && (
                  <div className="mb-4">
                    <label className="small fw-bold text-muted text-uppercase ls-wide d-block mb-1">
                      Notes
                    </label>
                    <p
                      className="bg-light p-3 rounded-3 text-dark mb-0"
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {selectedTask.notes}
                    </p>
                  </div>
                )}
                <div className="row g-3">
                  <div className="col-6">
                    <label className="small fw-bold text-muted text-uppercase ls-wide d-block mb-1">
                      Urgency
                    </label>
                    <span
                      className={`badge rounded-pill px-3 py-2 bg-dark text-white`}
                    >
                      {selectedTask.urgency.toUpperCase()}
                    </span>
                  </div>
                  <div className="col-6">
                    <label className="small fw-bold text-muted text-uppercase ls-wide d-block mb-1">
                      Due Date
                    </label>
                    <p className="fw-bold mb-0 text-dark">
                      {selectedTask.dueDate
                        ? new Date(selectedTask.dueDate).toLocaleDateString(
                            "en-GB",
                          )
                        : "No date set"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 bg-light p-3 justify-content-start">
                <small className="text-muted">
                  Added on:{" "}
                  {new Date(
                    selectedTask.createdAt || Date.now(),
                  ).toLocaleDateString("en-GB")}
                </small>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className="row g-4 align-items-stretch"
        style={{ minHeight: "380px" }}
      >
        <div className="col-lg-3">
          <div
            className="card border-0 shadow-sm rounded-4 h-100 p-4"
            style={{ backgroundColor: "#f3e5f5" }}
          >
            <h6
              className="text-uppercase fw-bold small mb-4"
              style={{ color: "#7b1fa2" }}
            >
              Overview
            </h6>
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h1 className="display-5 fw-bold mb-0 text-dark">
                    {dueToday.length}
                  </h1>
                  <small
                    className="fw-bold text-uppercase opacity-75"
                    style={{ fontSize: "10px" }}
                  >
                    Active Today
                  </small>
                </div>
                <div className="text-end">
                  <h1 className="display-5 fw-bold mb-0 text-danger">
                    {overdue.length}
                  </h1>
                  <small
                    className="fw-bold text-uppercase opacity-75"
                    style={{ fontSize: "10px" }}
                  >
                    Overdue
                  </small>
                </div>
              </div>
            </div>
            <Link
              to="/tasks"
              className="btn btn-white btn-sm rounded-pill w-100 fw-bold py-2 shadow-sm border mt-auto"
            >
              Manage Tasks
            </Link>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 h-100 bg-white p-4">
            <h6 className="text-dark fw-bold text-uppercase small mb-4">
              📅 Today's Plan
            </h6>
            <div
              className="overflow-auto flex-grow-1"
              style={{ maxHeight: "250px" }}
            >
              {overdue.length > 0 && (
                <div className="mb-3">
                  {overdue.slice(0, 2).map((t) => (
                    <div
                      key={t._id}
                      className="p-3 mb-2 bg-danger bg-opacity-10 border-start border-danger border-3 rounded small fw-bold text-danger"
                      style={{ cursor: "pointer" }}
                      onClick={() => setSelectedTask(t)}
                    >
                      {t.title}
                    </div>
                  ))}
                </div>
              )}
              {dueToday.length > 0 ? (
                dueToday.map((t) => (
                  <div
                    key={t._id}
                    className="p-3 mb-2 bg-light rounded small fw-bold text-dark"
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedTask(t)}
                  >
                    {t.title}
                  </div>
                ))
              ) : (
                <div className="p-5 text-center text-muted border border-dashed rounded-4 h-100 d-flex align-items-center justify-content-center">
                  Clear skies today! ☕
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 h-100 bg-white p-4 d-flex flex-column align-items-center">
            <h6 className="text-muted fw-bold text-uppercase small mb-4 align-self-start">
              Activity Overview
            </h6>
            <div className="d-flex align-items-center justify-content-center flex-grow-1 w-100">
              <HeatMapGrid
                data={heatmapData}
                joinDate={joinDate}
                daysToView={28}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
