const Stock = require('../models/Stock');
const axios = require('axios');
const OpenAI = require('openai');

// Configure OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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

// Generate AI Stock Advice
async function generateStockAdvice(stockSymbol) {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system", 
          content: "You are a financial advisor providing stock analysis."
        },
        {
          role: "user",
          content: `Provide a brief analysis and recommendation for ${stockSymbol} stock.`
        }
      ]
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating stock advice:', error);
    return 'Unable to generate stock advice at this time.';
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

    res.json({
      stocks: stocksWithCurrentValue,
      summary: {
        totalValue,
        totalInvestment,
        totalProfitLoss: totalValue - totalInvestment,
        totalProfitLossPercentage: ((totalValue - totalInvestment) / totalInvestment) * 100
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear all stocks
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
    const response = await axios.post(
      'https://api.anthropic.com/v1/completions',
      {
        model: 'claude-2',
        prompt: `You are a financial advisor. Provide a detailed analysis of the stock ${stockSymbol}, including its current performance and future outlook.`,
        max_tokens_to_sample: 200
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.ANTHROPIC_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.completion.trim(); // Ensure we return the clean completion text
  } catch (error) {
    console.error('Error generating stock analysis with Claude:', error);
    return 'Unable to generate stock analysis at this time.';
  }
}
