const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

// Register user
router.post('/register', userController.register);
// Login user
router.post('/login', userController.login);
// Logout user
router.post('/logout', authenticate, userController.logout);

module.exports = router;