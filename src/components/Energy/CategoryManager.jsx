import React, { useState } from "react";
import axios from "axios";

const CategoryManager = ({ user, onUpdate }) => {
  const [newCat, setNewCat] = useState({ name: "", weight: 10 });
  const token = localStorage.getItem("token");
  const baseURL = import.meta.env.VITE_API_URL;

  const pastelPalette = [
    { bg: "#f3e5f5", text: "#7b1fa2", border: "#ce93d8" },
    { bg: "#e8f5e9", text: "#2e7d32", border: "#a5d6a7" },
    { bg: "#e3f2fd", text: "#1565c0", border: "#90caf9" },
    { bg: "#fff3e0", text: "#e65100", border: "#ffcc80" },
    { bg: "#fce4ec", text: "#c2185b", border: "#f48fb1" },
  ];

  const getStyle = (index) => pastelPalette[index % pastelPalette.length];

  const capitalise = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleToggleManual = async () => {
    const newValue = !user.useManualWeights;
    try {
      const res = await axios.put(`${baseURL}/users/profile/identity`, 
        { useManualWeights: newValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUpdate(res.data);
    } catch (err) {
      console.error("Toggle failed");
    }
  };

  const saveUpdate = async (categoryId, data) => {
    if (data.name) data.name = capitalise(data.name);
    try {
      const res = await axios.put(`${baseURL}/users/categories/${categoryId}`, 
        data, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUpdate((prev) => ({ ...prev, categories: res.data }));
    } catch (err) {
      console.error("Update failed");
    }
  };

  const handleAdd = async () => {
    if (!newCat.name || user.categories?.length >= 10) return;
    try {
      const res = await axios.post(`${baseURL}/users/categories`, 
        { name: capitalise(newCat.name), weight: Number(newCat.weight) }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUpdate((prev) => ({ ...prev, categories: res.data }));
      setNewCat({ name: "", weight: 10 });
    } catch (err) {
      console.error("Add failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      const res = await axios.delete(`${baseURL}/users/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onUpdate((prev) => ({ ...prev, categories: res.data }));
    } catch (err) {
      console.error("Delete failed");
    }
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 mb-3">
      <div className="form-check form-switch p-3 rounded-3 bg-light border d-flex align-items-center">
        <input 
          className="form-check-input ms-0 me-3 cursor-pointer shadow-none" 
          type="checkbox" 
          id="manualModeSwitch"
          checked={user.useManualWeights || false}
          onChange={handleToggleManual} 
        />
        <label className="form-check-label small fw-bold text-dark cursor-pointer" htmlFor="manualModeSwitch">
          ENABLE MANUAL WEIGHTS & CUSTOM CATEGORIES
        </label>
      </div>

      {user.useManualWeights && (
        <div className="mt-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <label className="fw-bold small text-dark text-uppercase">Categories & Points</label>
            <span className="badge bg-light text-muted border">{user.categories?.length || 0} / 10</span>
          </div>
          
          <div className="mb-4">
            {user.categories?.map((cat, index) => {
              const style = getStyle(index);
              return (
                <div key={cat._id} className="d-flex align-items-center gap-3 mb-2 p-2 rounded-3 border" style={{ borderColor: style.border, backgroundColor: style.bg }}>
                  <input 
                    type="text"
                    className="flex-grow-1 fw-bold border-0 bg-transparent shadow-none p-0"
                    style={{ color: style.text, outline: "none" }}
                    defaultValue={cat.name}
                    onBlur={(e) => saveUpdate(cat._id, { name: e.target.value })}
                  />
                  
                  <div className="d-flex align-items-center bg-white rounded-2 px-2 border" style={{ width: "95px" }}>
                    <input 
                      type="number"
                      className="form-control form-control-sm border-0 bg-transparent text-center shadow-none p-1"
                      value={cat.weight}
                      onChange={(e) => saveUpdate(cat._id, { weight: e.target.value })}
                    />
                    <span className="extra-small text-muted">pts</span>
                  </div>

                  <button className="btn btn-sm p-0 px-1 text-danger border-0" onClick={() => handleDelete(cat._id)}>✕</button>
                </div>
              );
            })}
          </div>

          {user.categories?.length < 10 && (
            <div className="p-3 rounded-4" style={{ backgroundColor: "#f8f9fa", border: "1px dashed #dee2e6" }}>
              <div className="row g-2">
                <div className="col-7">
                  <input 
                    className="form-control form-control-sm border-0 shadow-none"
                    placeholder="New Category..."
                    value={newCat.name}
                    onChange={(e) => setNewCat({...newCat, name: e.target.value})}
                  />
                </div>
                <div className="col-3">
                  <input 
                    type="number"
                    className="form-control form-control-sm border-0 shadow-none"
                    value={newCat.weight}
                    onChange={(e) => setNewCat({...newCat, weight: e.target.value})}
                  />
                </div>
                <div className="col-2">
                  <button className="btn btn-dark btn-sm w-100" onClick={handleAdd}>+</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryManager;