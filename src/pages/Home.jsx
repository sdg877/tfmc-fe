import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import HeatMapGrid from "../components/HeatMap/HeatMapGrid";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [userName, setUserName] = useState("");
  const [joinDate, setJoinDate] = useState(null);
  const [heatmapData, setHeatmapData] = useState({});
  const [loading, setLoading] = useState(true);
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
            quickwin: 5,
            admin: 10,
            physical: 20,
            social: 30,
            focus: 40,
            stress: 45,
          };
          const dayStats = {};

          resTasks.data.forEach((task) => {
            if (task.isCompleted && task.updatedAt) {
              const date = new Date(task.updatedAt).toISOString().split("T")[0];
              const energy = weights[task.category] || 10;

              if (!dayStats[date]) {
                dayStats[date] = { totalEnergy: 0, count: 0 };
              }
              dayStats[date].totalEnergy += energy;
              dayStats[date].count += 1;
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

  const todayStr = new Date().toLocaleDateString("en-GB");
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
        (t.dueDate &&
          new Date(t.dueDate).toLocaleDateString("en-GB") === todayStr)),
  );

  if (!token) {
    return (
      <div className="container mt-5 py-5 text-center">
        <h1 className="display-3 fw-bold text-dark mb-4">
          Master your energy.
        </h1>
        <p className="lead text-muted mb-5">
          Track your Brain Load and prevent burnout with our visual energy
          battery.
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
      <div className="container py-5 text-center">
        Loading your dashboard...
      </div>
    );

  return (
    <div className="container mt-5">
      <header className="mb-5 text-center">
        <h1 className="display-5 fw-bold text-dark mb-1">
          {greeting}
          {userName ? `, ${userName}` : ""}
        </h1>
        <p className="text-muted small text-uppercase fw-bold ls-wide">
          Your daily energy overview
        </p>
      </header>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 bg-dark text-white p-4 h-100">
            <h5 className="fw-bold mb-4 opacity-75">Status</h5>
            <div className="mb-3">
              <h2 className="mb-0 fw-bold">{dueToday.length}</h2>
              <small className="text-white-50 text-uppercase fw-bold">
                Due Today
              </small>
            </div>
            <div className="mb-4">
              <h2 className="mb-0 text-danger fw-bold">{overdue.length}</h2>
              <small className="text-white-50 text-uppercase fw-bold">
                Overdue
              </small>
            </div>
            <Link
              to="/tasks"
              className="btn btn-light btn-sm rounded-pill w-100 mt-auto fw-bold py-2"
            >
              Go to Tasks
            </Link>
          </div>
        </div>

        <div className="col-md-8">
          {overdue.length > 0 && (
            <div className="mb-4">
              <h6 className="text-danger fw-bold text-uppercase small mb-3">
                ⚠️ Immediate Attention
              </h6>
              <div className="list-group border-0">
                {overdue.slice(0, 2).map((t) => (
                  <div
                    key={t._id}
                    className="list-group-item border-start border-danger border-4 mb-2 rounded shadow-sm py-3"
                  >
                    <span className="fw-bold">{t.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-4">
            <h6 className="text-dark fw-bold text-uppercase small mb-3">
              📅 Today's Plan
            </h6>
            <div className="list-group border-0">
              {dueToday.length > 0 ? (
                dueToday.slice(0, 3).map((t) => (
                  <div
                    key={t._id}
                    className="list-group-item border-0 mb-2 rounded shadow-sm py-3 bg-white"
                  >
                    <span className="fw-bold text-dark">{t.title}</span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center bg-light rounded-4 text-muted border border-dashed">
                  Clear skies today! ☕
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="row justify-content-center mt-5 mb-5">
          <div className="col-12 col-md-6 col-lg-4">
            <HeatMapGrid
              data={heatmapData}
              joinDate={joinDate}
              daysToView={28}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
