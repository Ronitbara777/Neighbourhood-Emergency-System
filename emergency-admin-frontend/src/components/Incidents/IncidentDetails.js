import React from 'react';

const IncidentDetails = ({ incident, show, onHide }) => {
  if (!incident || !show) return null;

  const getStatusBadge = (status) => {
    const statusClass = `status-${status.toLowerCase().replace(' ', '')}`;
    return <span className={`status-badge ${statusClass}`}>{status}</span>;
  };

  const getEmergencyTypeBadge = (type) => {
    const typeClass = `type-${type.toLowerCase().replace(' ', '')}`;
    return <span className={`emergency-type-badge ${typeClass}`}>{type}</span>;
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Incident Details #{incident.Incident_ID}</h5>
            <button type="button" className="btn-close" onClick={onHide}></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-6">
                <h6>Basic Information</h6>
                <p><strong>ID:</strong> #{incident.Incident_ID}</p>
                <p><strong>Date & Time:</strong> {new Date(incident.Date_Time).toLocaleString()}</p>
                <p><strong>Emergency Type:</strong> {getEmergencyTypeBadge(incident.Emergency_Type)}</p>
                <p><strong>Status:</strong> {getStatusBadge(incident.Status)}</p>
              </div>
              <div className="col-md-6">
                <h6>Location & Service</h6>
                <p><strong>Location:</strong> {incident.Location}</p>
                <p><strong>Assigned Service:</strong> {incident.Service_Name}</p>
                <p><strong>Service Contact:</strong> {incident.Service_Contact}</p>
                <p><strong>Service Type:</strong> {incident.Service_Type}</p>
              </div>
            </div>

            <hr />

            <div className="row">
              <div className="col-md-6">
                <h6>Resident Information</h6>
                <p><strong>Name:</strong> {incident.Resident_Name}</p>
                <p><strong>Phone:</strong> {incident.Phone_number}</p>
                <p><strong>Address:</strong> {incident.Address}</p>
              </div>
              <div className="col-md-6">
                <h6>Incident Details</h6>
                <p><strong>Description:</strong></p>
                <div className="border p-2 bg-light rounded">
                  {incident.Description}
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onHide}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentDetails;