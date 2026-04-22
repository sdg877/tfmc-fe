import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskCalendar from "../components/Tasks/TaskCalendar";

const Calendar = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseURL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(`${baseURL}/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(res.data);
      } catch (err) {
        console.error("Error fetching tasks for calendar", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [baseURL, token]);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-dark" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container-xl mt-4">
      <div className="mb-4">
        <h2 className="fw-bold mb-0 text-dark">Schedule Overview</h2>
      </div>

      <div className="bg-white rounded shadow-sm overflow-hidden">
        <TaskCalendar tasks={tasks} />
      </div>
    </div>
  );
};

export default Calendar;
