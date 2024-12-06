const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');
const { authenticate } = require('../middleware/auth');

// Get all stocks in the user's portfolio
router.get('/', authenticate, stockController.getAllStocks);

// Get stock by symbol
router.get('/symbol/:symbol', authenticate, stockController.getStockBySymbol);

// Add a new stock
router.post('/add', authenticate, stockController.addStock);

// Get individual stock details
router.get('/:id', authenticate, stockController.getStockDetails);

const stockController = require('../controllers/stockController');
const { authenticate } = require('../middleware/auth');

// Delete a stock by ID
router.delete('/:id', authenticate, stockController.deleteStock);

// Analyze portfolio
router.get('/analyze/portfolio', authenticate, stockController.analyzePortfolio);

// Clear all stocks
router.delete('/clear', authenticate, stockController.clearStocks);

module.exports = router;
