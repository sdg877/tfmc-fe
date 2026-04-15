import { useState } from 'react';
import axios from 'axios';

const AddTask = ({ onTaskAdded }) => {
  const [formData, setFormData] = useState({ 
    title: '', 
    energyRequired: 3, 
    urgency: 'soon',
    dueDate: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/tasks`, 
        formData, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onTaskAdded(res.data);
      setFormData({ title: '', energyRequired: 3, urgency: 'soon', dueDate: '' });
    } catch (err) {
      alert(err.response?.data?.message || "Check your input");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-3 mb-4 shadow-sm">
      <div className="mb-2">
        <label className="small fw-bold">Task Title</label>
        <input 
          className="form-control" 
          value={formData.title} 
          onChange={(e) => setFormData({...formData, title: e.target.value})} 
          placeholder="What needs doing?"
          required
        />
      </div>
      <div className="row g-2">
        <div className="col-md-4">
          <label className="small fw-bold">Energy (1-5)</label>
          <input 
            type="number" min="1" max="5" className="form-control" 
            value={formData.energyRequired}
            onChange={(e) => setFormData({...formData, energyRequired: Number(e.target.value)})}
          />
        </div>
        <div className="col-md-4">
          <label className="small fw-bold">Urgency</label>
          <select 
            className="form-select" 
            value={formData.urgency}
            onChange={(e) => setFormData({...formData, urgency: e.target.value})}
          >
            <option value="later">later</option>
            <option value="soon">soon</option>
            <option value="now">now</option>
          </select>
        </div>
        <div className="col-md-4">
          <label className="small fw-bold">Due Date</label>
          <input 
            type="date" className="form-control"
            value={formData.dueDate}
            onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
          />
        </div>
      </div>
      <button className="btn btn-primary w-100 mt-3">Add Task</button>
    </form>
  );
};

export default AddTask;