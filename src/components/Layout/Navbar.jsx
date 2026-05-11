import { Link, useLocation } from "react-router-dom";
import Logout from "./Logout";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  return (
    <nav className="navbar navbar-dark bg-dark px-4 shadow-sm">
      <Link className="navbar-brand fw-bold" to="/">
        The Fast Minds Club
      </Link>

      <div className="navbar-nav ms-auto d-flex flex-row align-items-center">
        {token ? (
          <>
            <Link className="nav-link me-4" to="/tasks">
              Tasks
            </Link>
            <Link className="nav-link me-4" to="/calendar">
              Calendar
            </Link>

            <div className="nav-item dropdown-hover position-relative">
              <span
                className="nav-link text-white-50"
                style={{ cursor: "pointer" }}
              >
                Account ▾
              </span>
              <div className="dropdown-content bg-dark border border-secondary rounded shadow">
                <Link
                  className="nav-link px-3 py-2 border-bottom border-secondary"
                  to="/profile"
                >
                  Profile
                </Link>
                <Link
                  className="nav-link px-3 py-2 border-bottom border-secondary"
                  to="/settings"
                >
                  Settings
                </Link>

                <div className="dropdown-logout-wrapper">
                  <Logout />
                </div>
              </div>
            </div>
          </>
        ) : (
          location.pathname !== "/login" &&
          location.pathname !== "/" && (
            <Link className="nav-link" to="/login">
              Login
            </Link>
          )
        )}
      </div>

      <style>{`
        .dropdown-hover:hover .dropdown-content {
          display: block;
        }
        .dropdown-content {
          display: none;
          position: absolute;
          right: 0;
          min-width: 140px;
          z-index: 1000;
          top: 100%;
        }
        .dropdown-content .nav-link:hover {
          background-color: #343a40;
          color: white !important;
        }
        /* Style the wrapper to ensure your Logout component matches the padding */
        .dropdown-logout-wrapper .nav-link, 
        .dropdown-logout-wrapper button {
          padding: 8px 16px !important;
          width: 100%;
          text-align: left;
          background: transparent;
          border: none;
          color: #ff4d4d !important;
          font-weight: bold;
        }
        .dropdown-logout-wrapper:hover {
          background-color: #343a40;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
