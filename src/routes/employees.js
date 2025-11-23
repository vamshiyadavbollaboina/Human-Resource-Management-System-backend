// backend/src/routes/employees.js
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const employeeController = require('../controllers/employeeController');

// All employee routes must be authenticated
router.use(authMiddleware); 

router.get('/', employeeController.listEmployees);          // List all
router.post('/', employeeController.createEmployee);        // Create
router.get('/:id', employeeController.getEmployee);         // Read single
router.put('/:id', employeeController.updateEmployee);      // Update
router.delete('/:id', employeeController.deleteEmployee);   // Delete
router.post('/:id/teams', employeeController.assignTeams);  // Assign to teams

module.exports = router;