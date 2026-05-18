import React from "react";

export default function GoogleEventModal({ event, onClose }) {
  if (!event) return null;

  const startRaw = event.start?.dateTime || event.start?.date;
  const endRaw = event.end?.dateTime || event.end?.date;

  const formatDateTime = (val) => {
    if (!val) return "—";
    const d = new Date(val);
    return event.start?.dateTime
      ? d.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })
      : d.toLocaleDateString("en-GB", { dateStyle: "medium" });
  };

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 1060 }}
      onClick={onClose}
    >
      <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header border-0 p-4 pb-0 d-flex align-items-start justify-content-between">
            <div>
              <span className="badge bg-light text-dark border rounded-pill px-3 py-2 mb-2">
                🗓️ Google Calendar
              </span>
              <h3 className="modal-title fw-bold text-dark">{event.summary || "Untitled Event"}</h3>
            </div>
            <button type="button" className="btn-close shadow-none" onClick={onClose} />
          </div>
          <div className="modal-body p-4">
            <div className="row g-3 mb-3">
              <div className="col-6">
                <label className="small fw-bold text-muted text-uppercase d-block mb-1">Start</label>
                <p className="fw-bold mb-0">{formatDateTime(startRaw)}</p>
              </div>
              <div className="col-6">
                <label className="small fw-bold text-muted text-uppercase d-block mb-1">End</label>
                <p className="fw-bold mb-0">{formatDateTime(endRaw)}</p>
              </div>
            </div>
            {event.description && (
              <>
                <label className="small fw-bold text-muted text-uppercase d-block mb-1">Description</label>
                <p className="bg-light p-3 rounded-3 mb-0" style={{ whiteSpace: "pre-wrap" }}>
                  {event.description}
                </p>
              </>
            )}
            {event.location && (
              <div className="mt-3">
                <label className="small fw-bold text-muted text-uppercase d-block mb-1">Location</label>
                <p className="mb-0">📍 {event.location}</p>
              </div>
            )}
          </div>
          <div className="modal-footer border-0 bg-light p-3">
            <small className="text-muted">This event is managed in Google Calendar</small>
          </div>
        </div>
      </div>
    </div>
  );
}