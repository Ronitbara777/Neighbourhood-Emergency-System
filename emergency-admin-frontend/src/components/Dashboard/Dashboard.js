import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { incidentAPI, residentAPI, serviceAPI } from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalIncidents: 0,
    totalResidents: 0,
    totalServices: 0,
    activeIncidents: 0
  });
  const [recentIncidents, setRecentIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [incidentsRes, residentsRes, servicesRes] = await Promise.all([
        incidentAPI.getAll(),
        residentAPI.getAll(),
        serviceAPI.getAll()
      ]);

      const incidents = incidentsRes.data;
      const residents = residentsRes.data;
      const services = servicesRes.data;

      setStats({
        totalIncidents: incidents.length,
        totalResidents: residents.length,
        totalServices: services.length,
        activeIncidents: incidents.filter(inc => 
          ['Reported', 'Dispatched', 'En Route'].includes(inc.Status)
        ).length
      });

      // Get recent incidents (last 5)
      setRecentIncidents(incidents.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusClass = `status-${status.toLowerCase().replace(' ', '')}`;
    return <span className={`status-badge ${statusClass}`}>{status}</span>;
  };

  const getEmergencyTypeBadge = (type) => {
    const typeClass = `type-${type.toLowerCase().replace(' ', '')}`;
    return <span className={`emergency-type-badge ${typeClass}`}>{type}</span>;
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Dashboard Overview</h1>
          <p className="text-muted mb-0">Welcome to Neighbourhood Emergency Contact</p>
        </div>
        <div className="text-end">
          <small className="text-muted">Last updated: {new Date().toLocaleString()}</small>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="dashboard-stats">
        <div className="stat-card incidents">
          <div className="stat-icon">
            <i className="bi bi-exclamation-triangle"></i>
          </div>
          <div className="stat-number">{stats.totalIncidents}</div>
          <div className="stat-label">Total Incidents</div>
        </div>

        <div className="stat-card residents">
          <div className="stat-icon">
            <i className="bi bi-people"></i>
          </div>
          <div className="stat-number">{stats.totalResidents}</div>
          <div className="stat-label">Registered Residents</div>
        </div>

        <div className="stat-card services">
          <div className="stat-icon">
            <i className="bi bi-building"></i>
          </div>
          <div className="stat-number">{stats.totalServices}</div>
          <div className="stat-label">Emergency Services</div>
        </div>

        <div className="stat-card active">
          <div className="stat-icon">
            <i className="bi bi-activity"></i>
          </div>
          <div className="stat-number">{stats.activeIncidents}</div>
          <div className="stat-label">Active Incidents</div>
        </div>
      </div>

      <div className="dashboard-charts">
        {/* Recent Incidents Chart */}
        <div className="chart-card">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5>Recent Incidents</h5>
            <Link to="/incidents" className="btn btn-sm btn-outline-primary">
              View All
            </Link>
          </div>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentIncidents.map((incident) => (
                  <tr key={incident.Incident_ID}>
                    <td>#{incident.Incident_ID}</td>
                    <td>{getEmergencyTypeBadge(incident.Emergency_Type)}</td>
                    <td>{incident.Location}</td>
                    <td>{getStatusBadge(incident.Status)}</td>
                    <td>{new Date(incident.Date_Time).toLocaleDateString()}</td>
                  </tr>
                ))}
                {recentIncidents.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-3">
                      No incidents found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="chart-card">
          <h5 className="mb-4">Quick Actions</h5>
          <div className="d-grid gap-3">
            <Link to="/incidents" className="btn btn-primary btn-lg">
              <i className="bi bi-plus-circle me-2"></i>
              Report New Incident
            </Link>
            <Link to="/residents" className="btn btn-outline-primary btn-lg">
              <i className="bi bi-person-plus me-2"></i>
              Add New Resident
            </Link>
            <Link to="/services" className="btn btn-outline-secondary btn-lg">
              <i className="bi bi-building me-2"></i>
              View Services
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h5 className="mb-4">Recent Activity</h5>
        <div className="activity-list">
          {recentIncidents.map((incident) => (
            <div key={incident.Incident_ID} className="activity-item">
              <div className="activity-icon incident">
                <i className="bi bi-exclamation-triangle"></i>
              </div>
              <div className="activity-content">
                <div className="activity-title">
                  New {incident.Emergency_Type} incident reported
                </div>
                <div className="activity-desc text-muted">
                  {incident.Description}
                </div>
                <div className="activity-time">
                  {new Date(incident.Date_Time).toLocaleString()}
                </div>
              </div>
              <div className="activity-status">
                {getStatusBadge(incident.Status)}
              </div>
            </div>
          ))}
          {recentIncidents.length === 0 && (
            <div className="text-center text-muted py-4">
              No recent activity
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;