import { useEffect, useState } from "react";
import axios from "axios";
import AddTask from "../components/Tasks/AddTask";
import TaskItem from "../components/Tasks/TaskItem";
import EnergyProgress from "../components/Energy/EnergyProgress";
import EnergyWarningModal from "../components/Energy/EnergyWarningModal";
import AppLoader from "../components/Layout/AppLoader";

const pastelPalette = [
  { bg: "#f3e5f5", text: "#7b1fa2", border: "#ce93d8" },
  { bg: "#e8f5e9", text: "#2e7d32", border: "#a5d6a7" },
  { bg: "#e3f2fd", text: "#1565c0", border: "#90caf9" },
  { bg: "#fff3e0", text: "#e65100", border: "#ffcc80" },
  { bg: "#fce4ec", text: "#c2185b", border: "#f48fb1" },
  { bg: "#f1f8e9", text: "#558b2f", border: "#c5e1a5" },
  { bg: "#e0f7fa", text: "#00838f", border: "#b2ebf2" },
  { bg: "#fff9c4", text: "#fbc02d", border: "#fff59d" },
  { bg: "#efebe9", text: "#4e342e", border: "#d7ccc8" },
  { bg: "#ede7f6", text: "#4527a0", border: "#d1c4e9" },
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
  const [showEnergyBar, setShowEnergyBar] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningLevel, setWarningLevel] = useState(0);
  const [currentLoad, setCurrentLoad] = useState(0);
  const [selectedTask, setSelectedTask] = useState(null);

  const [silencedLevel, setSilencedLevel] = useState(() => {
    return parseInt(localStorage.getItem("silencedEnergyLevel")) || 0;
  });

  const baseURL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const calculateLoad = (taskList = [], calendarDrain = 0) => {
    if (!taskList || taskList.length === 0) return Number(calendarDrain);
    const todayString = new Date().toLocaleDateString("en-GB");

    const totalPoints = taskList.reduce((total, t) => {
      const isRelevant =
        (t.isCompleted &&
          t.updatedAt &&
          new Date(t.updatedAt).toLocaleDateString("en-GB") === todayString) ||
        t.isPlannedForToday ||
        (t.dueDate &&
          new Date(t.dueDate).toLocaleDateString("en-GB") === todayString);

      if (isRelevant) {
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
      border: `1px solid ${colors.border}`,
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resTasks = await axios.get(`${baseURL}/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(resTasks.data);

        const resUser = await axios.get(`${baseURL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (resUser.data) {
          setUser(resUser.data);
          setDailyLimit(Number(resUser.data.dailyEnergyLimit) || 100);
          setShowEnergyBar(resUser.data.settings?.showEnergyBar ?? true);

          if (resUser.data.googleConnected) {
            try {
              const resEnergy = await axios.get(
                `${baseURL}/users/energy-usage`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                },
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

    if (showEnergyBar) {
      let reachedLevel = 0;
      if (newLoad >= dailyLimit) reachedLevel = 100;
      else if (newLoad >= dailyLimit * 0.9) reachedLevel = 90;
      else if (newLoad >= dailyLimit * 0.8) reachedLevel = 80;

      if (reachedLevel > 0 && reachedLevel > silencedLevel) {
        setWarningLevel(reachedLevel);
        setShowWarning(true);
        setFilter((prev) => ({ ...prev, hideNonUrgent: true }));
      }
    }
  }, [tasks, googleDrain, showEnergyBar, silencedLevel, dailyLimit]);

  const handleTaskAdded = (newTask) => {
    setTasks([newTask, ...tasks]);
    setActiveTab("today");
  };

  if (loading) {
    return <AppLoader message="Just a sec..." />;
  }

  const todayTasks = tasks.filter(
    (t) => !t.isCompleted && (t.urgency === "now" || t.isPlannedForToday),
  );

  return (
    <div className="container py-4" style={{ maxWidth: "1000px" }}>
      <header className="mb-4">
        <h2 className="fw-bold text-dark mb-1">The Fast Minds Club</h2>
        <p className="text-muted small text-uppercase fw-bold ls-wide">
          Organise your day{user?.name ? `, ${user.name}` : ""}
        </p>
      </header>

      <ul className="nav nav-pills nav-fill mb-4 bg-light p-1 rounded-pill shadow-sm border">
        {["today", "all", "add"].map((tab) => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link rounded-pill fw-bold ${activeTab === tab ? "active bg-dark text-white" : "text-dark"}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "add"
                ? "+ Add Task"
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          </li>
        ))}
      </ul>

      {showEnergyBar && activeTab !== "add" && (
        <EnergyProgress
          tasks={tasks}
          dailyLimit={dailyLimit}
          googleDrain={googleDrain}
        />
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

      {/* Task Detail Modal - FIX IMPLEMENTED HERE */}
      {selectedTask && (
        <div
          className="modal fade show d-block"
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 1060,
          }}
          onClick={() => setSelectedTask(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header border-0 p-4 pb-0 d-flex justify-content-between align-items-start">
                <div>
                  <span
                    className="badge mb-2 text-uppercase"
                    style={getCategoryStyle(selectedTask.category)} // Using getCategoryStyle now
                  >
                    {selectedTask.category}
                  </span>
                  <h3 className="modal-title fw-bold text-dark">
                    {selectedTask.title}
                  </h3>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedTask(null)}
                ></button>
              </div>
              <div className="modal-body p-4 text-dark">
                {selectedTask.notes && (
                  <div className="mb-4">
                    <label className="small fw-bold text-muted text-uppercase ls-wide d-block mb-1">
                      Notes
                    </label>
                    <p
                      className="bg-light p-3 rounded-3 mb-0"
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {selectedTask.notes}
                    </p>
                  </div>
                )}
                <div className="row g-3">
                  <div className="col-6">
                    <label className="small fw-bold text-muted text-uppercase ls-wide d-block mb-1">
                      Urgency
                    </label>
                    <span className="badge rounded-pill px-3 py-2 bg-dark text-white">
                      {selectedTask.urgency.toUpperCase()}
                    </span>
                  </div>
                  <div className="col-6">
                    <label className="small fw-bold text-muted text-uppercase ls-wide d-block mb-1">
                      Due Date
                    </label>
                    <p className="fw-bold mb-0">
                      {selectedTask.dueDate
                        ? new Date(selectedTask.dueDate).toLocaleDateString(
                            "en-GB",
                          )
                        : "No date set"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 bg-light p-3 justify-content-start">
                <small className="text-muted">
                  Added on:{" "}
                  {new Date(
                    selectedTask.createdAt || Date.now(),
                  ).toLocaleDateString("en-GB")}
                </small>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "today" && (
        <div className="fade-in">
          {todayTasks.length > 0 ? (
            <div className="list-group list-group-flush shadow-sm rounded-4 overflow-hidden border">
              {todayTasks.map((t) => (
                <TaskItem
                  key={t._id}
                  task={t}
                  setTasks={setTasks}
                  showEnergyBar={showEnergyBar}
                  onSelect={setSelectedTask}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white p-5 text-center rounded-4 shadow-sm border">
              <div className="display-4 mb-3">✨</div>
              <h4 className="fw-bold text-dark">All caught up!</h4>
              <p className="text-muted mb-4">Your plate is clear for today.</p>
              <button
                className="btn btn-dark rounded-pill px-4 fw-bold"
                onClick={() => setActiveTab("add")}
              >
                + Add a Task
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === "all" && (
        <div className="fade-in">
          <div className="d-flex justify-content-between align-items-center mb-3 px-1">
            <div className="d-flex gap-2 align-items-center">
              <select
                className="form-select form-select-sm w-auto border-0 bg-light fw-bold rounded-pill px-3 shadow-sm"
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
              <div className="form-check form-switch small ms-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="hideNonUrgent"
                  checked={filter.hideNonUrgent}
                  onChange={(e) =>
                    setFilter({ ...filter, hideNonUrgent: e.target.checked })
                  }
                />
                <label
                  className="form-check-label text-muted fw-bold"
                  htmlFor="hideNonUrgent"
                >
                  Hide non-urgent
                </label>
              </div>
            </div>
            <div className="form-check form-switch small">
              <input
                className="form-check-input"
                type="checkbox"
                id="showComp"
                checked={showCompleted}
                onChange={() => setShowCompleted(!showCompleted)}
              />
              <label
                className="form-check-label text-muted fw-bold"
                htmlFor="showComp"
              >
                Show Completed
              </label>
            </div>
          </div>

          <div className="list-group list-group-flush shadow-sm rounded-4 overflow-hidden border">
            {tasks
              .filter((t) => {
                if (filter.category !== "all" && t.category !== filter.category)
                  return false;
                if (filter.hideNonUrgent && t.urgency !== "now") return false;
                if (!showCompleted && t.isCompleted) return false;
                return true;
              })
              .sort((a, b) => {
                if (a.isCompleted !== b.isCompleted)
                  return a.isCompleted ? 1 : -1;
                return new Date(b.createdAt) - new Date(a.createdAt);
              })
              .map((t) => (
                <div
                  key={t._id}
                  style={
                    t.isCompleted
                      ? { opacity: 0.6, filter: "grayscale(0.5)" }
                      : {}
                  }
                >
                  <TaskItem
                    key={t._id}
                    task={t}
                    user={user}
                    setTasks={setTasks}
                    onSelect={setSelectedTask}
                  />
                </div>
              ))}
          </div>
        </div>
      )}

      {activeTab === "add" && (
        <div className="bg-white p-4 rounded-4 shadow-sm border">
          <AddTask
            onTaskAdded={handleTaskAdded}
            showEnergyBar={showEnergyBar}
            user={user}
          />
        </div>
      )}
    </div>
  );
};

export default Tasks;
