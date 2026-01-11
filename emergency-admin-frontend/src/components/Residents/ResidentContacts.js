import React, { useState, useEffect } from 'react';
import { residentAPI } from '../../services/api';

const ResidentContacts = ({ show, onHide, resident }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact_type: 'Family',
    phone_number: '',
    relationship_type: '',
    priority_level: 1
  });

  useEffect(() => {
    if (show && resident) {
      loadContacts();
    }
  }, [show, resident]);

  const loadContacts = async () => {
    try {
      const response = await residentAPI.getContacts(resident.Resident_ID);
      setContacts(response.data);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await residentAPI.addContact(resident.Resident_ID, formData);
      await loadContacts();
      setShowForm(false);
      setFormData({
        name: '',
        contact_type: 'Family',
        phone_number: '',
        relationship_type: '',
        priority_level: 1
      });
    } catch (error) {
      console.error('Error adding contact:', error);
      alert('Error adding contact');
    }
  };

  const handleDelete = async (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await residentAPI.deleteContact(resident.Resident_ID, contactId);
        await loadContacts();
        alert('Contact deleted successfully');
      } catch (error) {
        console.error('Error deleting contact:', error);
        alert('Error deleting contact');
      }
    }
  };

  if (!resident || !show) return null;

  return (
    <>
      {/* Main Contacts Modal */}
      <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Emergency Contacts - {resident.Name}
              </h5>
              <button type="button" className="btn-close" onClick={onHide}></button>
            </div>
            <div className="modal-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6>Emergency Contacts</h6>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowForm(true)}
                >
                  <i className="bi bi-person-plus me-1"></i>
                  Add Contact
                </button>
              </div>

              {loading ? (
                <div className="text-center py-3">
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-bordered table-sm">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Phone</th>
                        <th>Relationship</th>
                        <th>Priority</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.map((contact) => (
                        <tr key={contact.Contact_ID}>
                          <td>{contact.Name}</td>
                          <td>{contact.Contact_Type}</td>
                          <td>{contact.Phone_Number}</td>
                          <td>{contact.Relationship_Type}</td>
                          <td>
                            <span className={`badge bg-${contact.Priority_level === 1 ? 'danger' : contact.Priority_level === 2 ? 'warning' : 'info'}`}>
                              {contact.Priority_level}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDelete(contact.Contact_ID)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                      {contacts.length === 0 && (
                        <tr>
                          <td colSpan="6" className="text-center text-muted py-3">
                            No emergency contacts found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onHide}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Contact Modal */}
      {showForm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Emergency Contact</h5>
                <button type="button" className="btn-close" onClick={() => setShowForm(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Contact Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Contact Type</label>
                    <select
                      className="form-select"
                      value={formData.contact_type}
                      onChange={(e) => setFormData({...formData, contact_type: e.target.value})}
                    >
                      <option value="Family">Family</option>
                      <option value="Friend">Friend</option>
                      <option value="Neighbor">Neighbor</option>
                      <option value="Professional">Professional</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={formData.phone_number}
                      onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Relationship</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.relationship_type}
                      onChange={(e) => setFormData({...formData, relationship_type: e.target.value})}
                      placeholder="e.g., Father, Mother, Friend"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Priority Level</label>
                    <select
                      className="form-select"
                      value={formData.priority_level}
                      onChange={(e) => setFormData({...formData, priority_level: parseInt(e.target.value)})}
                    >
                      <option value={1}>High (1)</option>
                      <option value={2}>Medium (2)</option>
                      <option value={3}>Low (3)</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Contact
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResidentContacts;