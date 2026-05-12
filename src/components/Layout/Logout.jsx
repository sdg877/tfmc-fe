import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomModal from './CustomModal';

const Logout = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      <button 
        className="nav-link border-0 bg-transparent text-danger fw-bold" 
        onClick={() => setShowConfirm(true)}
      >
        Logout
      </button>

      <CustomModal
        show={showConfirm}
        title="LOGOUT"
        message="Are you sure you want to end your session? You'll need to log back in to see your energy limits."
        type="danger"
        onClose={() => setShowConfirm(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default Logout;