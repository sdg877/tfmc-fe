import { Link, useLocation } from "react-router-dom";
import Logout from "./Logout";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  return (
    <nav className="navbar navbar-dark bg-dark px-4 shadow-sm">
      <Link className="navbar-brand fw-bold" to="/">
        The Fast Minds Club
      </Link>
      <div className="navbar-nav ms-auto">
        {token ? (
          <div className="d-flex align-items-center">
            {location.pathname !== "/tasks" && (
              <Link className="nav-link me-3" to="/tasks">
                Tasks
              </Link>
            )}

            {location.pathname !== "/progress" && (
              <Link className="nav-link me-3" to="/progress">
                Progress
              </Link>
            )}

            {location.pathname !== "/calendar" && (
              <Link className="nav-link me-3" to="/calendar">
                Calendar
              </Link>
            )}

            {location.pathname !== "/profile" && (
              <Link className="nav-link me-3" to="/profile">
                Profile
              </Link>
            )}

            <Logout />
          </div>
        ) : (
          location.pathname !== "/login" &&
          !isHomePage && (
            <Link className="nav-link" to="/login">
              Login
            </Link>
          )
        )}
      </div>
    </nav>
  );
};

export default Navbar;