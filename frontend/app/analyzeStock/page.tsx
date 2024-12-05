"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface StockData {
    id: string,
    symbol: string,
    name: string,
    quantity: number,
    averagePrice: number,
    currentPrice: number,
    totalValue: number,
    profitLoss: number,
    profitLossPercentage: number,
    userId: number,
    createdAt: string,
    updatedAt: string,
    aiAnalysis: string
}

const analyzeStock = () => {

    const searchParams = useSearchParams();
    const symbol = searchParams.get("symbol");
    console.log(symbol)
    const [stockData, setStockData] = useState<StockData | null>(null);


    useEffect(() => {
        const fetchSingleStockData = async () => {
          fetch(`http://localhost:5001/api/stocks/symbol/${symbol}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTczMzM2MjMxOCwiZXhwIjoxNzMzNDQ4NzE4fQ.31bI2hfYFQlR6TExs5VKaKbiAi-Q1WQeEZpYVTLaC0Q`,
            },
          })
          .then((res) => {   
            if (!res.ok) {
                if (res.status === 404)
                {
                    throw new Error('Stock Not Found: ' + res.statusText);
                }
                throw new Error('Fetch failed: ' + res.statusText);
            }
            return res.json();
          })
          .then((data) => {
            console.log(data);
            setStockData(data);
          })
          .catch((err) => {
            console.log(err.message);
            // alert('Fetch failed. Please try again.');
          });
    };
      fetchSingleStockData();
    
    }, []);



    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 px-4">


        

            {stockData && stockData.symbol}




        </div>






    )






}

export default analyzeStock;