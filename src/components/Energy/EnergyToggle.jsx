import React from "react";
import axios from "axios";

const EnergyToggle = ({ showEnergyBar, onUpdate }) => {
  const token = localStorage.getItem("token");
  const baseURL = import.meta.env.VITE_API_URL;

  const handleToggle = async () => {
    const newValue = !showEnergyBar;
    try {
      await axios.put(
        `${baseURL}/users/profile`,
        { settings: { showEnergyBar: newValue } },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      onUpdate(newValue);
    } catch (err) {
      console.error("Failed to update settings", err);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-between">
      <div className="pe-4">
        <span className="fw-bold d-block text-dark mb-1">
          Energy Management
        </span>
        <span className="text-muted small">
          Display relative brain load and task intensity indicators across the
          application.
        </span>
      </div>

      <div className="form-check form-switch p-0 m-0">
        <input
          className="form-check-input ms-0"
          type="checkbox"
          role="switch"
          id="energySwitch"
          checked={!!showEnergyBar}
          onChange={handleToggle}
          style={{ width: "2.8rem", height: "1.4rem", cursor: "pointer" }}
        />
      </div>
    </div>
  );
};

export default EnergyToggle;
