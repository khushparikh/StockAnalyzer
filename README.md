# Stock Portfolio Tracker

A Node.js application for tracking and analyzing your stock portfolio with real-time prices, AI-powered insights, and user authentication.

## Features

- Secure user authentication with JWT
- Personal stock portfolio management
- Real-time stock prices and company information via Finnhub API
- Advanced AI-powered stock analysis using Anthropic's Claude
- Detailed portfolio performance metrics
- Intelligent investment recommendations
- SQLite database for easy setup and portability
- End-to-end encryption for sensitive stock data (quantities and prices)

## Prerequisites

- Node.js (v20 or later)
- Finnhub API Key (get it from [Finnhub](https://finnhub.io))
- Anthropic API Key (get it from [Anthropic](https://console.anthropic.com))

## Project Structure

```
stock-portfolio-tracker/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── stockController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Stock.js
│   │   └── User.js
│   ├── utils/
│   │   └── encryption.js
│   ├── routes/
│   │   ├── stockRoutes.js
│   │   └── userRoutes.js
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   ├── .env
│   └── .env.example
└── README.md
```

## Getting Started

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

4. Update the `.env` file with your credentials:

```env
PORT=5001
FINNHUB_API_KEY=your_finnhub_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_32_byte_encryption_key
```

5. Generate a secure encryption key:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

6. Add the generated encryption key to your `.env` file

7. Start the development server:

```bash
npm run dev
```

8. Open a new terminal

9. Navigate to the frontend directory:

```bash
cd backend
```

10. Install dependencies:

```bash
npm install
```

11. Start the development server:

```bash
npm run dev
```

## Security Features

### Data Encryption
The application uses AES-256-CBC encryption to protect sensitive stock data:
- Stock quantities
- Average purchase prices
- Current prices

The encryption is transparent to API users - data is automatically:
- Encrypted when saved to the database
- Decrypted when retrieved through the API

## API Documentation

### Authentication Endpoints

#### Register a New User

```bash
curl -X POST http://localhost:5001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

Example Response:

```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login

```bash
curl -X POST http://localhost:5001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Example Response:

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Stock Portfolio Endpoints

All stock endpoints require authentication. Replace `your_jwt_token` with your actual JWT token.

#### Add a Stock
```bash
curl -X POST http://localhost:5001/api/stocks/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{
    "symbol": "AAPL",
    "quantity": 10
  }'
```

Response:
```json
{
  "id": 1,
  "userId": 1,
  "symbol": "AAPL",
  "name": "Apple Inc",
  "quantity": 10,
  "averagePrice": 243.01,
  "currentPrice": 243.01,
  "industry": "Technology",
  "lastUpdated": "2024-12-05T00:23:56.502Z",
  "createdAt": "2024-12-05T00:23:56.502Z",
  "updatedAt": "2024-12-05T00:23:56.502Z"
}
```

#### Get All Stocks
```bash
curl -X GET http://localhost:5001/api/stocks \
  -H "Authorization: Bearer your_jwt_token"
```

Response:
```json
[
  {
    "id": 1,
    "userId": 1,
    "symbol": "AAPL",
    "name": "Apple Inc",
    "quantity": 10,
    "averagePrice": 243.01,
    "currentPrice": 243.01,
    "industry": "Technology",
    "lastUpdated": "2024-12-05T00:23:56.502Z",
    "createdAt": "2024-12-05T00:23:56.502Z",
    "updatedAt": "2024-12-05T00:23:56.502Z"
  }
]

```

#### Get Stock by Symbol with AI Analysis
```bash
curl -X GET http://localhost:5001/api/stocks/symbol/AAPL \
  -H "Authorization: Bearer your_jwt_token"
```

Response:
```json
{
  "id": 1,
  "userId": 1,
  "symbol": "AAPL",
  "name": "Apple Inc",
  "quantity": 10,
  "averagePrice": 243.01,
  "currentPrice": 243.01,
  "industry": "Technology",
  "lastUpdated": "2024-12-05T00:25:01.000Z",
  "createdAt": "2024-12-05T00:23:56.502Z",
  "updatedAt": "2024-12-05T00:25:01.001Z",
  "aiAnalysis": "As a financial advisor, here is a brief analysis of the stock AAPL (Apple Inc.):\n\nKey Performance Indicators:\n- Revenue growth: AAPL has consistently reported strong revenue growth..."
}
```

#### Analyze Portfolio

```bash
curl -X GET http://localhost:5001/api/stocks/analyze/portfolio \
  -H "Authorization: Bearer your_jwt_token"
```

Example Response:

```json
{
  "stocks": [
    {
      "id": 1,
      "userId": 1,
      "symbol": "AAPL",
      "name": "Apple Inc",
      "quantity": 10,
      "averagePrice": 243.01,
      "currentPrice": 243.01,
      "industry": "Technology",
      "lastUpdated": "2024-12-05T00:26:17.532Z",
      "createdAt": "2024-12-05T00:23:56.502Z",
      "updatedAt": "2024-12-05T00:26:17.532Z",
      "currentValue": 2430.1,
      "profitLoss": null,
      "profitLossPercentage": null
    },
    {
      "id": 2,
      "userId": 1,
      "symbol": "MSFT",
      "name": "Microsoft Corp",
      "quantity": 5,
      "averagePrice": 437.42,
      "currentPrice": 437.42,
      "industry": "Technology",
      "lastUpdated": "2024-12-05T00:26:17.648Z",
      "createdAt": "2024-12-05T00:25:55.336Z",
      "updatedAt": "2024-12-05T00:26:17.648Z",
      "currentValue": 2187.1,
      "profitLoss": null,
      "profitLossPercentage": null
    }
  ],
  "summary": {
    "totalValue": 4617.2,
    "totalInvestment": null,
    "totalProfitLoss": null,
    "totalProfitLossPercentage": null
  },
  "aiAnalysis": "As a financial advisor, here's a brief analysis of the provided portfolio:\n\nDiversification:\nThe portfolio consists of only two stocks, Apple (AAPL) and Microsoft (MSFT)..."
}
```

#### Clear Portfolio
```bash
curl -X DELETE http://localhost:5001/api/stocks/clear \
  -H "Authorization: Bearer your_jwt_token"
```

Response:
```json
{
  "message": "All stocks have been cleared from the database"
}
```

## Testing Guide

Here's a step-by-step guide to test all endpoints with curl commands and expected responses:

### 1. Register a New User

```bash
curl -X POST http://localhost:5001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

Response:

```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Login

```bash
curl -X POST http://localhost:5001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Response:

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Add First Stock (AAPL)

```bash
# Replace <token> with the JWT token received from login
curl -X POST http://localhost:5001/api/stocks/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "symbol": "AAPL",
    "quantity": 10
  }'
```

Response:

```json
{
  "id": 1,
  "userId": 1,
  "symbol": "AAPL",
  "name": "Apple Inc",
  "quantity": 10,
  "averagePrice": 243.01,
  "currentPrice": 243.01,
  "industry": "Technology",
  "lastUpdated": "2024-12-05T00:23:56.502Z",
  "createdAt": "2024-12-05T00:23:56.502Z",
  "updatedAt": "2024-12-05T00:23:56.502Z"
}
```

### 4. Add Second Stock (MSFT)

```bash
curl -X POST http://localhost:5001/api/stocks/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "symbol": "MSFT",
    "quantity": 5
  }'
```

Response:

```json
{
  "id": 2,
  "userId": 1,
  "symbol": "MSFT",
  "name": "Microsoft Corp",
  "quantity": 5,
  "averagePrice": 437.42,
  "currentPrice": 437.42,
  "industry": "Technology",
  "lastUpdated": "2024-12-05T00:26:17.648Z",
  "createdAt": "2024-12-05T00:25:55.336Z",
  "updatedAt": "2024-12-05T00:26:17.648Z"
}
```

### 5. Get All Stocks

```bash
curl -X GET http://localhost:5001/api/stocks \
  -H "Authorization: Bearer <token>"
```

Response:

```json
[
  {
    "id": 1,
    "userId": 1,
    "symbol": "AAPL",
    "name": "Apple Inc",
    "quantity": 10,
    "averagePrice": 243.01,
    "currentPrice": 243.01,
    "industry": "Technology",
    "lastUpdated": "2024-12-05T00:23:56.502Z",
    "createdAt": "2024-12-05T00:23:56.502Z",
    "updatedAt": "2024-12-05T00:23:56.502Z"
  },
  {
    "id": 2,
    "userId": 1,
    "symbol": "MSFT",
    "name": "Microsoft Corp",
    "quantity": 5,
    "averagePrice": 437.42,
    "currentPrice": 437.42,
    "industry": "Technology",
    "lastUpdated": "2024-12-05T00:26:17.648Z",
    "createdAt": "2024-12-05T00:25:55.336Z",
    "updatedAt": "2024-12-05T00:26:17.648Z"
  }
]
```

### 6. Get Single Stock Details

```bash
curl -X GET http://localhost:5001/api/stocks/symbol/AAPL \
  -H "Authorization: Bearer <token>"
```

Response:

```json
{
  "id": 1,
  "userId": 1,
  "symbol": "AAPL",
  "name": "Apple Inc",
  "quantity": 10,
  "averagePrice": 243.01,
  "currentPrice": 243.01,
  "industry": "Technology",
  "lastUpdated": "2024-12-05T00:25:01.000Z",
  "createdAt": "2024-12-05T00:23:56.502Z",
  "updatedAt": "2024-12-05T00:25:01.001Z",
  "aiAnalysis": "As a financial advisor, here is a brief analysis of the stock AAPL (Apple Inc.):\n\nKey Performance Indicators:\n- Revenue growth: AAPL has consistently reported strong revenue growth, driven by the success of its iPhone, iPad, and Mac product lines, as well as its growing services business.\n- Profitability: The company maintains high profit margins, with a net profit margin consistently above 20% in recent years.\n- Cash flow: AAPL generates substantial free cash flow, which allows it to invest in R&D, make strategic acquisitions, and return capital to shareholders through share buybacks and dividends.\n- Balance sheet: The company has a very strong balance"
}
```

### 7. Analyze Portfolio

```bash
curl -X GET http://localhost:5001/api/stocks/analyze/portfolio \
  -H "Authorization: Bearer <token>"
```

Response:

```json
{
  "stocks": [
    {
      "id": 1,
      "userId": 1,
      "symbol": "AAPL",
      "name": "Apple Inc",
      "quantity": 10,
      "averagePrice": 243.01,
      "currentPrice": 243.01,
      "industry": "Technology",
      "lastUpdated": "2024-12-05T00:26:17.532Z",
      "createdAt": "2024-12-05T00:23:56.502Z",
      "updatedAt": "2024-12-05T00:26:17.532Z",
      "currentValue": 2430.1,
      "profitLoss": null,
      "profitLossPercentage": null
    },
    {
      "id": 2,
      "userId": 1,
      "symbol": "MSFT",
      "name": "Microsoft Corp",
      "quantity": 5,
      "averagePrice": 437.42,
      "currentPrice": 437.42,
      "industry": "Technology",
      "lastUpdated": "2024-12-05T00:26:17.648Z",
      "createdAt": "2024-12-05T00:25:55.336Z",
      "updatedAt": "2024-12-05T00:26:17.648Z",
      "currentValue": 2187.1,
      "profitLoss": null,
      "profitLossPercentage": null
    }
  ],
  "summary": {
    "totalValue": 4617.2,
    "totalInvestment": null,
    "totalProfitLoss": null,
    "totalProfitLossPercentage": null
  },
  "aiAnalysis": "As a financial advisor, here's a brief analysis of the provided portfolio:\n\nDiversification:\nThe portfolio consists of only two stocks, Apple (AAPL) and Microsoft (MSFT), which represents a relatively concentrated position. Ideally, a well-diversified portfolio should include a broader range of asset classes and sectors to mitigate the risk of overexposure to a specific industry or company.\n\nRisk Assessment:\nThe portfolio is heavily weighted towards the technology sector, as both AAPL and MSFT are technology companies. This concentration increases the portfolio's sensitivity to fluctuations in the tech industry, which could lead to higher volatility and risk compared to a more diversified portfolio.\n\nWhile AAPL and MSFT are large, well-established companies with a history of strong performance, they are still subject to market and company-specific risks."
}
```

### 8. Clear Portfolio

```bash
curl -X DELETE http://localhost:5001/api/stocks/clear \
  -H "Authorization: Bearer <token>"
```

Response:

```json
{
  "message": "All stocks have been cleared from the database"
}
```

### 9. Verify Empty Portfolio

```bash
curl -X GET http://localhost:5001/api/stocks \
  -H "Authorization: Bearer <token>"
```

Response:

```json
[]
```

### 10. Test Logout
```bash
curl -X POST http://localhost:5001/api/users/logout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>"
```
Response:

```json
['Logged out successfully']
```

## Testing Results Summary

### API Endpoint Tests

```bash
# Get Stock by Symbol Test
curl -X GET http://localhost:5001/api/stocks/symbol/AAPL \
  -H "Authorization: Bearer <token>"

Expected Response:
{
  "symbol": "AAPL",
  "name": "Apple Inc",
  "quantity": 10,
  "purchasePrice": 150.50,
  "currentPrice": 175.25,
  "industry": "Technology",
  "lastUpdated": "2024-03-14T10:30:00Z",
  "aiAnalysis": "Detailed AI-powered analysis of AAPL stock performance and future outlook..."
}
```

### Test Results

- User Registration: Creates new user and returns JWT token
- User Login: Authenticates user and returns JWT token
- Add Stock: Successfully adds stocks to portfolio
- Get All Stocks: Returns list of all stocks in portfolio
- Get Stock by Symbol: Returns detailed stock information with AI analysis
- Get Stock Details: Returns detailed information for a specific stock
- Portfolio Analysis: Provides comprehensive portfolio analysis with real-time data
- Clear Portfolio: Removes all stocks from portfolio
- Empty Portfolio Verification: Confirms portfolio is empty after clearing

### Notes

- Keep the JWT token from the login/register response for subsequent requests
- Replace `<token>` in the commands with your actual JWT token
- Stock prices in responses may vary as they are fetched in real-time
- All timestamps in responses are in UTC

## Data Models

### User Model

| Field    | Type   | Description          | Notes            |
| -------- | ------ | -------------------- | ---------------- |
| username | STRING | User's username      | Required, Unique |
| email    | STRING | User's email address | Required, Unique |
| password | STRING | Hashed password      | Required         |

### Stock Model

| Field        | Type    | Description                      | Notes                 |
| ------------ | ------- | -------------------------------- | --------------------- |
| userId       | INTEGER | Reference to user                | Required, Foreign Key |
| symbol       | STRING  | Stock ticker symbol              | Required              |
| name         | STRING  | Company name                     | Optional              |
| quantity     | INTEGER | Number of shares                 | Required, Min: 0      |
| averagePrice | DECIMAL | Average purchase price per share | Required, Min: 0      |
| createdAt    | DATE    | Record creation timestamp        | Automatically managed |
| updatedAt    | DATE    | Record update timestamp          | Automatically managed |

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Server Error

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Protected routes requiring authentication
- Input validation and sanitization
- Secure password storage

## Development

The project uses:

- Express.js for the API server
- Sequelize as ORM
- SQLite for database
- JSON Web Tokens for authentication
- Anthropic's Claude for AI-powered insights
- Finnhub API for real-time stock data

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
