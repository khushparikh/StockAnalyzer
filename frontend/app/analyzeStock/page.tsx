"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

interface StockData {
  id: string,
  symbol: string,
  name: string,
  quantity: number,
  averagePrice: number,
  currentPrice: number,
  industry: string,
  userId: number,
  createdAt: string,
  updatedAt: string,
  aiAnalysis: string 
}

const AnalyzeStock = () => {
  const searchParams = useSearchParams();
  const symbol = searchParams.get("symbol");
  const [stockData, setStockData] = useState<StockData | null>(null);
  const router = useRouter();

  const [totalPrice, setTotalPrice] = useState(0);

  const JWT = sessionStorage.getItem("JWT");

  const handleBackSelection = () => {
    router.push('/fullPortfolio');
  };

  useEffect(() => {
    if (!JWT) {
      router.push('/');
    }

    const fetchSingleStockData = async () => {
      fetch(`http://127.0.0.1:5001/api/stocks/symbol/${symbol}`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${JWT}`,
        },
      })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404)
          {
            alert('Stock not found: ' + res.statusText);
          }
          else
          {
            alert('Failed to fetch stock: ' + res.statusText);
          }
          router.push('/fullPortfolio')
        }
        return res.json();
      })
      .then((data) => {
        setStockData(data);
        setTotalPrice(data.quantity * data.currentPrice); 
      })
      .catch((err) => {
        console.log(err.message);
        alert('Failed to fetch stock. Please try again.');
      });

    };

    fetchSingleStockData();
  }, []);


  
  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white px-6 py-8`}>
      <h1 className="text-4xl font-extrabold tracking-wide text-center mb-8">Stock Analysis</h1>
      
      {stockData &&
        <div className="space-y-6">
          {/* Summary Section */}
          <div className="bg-gray-800 shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-medium mb-4">Stock Summary</h2>
            <div className="grid grid-cols-2 gap-4">
              <DetailItem 
                label="Symbol" 
                value={stockData.symbol ? stockData.symbol : "N/A"} 
              />
              <DetailItem 
                label="Company" 
                value={stockData.name ? stockData.name : "N/A"} 
              />
              <DetailItem 
                label="Quantity" 
                value={stockData.quantity ? stockData.quantity.toString() : "N/A"} 
              />
              <DetailItem 
                label="Current Price" 
                value={stockData.currentPrice ? `$${stockData.currentPrice.toFixed(2)}` : "N/A"} 
              />
              <DetailItem 
                label="Total Value" 
                value={totalPrice ? `$${totalPrice.toString()}` : "N/A"} 
              />

              <DetailItem 
                label="Industry" 
                value={stockData.industry ? `${stockData.industry.toString()}` : "N/A"} 
              />
            </div>
          </div>

          {/* AI Analysis Section */}
          <div className="bg-gray-800 shadow-lg rounded-lg p-6 overflow-visible">
            <h2 className="text-2xl font-medium mb-4">AI Investment Insights</h2>
            <p className="italic text-gray-300 whitespace-normal leading-relaxed overflow-visible">
              {stockData.aiAnalysis || "No AI analysis available at this time."}
            </p>
          </div>
          {/* Action Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleBackSelection}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Back to Portfolio
            </button>
          </div>
        </div>
    
      }
    </div>
  );
};

// Helper component for consistent detail rendering
    const DetailItem = ({ 
      label, 
      value, 
      className = '' 
    }: { 
      label: string, 
      value: string, 
      className?: string 
    }) => (
      <div className="bg-gray-700 rounded-lg p-4 shadow-md">
        <span className="block text-sm text-gray-400 mb-1">{label}</span>
        <span className={`text-lg font-semibold ${className}`}>{value}</span>
      </div>
    );

export default AnalyzeStock;