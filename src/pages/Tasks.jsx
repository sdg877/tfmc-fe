import { useEffect, useState } from "react";
import axios from "axios";
import AddTask from "../components/Tasks/AddTask";
import TaskItem from "../components/Tasks/TaskItem";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleNewTask = (newTask) => setTasks([newTask, ...tasks]);

  const filteredTasks = tasks.filter((t) => {
    if (!t || !t._id) return false;
    if (filter === "low-energy") return t.energyRequired <= 2;
    if (filter === "urgent") return t.urgency === "now";
    return true;
  });

  if (loading)
    return <div className="container mt-5 text-center">Loading tasks...</div>;

  return (
    <div className="container mt-4" style={{ maxWidth: "700px" }}>
      <header className="mb-4 d-flex justify-content-between align-items-center">
        <h2>Task Manager</h2>
        <span className="badge bg-secondary">{tasks.length} Total</span>
      </header>

      <AddTask onTaskAdded={handleNewTask} />

      <div className="btn-group w-100 mb-4 shadow-sm">
        <button
          className={`btn ${filter === "all" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setFilter("all")}
        >
          All Tasks
        </button>
        <button
          className={`btn ${filter === "urgent" ? "btn-danger" : "btn-outline-danger"}`}
          onClick={() => setFilter("urgent")}
        >
          Do Now
        </button>
        <button
          className={`btn ${filter === "low-energy" ? "btn-success" : "btn-outline-success"}`}
          onClick={() => setFilter("low-energy")}
        >
          Low Energy
        </button>
      </div>

      <div className="list-group">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((t) => (
            <TaskItem key={t._id} task={t} setTasks={setTasks} />
          ))
        ) : (
          <div className="text-center py-5 border rounded bg-light">
            <p className="text-muted mb-0">
              {filter === "all"
                ? "No tasks found."
                : "Nothing matches this filter!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
