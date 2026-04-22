import { useState, useEffect } from "react";
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
        `${baseURL}/users/profile`,
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
    <div className="card p-3 border-0 shadow-sm bg-white">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <label className="fw-bold mb-0">Daily Capacity</label>
        <span
          className={`badge ${limit < 100 ? "bg-warning text-dark" : "bg-primary"}`}
        >
          {limit}%
        </span>
      </div>

      <input
        type="range"
        className="form-range"
        min="10"
        max="100"
        step="5"
        value={limit}
        onChange={(e) => setLimit(e.target.value)}
        onMouseUp={(e) => handleSave(e.target.value)}
        onTouchEnd={(e) => handleSave(e.target.value)}
      />

      <div className="d-flex justify-content-between mt-1">
        <small className="text-muted">Low Energy</small>
        <small className="text-muted">Full Power</small>
      </div>

      {saving && (
        <div className="text-center mt-2">
          <small className="text-primary">Saving...</small>
        </div>
      )}
    </div>
  );
};

export default EnergySlider;
