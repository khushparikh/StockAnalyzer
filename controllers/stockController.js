const Stock = require('../models/Stock');
const axios = require('axios');
const { Configuration, OpenAIApi } = require('openai');


// Get all stocks in portfolio
exports.getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.findAll();
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new stock
exports.addStock = async (req, res) => {
  try {
    const { symbol, quantity } = req.body;
    
    // Get stock details including current price and company name
    const stockDetails = await fetchStockDetails(symbol);
    
    const stock = await Stock.create({
      symbol: symbol.toUpperCase(),
      name: stockDetails.name,
      quantity,
      purchasePrice: stockDetails.currentPrice,
      currentPrice: stockDetails.currentPrice,
      industry: stockDetails.industry,
      lastUpdated: new Date()
    });
    
    res.status(201).json(stock);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get individual stock details
exports.getStockDetails = async (req, res) => {
  try {
    const stock = await Stock.findByPk(req.params.id);
    
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    // Update current price and details
    const stockDetails = await fetchStockDetails(stock.symbol);
    await stock.update({
      currentPrice: stockDetails.currentPrice,
      name: stockDetails.name,
      industry: stockDetails.industry,
      lastUpdated: new Date()
    });

    // Get AI advice
    const advice = await generateStockAdvice(stock.symbol);
    
    res.json({
      ...stock.toJSON(),
      advice
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
