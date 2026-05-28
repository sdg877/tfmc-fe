import React, { useState } from "react";
import axios from "axios";

const QuickAddTask = ({ onTaskAdded, user }) => {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const token = localStorage.getItem("token");
    const baseURL = import.meta.env.VITE_API_URL;

    const defaultCategory = user?.categories?.[0]?.name || "";
    const defaultCost = user?.categories?.[0]?.weight || 0;

    try {
      setLoading(true);
      const res = await axios.post(
        `${baseURL}/tasks`,
        {
          title: title.trim(),
          category: defaultCategory,
          urgency: "soon",
          dueDate: "",
          energyRequired: defaultCost,
          notes: "",
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      onTaskAdded(res.data);
      setTitle("");
    } catch (err) {
      console.error("Quick add failed:", err);
      alert(err.response?.data?.message || "Failed to add task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-4 mb-3 shadow-sm border rounded-4 w-100 bg-white">
      <div className="mb-2">
        <h6 className="fw-bold text-uppercase text-muted" style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}>
          Quick Add Task
        </h6>
      </div>
      
      <form onSubmit={handleSubmit} className="d-flex gap-2 my-1">
        <input
          type="text"
          className="form-control form-control-lg border-0 bg-light rounded-pill px-4 shadow-none fs-6 flex-grow-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Type a task name and press Enter to save..."
          disabled={loading}
          required
        />
        <button 
          type="submit" 
          className="btn btn-dark rounded-pill px-4 fw-bold"
          disabled={loading || !title.trim()}
        >
          {loading ? "Saving..." : "Add"}
        </button>
      </form>
      
      <span className="text-muted small mt-1 d-block px-2" style={{ fontSize: "0.72rem" }}>
        Saved to your backlog. You can open it later to add weights, timings, or connect to Google Calendar.
      </span>
    </div>
  );
};

export default QuickAddTask;