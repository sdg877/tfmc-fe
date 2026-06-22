import { useEffect, useState } from "react";
import axios from "axios";
import AddTask from "../components/Tasks/AddTask";
import QuickAddTask from "../components/Tasks/QuickAddTask";
import TaskItem from "../components/Tasks/TaskItem";
import EnergyProgress from "../components/Energy/EnergyProgress";
import EnergyWarningModal from "../components/Energy/EnergyWarningModal";
import AppLoader from "../components/Layout/AppLoader";
import TaskDetailModal from "../components/Tasks/TaskDetailModal";
import OverdueCleanupModal from "../components/Tasks/OverdueCleanupModal";

const pastelPalette = [
  { bg: "#FFF0F5", text: "#C71585", border: "#FFB6C1" },
  { bg: "#E6F3FF", text: "#1D4ED8", border: "#B9E0FF" },
  { bg: "#EAF9EE", text: "#166534", border: "#C1E7CC" },
  { bg: "#FFF0E5", text: "#C2410C", border: "#FFD3B6" },
  { bg: "#F3E8FF", text: "#6B21A8", border: "#E9D5FF" },
  { bg: "#E0F2FE", text: "#0369A1", border: "#BAE6FD" },
  { bg: "#FDF2F8", text: "#9D174D", border: "#FCE7F3" },
  { bg: "#F0FDFA", text: "#0F766E", border: "#CCFBF1" },
  { bg: "#F5F5F7", text: "#3A3A3C", border: "#D1D1D6" },
  { bg: "#FFEAEF", text: "#991B1B", border: "#FCA5A5" },
];

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [dailyLimit, setDailyLimit] = useState(100);
  const [googleDrain, setGoogleDrain] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("today");
  const [filter, setFilter] = useState({
    category: "all",
    hideNonUrgent: false,
  });
  const [showEnergyBar, Toast] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningLevel, setWarningLevel] = useState(0);
  const [currentLoad, setCurrentLoad] = useState(0);
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalMode, setModalMode] = useState("view");
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [overdueQueue, setOverdueQueue] = useState([]);

  const [energyViewMode, setEnergyViewMode] = useState(() => {
    return localStorage.getItem("energyViewMode") || "battery";
  });

  const [silencedLevel, setSilencedLevel] = useState(() => {
    return parseInt(localStorage.getItem("silencedEnergyLevel")) || 0;
  });

  const baseURL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const calculateLoad = (taskList = [], calendarDrain = 0) => {
    if (!taskList || taskList.length === 0) return Number(calendarDrain);

    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);
    const todayString = todayMidnight.toLocaleDateString("sv-SE");

    const totalPoints = taskList.reduce((total, t) => {
      const taskDate = t.completedAt || t.dueDate;
      const localTaskDate = taskDate
        ? new Date(taskDate).toLocaleDateString("sv-SE")
        : null;

      const matchesToday = localTaskDate === todayString;
      const completedToday = t.isCompleted && matchesToday;

      const isOverdue =
        !t.isCompleted &&
        t.dueDate &&
        new Date(t.dueDate).setHours(0, 0, 0, 0) < todayMidnight.getTime();

      const plannedForToday =
        !t.isCompleted && (t.isPlannedForToday || matchesToday || isOverdue);

      if (completedToday || plannedForToday) {
        const taskWeight = Number(t.energyRequired) || Number(t.energyPoints);

        if (taskWeight) {
          return total + taskWeight;
        }

        const catSettings = user?.categories?.find(
          (c) => c.name.toLowerCase() === t.category?.toLowerCase(),
        );
        return total + (catSettings?.weight || 10);
      }
      return total;
    }, 0);

    return totalPoints + Number(calendarDrain);
  };

  const getCategoryStyle = (catName) => {
    if (!user?.categories)
      return {
        backgroundColor: "#f5f5f5",
        color: "#757575",
        border: "1px solid #e0e0e0",
      };
    const index = user.categories.findIndex(
      (c) => c.name.toLowerCase() === catName?.toLowerCase(),
    );
    const styleIndex = index !== -1 ? index : 0;
    const colors = pastelPalette[styleIndex % pastelPalette.length];
    return {
      backgroundColor: colors.bg,
      color: colors.text,
      border: `2px solid ${colors.border}`,
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resTasks = await axios.get(`${baseURL}/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(resTasks.data);

        const todayMidnight = new Date();
        todayMidnight.setHours(0, 0, 0, 0);

        const overdue = resTasks.data.filter((t) => {
          if (t.isCompleted || !t.dueDate) return false;
          return (
            new Date(t.dueDate).setHours(0, 0, 0, 0) < todayMidnight.getTime()
          );
        });
        setOverdueQueue(overdue);

        const resUser = await axios.get(`${baseURL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (resUser.data) {
          setUser(resUser.data);
          setDailyLimit(Number(resUser.data.dailyEnergyLimit) || 100);
          Toast(resUser.data.settings?.showEnergyBar ?? true);

          if (resUser.data.googleConnected) {
            try {
              const resEnergy = await axios.get(
                `${baseURL}/users/energy-usage`,
                { headers: { Authorization: `Bearer ${token}` } },
              );
              setGoogleDrain(resEnergy.data.googleEnergyDrain || 0);
            } catch (err) {
              console.error("Google Energy fetch failed", err);
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [baseURL, token]);

  useEffect(() => {
    const newLoad = calculateLoad(tasks, googleDrain);
    setCurrentLoad(newLoad);

    if (showEnergyBar && dailyLimit > 0) {
      const currentPercent = Math.round((newLoad / dailyLimit) * 100);
      let reachedLevel = 0;

      if (currentPercent >= 100) reachedLevel = 100;
      else if (currentPercent >= 90) reachedLevel = 90;
      else if (currentPercent >= 80) reachedLevel = 80;

      if (
        reachedLevel > 0 &&
        reachedLevel > silencedLevel &&
        currentPercent >= reachedLevel
      ) {
        setWarningLevel(reachedLevel);
        setShowWarning(true);
        setFilter((prev) => ({ ...prev, hideNonUrgent: true }));
      } else if (currentPercent < silencedLevel) {
        setSilencedLevel(reachedLevel);
        localStorage.setItem("silencedEnergyLevel", reachedLevel.toString());
      }
    }
  }, [tasks, googleDrain, showEnergyBar, silencedLevel, dailyLimit]);

  useEffect(() => {
    const handleStorageChange = () => {
      setEnergyViewMode(localStorage.getItem("energyViewMode") || "battery");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleCleanComplete = async (task, dateTarget) => {
    try {
      const completedTimestamp =
        dateTarget === "today"
          ? new Date().toISOString()
          : new Date(task.dueDate).toISOString();

      const res = await axios.put(
        `${baseURL}/tasks/${task._id}`,
        {
          isCompleted: true,
          completedAt: completedTimestamp,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setTasks((prev) => prev.map((t) => (t._id === task._id ? res.data : t)));
      setOverdueQueue((prev) => prev.filter((o) => o._id !== task._id));
    } catch (err) {
      console.error("Clean complete failed", err);
    }
  };

  const handleCleanMoveToToday = async (task) => {
    try {
      const todayString = new Date().toISOString().split("T")[0];
      const res = await axios.put(
        `${baseURL}/tasks/${task._id}`,
        { dueDate: todayString, isPlannedForToday: true },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setTasks((prev) => prev.map((t) => (t._id === task._id ? res.data : t)));
      setOverdueQueue((prev) => prev.filter((o) => o._id !== task._id));
    } catch (err) {
      console.error("Clean update date failed", err);
    }
  };

  const handleCleanSkip = (task) => {
    setOverdueQueue((prev) => prev.filter((o) => o._id !== task._id));
  };

  const handleTaskAdded = (newTask) => {
    setTasks([newTask, ...tasks]);
  };

  const handleUpdateTask = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === updatedTask._id ? updatedTask : t)),
    );
    setSelectedTask(updatedTask);
  };

  const handleDeleteTask = async (taskId, googleId) => {
    try {
      await axios.delete(`${baseURL}/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { googleEventId: googleId },
      });
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      setSelectedTask(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectTask = (task, mode = "view") => {
    setSelectedTask(task);
    setModalMode(mode);
  };

  if (loading) {
    return <AppLoader message="Just a sec..." />;
  }

  const todayTasks = tasks.filter(
    (t) => !t.isCompleted && (t.urgency === "now" || t.isPlannedForToday),
  );

  return (
    <div className="container py-4" style={{ maxWidth: "720px" }}>
      <header className="mb-4 text-center">
        <h2 className="fw-bold text-dark mb-1">The Fast Minds Club</h2>
        <p className="text-muted small text-uppercase fw-bold ls-wide mb-0">
          Organise your day{user?.name ? `, ${user.name}` : ""}
        </p>
      </header>

      <div className="d-flex justify-content-center mb-4">
        <ul
          className="nav nav-pills bg-light p-1 rounded-pill shadow-sm border"
          style={{ width: "fit-content" }}
        >
          {["today", "all", "add"].map((tab) => (
            <li className="nav-item" key={tab}>
              <button
                className={`nav-link rounded-pill fw-bold px-4 ${activeTab === tab ? "active bg-dark text-white" : "text-dark"}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "add"
                  ? "+ Add Detailed"
                  : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {showEnergyBar && activeTab !== "add" && (
        <div className="mb-4 px-2">
          <EnergyProgress
            tasks={tasks}
            dailyLimit={dailyLimit}
            user={user}
            viewMode={energyViewMode}
          />
        </div>
      )}

      {activeTab === "today" && (
        <div className="mb-3 px-2">
          <button
            type="button"
            className="btn btn-link btn-sm text-decoration-none p-0 text-muted fw-bold shadow-none"
            onClick={() => setShowQuickAdd(!showQuickAdd)}
          >
            {showQuickAdd ? "✕ Close Quick Add" : "+ Quick Add"}
          </button>
        </div>
      )}

      {activeTab === "today" && (
        <div className="fade-in px-2">
          {showQuickAdd && (
            <QuickAddTask
              onTaskAdded={(newTask) => handleTaskAdded(newTask)}
              user={user}
            />
          )}

          {todayTasks.length > 0 ? (
            <div
              className="d-grid gap-3 mt-3"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                alignItems: "start",
              }}
            >
              {todayTasks.map((t) => (
                <TaskItem
                  key={t._id}
                  task={t}
                  user={user}
                  setTasks={setTasks}
                  onSelect={handleSelectTask}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white p-5 text-center rounded-4 shadow-sm border mt-3">
              <div className="mb-2" style={{ fontSize: "2rem" }}>
                ✨
              </div>
              <h4 className="fw-bold text-dark">All caught up!</h4>
              <p className="text-muted mb-0">Your plate is clear for today.</p>
            </div>
          )}
        </div>
      )}

      <EnergyWarningModal
        show={showWarning}
        onClose={(isSilenced) => {
          setShowWarning(false);
          if (isSilenced) {
            setSilencedLevel(warningLevel);
            localStorage.setItem(
              "silencedEnergyLevel",
              warningLevel.toString(),
            );
          }
        }}
        energyUsed={currentLoad}
        limit={dailyLimit}
        level={warningLevel}
      />

      <TaskDetailModal
        show={!!selectedTask}
        task={selectedTask}
        mode={modalMode}
        user={user}
        onClose={() => setSelectedTask(null)}
        onSwitchMode={(newMode) => setModalMode(newMode)}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
        onToggleComplete={async (task) => {
          const token = localStorage.getItem("token");
          try {
            const res = await axios.put(
              `${import.meta.env.VITE_API_URL}/tasks/${task._id}`,
              { isCompleted: !task.isCompleted },
              { headers: { Authorization: `Bearer ${token}` } },
            );
            handleUpdateTask(res.data);
          } catch (err) {
            console.error("Quick toggle failed", err);
          }
        }}
        getCategoryStyle={getCategoryStyle}
      />

      {activeTab === "all" && (
        <div className="fade-in px-2">
          <div className="d-flex justify-content-between align-items-center mb-3 px-1 bg-light p-2 rounded-4 border shadow-sm small">
            <div className="d-flex gap-2 align-items-center">
              <select
                className="form-select form-select-sm w-auto border-0 bg-white fw-bold rounded-pill px-3 shadow-none"
                value={filter.category}
                onChange={(e) =>
                  setFilter({ ...filter, category: e.target.value })
                }
              >
                <option value="all">All Categories</option>
                {user?.categories?.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <div className="form-check form-switch ms-2 mb-0 d-flex align-items-center gap-2">
                <input
                  className="form-check-input mt-0"
                  type="checkbox"
                  id="hideNonUrgent"
                  checked={filter.hideNonUrgent}
                  onChange={(e) =>
                    setFilter({ ...filter, hideNonUrgent: e.target.checked })
                  }
                />
                <label
                  className="form-check-label text-muted fw-bold mb-0"
                  htmlFor="hideNonUrgent"
                  style={{ cursor: "pointer" }}
                >
                  Hide non-urgent
                </label>
              </div>
            </div>
            <div className="form-check form-switch mb-0 d-flex align-items-center gap-2">
              <input
                className="form-check-input mt-0"
                type="checkbox"
                id="showComp"
                checked={showCompleted}
                onChange={() => setShowCompleted(!showCompleted)}
              />
              <label
                className="form-check-label text-muted fw-bold mb-0"
                htmlFor="showComp"
                style={{ cursor: "pointer" }}
              >
                Show Completed
              </label>
            </div>
          </div>

          <div
            className="d-grid gap-3"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              alignItems: "start",
            }}
          >
            {tasks
              .filter((t) => {
                if (filter.category !== "all" && t.category !== filter.category)
                  return false;
                if (filter.hideNonUrgent && t.urgency !== "now") return false;
                if (!showCompleted && t.isCompleted) return false;
                return true;
              })
              .sort((a, b) => {
                if (a.isCompleted !== b.isCompleted) {
                  return a.isCompleted ? 1 : -1;
                }

                if (a.isCompleted && b.isCompleted) {
                  const dateA = new Date(a.completedAt || a.updatedAt || 0);
                  const dateB = new Date(b.completedAt || b.updatedAt || 0);
                  return dateB - dateA;
                }

                if (a.dueDate && !b.dueDate) return -1;
                if (!a.dueDate && b.dueDate) return 1;
                if (a.dueDate && b.dueDate) {
                  return new Date(a.dueDate) - new Date(b.dueDate);
                }

                return new Date(b.createdAt) - new Date(a.createdAt);
              })
              .map((t) => (
                <div
                  key={t._id}
                  style={{
                    width: "100%",
                    ...(t.isCompleted
                      ? { opacity: 0.6, filter: "grayscale(0.5)" }
                      : {}),
                  }}
                >
                  <TaskItem
                    task={t}
                    user={user}
                    setTasks={setTasks}
                    onSelect={handleSelectTask}
                  />
                </div>
              ))}
          </div>
        </div>
      )}

      {activeTab === "add" && (
        <div className="bg-white p-4 rounded-4 shadow-sm border mx-2">
          <AddTask
            onTaskAdded={(task) => {
              handleTaskAdded(task);
              setActiveTab("today");
            }}
            showEnergyBar={showEnergyBar}
            user={user}
            tasks={tasks}
          />
        </div>
      )}

      {overdueQueue.length > 0 && (
        <OverdueCleanupModal
          tasks={overdueQueue}
          onComplete={handleCleanComplete}
          onMoveToToday={handleCleanMoveToToday}
          onSkip={handleCleanSkip}
          onClose={() => setOverdueQueue([])}
        />
      )}
    </div>
  );
};

export default Tasks;
