import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Tasks from "./pages/Tasks";
import Calendar from "./pages/Calendar";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";
import Contact from "./pages/Contact";
import About from "./pages/About";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const baseURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await axios.get(`${baseURL}/users/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data);
        } catch (err) {
          console.error("Session fetch failed", err);
          localStorage.removeItem("token");
          setUser(null);
        }
      }
    };
    fetchUser();
  }, [baseURL]);

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Navbar user={user} setUser={setUser} />
          <main className="flex-grow-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Auth setUser={setUser} />} />
              <Route path="/signup" element={<Auth setUser={setUser} />} />

              {/* Protected Routes */}
              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <Tasks user={user} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/calendar"
                element={
                  <ProtectedRoute>
                    <Calendar user={user} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/progress"
                element={
                  <ProtectedRoute>
                    <Progress user={user} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile user={user} setUser={setUser} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings user={user} setUser={setUser} />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
