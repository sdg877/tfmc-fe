import { Link, useLocation } from "react-router-dom";
import Logout from "./Logout";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isAuth =
    location.pathname === "/login" || location.pathname === "/signup";

  const tabs = [
    {
      to: "/",
      label: "Home",
      icon: (active) => (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill={active ? "#1a1a2e" : "none"}
          stroke={active ? "#1a1a2e" : "#aaa"}
          strokeWidth="2"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      to: "/tasks",
      label: "Tasks",
      icon: (active) => (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke={active ? "#1a1a2e" : "#aaa"}
          strokeWidth="2"
        >
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <polyline points="3 6 4 7 6 5" stroke={active ? "#1a1a2e" : "#aaa"} />
          <polyline
            points="3 12 4 13 6 11"
            stroke={active ? "#1a1a2e" : "#aaa"}
          />
          <polyline
            points="3 18 4 19 6 17"
            stroke={active ? "#1a1a2e" : "#aaa"}
          />
        </svg>
      ),
    },
    {
      to: "/calendar",
      label: "Calendar",
      icon: (active) => (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke={active ? "#1a1a2e" : "#aaa"}
          strokeWidth="2"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      to: "/profile",
      label: "Account",
      icon: (active) => (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke={active ? "#1a1a2e" : "#aaa"}
          strokeWidth="2"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <nav
        style={{
          backgroundColor: "#1a1a2e",
          padding: "0 1.25rem",
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        {isHome || isAuth ? (
          <span
            style={{
              color: "white",
              fontWeight: 800,
              fontSize: "1rem",
              letterSpacing: "-0.3px",
            }}
          >
            The Fast Minds Club
          </span>
        ) : (
          <Link
            to="/"
            style={{
              color: "white",
              fontWeight: 800,
              fontSize: "1rem",
              letterSpacing: "-0.3px",
              textDecoration: "none",
            }}
          >
            The Fast Minds Club
          </Link>
        )}

        {token && (
          <div className="d-none d-md-flex align-items-center gap-4">
            {tabs.slice(0, 3).map((tab) => (
              <Link
                key={tab.to}
                to={tab.to}
                style={{
                  color:
                    location.pathname === tab.to
                      ? "white"
                      : "rgba(255,255,255,0.55)",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                }}
              >
                {tab.label}
              </Link>
            ))}
            <div
              style={{ position: "relative" }}
              className="dropdown-hover-wrap"
            >
              <span
                style={{
                  color: "rgba(255,255,255,0.55)",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                }}
              >
                Account ▾
              </span>
              <div className="desktop-dropdown">
                <Link to="/profile" className="desktop-dropdown-item">
                  Profile
                </Link>
                <Link to="/settings" className="desktop-dropdown-item">
                  Settings
                </Link>
                <div
                  style={{
                    borderTop: "1px solid #f0f0f0",
                    marginTop: "0.25rem",
                    paddingTop: "0.25rem",
                  }}
                >
                  <Logout />
                </div>
              </div>
            </div>
          </div>
        )}

        {!token && !isAuth && (
          <Link
            to="/login"
            style={{
              color: "rgba(255,255,255,0.7)",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            Sign in
          </Link>
        )}
      </nav>

      {token && (
        <div
          className="d-flex d-md-none"
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "white",
            borderTop: "1px solid #f0f0f0",
            zIndex: 200,
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          {tabs.map((tab) => {
            const active = location.pathname === tab.to;
            return (
              <Link
                key={tab.to}
                to={tab.to}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0.6rem 0 0.5rem",
                  textDecoration: "none",
                  gap: "3px",
                }}
              >
                {tab.icon(active)}
                <span
                  style={{
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    color: active ? "#1a1a2e" : "#aaa",
                  }}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      )}

      <style>{`
        .dropdown-hover-wrap { position: relative; }
        .desktop-dropdown {
          display: none;
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
          min-width: 150px;
          padding: 0.5rem;
          z-index: 1000;
        }
        .dropdown-hover-wrap:hover .desktop-dropdown { display: block; }
        .desktop-dropdown-item {
          display: block;
          padding: 0.5rem 0.75rem;
          color: #1a1a2e;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.85rem;
          border-radius: 8px;
        }
        .desktop-dropdown-item:hover { background: #f5f5f5; }
      `}</style>
    </>
  );
};

export default Navbar;
