<<<<<<< HEAD
# StockAnalyzer
=======
# Stock Portfolio Tracker

A Node.js application for tracking and analyzing your stock portfolio with real-time prices and AI-powered insights.

## Features
- Track multiple stocks in your portfolio
- Automatic fetching of real-time stock prices and company information
- AI-generated investment advice using OpenAI
- Portfolio performance analysis
- Local SQLite database for easy setup

## Prerequisites
- Node.js (v14 or later)
- Finnhub API Key (get it from [Finnhub](https://finnhub.io))
- OpenAI API Key (get it from [OpenAI Platform](https://platform.openai.com))

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/yourusername/stock-portfolio-tracker.git
cd stock-portfolio-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
PORT=5002
FINNHUB_API_KEY=your_finnhub_api_key
OPENAI_API_KEY=your_openai_api_key
```

4. Start the server:
```bash
npm run dev  # Development with auto-reload
# or
npm start    # Production
```

The server will start on port 5002 (or your specified port in .env). The SQLite database will be automatically:
- Created in the `data` directory if it doesn't exist
- Initialized with the necessary tables
- Migrated if there are any model changes

No additional database setup is required!

## API Documentation

Below are all the available API endpoints with example curl commands and their responses:

### 1. Get All Stocks
Retrieves all stocks in your portfolio.

```bash
curl http://localhost:5002/api/stocks
```

Example Response:
```json
[
  {
    "id": 1,
    "symbol": "AAPL",
    "name": "Apple Inc",
    "quantity": 100,
    "purchasePrice": 191.45,
    "currentPrice": 191.45,
    "industry": "Technology",
    "lastUpdated": "2023-11-25T06:30:00.519Z",
    "createdAt": "2023-11-25T06:30:00.519Z",
    "updatedAt": "2023-11-25T06:30:00.519Z"
  }
]
```

### 2. Add New Stock
Add a new stock to your portfolio. Only requires symbol and quantity - other details are fetched automatically.

```bash
curl -X POST http://localhost:5002/api/stocks/add \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "AAPL",
    "quantity": 100
  }'
```

Example Response:
```json
{
  "id": 1,
  "symbol": "AAPL",
  "name": "Apple Inc",
  "quantity": 100,
  "purchasePrice": 191.45,
  "currentPrice": 191.45,
  "industry": "Technology",
  "lastUpdated": "2023-11-25T06:30:00.519Z",
  "createdAt": "2023-11-25T06:30:00.519Z",
  "updatedAt": "2023-11-25T06:30:00.519Z"
}
```

### 3. Get Stock Details
Get detailed information about a specific stock by its ID.

```bash
curl http://localhost:5002/api/stocks/1
```

Example Response:
```json
{
  "id": 1,
  "symbol": "AAPL",
  "name": "Apple Inc",
  "quantity": 100,
  "purchasePrice": 191.45,
  "currentPrice": 191.45,
  "industry": "Technology",
  "lastUpdated": "2023-11-25T06:30:00.519Z",
  "createdAt": "2023-11-25T06:30:00.519Z",
  "updatedAt": "2023-11-25T06:30:00.519Z"
}
```

### 4. Analyze Portfolio
Get a comprehensive analysis of your entire portfolio, including current values and profit/loss calculations.

```bash
curl http://localhost:5002/api/stocks/analyze/portfolio
```

Example Response:
```json
{
  "stocks": [
    {
      "id": 1,
      "symbol": "AAPL",
      "name": "Apple Inc",
      "quantity": 100,
      "purchasePrice": 191.45,
      "currentPrice": 195.45,
      "industry": "Technology",
      "lastUpdated": "2023-11-25T06:30:00.519Z",
      "currentValue": 19545.00,
      "profitLoss": 400.00,
      "profitLossPercentage": 2.09
    }
  ],
  "summary": {
    "totalValue": 19545.00,
    "totalInvestment": 19145.00,
    "totalProfitLoss": 400.00,
    "totalProfitLossPercentage": 2.09
  }
}
```

### 5. Clear Portfolio
Delete all stocks from your portfolio.

```bash
curl -X DELETE http://localhost:5002/api/stocks/clear
```

Example Response:
```json
{
  "message": "All stocks have been cleared from the database"
}
```

### Response Status Codes
- 200: Successful operation
- 400: Bad request (invalid input)
- 404: Resource not found
- 500: Server error

### Error Response Format
When an error occurs, the response will look like this:
```json
{
  "message": "Error description here"
}
```

## Technologies
- Express.js - Web framework
- SQLite - Database
- Sequelize - ORM
- Finnhub API - Real-time stock data
- OpenAI API - AI-powered insights
- Axios - HTTP client

## Project Structure
```
stock-portfolio-tracker/
├── config/         # Database configuration
├── controllers/    # Request handlers
├── models/         # Data models
├── routes/         # API routes
├── data/          # SQLite database
├── server.js      # Application entry point
└── .env           # Environment variables
```

## Error Handling
- If port 5002 is in use, you can change it in the `.env` file
- Make sure your API keys are valid
- Check the console for any error messages

## Contributing
Feel free to open issues and pull requests!
>>>>>>> 0698b43 (added get stock feature and integrated FINNHUB API for realtime stock data)
