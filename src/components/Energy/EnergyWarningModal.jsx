const EnergyWarningModal = ({ show, onClose, energyUsed, limit, level }) => {
  if (!show) return null;

  const getMessage = () => {
    if (level >= 100)
      return {
        title: "CRITICAL LOAD",
        text: "You've hit your limit. Stop adding and start resting.",
        color: "text-danger",
      };
    if (level >= 90)
      return {
        title: "NEAR CAPACITY",
        text: "You are at 90%. Choose your next task very carefully.",
        color: "text-warning",
      };
    return {
      title: "ENERGY ALERT",
      text: "You've reached 80%. Consider winding down.",
      color: "text-info",
    };
  };

  const content = getMessage();

  return (
    <div
      className="modal show d-block shadow"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 rounded-4">
          <div className="modal-header border-0 pb-0">
            <h5 className={`fw-bold ${content.color}`}>{content.title}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body py-4">
            <p className="text-dark fw-medium">{content.text}</p>
            <div className="p-3 bg-light rounded-3 text-center">
              <span className="h4 fw-bold mb-0">{energyUsed} / 100</span>
            </div>
          </div>
          <div className="modal-footer border-0 pt-0">
            <button
              className="btn btn-dark w-100 rounded-pill"
              onClick={onClose}
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
