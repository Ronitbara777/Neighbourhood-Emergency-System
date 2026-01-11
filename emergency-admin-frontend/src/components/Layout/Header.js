import React from 'react';
import { useLocation } from 'react-router-dom';

const Header = ({ onLogout }) => {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
      case '/dashboard':
        return 'Dashboard';
      case '/incidents':
        return 'Incident Management';
      case '/residents':
        return 'Resident Management';
      case '/services':
        return 'Emergency Services';
      default:
        return 'Dashboard';
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  return (
    <header className="header">
      <div className="header-title">
        <h1>{getPageTitle()}</h1>
      </div>
      <div className="header-actions">
        <div className="user-info">
          <div className="user-avatar">
            <i className="bi bi-person"></i>
          </div>
          <div className="user-details">
            <div className="user-name fw-bold">Admin User</div>
            <div className="user-role text-muted small">System Administrator</div>
          </div>
        </div>
        <button 
          className="btn btn-outline-danger btn-sm"
          onClick={handleLogout}
          title="Logout"
        >
          <i className="bi bi-box-arrow-right"></i>
        </button>
      </div>
    </header>
  );
};

export default Header;