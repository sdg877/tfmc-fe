import { useEffect, useState } from "react";
import axios from "axios";
import AddTask from "../components/Tasks/AddTask";
import TaskItem from "../components/Tasks/TaskItem";
import EnergyProgress from "../components/Energy/EnergyProgress";
import EnergyWarningModal from "../components/Energy/EnergyWarningModal";

const categoryStyles = {
  admin: {
    backgroundColor: "#f3e5f5",
    color: "#7b1fa2",
    border: "1px solid #ce93d8",
  },
  physical: {
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
    border: "1px solid #a5d6a7",
  },
  social: {
    backgroundColor: "#e3f2fd",
    color: "#1565c0",
    border: "1px solid #90caf9",
  },
  focus: {
    backgroundColor: "#fff3e0",
    color: "#e65100",
    border: "1px solid #ffcc80",
  },
  stress: {
    backgroundColor: "#fce4ec",
    color: "#c2185b",
    border: "1px solid #f48fb1",
  },
  default: {
    backgroundColor: "#f5f5f5",
    color: "#757575",
    border: "1px solid #e0e0e0",
  },
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [dailyLimit, setDailyLimit] = useState(100);
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

  const baseURL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const calculateLoad = (taskList = []) => {
    if (!taskList || taskList.length === 0) return 0;
    const today = new Date().toLocaleDateString("en-GB");
    const weights = {
      admin: 10,
      physical: 20,
      social: 30,
      focus: 40,
      stress: 45,
    };

    const todaysTasks = taskList.filter((t) => {
      const isPlanned = t.isPlannedForToday === true;
      const isDueToday =
        t.dueDate && new Date(t.dueDate).toLocaleDateString("en-GB") === today;
      const completedToday =
        t.isCompleted &&
        t.updatedAt &&
        new Date(t.updatedAt).toLocaleDateString("en-GB") === today;
      return isPlanned || isDueToday || completedToday;
    });

    return todaysTasks.reduce(
      (total, t) => total + (weights[t.category] || 10),
      0,
    );
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
    const newLoad = calculateLoad(tasks);
    setCurrentLoad(newLoad);

    if (showEnergyBar) {
      let reachedLevel = 0;
      if (newLoad >= 100) reachedLevel = 100;
      else if (newLoad >= 90) reachedLevel = 90;
      else if (newLoad >= 80) reachedLevel = 80;

      if (reachedLevel > 0 && reachedLevel !== warningLevel) {
        setWarningLevel(reachedLevel);
        setShowWarning(true);
        setFilter((prev) => ({ ...prev, hideNonUrgent: true }));
      }
    }
  }, [tasks, showEnergyBar, warningLevel]);

  const handleTaskAdded = (newTask) => {
    setTasks([newTask, ...tasks]);
    setActiveTab("today");
  };

  if (loading)
    return (
      <div className="container mt-5 text-center text-muted py-5">
        Loading...
      </div>
    );

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
        <EnergyProgress tasks={tasks} dailyLimit={dailyLimit} />
      )}

      <EnergyWarningModal
        show={showWarning}
        onClose={() => setShowWarning(false)}
        energyUsed={currentLoad}
        limit={dailyLimit}
        level={warningLevel}
      />

      {selectedTask && (
        <div
          className="modal fade show d-block"
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
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
                    style={
                      categoryStyles[selectedTask.category] ||
                      categoryStyles.default
                    }
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
              <div className="modal-body p-4">
                {selectedTask.notes && (
                  <div className="mb-4">
                    <label className="small fw-bold text-muted text-uppercase ls-wide d-block mb-1">
                      Notes
                    </label>
                    <p
                      className="bg-light p-3 rounded-3 text-dark mb-0"
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {selectedTask.notes}
                    </p>
                  </div>
                )}
                <div className="row g-3 text-dark">
                  <div className="col-6">
                    <label className="small fw-bold text-muted text-uppercase ls-wide d-block mb-1">
                      Urgency
                    </label>
                    <span
                      className={`badge rounded-pill px-3 py-2 bg-dark text-white`}
                    >
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
              {todayTasks
                .filter((t) => t._id !== selectedTask?._id)
                .map((t) => (
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
                <option value="admin">Admin</option>
                <option value="focus">Focus</option>
                <option value="physical">Physical</option>
                <option value="social">Social</option>
                <option value="stress">High Stress</option>
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
              .filter((t) => t._id !== selectedTask?._id)
              .sort((a, b) => {
                if (a.isCompleted !== b.isCompleted)
                  return a.isCompleted ? 1 : -1;
                return new Date(b.createdAt) - new Date(a.createdAt);
              })
              .map((t) => (
                <TaskItem
                  key={t._id}
                  task={t}
                  setTasks={setTasks}
                  showEnergyBar={showEnergyBar}
                  onSelect={setSelectedTask}
                />
              ))}
          </div>
        </div>
      )}

      {activeTab === "add" && (
        <div className="bg-white p-4 rounded-4 shadow-sm border">
          <AddTask
            onTaskAdded={handleTaskAdded}
            showEnergyBar={showEnergyBar}
          />
        </div>
      )}
    </div>
  );
};

export default Tasks;
