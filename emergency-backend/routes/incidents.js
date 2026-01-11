const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');

// Report new incident
router.post('/', incidentController.reportIncident);

// Get all incidents (for handler)
router.get('/', incidentController.getAllIncidents);

// Get incidents by resident
router.get('/resident/:residentId', incidentController.getIncidentsByResident);

// Update incident status
router.put('/:id/status', incidentController.updateIncidentStatus);

// Get incident details
router.get('/:id', incidentController.getIncidentById);

// REMOVED: Add incident update route

module.exports = router;