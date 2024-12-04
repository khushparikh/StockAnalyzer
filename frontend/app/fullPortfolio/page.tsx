"use client";
import React, { useState, useEffect } from 'react';
import {useRouter} from 'next/navigation';



const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Stock {
  id: number;
  description: string;
  symbol: string;
  averagePrice: number;
  quantity: number;
}

const PortfolioPage = () => {
  const [stockData, setStockData] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stock, setStock] = useState<Stock[]>([]);
  const [search, setSearch] = useState("");
  const [additionalSearch1, setAdditionalSearch1] = useState('');
  const [additionalSearch2, setAdditionalSearch2] = useState('');


  const router = useRouter();

  const handleAddStock = (e: React.MouseEvent<HTMLButtonElement>) => {
    router.push('/addStock');
  }

  useEffect(() => {

    const fetchStockData = async () => {
      fetch('http://127.0.0.1:5001/api/stocks', {
        method: 'GET',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTczMzI5MDY5MiwiZXhwIjoxNzMzMzc3MDkyfQ.pZpSSPRIUQdu8BH1bs1P8EvQBu0Zhi1HU3SMFYahjz4`,
        },
      })
      .then((res) => {
        console.log(res)   
        if (!res.ok) {
            if (res.status === 401)
            {
                throw new Error('Invalid credentials: ' + res.statusText);
            }
            throw new Error('Login failed: ' + res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setStock(data);
      })
      .catch((err) => {
        console.log(err.message);
        alert('Login failed. Please try again.');
      });
};
  fetchStockData();

}, []);

return (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white px-6 py-8">
    
    {/* Header */}
    <div className="text-center">
      <h1 className="text-4xl font-extrabold tracking-wide">Full Portfolio</h1>
      <p className="text-lg text-gray-300 mt-2">Track and manage your investments effortlessly.</p>
    </div>

    {/* Search and Add Button */}
    <div className="flex justify-between items-center mt-10 max-w-4xl mx-auto">
      <input
        type="text"
        placeholder="Search SYMBOL"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-transparent border-b-2 border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 pb-2 transition-colors duration-300"
        />
      <button
        onClick={handleAddStock}
        className="ml-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 transition-all"
      >
        Add Stock
      </button>
    </div>

    {/* Stock Cards */}
    <div className="grid gap-6 mt-12 max-w-4xl mx-auto">
      {stock.map((stock, index) => (
        <div
          key={index}
          className="flex justify-between items-center bg-gray-800 p-6 rounded-lg shadow-lg transition-transform hover:scale-105"
        >
          <div>
            <h2 className="text-2xl font-bold">{stock.symbol}</h2>
            <p className="text-gray-400 text-sm">{stock.description}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">Price: ${stock.averagePrice.toFixed(2)}</p>
            <p className="text-sm text-gray-400">Quantity: {stock.quantity}</p>
          </div>
        </div>
      ))}
    </div>

    {/* Additional Search Bars */}
    <div className="mt-6 max-w-4xl mx-auto space-x-4 flex justify-between items-center">
    <input
        type="text"
        placeholder="Search Symbol"
        value={additionalSearch1}
        onChange={(e) => setAdditionalSearch1(e.target.value)}
        className="w-full bg-transparent border-b-2 border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 pb-2 transition-colors duration-300"
        />
      <input
        type="text"
        placeholder="Select Quantity"
        value={additionalSearch2}
        onChange={(e) => setAdditionalSearch2(e.target.value)}
        className="w-full bg-transparent border-b-2 border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 pb-2 transition-colors duration-300"
        />
      <button
        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-500 transition-all"
  >
        Go To Stock
      </button>
    </div>

    {/* Error Message */}
    {error && <p className="text-red-400 text-center mt-6">{error}</p>}
  </div>
);
}

export default PortfolioPage;

