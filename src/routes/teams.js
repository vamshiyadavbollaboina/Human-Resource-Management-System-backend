// backend/src/routes/teams.js
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const teamController = require('../controllers/teamController');

// All team routes must be authenticated
router.use(authMiddleware); 

router.get('/', teamController.listTeams);                  // List all teams
router.post('/', teamController.createTeam);                // Create a team
router.get('/:id', teamController.getTeam);                 // Read a single team
router.put('/:id', teamController.updateTeam);              // Update a team
router.delete('/:id', teamController.deleteTeam);           // Delete a team
router.post('/:id/assign', teamController.assignEmployees);  // Assign employees to a team

module.exports = router;