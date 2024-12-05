"use client";
import React, { useState, useEffect } from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';




const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Stock {
  id: number;
  description: string;
  symbol: string;
  averagePrice: number;
  quantity: number;
}

const PortfolioPage = () => {
  // const [stockData, setStockData] = useState<Stock[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  const [stock, setStock] = useState<Stock[]>([]);
  const [searchSymbol, setSearchSymbol] = useState("");
  const [addSymbol, setAddSymbol] = useState('');
  const [addQuantiy, setAddQuantity] = useState('');

  const fetchStockData = () => {
    fetch('http://127.0.0.1:5001/api/stocks', {
      method: 'GET',
      headers: {
          'Content-type': 'application/json; charset=UTF-8',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTczMzQzODYyNywiZXhwIjoxNzMzNTI1MDI3fQ.l5TRjcKfHemO0uTFCK3ZhsX_0oxGr4arhxNYI0a7IZU`,
      },
    })
    .then((res) => {
      console.log(res)   
      if (!res.ok) {
        throw new Error('Failed to get all stocks: ' + res.statusText);
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
      setStock(data);
    })
    .catch((err) => {
      console.log(err.message);
      alert('Failed to get all stocks. Please try again.');
    });
  };

  const handleAddStock = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    fetch(`http://127.0.0.1:5001/api/stocks/add`, {
      method: 'POST',
      body: JSON.stringify({
        "symbol": addSymbol,
        "quantity": addQuantiy,
    }),
      headers: {
          'Content-type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTczMzQzODYyNywiZXhwIjoxNzMzNTI1MDI3fQ.l5TRjcKfHemO0uTFCK3ZhsX_0oxGr4arhxNYI0a7IZU'
      },
    })
    .then((res) => {   
      if (!res.ok) {
        throw new Error('Failed to add stock. Please try again: ' + res.statusText)
      }
      return res.json();
    })
    .then((data) => {
      fetchStockData();
      setAddSymbol("")
      setAddQuantity("")
    })
    .catch((err) => {
       console.log(err.message);
       alert('Failed to add stock. Please try again.');
    }); 
  }
 
  useEffect(() => {
    fetchStockData();
  }, []);

return (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white px-6 py-8">
    
    {/* Header */}
    <div className="text-center">
      <h1 className="text-4xl font-extrabold tracking-wide">Full Portfolio</h1>
      <p className="text-lg text-white mt-2">Track and manage your investments effortlessly.</p>
    </div>

    {/* Search and Learn More Button */}
    <div className="flex justify-between items-center mt-10 max-w-4xl mx-auto">
      <input
        type="text"
        placeholder="Search SYMBOL"
        value={searchSymbol}
        onChange={(e) => setSearchSymbol(e.target.value)}
        className="w-full bg-transparent border-b-2 border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 pb-2 transition-colors duration-300"
        />
        
      {/* <button
        onClick={(e) => handleAnalyzeStock(e)}
        className="ml-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 transition-all">
        Learn More 
      </button> */}
      <Link
        className=" ml-4 px-2 py-3 bg-blue-600 text-white text-center font-semibold rounded-lg shadow-md hover:bg-blue-400 transition-all"
        href={{
          pathname: 'analyzeStock',
          query: { symbol: searchSymbol }
        }}
      >Learn More
      </Link>
    </div>

  <div className="grid gap-6 mt-12 max-w-4xl mx-auto">


  {/* Stock List */}
  {stock.map((stock, index) => (
    <Link 
      key={index}
      href={{
        pathname: "/analyzeStock",
        query: { symbol: stock.symbol }
      }}
      className="block"
    >
      <div className="flex justify-between items-center bg-gray-800 p-6 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
        <div>
          <h2 className="text-2xl font-bold text-white">{stock.symbol}</h2>
          <p className="text-gray-400 text-sm mt-1">{stock.description}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-green-400">${stock.averagePrice.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-1">Quantity: {stock.quantity}</p>
        </div>
      </div>
    </Link>      
      ))}
    </div>



    {/* Add Stock */}
    <div className="mt-6 max-w-4xl mx-auto space-x-4 flex justify-between items-center">
    <input
        type="text"
        placeholder="Search Symbol"
        value={addSymbol}
        onChange={(e) => setAddSymbol(e.target.value)}
        className="w-full bg-transparent border-b-2 border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 pb-2 transition-colors duration-300"
        />
      <input
        type="text"
        placeholder="Select Quantity"
        value={addQuantiy}
        onChange={(e) => setAddQuantity(e.target.value)}
        className="w-full bg-transparent border-b-2 border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 pb-2 transition-colors duration-300"
        />
      <button
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-400 transition-all"
        onClick={(e) => handleAddStock(e)}
        >Add Stock
      </button>
    </div>

    {/* Error Message
    {error && <p className="text-red-400 text-center mt-6">{error}</p>} */}
  </div>
);
}

export default PortfolioPage;

