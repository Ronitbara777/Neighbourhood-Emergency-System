import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ onLogout }) => {
  const location = useLocation();

  const menuItems = [
    { 
      path: '/dashboard', 
      icon: 'bi-speedometer2', 
      label: 'Dashboard',
      description: 'System Overview'
    },
    { 
      path: '/incidents', 
      icon: 'bi-exclamation-triangle', 
      label: 'Incidents',
      description: 'Manage Emergencies'
    },
    { 
      path: '/residents', 
      icon: 'bi-people', 
      label: 'Residents',
      description: 'Resident Database'
    },
    { 
      path: '/services', 
      icon: 'bi-building', 
      label: 'Services',
      description: 'Emergency Services'
    },
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <i className="bi bi-shield-exclamation"></i>
        </div>
        <h4>NeighbourHood Emergency Contact</h4>
        <small className="text-muted">Admin Panel</small>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div key={item.path} className="nav-item">
            <Link
              to={item.path}
              className={`nav-link ${location.pathname === item.path || 
                (item.path === '/dashboard' && location.pathname === '/') ? 'active' : ''}`}
            >
              <i className={`bi ${item.icon}`}></i>
              <span>{item.label}</span>
            </Link>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer mt-auto p-3">
        <button 
          className="btn btn-outline-light w-100 mb-2"
          onClick={handleLogout}
        >
          <i className="bi bi-box-arrow-left me-2"></i>
          Logout
        </button>
        <div className="text-center">
          <small className="text-muted">
            Neighbourhood Emergency Contact v1.0
          </small>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;