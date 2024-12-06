'use client';

import React, { useEffect, useState } from 'react';

interface Stock {
  id: number;
  userid: number;
  symbol: string;
  name: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  industry: string;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
  currentValue: number;
  profitLoss: boolean;
  profitLossPercent: number|boolean;
}

interface Summary {
  totalValue: number;
  totalInvestment: number|boolean;
  totalProfitLoss: number|boolean;
  totalProfitLossPercent: number|boolean;
}

const AnalyzePortfolio = () => {
    const [portfolioData, setPortfolioData] = useState<any>(null);
    const [error, setError] = useState<string>('');
  
    useEffect(() => {
      const fetchPortfolioData = async () => {
        try {
          //const token = localStorage.getItem('token');
          const response = await fetch('http://127.0.0.1:5001/api/stocks/analyze/portfolio', {
            method: 'GET',
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTczMzQ0NTQ5OSwiZXhwIjoxNzMzNDQ1Njc5fQ.FnCNdjorq8WoPxjOxUl0vvWU10dGMbs-grv21O8vo3s`,
              'Content-Type': 'application/json',
            },
          });
  
          if (!response.ok) {
            throw new Error('Failed to fetch portfolio data');
          }
  
          const data = await response.json();
          setPortfolioData(data);
        } catch (err: any) {
          setError(err.message);
        }
      };
  
      fetchPortfolioData();
    }, []);
  
    if (error) {
      return <p className="text-red-500 text-center mt-4">{error}  999</p>;
    }
  
    if (!portfolioData) {
      return <p className="text-center mt-4">Loading portfolio data...</p>;
    }

    // Utility function to calculate sum of current values by industry
const calculateIndustryDistribution = (stocks: Stock[]) => {
    const industryValues: { [key: string]: number } = {};
  
    stocks.forEach((stock) => {
      if (industryValues[stock.industry]) {
        industryValues[stock.industry] += stock.currentValue;
      } else {
        industryValues[stock.industry] = stock.currentValue;
      }
    });
  
    return {
      labels: Object.keys(industryValues),
      data: Object.values(industryValues),
    };
  };
  
  // Chart Data Preparation
  const portfolioComposition = {
    labels: portfolioData.stocks.map((stock: Stock) => stock.symbol),
    datasets: [
      {
        data: portfolioData.stocks.map((stock: Stock) => stock.currentValue),
        backgroundColor: ['#4caf50', '#ff7043'], // Add more colors if needed
      },
    ],
  };
  
  const stockValuesComparison = {
    labels: portfolioData.stocks.map((stock: Stock) => stock.symbol),
    datasets: [
      {
        label: 'Current Value',
        data: portfolioData.stocks.map((stock: Stock) => stock.currentValue),
        backgroundColor: ['#4caf50', '#ff7043'], // Add more colors for each bar if needed
      },
    ],
  };
  
  // Get industry distribution data
  const industryData = calculateIndustryDistribution(portfolioData.stocks);
  
  const industryDistribution = {
    labels: industryData.labels,
    datasets: [
      {
        data: industryData.data,
        backgroundColor: ['#4caf50', '#ff7043', '#42a5f5'], // Add more colors for additional industries
      },
    ],
  };
    return (
        <div className="p-8 bg-gray-100 min-h-screen">
          <h1 className="text-3xl font-bold text-center mb-6">Portfolio Analysis</h1>
    
          {/* Summary Section */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Summary</h2>
            <div className="grid grid-cols-2 gap-4">
              <p>
                <span className="font-medium">Total Value:</span> ${portfolioData.summary.totalValue.toFixed(2)}
              </p>
              <p>
                <span className="font-medium">Total Investment:</span> ${portfolioData.summary.totaltotalInvestment?.toFixed(2)}
              </p>
              <p>
                <span className="font-medium">Total Profit/Loss:</span> ${portfolioData.summary.totalProfitLoss?.toFixed(2)}
              </p>
              <p>
                <span className="font-medium">Profit/Loss Percentage:</span> {portfolioData.summary.totalProfitLossPercentage?.toFixed(2)}%
              </p>
            </div>
          </div>
    
          {/* Stock Breakdown Section */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Stock Breakdown</h2>
            <table className="w-full table-auto border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">Symbol</th>
                  <th className="border border-gray-300 px-4 py-2">Company</th>
                  <th className="border border-gray-300 px-4 py-2">Quantity</th>
                  <th className="border border-gray-300 px-4 py-2">Avg Price ($)</th>
                  <th className="border border-gray-300 px-4 py-2">Current Price ($)</th>
                  <th className="border border-gray-300 px-4 py-2">Current Value ($)</th>
                  <th className="border border-gray-300 px-4 py-2">Profit/Loss ($)</th>
                  <th className="border border-gray-300 px-4 py-2">P/L (%)</th>
                </tr>
              </thead>
              <tbody>
                {portfolioData.stocks.map((stock: any) => (
                  <tr key={stock.symbol} className="text-center">
                    <td className="border border-gray-300 px-4 py-2">{stock.symbol}</td>
                    <td className="border border-gray-300 px-4 py-2">{stock.name || 'N/A'}</td>
                    <td className="border border-gray-300 px-4 py-2">{stock.quantity}</td>
                    <td className="border border-gray-300 px-4 py-2">{stock.averagePrice.toFixed(2)}</td>
                    <td className="border border-gray-300 px-4 py-2">{stock.currentPrice.toFixed(2)}</td>
                    <td className="border border-gray-300 px-4 py-2">{stock.currentValue.toFixed(2)}</td>
                    <td className={`border border-gray-300 px-4 py-2 ${stock.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {stock.profitLoss?.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{stock.profitLossPercentage?.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
    
          {/* AI Analysis Section */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">AI Investment Advice</h2>
            <p className="italic">{portfolioData.aiAnalysis}</p>
          </div>
        </div>
      );
};

export default AnalyzePortfolio;