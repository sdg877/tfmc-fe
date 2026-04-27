import { useState, useEffect } from "react";
import axios from "axios";

const AddTask = ({ onTaskAdded, showEnergyBar }) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    urgency: "soon",
    dueDate: "",
    energyPoints: 0,
  });

  const categoryWeights = {
    quickwin: 5,
    admin: 10,
    physical: 20,
    social: 30,
    focus: 40,
    stress: 45,
  };

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

    const finalData = {
      ...formData,
      energyPoints: categoryWeights[formData.category] || 10,
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/tasks`,
        finalData,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      onTaskAdded(res.data);

      setFormData({
        title: "",
        category: "",
        urgency: "soon",
        dueDate: "",
        energyPoints: 0,
      });
    } catch (err) {
      alert(err.response?.data?.message || "Check your input");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-2 bg-white">
      <div className="mb-4">
        <label className="small fw-bold text-muted text-uppercase ls-wide mb-2 d-block">
          Task Description
        </label>
        <input
          className="form-control form-control-lg border-0 bg-light rounded-3 shadow-none"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="What are we doing?"
          required
        />
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <label className="small fw-bold text-muted text-uppercase ls-wide mb-2 d-block">
            Category
          </label>
          <select
            className="form-select border-0 bg-light py-2 shadow-none"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            required
          >
            <option value="" disabled>
              Select intensity...
            </option>
            <option value="quickwin">Quick Win (5 pts)</option>
            <option value="admin">Admin / Emails (10 pts)</option>
            <option value="physical">Physical / Errands (20 pts)</option>
            <option value="social">Social / Meetings (30 pts)</option>
            <option value="focus">Deep Focus (40 pts)</option>
            <option value="stress">High Stress (45 pts)</option>
          </select>
        </div>

        <div className="col-md-3">
          <label className="small fw-bold text-muted text-uppercase ls-wide mb-2 d-block">
            Urgency
          </label>
          <select
            className="form-select border-0 bg-light py-2 shadow-none"
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

        <div className="col-md-3">
          <label className="small fw-bold text-muted text-uppercase ls-wide mb-2 d-block">
            Due Date
          </label>
          <input
            type="date"
            className="form-control border-0 bg-light py-2 shadow-none"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
          />
        </div>
      </div>

      <div className="mt-4 pt-2 border-top">
        <button className="btn btn-dark w-100 py-3 rounded-pill fw-bold">
          Create Task
        </button>
      </div>
    </form>
  );
};

export default AddTask;