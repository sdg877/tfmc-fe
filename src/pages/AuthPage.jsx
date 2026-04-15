import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthForm from '../components/AuthForm';

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isSignup = location.pathname === '/signup';

  const handleAuth = async (formData) => {
    const baseURL = import.meta.env.VITE_API_URL;
    const endpoint = isSignup ? '/users/register' : '/users/login';

    try {
      const response = await axios.post(`${baseURL}${endpoint}`, formData);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/profile');
      }
    } catch (err) {
      console.error("Auth Error:", err.response?.data || err.message);
      alert(err.response?.data?.msg || "Authentication failed");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <AuthForm 
            type={isSignup ? 'signup' : 'login'} 
            onSubmit={handleAuth} 
          />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;