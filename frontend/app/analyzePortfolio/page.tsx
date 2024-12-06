'use client';

import React, { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto';

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
        backgroundColor: ['#4caf50', '#ff7043'],
      },
    ],
  };
  
  const stockValuesComparison = {
    labels: portfolioData.stocks.map((stock: Stock) => stock.symbol),
    datasets: [
      {
        label: 'Current Value',
        data: portfolioData.stocks.map((stock: Stock) => stock.currentValue),
        backgroundColor: ['#4caf50', '#ff7043'],
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">Portfolio Composition</h2>
          <Pie data={portfolioComposition} />
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">Stock Values Comparison</h2>
          <Bar data={stockValuesComparison} />
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">Industry Distribution</h2>
          <Pie data={industryDistribution} />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Portfolio Summary</h2>
        <p className="text-lg">
          <strong>Total Value:</strong> ${portfolioData.summary.totalValue.toFixed(2)}
        </p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">AI Analysis</h2>
        <p className="italic">{portfolioData.aiAnalysis}</p>
      </div>
    </div>
  );
};

export default AnalyzePortfolio;