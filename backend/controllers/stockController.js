const Stock = require('../models/Stock');
const axios = require('axios');
const { Anthropic } = require('@anthropic-ai/sdk');

// Initialize the Anthropic client
const anthropicClient = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, // Your API key
});

// Fetch stock details from Finnhub
async function fetchStockDetails(symbol) {
  try {
    const [quoteResponse, profileResponse] = await Promise.all([
      axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`),
      axios.get(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`)
    ]);
    
    return {
      currentPrice: quoteResponse.data.c,
      name: profileResponse.data.name,
      industry: profileResponse.data.finnhubIndustry
    };
  } catch (error) {
    console.error('Error fetching stock details:', error);
    throw new Error(`Could not fetch details for ${symbol}`);
  }
}

// Get all stocks in portfolio
exports.getAllStocks = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming authentication middleware sets req.user
    const stocks = await Stock.findAll({ where: { userId } });
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new stock
exports.addStock = async (req, res) => {
  try {
    const { symbol, quantity } = req.body;
    const userId = req.user.id; // Assuming authentication middleware sets req.user

    const stockDetails = await fetchStockDetails(symbol);

    const stock = await Stock.create({
      symbol: symbol.toUpperCase(),
      name: stockDetails.name,
      quantity,
      purchasePrice: stockDetails.currentPrice,
      currentPrice: stockDetails.currentPrice,
      industry: stockDetails.industry,
      lastUpdated: new Date(),
      userId
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

    // Get AI analysis using Claude
    const analysis = await analyzeStockWithClaude(stock.symbol);
    
    res.json({
      ...stock.toJSON(),
      aiAnalysis: analysis
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get stock by symbol
exports.getStockBySymbol = async (req, res) => {
  try {
    const { symbol } = req.params;
    const userId = req.user.id;

    const stock = await Stock.findOne({ 
      where: { 
        symbol: symbol.toUpperCase(),
        userId 
      } 
    });
    
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found in your portfolio' });
    }

    // Update current price and details
    const stockDetails = await fetchStockDetails(stock.symbol);
    await stock.update({
      currentPrice: stockDetails.currentPrice,
      name: stockDetails.name,
      industry: stockDetails.industry,
      lastUpdated: new Date()
    });

    // Get AI analysis using Claude
    const analysis = await analyzeStockWithClaude(stock.symbol);
    
    res.json({
      ...stock.toJSON(),
      aiAnalysis: analysis
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Analyze portfolio
exports.analyzePortfolio = async (req, res) => {
  try {
    const stocks = await Stock.findAll();
    
    let totalValue = 0;
    let totalInvestment = 0;
    const stocksWithCurrentValue = [];

    for (const stock of stocks) {
      const stockDetails = await fetchStockDetails(stock.symbol);
      await stock.update({
        currentPrice: stockDetails.currentPrice,
        name: stockDetails.name,
        industry: stockDetails.industry,
        lastUpdated: new Date()
      });

      const currentValue = stock.quantity * stockDetails.currentPrice;
      const investmentValue = stock.quantity * stock.purchasePrice;
      
      totalValue += currentValue;
      totalInvestment += investmentValue;

      stocksWithCurrentValue.push({
        ...stock.toJSON(),
        currentValue,
        profitLoss: currentValue - investmentValue,
        profitLossPercentage: ((currentValue - investmentValue) / investmentValue) * 100
      });
    }

    // Get AI analysis for the entire portfolio
    const portfolioAnalysis = await analyzePortfolioWithClaude(stocksWithCurrentValue);

    res.json({
      stocks: stocksWithCurrentValue,
      summary: {
        totalValue,
        totalInvestment,
        totalProfitLoss: totalValue - totalInvestment,
        totalProfitLossPercentage: ((totalValue - totalInvestment) / totalInvestment) * 100
      },
      aiAnalysis: portfolioAnalysis
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.clearStocks = async (req, res) => {
  try {
    await Stock.destroy({
      where: {},
      truncate: true
    });
    res.json({ message: 'All stocks have been cleared from the database' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

async function analyzeStockWithClaude(stockSymbol) {
  try {
    const prompt = `You are a financial advisor. Provide a detailed analysis of the stock ${stockSymbol}, including its current performance and future outlook.`;
    const response = await anthropicClient.complete({
      model: 'claude-2', // Specify the Claude model version
      prompt: `\n\nHuman: ${prompt}\n\nAssistant:`,
      maxTokensToSample: 200,
      temperature: 0.7, // Adjust temperature for variability in responses
    });

    return response.completion.trim(); // Return the clean response text
  } catch (error) {
    console.error('Error generating stock analysis with Claude:', error);
    return 'Unable to generate stock analysis at this time.';
  }
}

async function analyzePortfolioWithClaude(stocks) {
  try {
    const portfolioSummary = stocks
      .map(stock => `Stock: ${stock.symbol}, Quantity: ${stock.quantity}, Current Price: ${stock.currentPrice}`)
      .join('\n');

    const prompt = `
      You are a financial advisor. Analyze the following portfolio:
      ${portfolioSummary}
      Provide insights on the portfolio's performance, risks, and areas of potential improvement.
    `;

    const response = await anthropicClient.complete({
      model: 'claude-2',
      prompt: `\n\nHuman: ${prompt}\n\nAssistant:`,
      maxTokensToSample: 500,
      temperature: 0.7,
    });

    return response.completion.trim(); // Return the clean response text
  } catch (error) {
    console.error('Error generating portfolio analysis with Claude:', error);
    return 'Unable to generate portfolio analysis at this time.';
  }
}