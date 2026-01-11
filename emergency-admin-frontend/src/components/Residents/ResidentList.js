import React, { useState, useEffect } from 'react';
import { residentAPI } from '../../services/api';
import ResidentForm from './ResidentForm';
import ResidentContacts from './ResidentContacts';

const ResidentList = () => {
  const [residents, setResidents] = useState([]);
  const [filteredResidents, setFilteredResidents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingResident, setEditingResident] = useState(null);
  const [showContacts, setShowContacts] = useState(false);
  const [selectedResident, setSelectedResident] = useState(null);

  useEffect(() => {
    loadResidents();
  }, []);

  // Add search filter effect
  useEffect(() => {
    if (searchTerm) {
      const filtered = residents.filter(resident =>
        resident.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resident.Phone_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resident.Email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resident.House_No?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resident.Address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredResidents(filtered);
    } else {
      setFilteredResidents(residents);
    }
  }, [searchTerm, residents]);

  const loadResidents = async () => {
    try {
      const response = await residentAPI.getAll();
      const sortedData = response.data.sort((a, b) => a.Resident_ID - b.Resident_ID);
      setResidents(sortedData);
      setFilteredResidents(sortedData);
    } catch (error) {
      console.error('Error loading residents:', error);
      alert('Error loading residents');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (residentId) => {
    if (window.confirm('Are you sure you want to delete this resident?')) {
      try {
        await residentAPI.delete(residentId);
        await loadResidents();
        alert('Resident deleted successfully');
      } catch (error) {
        console.error('Error deleting resident:', error);
        alert('Error deleting resident');
      }
    }
  };

  const handleEdit = (resident) => {
    setEditingResident(resident);
    setShowForm(true);
  };

  const handleViewContacts = (resident) => {
    setSelectedResident(resident);
    setShowContacts(true);
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
          <i className="bi bi-people me-2"></i>
          Resident Management
        </h2>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setEditingResident(null);
            setShowForm(true);
          }}
        >
          <i className="bi bi-person-plus me-2"></i>
          Add New Resident
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
                  placeholder="Search residents by name, phone, email, house number..."
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
                  Showing {filteredResidents.length} of {residents.length} residents
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">All Residents</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>DB ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>House No</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredResidents.map((resident, index) => (
                  <tr key={resident.Resident_ID}>
                    <td>
                      <strong>{index + 1}</strong>
                    </td>
                    <td>
                      <small className="text-muted">#{resident.Resident_ID}</small>
                    </td>
                    <td>{resident.Name}</td>
                    <td>{resident.Phone_number}</td>
                    <td>{resident.Email}</td>
                    <td>{resident.House_No}</td>
                    <td>{resident.Address}</td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-info"
                          onClick={() => handleViewContacts(resident)}
                          title="View Contacts"
                        >
                          <i className="bi bi-telephone"></i>
                        </button>
                        <button
                          className="btn btn-outline-warning"
                          onClick={() => handleEdit(resident)}
                          title="Edit Resident"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => handleDelete(resident.Resident_ID)}
                          title="Delete Resident"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredResidents.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center text-muted py-4">
                      {searchTerm ? 'No residents found matching your search.' : 'No residents found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ResidentForm
        show={showForm}
        onHide={() => {
          setShowForm(false);
          setEditingResident(null);
        }}
        resident={editingResident}
        onSave={loadResidents}
      />

      <ResidentContacts
        show={showContacts}
        onHide={() => {
          setShowContacts(false);
          setSelectedResident(null);
        }}
        resident={selectedResident}
      />
    </div>
  );
};

export default ResidentList;