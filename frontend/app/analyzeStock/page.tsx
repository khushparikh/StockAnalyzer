"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

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


  const handleBackSelection = () => {
    router.push('/fullPortfolio');
  };

  useEffect(() => {
    const fetchSingleStockData = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/stocks/symbol/${symbol}`, {
          method: 'GET',
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTczMzQ2NDE3NCwiZXhwIjoxNzMzNTUwNTc0fQ.LWbuiIXfL1PnWBALK5nGyYlKQIGmCP4KWfmyhDoc39s`,
          },
        });
        
        if (!response.ok) {
          throw new Error(response.status === 404 ? 'Stock Not Found' : 'Fetch failed');
        }
        
        const data: StockData = await response.json();
        setStockData(data);
        setTotalPrice(data.quantity * data.currentPrice); 
      } catch (error) {
        console.error(error);
      }
    };

    fetchSingleStockData();
  }, [symbol]);

  const getProfitLossColor = (value: number) => 
    value >= 0 ? 'text-green-500' : 'text-red-500';

  return (
    
    <div className={`${roboto.className} min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white px-6 py-8`}>
      <h1 className="text-3xl font-bold text-center mb-8">Stock Analysis</h1>
      
      {stockData ? (
        <div className="space-y-6">
          {/* Summary Section */}
          <div className="bg-gray-800 shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-medium mb-4">Stock Summary</h2>
            <div className="grid grid-cols-2 gap-4">
              <DetailItem 
                label="Symbol" 
                value={stockData.symbol} 
              />
              <DetailItem 
                label="Company" 
                value={stockData.name || "N/A"} 
              />
              <DetailItem 
                label="Quantity" 
                value={stockData.quantity.toString()} 
              />
              <DetailItem 
                label="Current Price" 
                value={`$${stockData.currentPrice.toFixed(2)}`} 
              />
              <DetailItem 
                label="Total Value" 
                value={`$${totalPrice.toString()}`} 
              />

              <DetailItem 
                label="Industry" 
                value={`${stockData.industry.toString()}`} 
              />
            </div>
          </div>

          {/* AI Analysis Section */}
          <div className="bg-gray-800 shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-medium mb-4">AI Investment Insights</h2>
            <p className="italic text-gray-300">
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
      ) : (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl animate-pulse">Loading stock details...</p>
        </div>
      )}
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