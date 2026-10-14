import React, { useState } from "react";

const EnergyWarningModal = ({
  show,
  onClose,
  energyUsed, // spent + planned for today (what the warning is triggered by)
  energySpent, // completed only (optional)
  limit,
  level,
}) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!show) return null;

  const cleanPlanned = Number(energyUsed) || 0;
  const cleanSpent = Number(energySpent) || 0;
  const cleanLimit = Number(limit) || 100;
  const actualPercent = Math.round((cleanPlanned / cleanLimit) * 100);

  const getMessage = () => {
    if (level >= 100)
      return {
        title: "CRITICAL LOAD",
        text: `Your day is ${actualPercent}% booked. Stop adding and start resting.`,
        color: "text-danger",
      };
    if (level >= 90)
      return {
        title: "NEAR CAPACITY",
        text: `Your day is ${actualPercent}% booked. Choose your next task very carefully.`,
        color: "text-warning",
      };
    return {
      title: "ENERGY ALERT",
      text: `Your day is ${actualPercent}% booked. Consider winding down.`,
      color: "text-info",
    };
  };

  const content = getMessage();

  const handleClose = () => {
    onClose(dontShowAgain);
    setDontShowAgain(false);
  };

  return (
    <div
      className="modal show d-block shadow"
      tabIndex="-1"
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
        zIndex: 2000,
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 rounded-4 shadow-lg">
          <div className="modal-header border-0 pb-0">
            <h5 className={`fw-bold ${content.color}`}>{content.title}</h5>
            <button
              type="button"
              className="btn-close shadow-none"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body py-4 text-center">
            <p
              className="text-dark fw-medium mb-4"
              style={{ fontSize: "1.1rem" }}
            >
              {content.text}
            </p>

            <div className="p-3 bg-light rounded-3 d-inline-block px-5 border">
              <span className="h2 fw-bold mb-0 text-dark">
                {cleanPlanned} / {cleanLimit}
              </span>
              <div className="text-muted small fw-bold mt-1">
                UNITS PLANNED
              </div>
              {energySpent !== undefined && (
                <div className="text-muted small mt-1">
                  {cleanSpent} spent so far
                </div>
              )}
            </div>

            <div className="mt-4 form-check d-flex justify-content-center align-items-center gap-2">
              <input
                className="form-check-input shadow-none"
                type="checkbox"
                id="silenceWarning"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                style={{ cursor: "pointer", width: "1.2em", height: "1.2em" }}
              />
              <label
                className="form-check-label small fw-bold text-muted"
                htmlFor="silenceWarning"
                style={{ cursor: "pointer" }}
              >
                Hide warnings for the {level}% bracket
              </label>
            </div>
          </div>
          <div className="modal-footer border-0 pt-0">
            <button
              className="btn btn-dark w-100 rounded-pill py-3 fw-bold shadow-sm"
              onClick={handleClose}
            >
              Understood
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergyWarningModal;