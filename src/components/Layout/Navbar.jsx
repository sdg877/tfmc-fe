import { Link, useLocation } from "react-router-dom";
import Logout from "./Logout";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <nav className="navbar navbar-dark bg-dark px-4 shadow-sm">
      <div className="position-relative">
        {isHome ? (
          <span className="navbar-brand fw-bold mb-0">The Fast Minds Club</span>
        ) : (
          <Link
            className="navbar-brand fw-bold brand-link"
            to="/"
            data-hover="Go to Overview"
          >
            The Fast Minds Club
          </Link>
        )}
      </div>

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
          !isHome &&
          location.pathname !== "/login" && (
            <Link className="nav-link" to="/login">
              Login
            </Link>
          )
        )}
      </div>

      <style>{`
        .brand-link {
          position: relative;
          text-decoration: none;
        }

        .brand-link:hover::after {
          content: attr(data-hover);
          position: absolute;
          left: 50%;
          bottom: -30px;
          transform: translateX(-50%);
          background-color: #444;
          color: #fff;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.7rem;
          white-space: nowrap;
          z-index: 1001;
          pointer-events: none;
        }

        .dropdown-hover:hover .dropdown-content { display: block; }
        .dropdown-content {
          display: none;
          position: absolute;
          right: 0;
          min-width: 140px;
          z-index: 1000;
          top: 100%;
        }
        .dropdown-content .nav-link:hover { background-color: #343a40; color: white !important; }
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
        .dropdown-logout-wrapper:hover { background-color: #343a40; }
        
        a.navbar-brand:hover {
          color: #fff !important;
          opacity: 0.8;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
