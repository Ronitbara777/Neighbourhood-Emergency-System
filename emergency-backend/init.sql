-- Initialize the database with your schema
USE emergency_management_system;

-- 1. Resident Table
CREATE TABLE IF NOT EXISTS Resident (
    Resident_ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Address TEXT NOT NULL,
    Phone_number VARCHAR(15) NOT NULL,
    Email VARCHAR(100),
    House_No VARCHAR(20)
);

-- 2. Emergency_Contact Table
CREATE TABLE IF NOT EXISTS Emergency_Contact (
    Contact_ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Contact_Type VARCHAR(50),
    Phone_Number VARCHAR(15) NOT NULL
);

-- 3. Resident_Contact Junction Table
CREATE TABLE IF NOT EXISTS Resident_Contact (
    ResidentContact_ID INT AUTO_INCREMENT PRIMARY KEY,
    Resident_ID INT,
    Contact_ID INT,
    Relationship_Type VARCHAR(50),
    Priority_level INT,
    FOREIGN KEY (Resident_ID) REFERENCES Resident(Resident_ID) ON DELETE CASCADE,
    FOREIGN KEY (Contact_ID) REFERENCES Emergency_Contact(Contact_ID) ON DELETE CASCADE,
    UNIQUE KEY unique_resident_contact (Resident_ID, Contact_ID)
);
    
-- 4. Emergency_Service Table
CREATE TABLE IF NOT EXISTS Emergency_Service (
    Service_ID INT AUTO_INCREMENT PRIMARY KEY,
    Service_Name VARCHAR(100) NOT NULL,
    Contact_Number VARCHAR(15) NOT NULL,
    Address TEXT,
    Service_Type VARCHAR(50)
);

-- 5. Incident_Report Table
CREATE TABLE IF NOT EXISTS Incident_Report (
    Incident_ID INT AUTO_INCREMENT PRIMARY KEY,
    Resident_ID INT,
    Date_Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Description TEXT ,
    Status VARCHAR(50) DEFAULT 'Reported',
    Service_ID INT,
    Emergency_Type VARCHAR(50),
    Location VARCHAR(255),
    FOREIGN KEY (Resident_ID) REFERENCES Resident(Resident_ID) ON DELETE CASCADE,
    FOREIGN KEY (Service_ID) REFERENCES Emergency_Service(Service_ID)
);

-- Insert sample residents
INSERT INTO Resident (Name, Address, Phone_number, Email, House_No) VALUES
('John Doe', '123 Main Street, Cityville', '555-0101', 'john.doe@email.com', 'A-101'),
('Jane Smith', '456 Oak Avenue, Townsville', '555-0102', 'jane.smith@email.com', 'B-205'),
('Mike Johnson', '789 Pine Road, Villagetown', '555-0103', 'mike.johnson@email.com', 'C-310'),
('Sarah Wilson', '321 Elm Street, Metrocity', '555-0104', 'sarah.wilson@email.com', 'D-115');

-- Insert emergency contacts
INSERT INTO Emergency_Contact (Name, Contact_Type, Phone_Number) VALUES
('Robert Doe', 'Father', '555-0201'),
('Maria Smith', 'Mother', '555-0202'),
('Mike Johnson', 'Friend', '555-0203'),
('David Wilson', 'Brother', '555-0204'),
('Lisa Brown', 'Sister', '555-0205'),
('Tom Davis', 'Neighbor', '555-0206');

-- Link residents with contacts
INSERT INTO Resident_Contact (Resident_ID, Contact_ID, Relationship_Type, Priority_level) VALUES
(1, 1, 'Father', 1),
(1, 3, 'Friend', 2),
(2, 2, 'Mother', 1),
(2, 6, 'Neighbor', 3),
(3, 4, 'Brother', 1),
(4, 5, 'Sister', 1);

-- Insert emergency services
INSERT INTO Emergency_Service (Service_Name, Contact_Number, Address, Service_Type) VALUES
('City Fire Department', '555-1001', '789 Fire Lane, Cityville', 'Fire'),
('Central Police Station', '555-1002', '321 Safety Road, Cityville', 'Police'),
('Metro Ambulance Service', '555-1003', '654 Health Street, Cityville', 'Medical'),
('Emergency Rescue Team', '555-1004', '987 Rescue Avenue, Cityville', 'Rescue');

-- Sample incident reports
INSERT INTO Incident_Report (Resident_ID, Description, Status, Service_ID, Emergency_Type, Location) VALUES
(1, 'Kitchen fire started while cooking', 'Dispatched', 1, 'Fire', '123 Main Street, Kitchen'),
(2, 'Severe chest pain and breathing difficulty', 'En Route', 3, 'Medical', '456 Oak Avenue, Living Room'),
(3, 'House burglary while away on vacation', 'Reported', 2, 'Police', '789 Pine Road, Main Entrance'),
(1, 'Car accident on highway exit', 'Resolved', 3, 'Medical', 'Highway 5, Exit 12');