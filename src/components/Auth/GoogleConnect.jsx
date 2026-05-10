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
        alert("Google Calendar connected with full permissions!");
      } catch (err) {
        console.error("Google Sync Error:", err);
      }
    },
    flow: "auth-code",
    ux_mode: "popup",
    scope: "https://www.googleapis.com/auth/calendar",
  });

  return (
    <button
      onClick={() => login()}
      className={`btn rounded-pill px-4 fw-bold ${
        isConnected ? "btn-outline-danger" : "btn-dark"
      }`}
    >
      {isConnected ? "Reconnect Google" : "Connect Google"}
    </button>
  );
};

export default GoogleConnect;
