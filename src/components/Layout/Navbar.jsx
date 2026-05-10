// import { Link, useLocation } from "react-router-dom";
// import Logout from "./Logout";

// const Navbar = () => {
//   const token = localStorage.getItem("token");
//   const location = useLocation();

//   const isHomePage = location.pathname === "/";

//   return (
//     <nav className="navbar navbar-dark bg-dark px-4 shadow-sm">
//       <Link className="navbar-brand fw-bold" to="/">
//         The Fast Minds Club
//       </Link>
//       <div className="navbar-nav ms-auto">
//         {token ? (
//           <div className="d-flex align-items-center">
//             {location.pathname !== "/tasks" && (
//               <Link className="nav-link me-3" to="/tasks">
//                 Tasks
//               </Link>
//             )}

//             {location.pathname !== "/calendar" && (
//               <Link className="nav-link me-3" to="/calendar">
//                 Calendar
//               </Link>
//             )}

//             {location.pathname !== "/profile" && (
//               <Link className="nav-link me-3" to="/profile">
//                 Profile
//               </Link>
//             )}

//             <Logout />
//           </div>
//         ) : (
//           location.pathname !== "/login" &&
//           !isHomePage && (
//             <Link className="nav-link" to="/login">
//               Login
//             </Link>
//           )
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import { Link, useLocation } from "react-router-dom";

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
            <Link className="nav-link me-4" to="/tasks">Tasks</Link>
            <Link className="nav-link me-4" to="/calendar">Calendar</Link>
            
            {/* Simple Account Grouping */}
            <div className="nav-item dropdown-hover position-relative">
              <span className="nav-link text-white-50" style={{ cursor: 'default' }}>
                Account ▾
              </span>
              <div className="dropdown-content bg-dark border border-secondary rounded shadow">
                <Link className="nav-link px-3 py-2 border-bottom border-secondary" to="/profile">
                  Profile
                </Link>
                <Link className="nav-link px-3 py-2" to="/settings">
                  Settings
                </Link>
              </div>
            </div>
          </>
        ) : (
          location.pathname !== "/login" && location.pathname !== "/" && (
            <Link className="nav-link" to="/login">Login</Link>
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
          min-width: 120px;
          z-index: 1000;
        }
        .dropdown-content .nav-link:hover {
          background-color: #343a40;
          color: white !important;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;