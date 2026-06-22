import React from "react";

const EnergyProgress = ({ tasks, dailyLimit, user, viewMode = "battery" }) => {
  const currentLimit = Number(dailyLimit) || 100;

  const getCategoryWeight = (task) => {
    if (user?.categories?.length) {
      const cat = user.categories.find(
        (c) => c.name.toLowerCase() === task.category?.toLowerCase(),
      );
      if (cat) return cat.weight;
    }
    const fallbackWeights = {
      social: 10,
      physical: 15,
      admin: 20,
      focus: 25,
      stress: 35,
    };
    return fallbackWeights[task.category?.toLowerCase()] || 10;
  };

  const calculateEnergyBreakdown = (list) => {
    if (!list || list.length === 0) return { completed: 0, planned: 0 };

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayString = todayStart.toLocaleDateString("sv-SE");

    return list.reduce(
      (acc, t) => {
        const taskDate = t.completedAt || t.dueDate;
        const localTaskDate = taskDate
          ? new Date(taskDate).toLocaleDateString("sv-SE")
          : null;

        const isPlannedToday = t.isPlannedForToday === true;
        const matchesToday = localTaskDate === todayString;

        const isOverdue =
          !t.isCompleted &&
          t.dueDate &&
          new Date(t.dueDate).setHours(0, 0, 0, 0) < todayStart.getTime();

        const completedToday = t.isCompleted && matchesToday;
        const plannedForToday =
          !t.isCompleted && (isPlannedToday || matchesToday || isOverdue);

        const taskWeight = getCategoryWeight(t);

        if (completedToday) {
          acc.completed += taskWeight;
        } else if (plannedForToday) {
          acc.planned += taskWeight;
        }
        return acc;
      },
      { completed: 0, planned: 0 },
    );
  };

  const { completed, planned } = calculateEnergyBreakdown(tasks);
  const totalUnitsUsed = completed + planned;

  const batteryPercentage =
    currentLimit > 0
      ? Math.max(0, 100 - Math.round((totalUnitsUsed / currentLimit) * 100))
      : 100;
  const barPercentage =
    currentLimit > 0
      ? Math.min(100, Math.round((completed / currentLimit) * 100))
      : 0;

  const displayPercentage =
    viewMode === "battery" ? batteryPercentage : barPercentage;
  const completedWidth =
    currentLimit > 0 ? (completed / currentLimit) * 100 : 0;
  const isOverload = totalUnitsUsed > currentLimit;

  const getProgressColor = () => {
    if (isOverload) return "#f87171";

    if (viewMode === "battery") {
      if (batteryPercentage <= 20) return "#fb923c";
      return "#34d399";
    }

    if (barPercentage >= 80) return "#fb923c";
    return "#34d399";
  };

  return (
    <div
      className="card p-3 mb-4 shadow-sm border-0 bg-white rounded-4"
      style={{ maxWidth: "340px" }}
    >
      <div className="mb-2">
        <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: "0.85rem" }}>
          {viewMode === "battery" ? "Energy Battery" : "Progress Bar"}
        </h6>
        <div className="mt-1">
          <span
            className="fw-bold"
            style={{
              fontSize: "1.1rem",
              color: isOverload ? "#ef4444" : "#1e293b",
            }}
          >
            {displayPercentage}%{" "}
            {viewMode === "battery" ? "Remaining" : "Complete"}
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
            {viewMode === "battery" ? (
              <div
                style={{
                  width: `${Math.max(0, 100 - ((completed + planned) / currentLimit) * 100)}%`,
                  backgroundColor: getProgressColor(),
                  transition: "width 0.4s ease",
                  height: "100%",
                }}
              />
            ) : (
              <div
                style={{
                  width: `${Math.min(completedWidth, 100)}%`,
                  backgroundColor: getProgressColor(),
                  transition: "width 0.4s ease",
                  height: "100%",
                }}
              />
            )}
          </div>
        </div>
        {viewMode === "battery" && (
          <div
            style={{
              width: "4px",
              height: "10px",
              backgroundColor: "#cbd5e1",
              borderRadius: "0 2.5px 2.5px 0",
              marginLeft: "-1px",
            }}
          />
        )}
      </div>

      <div className="d-flex flex-wrap gap-3 mt-1 border-top pt-2">
        <small
          className="fw-bold text-uppercase text-muted"
          style={{ fontSize: "0.58rem" }}
        >
          ● Complete: {completed}
        </small>
        <small
          className="fw-bold text-uppercase text-muted"
          style={{ fontSize: "0.58rem" }}
        >
          ● Planned/Remaining: {planned}
        </small>
        <small
          className="fw-bold text-uppercase text-muted"
          style={{ fontSize: "0.58rem" }}
        >
          ● Max Capacity: {currentLimit}
        </small>
      </div>

      {isOverload && (
        <div
          className="mt-2 text-danger fw-bold"
          style={{ fontSize: "0.68rem" }}
        >
          Overload: Scheduled tasks exceed your capacity limit.
        </div>
      )}
    </div>
  );
};

export default EnergyProgress;
