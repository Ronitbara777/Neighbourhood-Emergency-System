const API_BASE_URL = 'http://localhost:5000/api';

export const ENDPOINTS = {
  INCIDENTS: {
    ALL: `${API_BASE_URL}/incidents`,
    BY_ID: (id) => `${API_BASE_URL}/incidents/${id}`,
    BY_RESIDENT: (residentId) => `${API_BASE_URL}/incidents/resident/${residentId}`,
    UPDATE_STATUS: (id) => `${API_BASE_URL}/incidents/${id}/status`,
  },
  RESIDENTS: {
    ALL: `${API_BASE_URL}/residents`,
    BY_ID: (id) => `${API_BASE_URL}/residents/${id}`,
    CONTACTS: (id) => `${API_BASE_URL}/residents/${id}/contacts`,
    ADD_CONTACT: (id) => `${API_BASE_URL}/residents/${id}/contacts`,
    UPDATE_CONTACT: (residentId, contactId) => `${API_BASE_URL}/residents/${residentId}/contacts/${contactId}`,
    DELETE_CONTACT: (residentId, contactId) => `${API_BASE_URL}/residents/${residentId}/contacts/${contactId}`,
  },
  SERVICES: {
    ALL: `${API_BASE_URL}/services`,
    BY_ID: (id) => `${API_BASE_URL}/services/${id}`,
  }
};