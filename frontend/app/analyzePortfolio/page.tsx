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
  
};

export default AnalyzePortfolio;