const db = require('../config/database');

// Business logic for auto-assigning services
const autoAssignService = (emergencyType) => {
  const serviceMap = {
    'Fire': 1,      // Fire Department
    'Medical': 3,   // Ambulance Service
    'Police': 2,    // Police Station
    'Accident': 3,  // Ambulance
    'Natural Disaster': 1, // Fire Department as first responder
    'Other': 2      // Default to Police
  };
  return serviceMap[emergencyType] || 2;
};

const incidentController = {
  // Report new incident
  reportIncident: (req, res) => {
    const { resident_id, emergency_type, description, location, user_name } = req.body;
    
    console.log('=== BACKEND RECEIVED ===');
    console.log('Description received:', description);
    
    const service_id = autoAssignService(emergency_type);
    
    // SIMPLE FIX: Use the description directly as it comes from frontend
    const dbDescription = description || `Emergency reported by ${user_name} at ${location}`;
    
    console.log('Storing in DB:', dbDescription);
    
    const query = `
      INSERT INTO Incident_Report 
      (Resident_ID, Description, Emergency_Type, Location, Service_ID, Status) 
      VALUES (?, ?, ?, ?, ?, 'Reported')
    `;
    
    db.query(query, [resident_id, dbDescription, emergency_type, location, service_id], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to report incident' });
      }
      
      res.status(201).json({
        success: true,
        incident_id: result.insertId,
        message: `Emergency reported successfully!`,
        service_id: service_id
      });
    });
  },

  // Get all incidents (for handler)
  getAllIncidents: (req, res) => {
    const query = `
      SELECT 
        ir.Incident_ID, ir.Date_Time, ir.Description, ir.Emergency_Type, 
        ir.Location, ir.Status,
        r.Name as Resident_Name, r.Phone_number, r.Address,
        es.Service_Name, es.Service_Type, es.Contact_Number as Service_Contact
      FROM Incident_Report ir
      JOIN Resident r ON ir.Resident_ID = r.Resident_ID
      LEFT JOIN Emergency_Service es ON ir.Service_ID = es.Service_ID
      ORDER BY ir.Date_Time DESC
    `;
    
    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to fetch incidents' });
      }
      res.json(results);
    });
  },

  // Get incidents by resident
  getIncidentsByResident: (req, res) => {
    const residentId = req.params.residentId;
    
    const query = `
      SELECT 
        ir.*, es.Service_Name, es.Contact_Number as Service_Contact
      FROM Incident_Report ir
      LEFT JOIN Emergency_Service es ON ir.Service_ID = es.Service_ID
      WHERE ir.Resident_ID = ?
      ORDER BY ir.Date_Time DESC
    `;
    
    db.query(query, [residentId], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to fetch incidents' });
      }
      res.json(results);
    });
  },

  // Update incident status
  updateIncidentStatus: (req, res) => {
    const incidentId = req.params.id;
    const { status } = req.body;
    
    const query = 'UPDATE Incident_Report SET Status = ? WHERE Incident_ID = ?';
    
    db.query(query, [status, incidentId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to update status' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Incident not found' });
      }
      
      res.json({ 
        success: true, 
        message: `Status updated to: ${status}` 
      });
    });
  },

  // Get incident by ID
  getIncidentById: (req, res) => {
    const incidentId = req.params.id;
    
    const query = `
      SELECT 
        ir.*, 
        r.Name as Resident_Name, r.Phone_number, r.Address,
        es.Service_Name, es.Service_Type, es.Contact_Number as Service_Contact
      FROM Incident_Report ir
      JOIN Resident r ON ir.Resident_ID = r.Resident_ID
      LEFT JOIN Emergency_Service es ON ir.Service_ID = es.Service_ID
      WHERE ir.Incident_ID = ?
    `;
    
    db.query(query, [incidentId], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to fetch incident' });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ error: 'Incident not found' });
      }
      
      res.json(results[0]);
    });
  }
};

module.exports = incidentController;