import { useEffect, useState } from "react";
import axios from "axios";
import OverdueCleanupModal from "./OverdueCleanupModal";

const OverdueCleanupManager = ({ user }) => {
  const [queue, setQueue] = useState([]);
  const baseURL = import.meta.env.VITE_API_URL;
  const isLoggedIn = !!user;

  const authHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  useEffect(() => {
    if (!isLoggedIn) {
      setQueue([]);
      return;
    }

    const fetchOverdue = async () => {
      try {
        const res = await axios.get(`${baseURL}/tasks`, authHeaders());
        const todayMidnight = new Date();
        todayMidnight.setHours(0, 0, 0, 0);

        setQueue(
          res.data.filter(
            (t) =>
              !t.isCompleted &&
              t.dueDate &&
              new Date(t.dueDate).setHours(0, 0, 0, 0) <
                todayMidnight.getTime(),
          ),
        );
      } catch (err) {
        console.error("Overdue fetch failed", err);
      }
    };

    fetchOverdue();
  }, [isLoggedIn, baseURL]);

  const tasksChanged = () => window.dispatchEvent(new Event("tasks-changed"));

  const handleComplete = async (task, dateTarget) => {
    try {
      const completedAt =
        dateTarget === "today"
          ? new Date().toISOString()
          : new Date(task.dueDate).toISOString();
      await axios.put(
        `${baseURL}/tasks/${task._id}`,
        { isCompleted: true, completedAt },
        authHeaders(),
      );
      setQueue((prev) => prev.filter((o) => o._id !== task._id));
      tasksChanged();
    } catch (err) {
      console.error("Clean complete failed", err);
    }
  };

  const handleMoveToToday = async (task) => {
    try {
      const todayString = new Date().toLocaleDateString("sv-SE");
      await axios.put(
        `${baseURL}/tasks/${task._id}`,
        { dueDate: todayString, isPlannedForToday: true },
        authHeaders(),
      );
      setQueue((prev) => prev.filter((o) => o._id !== task._id));
      tasksChanged();
    } catch (err) {
      console.error("Clean update date failed", err);
    }
  };

  const handleSkip = (task) =>
    setQueue((prev) => prev.filter((o) => o._id !== task._id));

  if (queue.length === 0) return null;

  return (
    <OverdueCleanupModal
      tasks={queue}
      onComplete={handleComplete}
      onMoveToToday={handleMoveToToday}
      onSkip={handleSkip}
      onClose={() => setQueue([])}
    />
  );
};

export default OverdueCleanupManager;