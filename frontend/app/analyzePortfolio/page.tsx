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
};

export default AnalyzePortfolio;