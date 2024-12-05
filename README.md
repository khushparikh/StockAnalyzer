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
DB_NAME=stock_portfolio
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
```

5. Start the development server:
```bash
npm run dev
```

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
All stock endpoints require authentication. Replace `<token>` with your JWT token in the following commands.

#### Get All Stocks in Portfolio
```bash
curl -X GET http://localhost:5001/api/stocks \
  -H "Authorization: Bearer <token>"
```

Example Response:
```json
[
  {
    "id": 1,
    "symbol": "AAPL",
    "name": "Apple Inc",
    "quantity": 10,
    "averagePrice": 180.50,
    "userId": 1,
    "createdAt": "2024-11-29T01:59:19.820Z",
    "updatedAt": "2024-11-29T01:59:19.820Z"
  }
]
```

#### Add a Stock
```bash
curl -X POST http://localhost:5001/api/stocks/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "symbol": "AAPL",
    "quantity": 10,
    "averagePrice": 180.50
  }'
```

Example Response:
```json
{
  "id": 1,
  "symbol": "AAPL",
  "name": "Apple Inc",
  "quantity": 10,
  "averagePrice": 180.50,
  "userId": 1,
  "createdAt": "2024-11-29T01:59:19.820Z",
  "updatedAt": "2024-11-29T01:59:19.820Z"
}
```

#### Get Stock Details
```bash
curl -X GET http://localhost:5001/api/stocks/1 \
  -H "Authorization: Bearer <token>"
```

Example Response:
```json
{
  "id": 1,
  "symbol": "AAPL",
  "name": "Apple Inc",
  "quantity": 10,
  "averagePrice": 180.50,
  "currentPrice": 190.50,
  "totalValue": 1905.00,
  "profitLoss": 100.00,
  "profitLossPercentage": 5.54,
  "userId": 1,
  "createdAt": "2024-11-29T01:59:19.820Z",
  "updatedAt": "2024-11-29T01:59:19.820Z"
}
```

#### Get Stock Details with AI Analysis
```bash
curl -X GET http://localhost:5001/api/stocks/1/analysis \
  -H "Authorization: Bearer <token>"
```

Example Response:
```json
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

#### Analyze Portfolio
```bash
curl -X GET http://localhost:5001/api/stocks/analyze/portfolio \
  -H "Authorization: Bearer <token>"
```

Example Response:
```json
{
  "totalValue": 1905.00,
  "totalInvestment": 1805.00,
  "totalProfitLoss": 100.00,
  "profitLossPercentage": 5.54,
  "stocks": [
    {
      "symbol": "AAPL",
      "name": "Apple Inc",
      "quantity": 10,
      "averagePrice": 180.50,
      "currentPrice": 190.50,
      "value": 1905.00,
      "profitLoss": 100.00,
      "profitLossPercentage": 5.54
    }
  ],
  "aiAnalysis": "Comprehensive AI analysis of portfolio diversification, risk assessment, and recommendations..."
}
```

#### Clear Portfolio
```bash
curl -X DELETE http://localhost:5001/api/stocks/clear \
  -H "Authorization: Bearer <token>"
```

Example Response:
```json
{
  "message": "Portfolio cleared successfully"
}
```

### Error Responses
Example of an error response:
```json
{
  "error": "Authentication required"
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
    "quantity": 10,
    "averagePrice": 180.50
  }'
```
Response:
```json
{
  "id": 1,
  "symbol": "AAPL",
  "name": "Apple Inc",
  "quantity": 10,
  "averagePrice": 180.50,
  "userId": 1,
  "updatedAt": "2024-11-29T02:03:11.426Z",
  "createdAt": "2024-11-29T02:03:11.426Z"
}
```

