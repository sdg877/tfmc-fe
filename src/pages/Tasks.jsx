import { useEffect, useState } from "react";
import axios from "axios";
import AddTask from "../components/Tasks/AddTask";
import TaskItem from "../components/Tasks/TaskItem";
import EnergyProgress from "../components/Energy/EnergyProgress";
import EnergyWarningModal from "../components/Energy/EnergyWarningModal";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [dailyLimit, setDailyLimit] = useState(100);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("today");
  const [filter, setFilter] = useState({ category: "all", urgency: "all" });
  const [showEnergyBar, setShowEnergyBar] = useState(true);

  const [showCompleted, setShowCompleted] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningLevel, setWarningLevel] = useState(0);
  const [currentLoad, setCurrentLoad] = useState(0);

  const baseURL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const calculateLoad = (taskList = [], limit = 100) => {
    const today = new Date().toLocaleDateString("en-GB");
    const weights = {
      quickwin: 5,
      admin: 10,
      physical: 20,
      social: 30,
      focus: 40,
      stress: 45,
    };

    const taskUnits = taskList
      .filter((t) => {
        // ONLY count towards daily battery if:
        const isNow = t.urgency === "now";
        const isPlanned = t.isPlannedForToday === true;
        const isDueToday =
          t.dueDate &&
          new Date(t.dueDate).toLocaleDateString("en-GB") === today;
        const completedToday =
          t.isCompleted &&
          new Date(t.updatedAt).toLocaleDateString("en-GB") === today;

        return isNow || isPlanned || isDueToday || completedToday;
      })
      .reduce((total, t) => total + (weights[t.category] || 10), 0);

    const removedUnits = 100 - (limit || 100);
    return taskUnits + removedUnits;
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
          setDailyLimit(Number(resUser.data.dailyEnergyLimit) || 100);
          setShowEnergyBar(resUser.data.settings?.showEnergyBar ?? true);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [baseURL, token]);

  useEffect(() => {
    if (showEnergyBar) {
      const newLoad = calculateLoad(tasks, dailyLimit);
      setCurrentLoad(newLoad);
    }
  }, [tasks, dailyLimit, showEnergyBar]);

  const isRecent = (task) => {
    if (!task.isCompleted) return true;
    const completedAt = new Date(task.updatedAt);
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
    return completedAt > fortyEightHoursAgo;
  };

  const handleTaskAdded = (newTask) => {
    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);

    if (showEnergyBar) {
      const newLoad = calculateLoad(updatedTasks, dailyLimit);
      setCurrentLoad(newLoad);

      let reachedLevel = 0;
      if (newLoad >= 100) reachedLevel = 100;
      else if (newLoad >= 90) reachedLevel = 90;
      else if (newLoad >= 80) reachedLevel = 80;

      if (reachedLevel > 0) {
        setWarningLevel(reachedLevel);
        setShowWarning(true);
      }
    }
    setActiveTab("today");
  };

  const handleToggleComplete = async (id, isCompleted) => {
    try {
      const res = await axios.put(
        `${baseURL}/tasks/${id}`,
        { isCompleted: !isCompleted },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error("Error updating task", err);
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(`${baseURL}/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(tasks.filter((t) => t._id !== id));
      } catch (err) {
        console.error("Error deleting task", err);
      }
    }
  };

  if (loading)
    return (
      <div className="container mt-5 text-center text-muted py-5">
        Loading workspace...
      </div>
    );

  return (
    <div className="container py-4" style={{ maxWidth: "1000px" }}>
      <header className="mb-4">
        <h2 className="fw-bold text-dark mb-1">Task Manager</h2>
        <p className="text-muted small text-uppercase fw-bold ls-wide">
          Organise your day
        </p>
      </header>

      <ul className="nav nav-pills nav-fill mb-4 bg-light p-1 rounded-pill shadow-sm border">
        {["today", "all", "add"].map((tab) => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link rounded-pill fw-bold ${
                activeTab === tab ? "active bg-dark text-white" : "text-dark"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "add"
                ? "+ Add Task"
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          </li>
        ))}
      </ul>

      {showEnergyBar && (
        <EnergyProgress tasks={tasks} dailyLimit={dailyLimit} />
      )}

      <EnergyWarningModal
        show={showWarning}
        onClose={() => setShowWarning(false)}
        energyUsed={currentLoad}
        limit={dailyLimit}
        level={warningLevel}
      />

      {activeTab === "today" && (
        <div className="fade-in">
          <div className="list-group list-group-flush shadow-sm rounded-4 overflow-hidden border">
            {tasks.filter(
              (t) =>
                !t.isCompleted && (t.urgency === "now" || t.isPlannedForToday),
            ).length > 0 ? (
              tasks
                .filter(
                  (t) =>
                    !t.isCompleted &&
                    (t.urgency === "now" || t.isPlannedForToday),
                )
                .map((t) => (
                  <TaskItem
                    key={t._id}
                    task={t}
                    onToggle={handleToggleComplete}
                    onDelete={handleDeleteTask}
                    setTasks={setTasks}
                    showEnergyBar={showEnergyBar}
                  />
                ))
            ) : (
              <div className="bg-white p-5 text-center">
                <div className="display-6 mb-3">✨</div>
                <h5 className="fw-bold text-dark">All caught up!</h5>
                <p className="text-muted mb-4">
                  Plate is clear. Fancy getting ahead or taking a break?
                </p>
                <div className="d-flex gap-2 justify-content-center">
                  <button
                    className="btn btn-dark rounded-pill px-4 fw-bold"
                    onClick={() => setActiveTab("add")}
                  >
                    Add Task
                  </button>
                  <button
                    className="btn btn-outline-dark rounded-pill px-4 fw-bold"
                    onClick={() => setActiveTab("all")}
                  >
                    View All
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "all" && (
        <div className="fade-in">
          <div className="d-flex justify-content-between align-items-center mb-3 px-1">
            <select
              className="form-select form-select-sm w-auto border-0 bg-light fw-bold rounded-pill px-3 shadow-sm"
              value={filter.category}
              onChange={(e) =>
                setFilter({ ...filter, category: e.target.value })
              }
            >
              <option value="all">All Categories</option>
              <option value="quickwin">Quick Wins</option>
              <option value="admin">Admin</option>
              <option value="focus">Focus</option>
              <option value="physical">Physical</option>
              <option value="social">Social</option>
              <option value="stress">High Stress</option>
            </select>

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
                Show Completed (48h)
              </label>
            </div>
          </div>

          <div className="list-group list-group-flush shadow-sm rounded-4 overflow-hidden border">
            {tasks
              .filter(
                (t) =>
                  filter.category === "all" || t.category === filter.category,
              )
              .filter(isRecent)
              .filter((t) => showCompleted || !t.isCompleted)
              .map((t) => (
                <TaskItem
                  key={t._id}
                  task={t}
                  onToggle={handleToggleComplete}
                  onDelete={handleDeleteTask}
                  setTasks={setTasks}
                  showEnergyBar={showEnergyBar}
                />
              ))}
          </div>
        </div>
      )}

      {activeTab === "add" && (
        <div className="fade-in">
          <div className="bg-white p-4 rounded-4 shadow-sm border">
            <AddTask
              onTaskAdded={handleTaskAdded}
              showEnergyBar={showEnergyBar}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
