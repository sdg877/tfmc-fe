import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Navbar from "./components/Layout/Navbar";

import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import Profile from "./pages/Profile";
import Tasks from "./pages/Tasks";

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
