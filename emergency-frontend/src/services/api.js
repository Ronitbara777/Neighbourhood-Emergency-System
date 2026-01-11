import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Define endpoints directly in this file
const ENDPOINTS = {
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

const api = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 10000,
});

// Incident API calls
export const incidentAPI = {
  getAll: () => api.get(ENDPOINTS.INCIDENTS.ALL),
  getById: (id) => api.get(ENDPOINTS.INCIDENTS.BY_ID(id)),
  getByResident: (residentId) => api.get(ENDPOINTS.INCIDENTS.BY_RESIDENT(residentId)),
  create: (data) => api.post(ENDPOINTS.INCIDENTS.ALL, data),
  updateStatus: (id, status) => api.put(ENDPOINTS.INCIDENTS.UPDATE_STATUS(id), { status }),
};

// Resident API calls
export const residentAPI = {
  getAll: () => api.get(ENDPOINTS.RESIDENTS.ALL),
  getById: (id) => api.get(ENDPOINTS.RESIDENTS.BY_ID(id)),
  create: (data) => api.post(ENDPOINTS.RESIDENTS.ALL, data),
  update: (id, data) => api.put(ENDPOINTS.RESIDENTS.BY_ID(id), data),
  delete: (id) => api.delete(ENDPOINTS.RESIDENTS.BY_ID(id)),
  getContacts: (id) => api.get(ENDPOINTS.RESIDENTS.CONTACTS(id)),
  addContact: (id, data) => api.post(ENDPOINTS.RESIDENTS.ADD_CONTACT(id), data),
  updateContact: (residentId, contactId, data) => api.put(ENDPOINTS.RESIDENTS.UPDATE_CONTACT(residentId, contactId), data),
  deleteContact: (residentId, contactId) => api.delete(ENDPOINTS.RESIDENTS.DELETE_CONTACT(residentId, contactId)),
};

// Service API calls
export const serviceAPI = {
  getAll: () => api.get(ENDPOINTS.SERVICES.ALL),
  getById: (id) => api.get(ENDPOINTS.SERVICES.BY_ID(id)),
};

export default api;