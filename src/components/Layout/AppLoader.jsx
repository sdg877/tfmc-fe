import React from "react";

const AppLoader = ({ message = "Syncing your fast mind..." }) => {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: "70vh" }}
    >
      {/* Container for the pulsing icon */}
      <div className="loader-icon-container mb-4">
        <svg
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#9b5de5" // Your purple brand color
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="main-pulse"
        >
          {/* An Hourglass-style icon */}
          <path d="M5 2h14M5 22h14M6 2v6.5c0 1.93 1.57 3.5 3.5 3.5s3.5-1.57 3.5-3.5V2M18 22v-6.5c0-1.93-1.57-3.5-3.5-3.5s-3.5 1.57-3.5 3.5V22" />
        </svg>
      </div>

      {/* Pulsing Text */}
      <h5
        className="fw-bold text-dark text-uppercase tracking-widest animate-flicker"
        style={{ letterSpacing: "2px", fontSize: "0.9rem" }}
      >
        {message}
      </h5>

      <style>{`
        .main-pulse {
          animation: pulse-grow 2s infinite ease-in-out;
        }

        .animate-flicker {
          animation: text-flicker 1.5s infinite both;
          color: #6c757d;
        }

        @keyframes pulse-grow {
          0% { transform: scale(0.9); opacity: 0.6; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.9); opacity: 0.6; }
        }

        @keyframes text-flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default AppLoader;
