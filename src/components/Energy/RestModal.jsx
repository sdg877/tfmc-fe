import React from "react";

const RestWarningModal = ({ isOpen, onClose, message, title = "Rest Period Active" }) => {
  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
      <div className="modal-dialog modal-dialog-centered modal-sm">
        <div className="modal-content border-0 shadow rounded-4 p-3">
          <div className="modal-header border-0 pb-1">
            <h6 className="modal-title fw-bold text-dark">{title}</h6>
            <button type="button" className="btn-close shadow-none small" onClick={onClose} />
          </div>
          <div className="modal-body py-2">
            <p className="text-muted small mb-0">{message}</p>
          </div>
          <div className="modal-footer border-0 pt-2">
            <button type="button" className="btn btn-dark btn-sm w-100 rounded-3 fw-bold" onClick={onClose}>
              Acknowledge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestWarningModal;