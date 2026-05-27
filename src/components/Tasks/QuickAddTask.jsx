import React, { useState } from "react";
import axios from "axios";

const QuickAddTask = ({ onTaskAdded, user }) => {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(false);
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

      // Pass the saved task up to update your array state instantly
      onTaskAdded(res.data);
      setTitle("");
    } catch (err) {
      console.error("Quick task dump failed:", err);
      alert(err.response?.data?.message || "Failed to dump task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2 bg-white">
      <h6 className="text-uppercase fw-bold text-muted small mb-3 px-1">
        Quick Brain Dump
      </h6>
      <form onSubmit={handleSubmit} className="d-flex gap-2">
        <input
          type="text"
          className="form-control form-control-lg border-0 bg-light rounded-pill px-4 shadow-none fs-6"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Type a task name and hit Enter to dump..."
          disabled={loading}
          required
        />
        <button
          type="submit"
          className="btn btn-dark rounded-pill px-4 fw-bold small"
          disabled={loading || !title.trim()}
        >
          {loading ? "..." : "Dump"}
        </button>
      </form>
      <small
        className="text-muted d-block mt-2 px-3"
        style={{ fontSize: "0.75rem" }}
      >
        Saved to your backlog. You can open it later to add weights, timings, or
        connect to Google Calendar.
      </small>
    </div>
  );
};

export default QuickAddTask;
