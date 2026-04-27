import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        try {
          const resTasks = await axios.get(
            `${import.meta.env.VITE_API_URL}/tasks`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          setTasks(resTasks.data);

          // Fetch user profile to get their real name
          const resUser = await axios.get(
            `${import.meta.env.VITE_API_URL}/users/profile`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );

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

  const upcomingWeek = tasks.filter((t) => {
    if (t.isCompleted) return false;
    const dueDate = new Date(t.dueDate);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return dueDate > new Date() && dueDate <= nextWeek;
  });

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
      </div>
    </div>
  );
};

export default Home;
