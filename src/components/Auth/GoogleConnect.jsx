import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const GoogleConnect = ({ isConnected, onSyncSuccess }) => {
  const token = localStorage.getItem("token");
  const baseURL = import.meta.env.VITE_API_URL;

  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        const res = await axios.post(
          `${baseURL}/users/sync-calendar`,
          { code: codeResponse.code },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        onSyncSuccess(res.data);
      } catch (err) {
        console.error("Google Sync Error:", err);
      }
    },
    flow: "auth-code",
    scope: "https://www.googleapis.com/auth/calendar.events",
  });

  const handleDisconnect = async () => {
    if (window.confirm("Disconnect your Google Calendar?")) {
      try {
        const res = await axios.post(
          `${baseURL}/users/calendar/disconnect`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        );
        onSyncSuccess(res.data.user || res.data);
      } catch (err) {
        console.error("Disconnect Error:", err);
      }
    }
  };

  return (
    <button
      onClick={isConnected ? handleDisconnect : () => login()}
      className={`btn rounded-pill px-4 fw-bold shadow-sm ${
        isConnected ? "btn-outline-secondary" : "btn-dark"
      }`}
      style={{ minWidth: "120px" }}
    >
      {isConnected ? "Disconnect" : "Connect Google"}
    </button>
  );
};

export default GoogleConnect;
