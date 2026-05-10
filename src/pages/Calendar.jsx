import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskCalendar from "../components/Tasks/TaskCalendar";

const Calendar = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const [googleEvents, setGoogleEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseURL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const taskRes = await axios.get(`${baseURL}/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(taskRes.data);

        const calendarRes = await axios.get(
          `${baseURL}/users/calendar-events`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setGoogleEvents(calendarRes.data);
      } catch (err) {
        console.error("Error fetching schedule data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <h2 className="fw-bold mb-0 text-dark">Schedule Overview</h2>
        {user?.googleConnected && (
          <span className="badge bg-light text-dark border rounded-pill px-3">
            Google Calendar Active
          </span>
        )}
      </div>

      <div className="bg-white rounded-4 shadow-sm overflow-hidden border">
        <TaskCalendar tasks={tasks} googleEvents={googleEvents} />
      </div>
    </div>
  );
};

export default Calendar;
