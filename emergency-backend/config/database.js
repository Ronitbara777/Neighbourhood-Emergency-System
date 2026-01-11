const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3308,  // Make sure port is included
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'rootpassword',
  database: process.env.DB_NAME || 'emergency_management_system'
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Error connecting to MySQL:', err.message);
    console.log('💡 Make sure Docker container is running: docker-compose up -d');
  } else {
    console.log('✅ Connected to MySQL Docker container successfully!');
  }
});

module.exports = connection;