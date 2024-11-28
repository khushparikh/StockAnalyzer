const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');
const { authenticate } = require('../middleware/auth');

// Get all stocks in the user's portfolio
router.get('/', authenticate, stockController.getAllStocks);

// Add a new stock
router.post('/add', authenticate, stockController.addStock);

// Get individual stock details
router.get('/:id', authenticate, stockController.getStockDetails);

// Analyze portfolio
router.get('/analyze/portfolio', authenticate, stockController.analyzePortfolio);

// Clear all stocks
router.delete('/clear', authenticate, stockController.clearStocks);

module.exports = router;
