import React, { useState } from "react";
import axios from "axios";

const EnergySlider = ({ initialValue, onUpdate }) => {
  const [limit, setLimit] = useState(initialValue || 100);
  const [saving, setSaving] = useState(false);

  const baseURL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const handleSave = async (value) => {
    setSaving(true);
    try {
      await axios.put(
        `${baseURL}/users/profile/energy`,
        { dailyEnergyLimit: Number(value) },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (onUpdate) onUpdate(Number(value));
    } catch (err) {
      console.error("Failed to save energy limit", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card p-3 border-0 shadow-sm bg-white rounded-4">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <label
          className="fw-bold mb-0 text-dark"
          style={{ fontSize: "0.85rem" }}
        >
          Daily Capacity
        </label>
        <span
          className={`badge rounded-pill fw-bold ${
            limit < 100
              ? "bg-warning-subtle text-warning-emphasis border border-warning-subtle"
              : "bg-light text-dark border"
          }`}
          style={{ fontSize: "0.75rem" }}
        >
          {limit}% Available
        </span>
      </div>

      <input
        type="range"
        className="form-range custom-slider-thumb"
        min="10"
        max="100"
        step="5"
        value={limit}
        onChange={(e) => setLimit(e.target.value)}
        onMouseUp={(e) => handleSave(e.target.value)}
        onTouchEnd={(e) => handleSave(e.target.value)}
        style={{ cursor: "pointer" }}
      />

      <div className="d-flex justify-content-between mt-1">
        <small className="text-muted fw-medium" style={{ fontSize: "0.65rem" }}>
          Low Energy
        </small>
        <small className="text-muted fw-medium" style={{ fontSize: "0.65rem" }}>
          Full Power
        </small>
      </div>

      {saving && (
        <div className="text-center mt-1.5" style={{ height: "10px" }}>
          <small
            className="text-muted text-uppercase fw-bold tracking-wider"
            style={{ fontSize: "0.55rem" }}
          >
            Updating...
          </small>
        </div>
      )}
    </div>
  );
};

export default EnergySlider;
