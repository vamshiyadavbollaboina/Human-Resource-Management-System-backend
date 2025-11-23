// backend/src/index.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');


// Routes
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');
const teamRoutes = require('./routes/teams');
const logRoutes = require('./routes/logs');

const app = express();
const PORT = process.env.PORT || 5000;

// ---------------------------
// Middleware
// ---------------------------
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// ---------------------------
// Database Check
// ---------------------------
db.sequelize.authenticate()
  .then(() => console.log('Database connection established successfully.'))
  .catch(err => {
    console.error('CRITICAL: Database connection failed ->', err.message);
    process.exit(1);
  });

// ---------------------------
// Routes
// ---------------------------
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/logs', logRoutes);

// Health route
app.get('/', (req, res) => {
  res.send('HRMS Backend API is running successfully!');
});

// ---------------------------
// Start Server
// ---------------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Local API: http://localhost:${PORT}`);
});
