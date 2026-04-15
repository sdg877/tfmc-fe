import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <button 
      className="btn btn-outline-danger btn-sm" 
      onClick={handleLogout}
    >
      Logout
    </button>
  );
};

export default Logout;