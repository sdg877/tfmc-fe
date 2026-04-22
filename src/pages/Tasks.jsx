import { useEffect, useState } from "react";
import axios from "axios";
import AddTask from "../components/Tasks/AddTask";
import TaskItem from "../components/Tasks/TaskItem";
import EnergyProgress from "../components/Energy/EnergyProgress";
import TaskCalendar from "../components/Tasks/taskCalendar";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [dailyLimit, setDailyLimit] = useState(100);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("today");
  const [filter, setFilter] = useState({ category: "all", urgency: "all" });

  const baseURL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

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

        if (resUser.data && resUser.data.dailyEnergyLimit !== undefined) {
          setDailyLimit(Number(resUser.data.dailyEnergyLimit));
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [baseURL, token]);

  // --- THE MISSING LOGIC ---
  const handleToggleComplete = async (id, isCompleted) => {
    try {
      const res = await axios.put(
        `${baseURL}/tasks/${id}`,
        { isCompleted: !isCompleted },
        { headers: { Authorization: `Bearer ${token}` } }
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
  // -------------------------

  const filteredTasks = tasks.filter((t) => {
    const categoryMatch = filter.category === "all" || t.category === filter.category;
    const urgencyMatch = filter.urgency === "all" || t.urgency === filter.urgency;
    return categoryMatch && urgencyMatch;
  });

  if (loading) return <div className="container mt-5 text-center">Loading...</div>;

  return (
    <div className="container mt-4" style={{ maxWidth: "1000px" }}>
      <h2 className="fw-bold mb-4">Task Manager</h2>

      <ul className="nav nav-pills nav-fill mb-4 bg-light p-1 rounded-pill shadow-sm">
        <li className="nav-item">
          <button className={`nav-link rounded-pill fw-bold ${activeTab === "today" ? "active bg-dark text-white" : "text-dark"}`} onClick={() => setActiveTab("today")}>Today</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link rounded-pill fw-bold ${activeTab === "calendar" ? "active bg-dark text-white" : "text-dark"}`} onClick={() => setActiveTab("calendar")}>Calendar</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link rounded-pill fw-bold ${activeTab === "all" ? "active bg-dark text-white" : "text-dark"}`} onClick={() => setActiveTab("all")}>All Tasks</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link rounded-pill fw-bold ${activeTab === "add" ? "active bg-dark text-white" : "text-dark"}`} onClick={() => setActiveTab("add")}>+ Add Task</button>
        </li>
      </ul>

      {activeTab === "today" && (
        <div>
          <EnergyProgress key={dailyLimit} tasks={tasks} dailyLimit={dailyLimit} />
          <div className="list-group shadow-sm mt-3">
            {tasks.filter(t => !t.isCompleted && (t.urgency === 'now' || t.isPlannedForToday)).map((t) => (
              <TaskItem key={t._id} task={t} onToggle={handleToggleComplete} onDelete={handleDeleteTask} />
            ))}
          </div>
        </div>
      )}

      {activeTab === "calendar" && (
        <div className="bg-white p-3 rounded shadow-sm">
          <TaskCalendar tasks={tasks} />
        </div>
      )}

      {activeTab === "all" && (
        <div>
          <div className="d-flex gap-2 mb-3">
            <select className="form-select form-select-sm w-auto" value={filter.category} onChange={(e) => setFilter({...filter, category: e.target.value})}>
              <option value="all">All Categories</option>
              <option value="admin">Admin</option>
              <option value="focus">Focus</option>
              <option value="physical">Physical</option>
              <option value="social">Social</option>
            </select>
            <select className="form-select form-select-sm w-auto" value={filter.urgency} onChange={(e) => setFilter({...filter, urgency: e.target.value})}>
              <option value="all">All Urgency</option>
              <option value="now">Now</option>
              <option value="soon">Soon</option>
              <option value="later">Later</option>
            </select>
          </div>
          <div className="list-group shadow-sm">
            {filteredTasks.map((t) => (
              <TaskItem key={t._id} task={t} onToggle={handleToggleComplete} onDelete={handleDeleteTask} />
            ))}
          </div>
        </div>
      )}

      {activeTab === "add" && (
        <div className="card p-4 shadow-sm border-0 bg-light">
          <AddTask onTaskAdded={(newTask) => { 
            setTasks([newTask, ...tasks]); 
            setActiveTab("today"); 
          }} />
        </div>
      )}
    </div>
  );
};

export default Tasks;