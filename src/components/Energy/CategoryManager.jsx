import React, { useState } from "react";
import axios from "axios";
import CustomModal from "../Layout/CustomModal.jsx";

const CategoryManager = ({ user, onUpdate }) => {
  const [newCat, setNewCat] = useState({ name: "", weight: 10 });
  const [duplicateError, setDuplicateError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showToggleWarning, setShowToggleWarning] = useState(false);

  const token = localStorage.getItem("token");
  const baseURL = import.meta.env.VITE_API_URL;

  const pastelPalette = [
    { bg: "#FFF0F5", text: "#C71585", border: "#FFB6C1" },
    { bg: "#E6F3FF", text: "#1D4ED8", border: "#B9E0FF" },
    { bg: "#EAF9EE", text: "#166534", border: "#C1E7CC" },
    { bg: "#FFF0E5", text: "#C2410C", border: "#FFD3B6" },
    { bg: "#F3E8FF", text: "#6B21A8", border: "#E9D5FF" },
    { bg: "#E0F2FE", text: "#0369A1", border: "#BAE6FD" },
    { bg: "#FDF2F8", text: "#9D174D", border: "#FCE7F3" },
    { bg: "#F0FDFA", text: "#0F766E", border: "#CCFBF1" },
    { bg: "#F5F5F7", text: "#3A3A3C", border: "#D1D1D6" },
    { bg: "#FFEAEF", text: "#991B1B", border: "#FCA5A5" },
  ];

  const getStyle = (index) => pastelPalette[index % pastelPalette.length];

  const capitalise = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const handleToggleClick = () => {
    if (user.useManualWeights) {
      setShowToggleWarning(true);
    } else {
      executeToggle(true);
    }
  };

  const executeToggle = async (newValue) => {
    try {
      const res = await axios.put(
        `${baseURL}/users/profile/identity`,
        { useManualWeights: newValue },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      onUpdate(res.data);
      setShowToggleWarning(false);
    } catch (err) {
      console.error("Toggle failed");
    }
  };

  const saveUpdate = async (categoryId, data) => {
    if (data.name) data.name = capitalise(data.name);
    try {
      const res = await axios.put(
        `${baseURL}/users/categories/${categoryId}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      onUpdate((prev) => ({ ...prev, categories: res.data }));
    } catch (err) {
      console.error("Update failed");
    }
  };

  const handleAdd = async () => {
    if (!newCat.name || user.categories?.length >= 10) return;

    const cleanNewName = newCat.name.trim().toLowerCase();

    const isDuplicate = user.categories?.some(
      (cat) => cat.name.trim().toLowerCase() === cleanNewName,
    );

    if (isDuplicate) {
      setDuplicateError(`"${capitalise(newCat.name)}" already exists.`);
      return;
    }

    try {
      setDuplicateError("");
      const res = await axios.post(
        `${baseURL}/users/categories`,
        { name: capitalise(newCat.name), weight: Number(newCat.weight) },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      onUpdate((prev) => ({ ...prev, categories: res.data }));
      setNewCat({ name: "", weight: 10 });
    } catch (err) {
      console.error("Add failed");
    }
  };

  const handleResetDefaults = async () => {
    setShowResetModal(false);
    try {
      const res = await axios.post(
        `${baseURL}/users/categories/reset`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      onUpdate((prev) => ({ ...prev, categories: res.data }));
      setDuplicateError("");
    } catch (err) {
      console.error("Reset failed", err);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await axios.delete(
        `${baseURL}/users/categories/${deleteTarget}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      onUpdate((prev) => ({ ...prev, categories: res.data }));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete failed");
    }
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 mb-3">
      <div className="d-flex justify-content-between align-items-center p-3 rounded-3 bg-light border">
        <div className="form-check form-switch d-flex align-items-center mb-0">
          <input
            className="form-check-input ms-0 me-3 cursor-pointer shadow-none"
            type="checkbox"
            id="manualModeSwitch"
            checked={user.useManualWeights || false}
            onChange={handleToggleClick}
          />
          <label
            className="form-check-label small fw-bold text-dark cursor-pointer"
            htmlFor="manualModeSwitch"
          >
            ENABLE MANUAL WEIGHTS
          </label>
        </div>

        {user.useManualWeights && (
          <button
            className="btn btn-link btn-sm text-danger fw-bold text-decoration-none p-0"
            style={{ fontSize: "0.75rem" }}
            onClick={() => setShowResetModal(true)}
          >
            RESET DEFAULTS
          </button>
        )}
      </div>

      {user.useManualWeights && (
        <div className="mt-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <label className="fw-bold small text-dark text-uppercase">
              Categories & Points
            </label>
            <span className="badge bg-light text-muted border">
              {user.categories?.length || 0} / 10
            </span>
          </div>

          <div className="mb-4">
            {user.categories?.map((cat, index) => {
              const style = getStyle(index);
              return (
                <div
                  key={cat._id}
                  className="d-flex align-items-center gap-3 mb-2 p-2 rounded-3 border"
                  style={{
                    borderColor: style.border,
                    backgroundColor: style.bg,
                  }}
                >
                  <input
                    type="text"
                    className="flex-grow-1 fw-bold border-0 bg-transparent shadow-none p-0"
                    style={{ color: style.text, outline: "none" }}
                    value={capitalise(cat.name)}
                    onChange={(e) => {
                      cat.name = e.target.value;
                      onUpdate({ ...user });
                    }}
                    onBlur={(e) =>
                      saveUpdate(cat._id, { name: e.target.value })
                    }
                  />

                  <div
                    className="d-flex align-items-center bg-white rounded-2 px-2 border"
                    style={{ width: "95px" }}
                  >
                    <input
                      type="number"
                      className="form-control form-control-sm border-0 bg-transparent text-center shadow-none p-1"
                      value={cat.weight}
                      onChange={(e) =>
                        saveUpdate(cat._id, { weight: e.target.value })
                      }
                    />
                    <span className="extra-small text-muted">pts</span>
                  </div>

                  <button
                    onClick={() => setDeleteTarget(cat._id)}
                    className="btn btn-sm text-danger border-0 p-0 px-2"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>

          {user.categories?.length < 10 && (
            <div
              className="p-3 rounded-4"
              style={{
                backgroundColor: "#f8f9fa",
                border: "1px dashed #dee2e6",
              }}
            >
              {duplicateError && (
                <div
                  className="text-danger fw-bold small mb-2 text-uppercase"
                  style={{ fontSize: "0.7rem" }}
                >
                  ⚠️ {duplicateError}
                </div>
              )}
              <div className="row g-2">
                <div className="col-7">
                  <input
                    className="form-control form-control-sm border-0 shadow-none"
                    placeholder="New Category..."
                    value={newCat.name}
                    onChange={(e) => {
                      if (duplicateError) setDuplicateError("");
                      setNewCat({ ...newCat, name: e.target.value });
                    }}
                  />
                </div>
                <div className="col-3">
                  <input
                    type="number"
                    className="form-control form-control-sm border-0 shadow-none"
                    value={newCat.weight}
                    onChange={(e) =>
                      setNewCat({ ...newCat, weight: e.target.value })
                    }
                  />
                </div>
                <div className="col-2">
                  <button
                    className="btn btn-dark btn-sm w-100"
                    onClick={handleAdd}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <CustomModal
        show={showToggleWarning}
        title="DISABLE MANUAL WEIGHTS"
        message="Are you sure you want to revert to default values? Any existing tasks will retain the custom point values used when they were created."
        type="danger"
        onClose={() => setShowToggleWarning(false)}
        onConfirm={() => executeToggle(false)}
      />

      <CustomModal
        show={!!deleteTarget}
        title="DELETE CATEGORY"
        message="Are you sure? Existing tasks will keep their current energy weight until manually updated."
        type="danger"
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />

      <CustomModal
        show={showResetModal}
        title="RESET TO DEFAULTS"
        message="Warning: This will delete all custom categories and reset weights to the original Admin, Physical, Social, Focus, and Stress levels. This cannot be undone."
        type="danger"
        onClose={() => setShowResetModal(false)}
        onConfirm={handleResetDefaults}
      />
    </div>
  );
};

export default CategoryManager;
