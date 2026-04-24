import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="container mt-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-dark">{greeting}, Sylvia</h1>
        <p className="text-muted fs-5">Ready to manage your energy today?</p>
      </div>

      <div className="row g-4 justify-content-center">
        <div className="col-md-5">
          <div className="card h-100 shadow-sm border-0 bg-light p-4">
            <div className="card-body text-center d-flex flex-column justify-content-between">
              <div>
                <div className="fs-1 mb-3">📝</div>
                <h3 className="card-title fw-bold">Task Manager</h3>
                <p className="card-text text-muted mt-3">
                  Break down your day and track your energy points.
                </p>
              </div>
              <Link
                to="/tasks"
                className="btn btn-dark rounded-pill px-5 py-2 mt-4 fw-bold"
              >
                Open Tasks
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-5">
          <div className="card h-100 shadow-sm border-0 bg-light p-4">
            <div className="card-body text-center d-flex flex-column justify-content-between">
              <div>
                <div className="fs-1 mb-3">📅</div>
                <h3 className="card-title fw-bold">Calendar</h3>
                <p className="card-text text-muted mt-3">
                  A high-level view of your upcoming week and commitments.
                </p>
              </div>
              <Link
                to="/calendar"
                className="btn btn-outline-dark rounded-pill px-5 py-2 mt-4 fw-bold"
              >
                View Schedule
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-5 pt-4">
        <small className="text-muted italic">
          "Don't judge each day by the harvest you reap, but by the seeds that
          you plant."
        </small>
      </div>
    </div>
  );
};

export default Home;
