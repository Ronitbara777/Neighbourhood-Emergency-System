import React, { useState, useEffect } from 'react';
import { incidentAPI, residentAPI } from '../../services/api';
import IncidentForm from './IncidentForm';
import IncidentDetails from './IncidentDetails';

const IncidentList = () => {
  const [incidents, setIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadIncidents();
  }, []);

  // Add search filter effect
  useEffect(() => {
    if (searchTerm) {
      const filtered = incidents.filter(incident =>
        incident.Resident_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.Emergency_Type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.Location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.Status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.Description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredIncidents(filtered);
    } else {
      setFilteredIncidents(incidents);
    }
  }, [searchTerm, incidents]);

  const loadIncidents = async () => {
    try {
      const response = await incidentAPI.getAll();
      const sortedData = response.data.sort((a, b) => a.Incident_ID - b.Incident_ID);
      setIncidents(sortedData);
      setFilteredIncidents(sortedData);
    } catch (error) {
      console.error('Error loading incidents:', error);
      alert('Error loading incidents');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (incidentId, newStatus) => {
    try {
      await incidentAPI.updateStatus(incidentId, newStatus);
      await loadIncidents();
      alert('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
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
        <h2 className="mb-0">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Incident Management
        </h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Report New Incident
        </button>
      </div>

      {/* Search Bar */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search incidents by resident name, type, location, status..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setSearchTerm('')}
                  >
                    <i className="bi bi-x"></i>
                  </button>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-center justify-content-end h-100">
                <small className="text-muted">
                  Showing {filteredIncidents.length} of {incidents.length} incidents
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">All Incidents</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date & Time</th>
                  <th>Resident</th>
                  <th>Emergency Type</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Service</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredIncidents.map((incident, index) => (
                  <tr key={incident.Incident_ID}>
                    <td>
                      <strong>#{index + 1}</strong>
                    </td>
                    <td>{new Date(incident.Date_Time).toLocaleString()}</td>
                    <td>{incident.Resident_Name}</td>
                    <td>{getEmergencyTypeBadge(incident.Emergency_Type)}</td>
                    <td>{incident.Location}</td>
                    <td>{getStatusBadge(incident.Status)}</td>
                    <td>{incident.Service_Name}</td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-info"
                          onClick={() => {
                            setSelectedIncident(incident);
                            setShowDetails(true);
                          }}
                          title="View Details"
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <select
                          className="form-select form-select-sm"
                          value={incident.Status}
                          onChange={(e) => handleStatusUpdate(incident.Incident_ID, e.target.value)}
                          style={{ width: 'auto' }}
                        >
                          <option value="Reported">Reported</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="En Route">En Route</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredIncidents.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center text-muted py-4">
                      {searchTerm ? 'No incidents found matching your search.' : 'No incidents found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <IncidentForm
        show={showForm}
        onHide={() => setShowForm(false)}
        onSave={loadIncidents}
      />

      <IncidentDetails
        incident={selectedIncident}
        show={showDetails}
        onHide={() => setShowDetails(false)}
      />
    </div>
  );
};

export default IncidentList;