### 4. Add Second Stock (MSFT)
```bash
curl -X POST http://localhost:5001/api/stocks/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "symbol": "MSFT",
    "quantity": 5,
    "averagePrice": 370.50
  }'
```
Response:
```json
{
  "id": 2,
  "symbol": "MSFT",
  "name": "Microsoft Corp",
  "quantity": 5,
  "averagePrice": 370.50,
  "userId": 1,
  "updatedAt": "2024-11-29T02:03:24.855Z",
  "createdAt": "2024-11-29T02:03:24.855Z"
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
    "averagePrice": 180.50,
    "createdAt": "2024-11-29T02:03:11.426Z",
    "updatedAt": "2024-11-29T02:03:11.426Z"
  },
  {
    "id": 2,
    "userId": 1,
    "symbol": "MSFT",
    "name": "Microsoft Corp",
    "quantity": 5,
    "averagePrice": 370.50,
    "createdAt": "2024-11-29T02:03:24.855Z",
    "updatedAt": "2024-11-29T02:03:24.855Z"
  }
]
```

### 6. Get Single Stock Details
```bash
curl -X GET http://localhost:5001/api/stocks/1 \
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
  "averagePrice": 180.50,
  "createdAt": "2024-11-29T02:03:11.426Z",
  "updatedAt": "2024-11-29T02:03:11.426Z",
  "currentPrice": 189.95,
  "totalValue": 1899.50,
  "profitLoss": 94.50,
  "profitLossPercentage": 5.23
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
      "symbol": "AAPL",
      "name": "Apple Inc",
      "quantity": 10,
      "averagePrice": 180.50,
      "currentPrice": 189.95,
      "value": 1899.50,
      "profitLoss": 94.50,
      "profitLossPercentage": 5.23
    },
    {
      "id": 2,
      "symbol": "MSFT",
      "name": "Microsoft Corp",
      "quantity": 5,
      "averagePrice": 370.50,
      "currentPrice": 378.85,
      "value": 1894.25,
      "profitLoss": 41.75,
      "profitLossPercentage": 2.25
    }
  ],
  "summary": {
    "totalValue": 3793.75,
    "totalInvestment": 3657.50,
    "totalProfitLoss": 136.25,
    "totalProfitLossPercentage": 3.72
  },
  "aiAnalysis": "Comprehensive AI analysis of portfolio diversification, risk assessment, and recommendations..."
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
  "message": "Portfolio cleared successfully"
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

## Testing Results Summary

✅ User Registration: Creates new user and returns JWT token  
✅ User Login: Authenticates user and returns JWT token  
✅ Add Stock: Successfully adds stocks to portfolio  
✅ Get All Stocks: Returns list of all stocks in portfolio  
✅ Get Stock Details: Returns detailed information for a specific stock  
✅ Portfolio Analysis: Provides comprehensive portfolio analysis with real-time data  
✅ Clear Portfolio: Removes all stocks from portfolio  
✅ Empty Portfolio Verification: Confirms portfolio is empty after clearing  

### Notes
- Keep the JWT token from the login/register response for subsequent requests
- Replace `<token>` in the commands with your actual JWT token
- Stock prices in responses may vary as they are fetched in real-time
- All timestamps in responses are in UTC

## Data Models

### User Model
| Field    | Type   | Description              | Notes                          |
|----------|--------|--------------------------|--------------------------------|
| username | STRING | User's username          | Required, Unique               |
| email    | STRING | User's email address     | Required, Unique               |
| password | STRING | Hashed password          | Required                       |

### Stock Model
| Field        | Type    | Description                        | Notes                          |
|-------------|---------|------------------------------------|---------------------------------|
| userId      | INTEGER | Reference to user                  | Required, Foreign Key          |
| symbol      | STRING  | Stock ticker symbol                | Required                       |
| name        | STRING  | Company name                       | Optional                       |
| quantity    | INTEGER | Number of shares                   | Required, Min: 0               |
| averagePrice| DECIMAL | Average purchase price per share   | Required, Min: 0               |
| createdAt   | DATE    | Record creation timestamp          | Automatically managed          |
| updatedAt   | DATE    | Record update timestamp            | Automatically managed          |

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
