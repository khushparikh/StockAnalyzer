'use client';

import React, { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { useRouter } from 'next/navigation';

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
  profitLossPercent: number | boolean;
}

const AnalyzePortfolio = () => {
    const [portfolioData, setPortfolioData] = useState<any>(null);
    const [error, setError] = useState<string>('');
    const router = useRouter();

    const JWT = sessionStorage.getItem("JWT");

    const handleBackSelection = () => {
        router.push('/fullPortfolio');
      };

    useEffect(() => {
        if (!JWT) {
            router.push("/"); // reroute back to the index if within an invalid session
        }

        const fetchPortfolioData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5001/api/stocks/analyze/portfolio', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${JWT}`,
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
            router.push('/fullPortfolio'); // Reroute to fullPortfolio if something goes wrong with the fetch
        }
        };

        fetchPortfolioData();
    }, []);

    if (error) {
        return <p className="text-red-500 text-center mt-4">{error}</p>;
    }

    if (!portfolioData) {
        return (
            <div className="flex align-middle justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 h-screen w-screen">
                <p className="text-center text-white font-extrabold text-6xl my-auto ">Loading portfolio data...</p>
            </div>
        );
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


    const baseColors = ['#2563eb', '#4f83ff', '#ff8c42', '#2da3a6', '#9b59b6'];

    const generateColors = (length: number) => {
        return Array.from({ length }, (_, i) => baseColors[i % baseColors.length]);
    };

    const colors = generateColors(portfolioData.stocks.length);
    // Chart Data Preparation
    const portfolioComposition = {
        labels: portfolioData.stocks.map((stock: Stock) => stock.symbol),
        datasets: [
            {
                data: portfolioData.stocks.map((stock: Stock) => stock.currentValue),
                backgroundColor: generateColors(portfolioData.stocks.length),
                borderColor: '#ffffff',
                borderWidth: 1,
            },
        ],
    };

    const stockValuesComparison = {
        labels: portfolioData.stocks.map((stock: Stock) => stock.symbol),
        datasets: [
            {
                label: 'Current Value',
                data: portfolioData.stocks.map((stock: Stock) => stock.currentValue),
                backgroundColor: generateColors(portfolioData.stocks.length),
                borderColor: '#ffffff',
                borderWidth: 1,
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
            backgroundColor: generateColors(portfolioData.stocks.length),
            borderColor: '#ffffff',
            borderWidth: 1,
        },
        ],
    };

    return (
        <div className="p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-6">Portfolio Analysis</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-800 rounded-lg p-6 shadow-md">
                <h2 className="text-xl font-semibold text-center text-white mb-4">Portfolio Composition</h2>
                <Pie data={portfolioComposition} />
                </div>
                <div className="bg-gray-800 rounded-lg p-6 shadow-md">
                <h2 className="text-xl font-semibold text-center text-white mb-4">Stock Values Comparison</h2>
                <Bar data={stockValuesComparison} />
                </div>
                <div className="bg-gray-800 rounded-lg p-6 shadow-md">
                <h2 className="text-xl font-semibold text-center text-white mb-4">Industry Distribution</h2>
                <Pie data={industryDistribution} />
                </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 shadow-md mb-6">
                <h2 className="text-2xl font-semibold text-white mb-4">Portfolio Summary</h2>
                <p className="text-lg text-gray-500">
                <strong>Total Value:</strong> ${portfolioData.summary.totalValue.toFixed(2)}
                </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 shadow-md">
                <h2 className="text-2xl font-semibold text-white mb-4">AI Analysis</h2>
                <p className="text-gray-500 whitespace-normal leading-relaxed overflow-visible">
                {portfolioData.aiAnalysis.split('\n').map((line: string, index: number) => (
                    <span key={index}>
                    {line}
                    <br />
                    </span>
                )) || "No AI analysis available at this time."}
                </p>
            </div>

            <div className="flex justify-center mt-6">
            <button
              onClick={handleBackSelection}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Back to Portfolio
            </button>
          </div>
        </div>
    );
};

export default AnalyzePortfolio;