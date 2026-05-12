import React from "react";

const CustomModal = ({ show, onClose, onConfirm, title, message, type = "info" }) => {
  if (!show) return null;

  const getTheme = () => {
    switch (type) {
      case "danger": return { color: "text-danger", btn: "btn-danger" };
      case "success": return { color: "text-success", btn: "btn-success" };
      default: return { color: "text-dark", btn: "btn-dark" };
    }
  };

  const theme = getTheme();

  return (
    <div
      className="modal show d-block shadow"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 3000 }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 rounded-4 shadow-lg p-3">
          <div className="modal-header border-0 pb-0">
            <h5 className={`fw-bold ${theme.color}`}>{title}</h5>
            {!onConfirm && <button className="btn-close shadow-none" onClick={onClose}></button>}
          </div>
          <div className="modal-body py-4 text-center">
            <p className="text-dark fw-medium" style={{ fontSize: "1.1rem" }}>{message}</p>
          </div>
          <div className="modal-footer border-0 pt-0 gap-2">
            {onConfirm ? (
              <>
                <button className="btn btn-light rounded-pill px-4 fw-bold border" onClick={onClose}>
                  Cancel
                </button>
                <button className={`btn ${theme.btn} rounded-pill px-4 fw-bold`} onClick={onConfirm}>
                  Yes, Proceed
                </button>
              </>
            ) : (
              <button className="btn btn-dark w-100 rounded-pill py-3 fw-bold" onClick={onClose}>
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;