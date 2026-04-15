import { useState } from 'react';

const AuthForm = ({ type, onSubmit }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const isSignup = type === 'signup';

  return (
    <div className="card shadow border-0 p-4">
      <h2 className="text-center mb-4">{isSignup ? 'Create Account' : 'Login'}</h2>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
        {isSignup && (
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input 
              className="form-control" 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
            />
          </div>
        )}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input 
            className="form-control" 
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input 
            type="password" 
            className="form-control" 
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
          />
        </div>
        <button className={`btn w-100 ${isSignup ? 'btn-success' : 'btn-primary'}`}>
          {isSignup ? 'Register' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;