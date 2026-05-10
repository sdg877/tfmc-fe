// import React from "react";
// import { useNavigate } from "react-router-dom";

// const Profile = ({ user }) => {
//   const navigate = useNavigate();

//   if (!user)
//     return <div className="p-5 text-center text-muted">Loading...</div>;

//   return (
//     <div className="container py-5" style={{ maxWidth: "800px" }}>
//       <header className="mb-5 border-bottom pb-4 d-flex justify-content-between align-items-end">
//         <div>
//           <h2 className="fw-bold text-dark mb-1">Hello, {user.name}</h2>
//           <p className="text-secondary mb-0">Your Account Identity</p>
//         </div>
//         <button
//           onClick={() => navigate("/settings")}
//           className="btn btn-dark rounded-pill px-4 fw-bold shadow-sm"
//         >
//           Go to Settings
//         </button>
//       </header>

//       <div className="bg-light border rounded-4 p-4 shadow-sm">
//         <h6 className="text-uppercase fw-bold text-muted small mb-4">
//           Identity Details
//         </h6>
//         <div className="row">
//           <div className="col-md-6 mb-4">
//             <label className="text-muted small d-block mb-1">
//               REGISTERED NAME
//             </label>
//             <div className="h6 fw-bold mb-0 text-dark">{user.name}</div>
//           </div>
//           <div className="col-md-6 mb-4">
//             <label className="text-muted small d-block mb-1">
//               EMAIL ADDRESS
//             </label>
//             <div className="h6 fw-bold mb-0 text-dark">{user.email}</div>
//           </div>
//         </div>
//         <hr className="my-3" />
//         <button
//           className="btn btn-outline-danger btn-sm rounded-pill px-4"
//           disabled
//         >
//           Reset Password
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Profile;

import React, { useState, useEffect } from "react"; // Added useEffect
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logout from "../components/Layout/Logout";

const Profile = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  // Start empty, then fill with useEffect
  const [formData, setFormData] = useState({ name: "", email: "" });

  const baseURL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  // This ensures the inputs aren't blank when you click "Edit"
  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email });
    }
  }, [user]);

  if (!user) return <div className="p-5 text-center text-muted">Loading...</div>;

  // const handleUpdate = async () => {
  //   try {
  //     const res = await axios.put(`${baseURL}/users/profile/identity`, formData, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setUser(res.data);
  //     setIsEditing(false);
  //   } catch (err) {
  //     console.error("Update failed", err);
  //     alert("Could not update profile.");
  //   }
  // };

const handleUpdate = async () => {
  try {
    const res = await axios.put(`${baseURL}/users/profile/identity`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 200) {
      setUser(res.data);
      setIsEditing(false);
    }
  } catch (err) {
    // This will tell us if it's a 404, 500, or a code crash
    console.error("Full Error Object:", err.response || err);
    alert(`Update failed: ${err.response?.data?.msg || "Check console"}`);
  }
};

  return (
    <div className="container py-5" style={{ maxWidth: "800px" }}>
      <header className="mb-5 border-bottom pb-4 d-flex justify-content-between align-items-end">
        <div>
          <h2 className="fw-bold text-dark mb-1">Hello, {user.name}</h2>
          <p className="text-secondary mb-0">Your Account Identity</p>
        </div>
        <div className="d-flex gap-2">
          <button onClick={() => navigate("/settings")} className="btn btn-outline-dark rounded-pill px-4 fw-bold">
            Settings
          </button>
          <Logout />
        </div>
      </header>

      <div className="bg-light border rounded-4 p-4 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h6 className="text-uppercase fw-bold text-muted small mb-0">Identity Details</h6>
          <button 
            className="btn btn-sm btn-dark rounded-pill px-3"
            onClick={() => isEditing ? handleUpdate() : setIsEditing(true)}
          >
            {isEditing ? "Save Changes" : "Edit Profile"}
          </button>
        </div>

        <div className="row">
          <div className="col-md-6 mb-4">
            <label className="text-muted small d-block mb-1">REGISTERED NAME</label>
            {isEditing ? (
              <input 
                className="form-control" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            ) : (
              <div className="h6 fw-bold mb-0 text-dark">{user.name}</div>
            )}
          </div>
          <div className="col-md-6 mb-4">
            <label className="text-muted small d-block mb-1">EMAIL ADDRESS</label>
            {isEditing ? (
              <input 
                className="form-control" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            ) : (
              <div className="h6 fw-bold mb-0 text-dark">{user.email}</div>
            )}
          </div>
        </div>
        
        {isEditing && (
          <button className="btn btn-link btn-sm text-muted" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;