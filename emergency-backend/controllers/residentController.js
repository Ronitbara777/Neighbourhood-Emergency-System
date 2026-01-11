const db = require('../config/database');

const residentController = {
  // Get all residents
  getAllResidents: (req, res) => {
    const query = 'SELECT * FROM Resident ORDER BY Name';
    
    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to fetch residents' });
      }
      res.json(results);
    });
  },

  // Get resident by ID
  getResidentById: (req, res) => {
    const residentId = req.params.id;
    
    const query = 'SELECT * FROM Resident WHERE Resident_ID = ?';
    
    db.query(query, [residentId], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to fetch resident' });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ error: 'Resident not found' });
      }
      
      res.json(results[0]);
    });
  },

  // Get emergency contacts for a resident
  getResidentContacts: (req, res) => {
    const residentId = req.params.id;
    
    const query = `
      SELECT 
        ec.Contact_ID, ec.Name, ec.Contact_Type, ec.Phone_Number,
        rc.Relationship_Type, rc.Priority_level, rc.ResidentContact_ID
      FROM Resident_Contact rc
      JOIN Emergency_Contact ec ON rc.Contact_ID = ec.Contact_ID
      WHERE rc.Resident_ID = ?
      ORDER BY rc.Priority_level ASC
    `;
    
    db.query(query, [residentId], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to fetch contacts' });
      }
      res.json(results);
    });
  },

  // Create new resident
  createResident: (req, res) => {
    const { name, address, phone_number, email, house_no } = req.body;
    
    const query = `
      INSERT INTO Resident (Name, Address, Phone_number, Email, House_No) 
      VALUES (?, ?, ?, ?, ?)
    `;
    
    db.query(query, [name, address, phone_number, email, house_no], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to create resident' });
      }
      
      res.status(201).json({
        success: true,
        resident_id: result.insertId,
        message: 'Resident created successfully'
      });
    });
  },

  // Update resident
  updateResident: (req, res) => {
    const residentId = req.params.id;
    const { name, address, phone_number, email, house_no } = req.body;
    
    const query = `
      UPDATE Resident 
      SET Name = ?, Address = ?, Phone_number = ?, Email = ?, House_No = ?
      WHERE Resident_ID = ?
    `;
    
    db.query(query, [name, address, phone_number, email, house_no, residentId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to update resident' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Resident not found' });
      }
      
      res.json({
        success: true,
        message: 'Resident updated successfully'
      });
    });
  },

  // Delete resident
  deleteResident: (req, res) => {
    const residentId = req.params.id;
    
    const query = 'DELETE FROM Resident WHERE Resident_ID = ?';
    
    db.query(query, [residentId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to delete resident' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Resident not found' });
      }
      
      res.json({
        success: true,
        message: 'Resident deleted successfully'
      });
    });
  },

  // Add emergency contact
  addEmergencyContact: (req, res) => {
    const residentId = req.params.id;
    const { name, contact_type, phone_number, relationship_type, priority_level } = req.body;
    
    // First create emergency contact
    const contactQuery = `
      INSERT INTO Emergency_Contact (Name, Contact_Type, Phone_Number) 
      VALUES (?, ?, ?)
    `;
    
    db.query(contactQuery, [name, contact_type, phone_number], (err, contactResult) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to create emergency contact' });
      }
      
      // Then link to resident
      const residentContactQuery = `
        INSERT INTO Resident_Contact (Resident_ID, Contact_ID, Relationship_Type, Priority_level) 
        VALUES (?, ?, ?, ?)
      `;
      
      db.query(residentContactQuery, [residentId, contactResult.insertId, relationship_type, priority_level], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to link contact to resident' });
        }
        
        res.status(201).json({
          success: true,
          contact_id: contactResult.insertId,
          message: 'Emergency contact added successfully'
        });
      });
    });
  },

  // Update emergency contact
  updateEmergencyContact: (req, res) => {
    const { residentId, contactId } = req.params;
    const { name, contact_type, phone_number, relationship_type, priority_level } = req.body;
    
    // Update emergency contact
    const contactQuery = `
      UPDATE Emergency_Contact 
      SET Name = ?, Contact_Type = ?, Phone_Number = ?
      WHERE Contact_ID = ?
    `;
    
    db.query(contactQuery, [name, contact_type, phone_number, contactId], (err, contactResult) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to update emergency contact' });
      }
      
      // Update resident contact relationship
      const residentContactQuery = `
        UPDATE Resident_Contact 
        SET Relationship_Type = ?, Priority_level = ?
        WHERE Resident_ID = ? AND Contact_ID = ?
      `;
      
      db.query(residentContactQuery, [relationship_type, priority_level, residentId, contactId], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to update contact relationship' });
        }
        
        res.json({
          success: true,
          message: 'Emergency contact updated successfully'
        });
      });
    });
  },

  // Delete emergency contact
  deleteEmergencyContact: (req, res) => {
    const { residentId, contactId } = req.params;
    
    // First delete from Resident_Contact
    const residentContactQuery = 'DELETE FROM Resident_Contact WHERE Resident_ID = ? AND Contact_ID = ?';
    
    db.query(residentContactQuery, [residentId, contactId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to unlink contact from resident' });
      }
      
      // Then delete from Emergency_Contact
      const contactQuery = 'DELETE FROM Emergency_Contact WHERE Contact_ID = ?';
      
      db.query(contactQuery, [contactId], (err, contactResult) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to delete emergency contact' });
        }
        
        res.json({
          success: true,
          message: 'Emergency contact deleted successfully'
        });
      });
    });
  }
};

module.exports = residentController;