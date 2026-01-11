import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Accept any username and password
    if (credentials.username.trim() && credentials.password.trim()) {
      onLogin(true);
    } else {
      alert('Please enter both username and password');
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-container" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="card" style={{
        width: '100%',
        maxWidth: '400px',
        border: 'none',
        borderRadius: '15px',
        boxShadow: '0 15px 35px rgba(0,0,0,0.1)'
      }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <div className="logo mb-3" style={{ fontSize: '3rem', color: '#667eea' }}>
              <i className="bi bi-shield-exclamation"></i>
            </div>
            <h3 className="card-title">Emergency System</h3>
            <p className="text-muted">Admin Login</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-person"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  placeholder="Enter any username"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">Password</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-lock"></i>
                </span>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="Enter any password"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 py-2">
              <i className="bi bi-box-arrow-in-right me-2"></i>
              Login to System
            </button>
          </form>

          <div className="text-center mt-4">
            <small className="text-muted">
              Enter any username and password to continue
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;