const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

// Get all stocks in portfolio
router.get('/', stockController.getAllStocks);

// Add a new stock
router.post('/add', stockController.addStock);

// Get individual stock details
router.get('/:id', stockController.getStockDetails);

// Analyze portfolio
router.get('/analyze/portfolio', stockController.analyzePortfolio);

// Clear all stocks
router.delete('/clear', stockController.clearStocks);

module.exports = router;
