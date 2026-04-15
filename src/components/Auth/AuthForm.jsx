import { useState } from 'react';

const AuthForm = ({ onSubmit }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, isLogin ? 'login' : 'signup');
  };

  return (
    <div className="card p-4 shadow-sm" style={{ maxWidth: '400px', margin: 'auto' }}>
      <h3>{isLogin ? 'Login' : 'Sign Up'}</h3>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="mb-3">
            <input 
              className="form-control" 
              placeholder="Name" 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
            />
          </div>
        )}
        <div className="mb-3">
          <input 
            type="email" 
            className="form-control" 
            placeholder="Email" 
            required 
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
          />
        </div>
        <div className="mb-3">
          <input 
            type="password" 
            className="form-control" 
            placeholder="Password" 
            required 
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
          />
        </div>
        <button className="btn btn-primary w-100 mb-3">
          {isLogin ? 'Login' : 'Create Account'}
        </button>
      </form>

      <div className="text-center">
        <button 
          className="btn btn-link btn-sm" 
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "No account? Sign up" : "Have an account? Log in"}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;