import { useState } from 'react';
import axios from 'axios';

const TaskItem = ({ task, setTasks }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ 
    title: task.title, 
    energyRequired: task.energyRequired, 
    urgency: task.urgency,
    dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
  });

  const token = localStorage.getItem('token');
  const baseURL = import.meta.env.VITE_API_URL;

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${baseURL}/tasks/${task._id}`, 
        editData, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(prev => prev.map(t => t._id === task._id ? res.data : t));
      setIsEditing(false);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const deleteTask = async () => {
    try {
      await axios.delete(`${baseURL}/tasks/${task._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(prev => prev.filter(t => t._id !== task._id));
    } catch (err) {
      console.error(err);
    }
  };

  if (isEditing) {
    return (
      <form onSubmit={handleUpdate} className="list-group-item p-3 border-primary shadow-sm bg-light mb-2">
        <input 
          className="form-control mb-2" 
          value={editData.title} 
          onChange={(e) => setEditData({...editData, title: e.target.value})} 
        />
        <div className="row g-2 mb-2">
          <div className="col-4">
            <input type="number" min="1" max="5" className="form-control"
              value={editData.energyRequired}
              onChange={(e) => setEditData({...editData, energyRequired: Number(e.target.value)})}
            />
          </div>
          <div className="col-4">
            <select className="form-select" value={editData.urgency}
              onChange={(e) => setEditData({...editData, urgency: e.target.value})}>
              <option value="later">later</option>
              <option value="soon">soon</option>
              <option value="now">now</option>
            </select>
          </div>
          <div className="col-4">
            <input type="date" className="form-control" value={editData.dueDate}
              onChange={(e) => setEditData({...editData, dueDate: e.target.value})}
            />
          </div>
        </div>
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-success btn-sm flex-grow-1">Save</button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      </form>
    );
  }

  return (
    <div className="list-group-item d-flex justify-content-between align-items-center mb-2 shadow-sm border rounded">
      <div>
        <h6 className="mb-0">{task.title}</h6>
        <div className="d-flex flex-wrap gap-2 mt-1">
          <span className="badge bg-info text-dark small">Energy: {task.energyRequired}</span>
          <span className={`badge small ${task.urgency === 'now' ? 'bg-danger' : 'bg-secondary'}`}>
            {task.urgency}
          </span>
          {task.dueDate && (
            <small className="text-muted w-100">
              Due: {new Date(task.dueDate).toLocaleDateString('en-GB')}
            </small>
          )}
        </div>
      </div>
      <div className="d-flex gap-2">
        <button onClick={() => setIsEditing(true)} className="btn btn-sm btn-outline-primary border-0">Edit</button>
        <button onClick={deleteTask} className="btn btn-sm btn-outline-danger border-0">&times;</button>
      </div>
    </div>
  );
};

export default TaskItem;