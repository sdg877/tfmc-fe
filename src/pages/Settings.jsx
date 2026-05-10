import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const Settings = ({ user, setUser }) => {
  const token = localStorage.getItem("token");
  const baseURL = import.meta.env.VITE_API_URL;

  const handleGoogleSync = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        const res = await axios.post(
          `${baseURL}/users/sync-calendar`,
          { code: codeResponse.code },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setUser(res.data);
        alert("Google Calendar connected!");
      } catch (err) {
        console.error("Google Sync Error:", err);
        alert("Connection failed. Please try again.");
      }
    },
    flow: "auth-code",
    ux_mode: "redirect",
    redirect_uri: window.location.origin,
    scope: "https://www.googleapis.com/auth/calendar.readonly",
  });

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Settings</h2>

      <section className="card border-0 shadow-sm rounded-4 p-4">
        <h5 className="fw-bold mb-3">Integrations</h5>
        <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded-3">
          <div>
            <p className="fw-bold mb-0">Google Calendar</p>
            <p className="small text-muted mb-0">
              {user?.googleConnected
                ? "Your appointments are synced."
                : "View your external events alongside your tasks."}
            </p>
          </div>

          <button
            onClick={() => handleGoogleSync()}
            className={`btn rounded-pill px-4 fw-bold ${
              user?.googleConnected ? "btn-secondary opacity-50" : "btn-dark"
            }`}
            disabled={user?.googleConnected}
          >
            {user?.googleConnected ? "Connected" : "Connect"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default Settings;
