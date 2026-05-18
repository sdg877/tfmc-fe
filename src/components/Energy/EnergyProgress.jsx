import React from "react";

const EnergyProgress = ({ tasks, dailyLimit }) => {
  const currentLimit = Number(dailyLimit) || 100;

  const calculateEnergyBreakdown = (list) => {
    if (!list || list.length === 0) return { completed: 0, planned: 0 };

    const today = new Date().toLocaleDateString("en-GB");
    const fallbackWeights = {
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

        const taskWeight =
          Number(t.weight) || fallbackWeights[t.category?.toLowerCase()] || 10;

        if (completedToday) {
          acc.completed += taskWeight;
        } else if (isPlannedToday || isDueToday) {
          acc.planned += taskWeight;
        }
        return acc;
      },
      { completed: 0, planned: 0 },
    );
  };

  const { completed, planned } = calculateEnergyBreakdown(tasks);
  const totalUnitsUsed = completed + planned;

  const usagePercentage =
    currentLimit > 0 ? Math.round((totalUnitsUsed / currentLimit) * 100) : 0;

  const completedWidth = Math.min((completed / 100) * 100, currentLimit);
  const plannedWidth = Math.min(
    (planned / 100) * 100,
    currentLimit - completedWidth,
  );
  const lockedWidth = 100 - currentLimit;

  const isOverload = totalUnitsUsed > currentLimit;
  const getBatteryColor = () => {
    if (isOverload) return "#f87171";
    if (totalUnitsUsed > currentLimit * 0.8) return "#fb923c";
    return "#34d399";
  };

  return (
    <div
      className="card p-3 mb-4 shadow-sm border-0 bg-white rounded-4"
      style={{ maxWidth: "340px" }}
    >
      <div className="mb-2">
        <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: "0.85rem" }}>
          Daily Energy Battery
        </h6>
        <div className="d-flex align-items-center gap-2 mt-1">
          <span
            className="fw-bold"
            style={{
              fontSize: "1.1rem",
              color: isOverload ? "#ef4444" : "#1e293b",
            }}
          >
            {usagePercentage}% Used
          </span>
          <span className="text-muted small">
            ({totalUnitsUsed} / {currentLimit} units)
          </span>
        </div>
      </div>

      <div className="d-flex align-items-center my-2">
        <div
          className="position-relative flex-grow-1"
          style={{
            height: "24px",
            border: "1.5px solid #cbd5e1",
            borderRadius: "6px",
            padding: "2px",
            backgroundColor: "#fff",
          }}
        >
          <div
            className="d-flex h-100 w-100 position-relative"
            style={{
              borderRadius: "3.5px",
              overflow: "hidden",
              backgroundColor: "#f1f5f9",
            }}
          >
            <div
              style={{
                width: `${completedWidth}%`,
                backgroundColor: getBatteryColor(),
                transition: "width 0.4s ease",
                height: "100%",
              }}
            />
            <div
              style={{
                width: `${plannedWidth}%`,
                backgroundColor: getBatteryColor(),
                opacity: 0.45,
                transition: "width 0.4s ease",
                height: "100%",
              }}
            />
            {lockedWidth > 0 && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  width: `${lockedWidth}%`,
                  backgroundColor: "#94a3b8",
                  backgroundImage:
                    "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.15) 4px, rgba(255,255,255,0.15) 8px)",
                  height: "100%",
                  borderLeft: "1.5px solid #64748b",
                }}
              />
            )}
          </div>
        </div>
        <div
          style={{
            width: "4px",
            height: "10px",
            backgroundColor: "#cbd5e1",
            borderRadius: "0 2.5px 2.5px 0",
            marginLeft: "-1px",
          }}
        />
      </div>

      <div className="d-flex gap-3 mt-1 border-top pt-2">
        <small
          className="fw-bold text-uppercase text-muted"
          style={{ fontSize: "0.58rem" }}
        >
          <span style={{ color: getBatteryColor() }}>●</span> Completed:{" "}
          {completed}
        </small>
        <small
          className="fw-bold text-uppercase text-muted"
          style={{ fontSize: "0.58rem" }}
        >
          <span style={{ opacity: 0.5, color: getBatteryColor() }}>●</span>{" "}
          Planned: {planned}
        </small>
      </div>

      {isOverload && (
        <div
          className="mt-2 text-danger fw-bold"
          style={{ fontSize: "0.68rem" }}
        >
          ⚠️ OVERLOAD: Tasks exceed lowered energy capacity.
        </div>
      )}
    </div>
  );
};

export default EnergyProgress;
