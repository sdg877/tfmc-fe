import { useState, useEffect } from "react";
import axios from "axios";

const AddTask = ({ onTaskAdded }) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    urgency: "soon",
    dueDate: "",
  });

  useEffect(() => {
    if (formData.dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const due = new Date(formData.dueDate);
      due.setHours(0, 0, 0, 0);

      const diffTime = due - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) {
        setFormData((prev) => ({ ...prev, urgency: "now" }));
      } else if (diffDays <= 3) {
        setFormData((prev) => ({ ...prev, urgency: "soon" }));
      } else {
        setFormData((prev) => ({ ...prev, urgency: "later" }));
      }
    }
  }, [formData.dueDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/tasks`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      onTaskAdded(res.data);

      setFormData({
        title: "",
        category: "",
        urgency: "soon",
        dueDate: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Check your input");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card p-3 mb-4 shadow-sm border-0 bg-white"
    >
      <div className="mb-3">
        <label className="small fw-bold text-muted">Task Title</label>
        <input
          className="form-control border-0 bg-light"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="What needs doing?"
          required
        />
      </div>

      <div className="row g-2">
        <div className="col-md-4">
          <label className="small fw-bold text-muted">
            Category (Brain Load)
          </label>
          <select
            className="form-select border-0 bg-light"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            required
          >
            <option value="" disabled>
              Select category...
            </option>
            <option value="admin">Quick Admin (Low)</option>
            <option value="physical">Physical/Errands (Med)</option>
            <option value="social">Social/Meetings (Med-High)</option>
            <option value="focus">Deep Focus (High)</option>
            <option value="stress">High Stress (Epic)</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="small fw-bold text-muted">Urgency</label>
          <select
            className="form-select border-0 bg-light"
            value={formData.urgency}
            onChange={(e) =>
              setFormData({ ...formData, urgency: e.target.value })
            }
          >
            <option value="later">Later</option>
            <option value="soon">Soon</option>
            <option value="now">Now</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="small fw-bold text-muted">Due Date</label>
          <input
            type="date"
            className="form-control border-0 bg-light"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
          />
        </div>
      </div>

      <button className="btn btn-dark w-100 mt-4 py-2 rounded-pill shadow-sm">
        Add Task
      </button>
    </form>
  );
};

export default AddTask;
