import { Link } from 'react-router-dom';
import Logout from './Logout';

const Navbar = () => {
  const token = localStorage.getItem('token');

  return (
    <nav className="navbar navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/">The Fast Minds Club</Link>
      <div className="navbar-nav ms-auto">
        {token ? (
          <div className="d-flex align-items-center">
            <Link className="nav-link me-3" to="/profile">Profile</Link>
            <Link className="nav-link me-3" to="/tasks">Tasks</Link>
            <Link className="nav-link me-3" to="/calendar">Calendar</Link>
            <Logout />
          </div>
        ) : (
          <Link className="nav-link" to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar
