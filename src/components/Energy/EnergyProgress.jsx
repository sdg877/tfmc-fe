import React from "react";

const EnergyProgress = ({ tasks, dailyLimit }) => {
  const totalBarSpace = 100;
  const currentCapacity = Number(dailyLimit) || 100;
  const removedUnits = totalBarSpace - currentCapacity;

  const calculateEnergy = (list) => {
    const today = new Date().toLocaleDateString("en-GB");

    const weights = {
      quickwin: 5,
      admin: 10,
      physical: 20,
      social: 30,
      focus: 40,
      stress: 45,
    };

    return list
      .filter((t) => {
        const isPlannedToday = t.isPlannedForToday || t.urgency === "now";
        const isDueToday =
          t.dueDate &&
          new Date(t.dueDate).toLocaleDateString("en-GB") === today;

        // Include tasks completed today to show energy already spent
        const completedToday =
          t.isCompleted &&
          new Date(t.updatedAt).toLocaleDateString("en-GB") === today;

        return isPlannedToday || isDueToday || completedToday;
      })
      .reduce((total, t) => total + (weights[t.category] || 10), 0);
  };

  const taskUnits = calculateEnergy(tasks);
  const combinedTotal = taskUnits + removedUnits;

  const getBatteryColor = () => {
    if (combinedTotal > 90) return "#dc3545";
    if (combinedTotal > 60) return "#fd7e14";
    return "#198754";
  };

  return (
    <div className="card p-4 mb-4 shadow-sm border-0 bg-white rounded-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h6 className="fw-bold mb-0 text-dark">Daily Energy Battery</h6>
          <small
            className="text-muted text-uppercase fw-bold ls-wide"
            style={{ fontSize: "0.7rem" }}
          >
            Spent + Planned Energy
          </small>
        </div>
        <span
          className={`badge rounded-pill ${combinedTotal > 100 ? "bg-danger" : "bg-dark"} px-3 py-2`}
        >
          {combinedTotal} / 100 Units
        </span>
      </div>

      <div className="d-flex align-items-center">
        {/* Battery Body */}
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
            style={{ borderRadius: "6px", overflow: "hidden" }}
          >
            <div
              className="progress-bar-animated progress-bar-striped"
              style={{
                width: `${(taskUnits / totalBarSpace) * 100}%`,
                backgroundColor: getBatteryColor(),
                transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {taskUnits > 15 && (
                <span className="small fw-bold text-white">{taskUnits}%</span>
              )}
            </div>

            {removedUnits > 0 && (
              <div
                style={{
                  width: `${(removedUnits / totalBarSpace) * 100}%`,
                  backgroundColor: "#f8f9fa",
                  backgroundImage:
                    "linear-gradient(45deg, #e9ecef 25%, transparent 25%, transparent 50%, #e9ecef 50%, #e9ecef 75%, transparent 75%, transparent)",
                  backgroundSize: "8px 8px",
                  borderLeft: "2px solid #212529",
                }}
              />
            )}
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

      {combinedTotal > 100 && (
        <div className="mt-3 text-danger small fw-bold text-center animate-pulse border-top pt-2">
          ⚠️ OVERLOAD: Capacity exceeded. Prioritise rest.
        </div>
      )}
    </div>
  );
};

export default EnergyProgress;
