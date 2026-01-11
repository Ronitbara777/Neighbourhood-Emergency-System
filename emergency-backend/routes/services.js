const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// Get all emergency services
router.get('/', serviceController.getAllServices);

// Get service by ID
router.get('/:id', serviceController.getServiceById);

// Remove this line for now - it's causing the error
// router.put('/incidents/:id/service', serviceController.updateServiceAllocation);

module.exports = router;