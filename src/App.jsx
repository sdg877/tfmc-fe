import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Navbar from "./components/Layout/Navbar";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Tasks from "./pages/Tasks";
import Calendar from "./pages/Calendar";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";

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
        }
      }
    };
    fetchUser();
  }, [baseURL]);

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Router>
        <Navbar user={user} setUser={setUser} />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Auth setUser={setUser} />} />
            <Route path="/signup" element={<Auth setUser={setUser} />} />
            <Route path="/tasks" element={<Tasks user={user} />} />
            <Route path="/profile" element={<Profile user={user} />} />
            <Route path="/calendar" element={<Calendar user={user} />} />
            <Route path="/progress" element={<Progress user={user} />} />
            <Route
              path="/settings"
              element={<Settings user={user} setUser={setUser} />}
            />
          </Routes>
        </main>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
