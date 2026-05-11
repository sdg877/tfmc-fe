import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthForm from "../components/Auth/AuthForm";

const Auth = ({ setUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isSignup = location.pathname === "/signup";

  const handleAuth = async (formData) => {
    const baseURL = import.meta.env.VITE_API_URL;
    const endpoint = isSignup ? "/users/register" : "/users/login";

    try {
      const response = await axios.post(`${baseURL}${endpoint}`, formData);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setUser(response.data);
        navigate("/profile");
      }
    } catch (err) {
      console.error("Auth Error:", err.response?.data || err.message);
      const errorMsg =
        err.response?.data?.msg || "Authentication failed. Check your details.";
      alert(errorMsg);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <AuthForm
            type={isSignup ? "signup" : "login"}
            onSubmit={handleAuth}
          />

          <div className="text-center mt-3">
            <button
              className="btn btn-link text-decoration-none text-muted small"
              onClick={() => navigate(isSignup ? "/login" : "/signup")}
            >
              {isSignup
                ? "Already have an account? Log in"
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
