import { useState } from "react";
import axios from "axios";

const EditTask = ({ task, setTasks, setIsEditing }) => {
  const [editData, setEditData] = useState({
    title: task.title,
    category: task.category || "admin",
    dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
  });

  const token = localStorage.getItem("token");
  const baseURL = import.meta.env.VITE_API_URL;

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${baseURL}/tasks/${task._id}`, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (task.googleEventId) {
        const start = new Date(`${editData.dueDate}T09:00`);
        const end = new Date(start.getTime() + 30 * 60000);

        await axios.put(
          `${baseURL}/users/calendar/update`,
          {
            eventId: task.googleEventId,
            title: editData.title,
            startTime: start.toISOString(),
            endTime: end.toISOString(),
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      }

      setTasks((prev) => prev.map((t) => (t._id === task._id ? res.data : t)));
      setIsEditing(false);
    } catch (err) {
      console.error("Update failed", err);
      alert("Saved to app, but failed to sync with Google Calendar.");
    }
  };

  return (
    <form
      onSubmit={handleUpdate}
      className="list-group-item p-3 border-primary shadow-sm bg-light mb-2 rounded-4"
    >
      <input
        className="form-control mb-2 rounded-3 shadow-none"
        value={editData.title}
        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
        required
      />
      <div className="row g-2 mb-3">
        <div className="col-6">
          <select
            className="form-select form-select-sm rounded-3 shadow-none"
            value={editData.category}
            onChange={(e) =>
              setEditData({ ...editData, category: e.target.value })
            }
          >
            <option value="admin">Admin</option>
            <option value="physical">Physical</option>
            <option value="social">Social</option>
            <option value="focus">Focus</option>
            <option value="stress">Stress</option>
          </select>
        </div>
        <div className="col-6">
          <input
            type="date"
            className="form-control form-select-sm rounded-3 shadow-none"
            value={editData.dueDate}
            onChange={(e) =>
              setEditData({ ...editData, dueDate: e.target.value })
            }
          />
        </div>
      </div>
      <div className="d-flex gap-2">
        <button
          type="submit"
          className="btn btn-success btn-sm flex-grow-1 rounded-3 fw-bold"
        >
          Save
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm rounded-3"
          onClick={() => setIsEditing(false)}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditTask;
