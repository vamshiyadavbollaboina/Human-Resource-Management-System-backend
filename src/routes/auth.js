// backend/src/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware'); // Used for protected routes

// PUBLIC ROUTES
// POST /api/auth/register
router.post('/register', authController.register); // <-- This is line 6, where the error occurs
// POST /api/auth/login
router.post('/login', authController.login);

// PROTECTED ROUTES
// The authMiddleware ensures the user is logged in
router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;