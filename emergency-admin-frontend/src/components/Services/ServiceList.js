import React, { useState, useEffect } from 'react';
import { serviceAPI } from '../../services/api';

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await serviceAPI.getAll();
      setServices(response.data);
    } catch (error) {
      console.error('Error loading services:', error);
      alert('Error loading services');
    } finally {
      setLoading(false);
    }
  };

  const getServiceTypeBadge = (type) => {
    const colors = {
      'Fire': 'danger',
      'Police': 'primary',
      'Medical': 'success',
      'Rescue': 'warning'
    };
    return <span className={`badge bg-${colors[type] || 'secondary'}`}>{type}</span>;
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
          <i className="bi bi-building me-2"></i>
          Emergency Services
        </h2>
      </div>

      <div className="row">
        {services.map((service) => (
          <div key={service.Service_ID} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-header">
                <h6 className="mb-0">{service.Service_Name}</h6>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  {getServiceTypeBadge(service.Service_Type)}
                </div>
                <p className="mb-2">
                  <i className="bi bi-telephone me-2"></i>
                  <strong>Contact:</strong> {service.Contact_Number}
                </p>
                {service.Address && (
                  <p className="mb-0">
                    <i className="bi bi-geo-alt me-2"></i>
                    <strong>Address:</strong> {service.Address}
                  </p>
                )}
              </div>
              <div className="card-footer bg-transparent">
                <small className="text-muted">
                  Service ID: #{service.Service_ID}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card mt-4">
        <div className="card-header">
          <h5 className="mb-0">Service Statistics</h5>
        </div>
        <div className="card-body">
          <div className="row text-center">
            <div className="col-md-3">
              <div className="border rounded p-3">
                <h3 className="text-primary">{services.filter(s => s.Service_Type === 'Fire').length}</h3>
                <p className="mb-0">Fire Services</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="border rounded p-3">
                <h3 className="text-primary">{services.filter(s => s.Service_Type === 'Police').length}</h3>
                <p className="mb-0">Police Services</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="border rounded p-3">
                <h3 className="text-primary">{services.filter(s => s.Service_Type === 'Medical').length}</h3>
                <p className="mb-0">Medical Services</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="border rounded p-3">
                <h3 className="text-primary">{services.length}</h3>
                <p className="mb-0">Total Services</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceList;