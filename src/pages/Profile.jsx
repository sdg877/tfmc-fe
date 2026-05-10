import React from "react";
import { useNavigate } from "react-router-dom";

const Profile = ({ user }) => {
  const navigate = useNavigate();

  if (!user)
    return <div className="p-5 text-center text-muted">Loading...</div>;

  return (
    <div className="container py-5" style={{ maxWidth: "800px" }}>
      <header className="mb-5 border-bottom pb-4 d-flex justify-content-between align-items-end">
        <div>
          <h2 className="fw-bold text-dark mb-1">Hello, {user.name}</h2>
          <p className="text-secondary mb-0">Your Account Identity</p>
        </div>
        <button
          onClick={() => navigate("/settings")}
          className="btn btn-dark rounded-pill px-4 fw-bold shadow-sm"
        >
          Go to Settings
        </button>
      </header>

      <div className="bg-light border rounded-4 p-4 shadow-sm">
        <h6 className="text-uppercase fw-bold text-muted small mb-4">
          Identity Details
        </h6>
        <div className="row">
          <div className="col-md-6 mb-4">
            <label className="text-muted small d-block mb-1">
              REGISTERED NAME
            </label>
            <div className="h6 fw-bold mb-0 text-dark">{user.name}</div>
          </div>
          <div className="col-md-6 mb-4">
            <label className="text-muted small d-block mb-1">
              EMAIL ADDRESS
            </label>
            <div className="h6 fw-bold mb-0 text-dark">{user.email}</div>
          </div>
        </div>
        <hr className="my-3" />
        <button
          className="btn btn-outline-danger btn-sm rounded-pill px-4"
          disabled
        >
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default Profile;
