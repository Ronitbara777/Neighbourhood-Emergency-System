import React, { useState } from 'react';
import { residentAPI } from '../../services/api';

const ResidentForm = ({ show, onHide, resident, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone_number: '',
    email: '',
    house_no: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (resident) {
      setFormData({
        name: resident.Name || '',
        address: resident.Address || '',
        phone_number: resident.Phone_number || '',
        email: resident.Email || '',
        house_no: resident.House_No || ''
      });
    } else {
      setFormData({
        name: '',
        address: '',
        phone_number: '',
        email: '',
        house_no: ''
      });
    }
  }, [resident, show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (resident) {
        await residentAPI.update(resident.Resident_ID, formData);
      } else {
        await residentAPI.create(formData);
      }
      onSave();
      onHide();
    } catch (error) {
      console.error('Error saving resident:', error);
      setError(`Failed to ${resident ? 'update' : 'create'} resident`);
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
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {resident ? 'Edit Resident' : 'Add New Resident'}
            </h5>
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
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">House Number</label>
                <input
                  type="text"
                  className="form-control"
                  name="house_no"
                  value={formData.house_no}
                  onChange={handleChange}
                  placeholder="Enter house number"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Address</label>
                <textarea
                  className="form-control"
                  rows={3}
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter complete address"
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onHide}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : (resident ? 'Update Resident' : 'Add Resident')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResidentForm;