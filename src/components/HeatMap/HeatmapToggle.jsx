import React from "react";

const HeatmapToggle = ({ showHeatMap, onUpdate }) => {
  return (
    <div className="d-flex justify-content-between align-items-center">
      <div>
        <p className="fw-bold mb-0">Progress Tracker Grid</p>
        <p className="small text-muted mb-0">
          Display or hide your visual consistency heatmap dashboard.
        </p>
      </div>
      <div className="form-check form-switch fs-5">
        <input
          className="form-check-input"
          type="checkbox"
          id="heatmapToggleSwitch"
          checked={showHeatMap}
          onChange={(e) => onUpdate(e.target.checked)}
          style={{ cursor: "pointer" }}
        />
      </div>
    </div>
  );
};

export default HeatmapToggle;