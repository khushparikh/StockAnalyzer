"use client";
import React, { useState, useEffect } from 'react';
import {useRouter} from 'next/navigation';



const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Stock {
  id: number;
  description: string;
  symbol: string;
  price: number;
  quantity: number;
}

const PortfolioPage = () => {
  const [stockData, setStockData] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stock, setStock] = useState<Stock[]>([]);

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


  // Fetch stock data from the API
  
return (

  <div>
    {stock.map((stock, index) => (
      <li key={index}>
        {stock.symbol}
      </li>

    ))
}


<button onClick={(e) => handleAddStock(e)}>
    Add Stock
  </button>

  </div>

)

}


export default PortfolioPage;