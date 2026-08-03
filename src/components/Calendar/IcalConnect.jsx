import React, { useState } from "react";
import axios from "axios";
import CustomModal from "../layout/CustomModal";

const IcalConnect = ({ isConnected, onSyncSuccess }) => {
  const [showModal, setShowModal] = useState(false);
  const [icalUrl, setIcalUrl] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const baseURL = import.meta.env.VITE_API_URL;

  const handleConnect = async () => {
    if (!icalUrl.trim()) {
      setError("Please enter a valid iCal URL");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        `${baseURL}/users/ical/connect`,
        { icalUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSyncSuccess(res.data);
      setShowInput(false);
      setIcalUrl("");
    } catch (err) {
      console.error("iCal Connect Error:", err);
      setError(err.response?.data?.message || "Could not connect. Check the URL and try again.");
    } finally {
      setLoading(false);
    }
  };

  const confirmDisconnect = async () => {
    setShowModal(false);
    try {
      const res = await axios.post(
        `${baseURL}/users/ical/disconnect`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSyncSuccess(res.data);
    } catch (err) {
      console.error("iCal Disconnect Error:", err);
    }
  };

  if (isConnected) {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-outline-secondary rounded-pill px-4 fw-bold shadow-sm"
          style={{ minWidth: "120px" }}
        >
          Disconnect iCal
        </button>

        <CustomModal
          show={showModal}
          title="DISCONNECT ICAL"
          message="Are you sure you want to stop syncing your iCal feed? You can reconnect at any time."
          type="danger"
          onClose={() => setShowModal(false)}
          onConfirm={confirmDisconnect}
        />
      </>
    );
  }

  return (
    <div>
      {!showInput ? (
        <button
          onClick={() => setShowInput(true)}
          className="btn btn-dark rounded-pill px-4 fw-bold shadow-sm"
          style={{ minWidth: "120px" }}
        >
          Connect iCal
        </button>
      ) : (
        <div className="d-flex flex-column gap-2" style={{ maxWidth: "400px" }}>
          <input
            type="url"
            className={`form-control rounded-pill border-0 bg-light shadow-sm ${error ? "is-invalid" : ""}`}
            placeholder="Paste your iCal URL here..."
            value={icalUrl}
            onChange={(e) => {
              setIcalUrl(e.target.value);
              setError("");
            }}
          />
          {error && <small className="text-danger ps-2">{error}</small>}
          <div className="d-flex gap-2">
            <button
              onClick={handleConnect}
              disabled={loading}
              className="btn btn-dark rounded-pill px-4 fw-bold shadow-sm flex-grow-1"
            >
              {loading ? "Connecting..." : "Save"}
            </button>
            <button
              onClick={() => { setShowInput(false); setError(""); setIcalUrl(""); }}
              className="btn btn-outline-secondary rounded-pill px-3 fw-bold"
            >
              Cancel
            </button>
          </div>
          <small className="text-muted ps-1">
            Find your iCal URL in Apple Calendar, Outlook, or any calendar app under sharing settings.
          </small>
        </div>
      )}
    </div>
  );
};

export default IcalConnect;
