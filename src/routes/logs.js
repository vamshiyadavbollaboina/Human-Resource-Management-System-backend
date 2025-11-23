// backend/src/routes/logs.js
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const logController = require('../controllers/logController');

// Log viewing should be protected
router.use(authMiddleware); 

router.get('/', logController.listLogs); // GET /api/logs

module.exports = router;