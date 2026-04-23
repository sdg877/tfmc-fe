import React from "react";

const EnergyWarningModal = ({ show, onClose, energyUsed, limit }) => {
  if (!show) return null;

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header bg-warning text-dark border-0">
            <h5 className="modal-title fw-bold">⚠️ Energy Limit Reached!</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body p-4 text-center">
            <div className="display-4 mb-3">🔋</div>
            <p className="fs-5">
              You've used <strong>{energyUsed}</strong> out of your{" "}
              <strong>{limit}</strong> daily points.
            </p>
            <p className="text-muted">
              Adding more tasks now might lead to burnout. Would you like to
              stop for today or keep going?
            </p>
          </div>
          <div className="modal-footer border-0 pb-4 justify-content-center">
            <button
              type="button"
              className="btn btn-dark rounded-pill px-4"
              onClick={onClose}
            >
              I'll Stop Here
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm border-0"
              onClick={onClose}
            >
              I understand, continue anyway
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergyWarningModal;
