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
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTczMzE5NjYwNiwiZXhwIjoxNzMzMjgzMDA2fQ.XUSqcvD-DHU7_R_Npo1p-P5CMSRwnsyajPxJ0abZ2Xw`,
        },
      })
      .then((res) => {   
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

  <div className="min-h-screen bg-black text-white flex flex-col items-center">
      
      {/* Header */}
      <h1 className="text-4xl font-bold mt-6">Full Portfolio</h1>

      {/* Stock Table */}
      <div className="w-full max-w-4xl mt-8">
        <div className="grid grid-cols-3 text-center font-semibold mb-4">
          <span>Stock</span>
          <span>Price</span>
          <span>Total</span>
        </div>
        {stock.map((stock, index) => (
          <div
            key={index}
            className="grid grid-cols-3 text-center py-2 bg-blue-500 rounded-lg mb-2"
          >
            <span>{stock.symbol}</span>
            <span>${stock.averagePrice.toFixed(2)}</span>
            <span>{stock.quantity}</span>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="mt-6">
        <input
          type="text"
          placeholder="Search SYMBOL"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg text-black"
        />
      </div>

      {/* Add Stock Button */}
      <button
        onClick={handleAddStock}
        className="mt-4 px-6 py-2 bg-blue-700 rounded-lg hover:bg-blue-600"
      >
        Add Stock
      </button>
    </div>
  );
};

export default PortfolioPage;
  
  
  
  
  
  
  
  
  /* <div>
    {stock.map((stock, index) => (
      <div key={index} className="flex  mx-4 my-4 text-black font-bold text-lg">
        <p className="mx-4">{stock.symbol}</p>
        <p className="mx-4">{stock.averagePrice}</p>
        <p className="mx-4">{stock.quantity}</p>
    
      </div>
    ))}



  <button onClick={(e) => handleAddStock(e)}>
    Add Stock
  </button>


  </div>
*/


