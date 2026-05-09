import React from "react";

const EnergyProgress = ({ tasks, dailyLimit }) => {
  const currentCapacity = Number(dailyLimit) || 100;

  const calculateEnergyBreakdown = (list) => {
    if (!list || list.length === 0) return { completed: 0, planned: 0 };

    const today = new Date().toLocaleDateString("en-GB");
    const weights = {
      admin: 10,
      physical: 20,
      social: 30,
      focus: 40,
      stress: 45,
    };

    return list.reduce(
      (acc, t) => {
        const isPlannedToday = t.isPlannedForToday === true;
        const isDueToday =
          t.dueDate &&
          new Date(t.dueDate).toLocaleDateString("en-GB") === today;
        const completedToday =
          t.isCompleted &&
          t.updatedAt &&
          new Date(t.updatedAt).toLocaleDateString("en-GB") === today;

        if (completedToday) {
          acc.completed += weights[t.category] || 10;
        } else if (isPlannedToday || isDueToday) {
          acc.planned += weights[t.category] || 10;
        }
        return acc;
      },
      { completed: 0, planned: 0 },
    );
  };

  const { completed, planned } = calculateEnergyBreakdown(tasks);
  const totalUnits = completed + planned;

  const completedWidth = Math.min((completed / currentCapacity) * 100, 100);
  const plannedWidth = Math.min(
    (planned / currentCapacity) * 100,
    100 - completedWidth,
  );
  const totalPercentage = Math.min(
    Math.round((totalUnits / currentCapacity) * 100),
    100,
  );

  const getBatteryColor = () => {
    if (totalPercentage > 90) return "#dc3545";
    if (totalPercentage > 60) return "#fd7e14";
    return "#198754";
  };

  return (
    <div className="card p-4 mb-4 shadow-sm border-0 bg-white rounded-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h6 className="fw-bold mb-0 text-dark">Daily Energy Battery</h6>
          <div className="d-flex gap-3 mt-1">
            <small
              className="fw-bold text-uppercase"
              style={{ fontSize: "0.65rem", color: getBatteryColor() }}
            >
              ● Completed: {completed}
            </small>
            <small
              className="fw-bold text-uppercase text-muted"
              style={{ fontSize: "0.65rem" }}
            >
              ○ Planned: {planned}
            </small>
          </div>
        </div>
        <span
          className={`badge rounded-pill ${totalUnits > currentCapacity ? "bg-danger" : "bg-dark"} px-3 py-2`}
        >
          {totalUnits} / {currentCapacity} Units
        </span>
      </div>

      <div className="d-flex align-items-center">
        <div
          className="position-relative flex-grow-1"
          style={{
            height: "55px",
            border: "4px solid #212529",
            borderRadius: "14px",
            padding: "4px",
            backgroundColor: "#fff",
          }}
        >
          <div
            className="d-flex h-100 w-100"
            style={{
              borderRadius: "6px",
              overflow: "hidden",
              backgroundColor: "#f8f9fa",
            }}
          >
            <div
              style={{
                width: `${completedWidth}%`,
                backgroundColor: getBatteryColor(),
                transition: "width 0.6s ease",
                height: "100%",
              }}
            />
            <div
              className="progress-bar-striped progress-bar-animated"
              style={{
                width: `${plannedWidth}%`,
                backgroundColor: getBatteryColor(),
                opacity: 0.4,
                transition: "width 0.6s ease",
                height: "100%",
              }}
            />

            <div
              className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center"
              style={{ left: 0, top: 0 }}
            >
              <span
                className="small fw-bold"
                style={{ color: totalPercentage > 50 ? "#fff" : "#212529" }}
              >
                {totalPercentage}%
              </span>
            </div>
          </div>
        </div>
        <div
          style={{
            width: "10px",
            height: "22px",
            backgroundColor: "#212529",
            borderRadius: "0 5px 5px 0",
            marginLeft: "-1px",
          }}
        />
      </div>

      {totalUnits > currentCapacity && (
        <div className="mt-3 text-danger small fw-bold text-center animate-pulse border-top pt-2">
          ⚠️ OVERLOAD: Capacity exceeded.
        </div>
      )}
    </div>
  );
};

export default EnergyProgress;
