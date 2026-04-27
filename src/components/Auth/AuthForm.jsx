import { useState } from "react";

const AuthForm = ({ onSubmit, type }) => {
  const isLogin = type === "login";
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div
      className="card p-4 shadow-sm border-0 bg-white"
      style={{ maxWidth: "400px", margin: "auto" }}
    >
      <h3 className="fw-bold text-center mb-4">
        {isLogin ? "Login" : "Create Account"}
      </h3>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="mb-3">
            <label className="small fw-bold text-muted">Name</label>
            <input
              className="form-control bg-light border-0"
              placeholder="Your name"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
        )}
        <div className="mb-3">
          <label className="small fw-bold text-muted">Email</label>
          <input
            type="email"
            className="form-control bg-light border-0"
            placeholder="email@example.com"
            required
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
        <div className="mb-3">
          <label className="small fw-bold text-muted">Password</label>
          <input
            type="password"
            className="form-control bg-light border-0"
            placeholder="••••••••"
            required
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>
        <button className="btn btn-dark w-100 mb-3 rounded-pill py-2 fw-bold">
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
