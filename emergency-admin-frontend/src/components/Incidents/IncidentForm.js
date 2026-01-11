import React, { useState, useEffect } from 'react';
import { incidentAPI, residentAPI } from '../../services/api';

const IncidentForm = ({ show, onHide, onSave }) => {
  const [formData, setFormData] = useState({
    resident_id: '',
    emergency_type: 'Fire',
    description: '',
    location: '',
    user_name: ''
  });
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (show) {
      loadResidents();
    }
  }, [show]);

  const loadResidents = async () => {
    try {
      const response = await residentAPI.getAll();
      setResidents(response.data);
    } catch (error) {
      console.error('Error loading residents:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await incidentAPI.create(formData);
      onSave();
      onHide();
      setFormData({
        resident_id: '',
        emergency_type: 'Fire',
        description: '',
        location: '',
        user_name: ''
      });
    } catch (error) {
      console.error('Error creating incident:', error);
      setError('Failed to create incident');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Report New Incident</h5>
            <button type="button" className="btn-close" onClick={onHide}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <div className="mb-3">
                <label className="form-label">Resident</label>
                <select
                  className="form-select"
                  name="resident_id"
                  value={formData.resident_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Resident</option>
                  {residents.map(resident => (
                    <option key={resident.Resident_ID} value={resident.Resident_ID}>
                      {resident.Name} - {resident.House_No}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Emergency Type</label>
                <select
                  className="form-select"
                  name="emergency_type"
                  value={formData.emergency_type}
                  onChange={handleChange}
                  required
                >
                  <option value="Fire">Fire</option>
                  <option value="Medical">Medical</option>
                  <option value="Police">Police</option>
                  <option value="Accident">Accident</option>
                  <option value="Natural Disaster">Natural Disaster</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-control"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter incident location"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the emergency situation"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Reported By</label>
                <input
                  type="text"
                  className="form-control"
                  name="user_name"
                  value={formData.user_name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onHide}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Reporting...' : 'Report Incident'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IncidentForm;