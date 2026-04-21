import { useEffect, useState } from "react";
import axios from "axios";
import AddTask from "../components/Tasks/AddTask";
import TaskItem from "../components/Tasks/TaskItem";
import EnergyProgress from "../components/Tasks/EnergyProgress";
import TaskCalendar from "../components/Tasks/TaskCalendar";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [dailyLimit, setDailyLimit] = useState(100);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const baseURL = import.meta.env.VITE_API_URL;

        const resTasks = await axios.get(`${baseURL}/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(resTasks.data);

        const resUser = await axios.get(`${baseURL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resUser.data.dailyEnergyLimit) {
          setDailyLimit(resUser.data.dailyEnergyLimit);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
    <div className="container mt-4" style={{ maxWidth: "800px" }}>
      <header className="mb-4 d-flex justify-content-between align-items-center">
        <h2 className="fw-bold">Task Manager</h2>
        <span className="badge bg-dark p-2">{tasks.length} Tasks Total</span>
      </header>

      <section className="mb-4">
        <EnergyProgress tasks={tasks} dailyLimit={dailyLimit} />
      </section>

      <section className="mb-5">
        <h5 className="mb-3">Task Schedule</h5>
        <TaskCalendar tasks={tasks} />
      </section>

      <hr className="my-5" />
      <section className="mb-4">
        <h5 className="mb-3">Add New Task</h5>
        <AddTask onTaskAdded={handleNewTask} />
      </section>

      <div className="btn-group w-100 mb-4 shadow-sm">
        <button
          className={`btn ${filter === "all" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`btn ${filter === "urgent" ? "btn-danger" : "btn-outline-danger"}`}
          onClick={() => setFilter("urgent")}
        >
          Urgent (Now)
        </button>
        <button
          className={`btn ${filter === "low-energy" ? "btn-success" : "btn-outline-success"}`}
          onClick={() => setFilter("low-energy")}
        >
          Low Energy
        </button>
      </div>

      <div className="list-group pb-5">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((t) => (
            <TaskItem key={t._id} task={t} setTasks={setTasks} />
          ))
        ) : (
          <div className="text-center py-5 border rounded bg-light italic text-muted">
            {filter === "all"
              ? "Your list is empty. Add something above!"
              : "No tasks match this filter."}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
