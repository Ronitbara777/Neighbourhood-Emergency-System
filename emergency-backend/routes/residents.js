const express = require('express');
const router = express.Router();
const residentController = require('../controllers/residentController');

// Get all residents
router.get('/', residentController.getAllResidents);

// Get resident by ID
router.get('/:id', residentController.getResidentById);

// Get emergency contacts for a resident
router.get('/:id/contacts', residentController.getResidentContacts);

// Create new resident
router.post('/', residentController.createResident);

// Update resident
router.put('/:id', residentController.updateResident);

// Delete resident
router.delete('/:id', residentController.deleteResident);

// Add emergency contact
router.post('/:id/contacts', residentController.addEmergencyContact);

// Update emergency contact
router.put('/:id/contacts/:contactId', residentController.updateEmergencyContact);

// Delete emergency contact
router.delete('/:id/contacts/:contactId', residentController.deleteEmergencyContact);

module.exports = router;