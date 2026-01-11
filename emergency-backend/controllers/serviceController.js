const db = require('../config/database');

const serviceController = {
  // Get all emergency services
  getAllServices: (req, res) => {
    const query = 'SELECT * FROM Emergency_Service ORDER BY Service_Type';
    
    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to fetch services' });
      }
      res.json(results);
    });
  },

  // Get service by ID
  getServiceById: (req, res) => {
    const serviceId = req.params.id;
    
    const query = 'SELECT * FROM Emergency_Service WHERE Service_ID = ?';
    
    db.query(query, [serviceId], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to fetch service' });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ error: 'Service not found' });
      }
      
      res.json(results[0]);
    });
  },

  // Update service allocation for incident
  updateServiceAllocation: (req, res) => {
    const incidentId = req.params.id;
    const { service_id } = req.body;
    
    const query = 'UPDATE Incident_Report SET Service_ID = ? WHERE Incident_ID = ?';
    
    db.query(query, [service_id, incidentId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to update service allocation' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Incident not found' });
      }
      
      res.json({ 
        success: true, 
        message: 'Service allocation updated successfully' 
      });
    });
  }
};

module.exports = serviceController;