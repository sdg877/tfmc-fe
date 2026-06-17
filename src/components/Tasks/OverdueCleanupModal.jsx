import React, { useState } from "react";

const OverdueCleanupModal = ({ tasks, onComplete, onMoveToToday, onSkip, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDateOptions, setShowDateOptions] = useState(false);

  if (!tasks || tasks.length === 0) return null;

  const currentTask = tasks[currentIndex];
  const totalTasks = tasks.length;

  const handleNext = () => {
    setShowDateOptions(false);
    if (currentIndex + 1 < totalTasks) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  return (
    <div
      className="modal show d-block shadow"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 4000 }}
    >
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "420px" }}>
        <div className="modal-content border-0 rounded-4 shadow-lg p-3">
          
          <div className="modal-header border-0 pb-0 d-flex flex-column align-items-center">
            <h5 className="fw-bold text-dark text-center mb-1">⏳ Backlog Cleanup</h5>
            <span className="badge bg-secondary-subtle text-secondary small rounded-pill px-2">
              Task {currentIndex + 1} of {totalTasks}
            </span>
          </div>

          <div className="modal-body py-4 text-center">
            <p className="text-muted small text-uppercase fw-bold mb-2">Overdue Item</p>
            <h4 className="fw-bold text-dark px-2 mb-3">{currentTask.title}</h4>
            <span className="badge rounded-pill px-3 py-2 bg-light text-secondary border">
              Due: {new Date(currentTask.dueDate).toLocaleDateString("en-GB")}
            </span>
          </div>

          <div className="modal-footer border-0 pt-0 d-grid gap-2">
            {!showDateOptions ? (
              <>
                <button 
                  className="btn btn-success rounded-pill py-2.5 fw-bold" 
                  onClick={() => setShowDateOptions(true)}
                >
                  ✓ Mark Complete...
                </button>
                <button 
                  className="btn btn-dark rounded-pill py-2.5 fw-bold" 
                  onClick={async () => {
                    await onMoveToToday(currentTask);
                    handleNext();
                  }}
                >
                  ➔ Move to Today
                </button>
                <button 
                  className="btn btn-light btn-sm rounded-pill py-2 text-muted fw-bold border-0 mt-1" 
                  onClick={() => {
                    onSkip(currentTask);
                    handleNext();
                  }}
                >
                  Leave Overdue / Skip
                </button>
              </>
            ) : (
              <div className="bg-light p-3 rounded-3 border w-100 text-center fade-in">
                <p className="small fw-bold text-dark mb-3">Which day should count this energy?</p>
                <div className="d-grid gap-2">
                  <button 
                    className="btn btn-success rounded-pill py-2 small fw-bold"
                    onClick={async () => {
                      await onComplete(currentTask, "today");
                      handleNext();
                    }}
                  >
                    ☀️ Add to Today's Energy
                  </button>
                  <button 
                    className="btn btn-outline-secondary rounded-pill py-2 small fw-bold bg-white"
                    onClick={async () => {
                      await onComplete(currentTask, "original");
                      handleNext();
                    }}
                  >
                    📅 Keep on Original Due Date
                  </button>
                  <button 
                    className="btn btn-link btn-sm text-decoration-none text-muted mt-1 shadow-none small"
                    onClick={() => setShowDateOptions(false)}
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default OverdueCleanupModal;