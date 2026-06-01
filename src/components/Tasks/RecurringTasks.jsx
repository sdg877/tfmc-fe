// components/Settings/RecurringTasks.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const RecurringTasks = () => {
  const [recurringTasks, setRecurringTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseURL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRecurring = async () => {
      try {
        const res = await axios.get(`${baseURL}/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Filter out completed iterations so you only see the active templates
        const activeTemplates = res.data.filter(t => t.isRecurring && !t.isCompleted);
        setRecurringTasks(activeTemplates);
      } catch (err) {
        console.error("Failed to load recurring patterns", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecurring();
  }, [baseURL, token]);

  const handleStopRecurrence = async (id) => {
    try {
      const res = await axios.put(
        `${baseURL}/tasks/${id}`,
        { isRecurring: false, recurrence: "none" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRecurringTasks(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      console.error("Failed to update task recurrence", err);
    }
  };

  if (loading) return <p className="text-muted small">Loading schedules...</p>;

  return (
    <div className="card p-4 border rounded-4 shadow-sm bg-white mt-3">
      <h5 className="fw-bold text-dark mb-1">Recurring Routines</h5>
      <p className="text-muted small mb-4">
        Manage tasks that repeat automatically when completed.
      </p>

      {recurringTasks.length === 0 ? (
        <div className="p-3 text-center bg-light rounded-3 text-muted small">
          No recurring tasks active. Set one up from your task details menu.
        </div>
      ) : (
        <div className="list-group list-group-flush rounded-3 border overflow-hidden">
          {recurringTasks.map((task) => (
            <div key={task._id} className="list-group-item d-flex justify-content-between align-items-center p-3 bg-white">
              <div>
                <h6 className="fw-bold text-dark mb-1">{task.title}</h6>
                <div className="d-flex gap-2 align-items-center">
                  <span className="badge bg-secondary text-capitalize rounded-pill" style={{ fontSize: "0.7rem" }}>
                    🔄 {task.recurrence}
                  </span>
                  {task.dueDate && (
                    <small className="text-muted" style={{ fontSize: "0.72rem" }}>
                      Next due: {new Date(task.dueDate).toLocaleDateString("en-GB")}
                    </small>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleStopRecurrence(task._id)}
                className="btn btn-sm btn-outline-danger rounded-pill fw-bold"
                style={{ fontSize: "0.75rem" }}
              >
                Stop Repeating
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecurringTasks;