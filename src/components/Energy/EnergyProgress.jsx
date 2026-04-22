import React from "react";

const EnergyProgress = ({ tasks, dailyLimit }) => {
  const totalBarSpace = 100;

  const currentCapacity = Number(dailyLimit) || 100;

  const removedUnits = totalBarSpace - currentCapacity;

  const calculateTaskUnits = (list) => {
    const today = new Date().toLocaleDateString("en-GB");
    return list
      .filter(
        (t) =>
          !t.isCompleted &&
          (t.urgency === "now" ||
            t.isPlannedForToday ||
            (t.dueDate &&
              new Date(t.dueDate).toLocaleDateString("en-GB") === today)),
      )
      .reduce((total, t) => {
        const weights = {
          admin: 10,
          physical: 20,
          social: 30,
          focus: 40,
          stress: 50,
        };
        return total + (weights[t.category] || 10);
      }, 0);
  };

  const taskUnits = calculateTaskUnits(tasks);

  const combinedTotal = taskUnits + removedUnits;

  return (
    <div className="card p-3 mb-4 shadow-sm border-0 bg-light">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="fw-bold mb-0">Active Energy</h6>
        <span className="badge bg-dark px-3 py-2">{combinedTotal} / 100</span>
      </div>

      <div
        className="progress"
        style={{
          height: "35px",
          borderRadius: "18px",
          backgroundColor: "#e9ecef",
          overflow: "hidden",
        }}
      >
        <div
          className="progress-bar bg-success progress-bar-striped progress-bar-animated"
          style={{
            width: `${(taskUnits / totalBarSpace) * 100}%`,
            transition: "width 0.5s",
          }}
        >
          {taskUnits > 0 && <span className="fw-bold">{taskUnits}</span>}
        </div>

        {removedUnits > 0 && (
          <div
            className="progress-bar"
            style={{
              width: `${(removedUnits / totalBarSpace) * 100}%`,
              backgroundColor: "#6c757d",
              opacity: "0.5",
              borderLeft: "2px solid white",
            }}
          >
            <small className="fw-bold">REDUCED</small>
          </div>
        )}
      </div>

      {combinedTotal > 100 && (
        <div className="mt-2 text-danger small fw-bold text-center">
          ⚠️ Budget Exceeded: You only have {currentCapacity} units available.
        </div>
      )}
    </div>
  );
};

export default EnergyProgress;
