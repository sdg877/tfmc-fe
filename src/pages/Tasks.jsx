import { useEffect, useState } from "react";
import axios from "axios";
import AddTask from "../components/Tasks/AddTask";
import TaskItem from "../components/Tasks/TaskItem";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading)
    return <div className="container mt-5 text-center">Loading tasks...</div>;

  return (
    <div className="container mt-4" style={{ maxWidth: "700px" }}>
      <header className="mb-4 d-flex justify-content-between align-items-center">
        <h2>Task Manager</h2>
        <span className="badge bg-secondary">{tasks.length} Tasks</span>
      </header>

      <AddTask onTaskAdded={handleNewTask} />

      {/* List Component */}
      <div className="list-group">
        {tasks && tasks.length > 0 && tasks[0]._id ? (
          tasks.map((t) => (
            <TaskItem key={t._id} task={t} setTasks={setTasks} />
          ))
        ) : (
          <div className="text-center py-5 border rounded bg-light">
            <p className="text-muted mb-0">No tasks found. Add one above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
