import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { PredictiveData } from '../types';
import { TrendingUp, BarChart2, DollarSign } from 'lucide-react';

interface Props {
  data: PredictiveData[];
  title: string;
  type: string;
}

export const PredictiveChart: React.FC<Props> = ({ data, title, type }) => {
  const [showOverview, setShowOverview] = useState(false);

  const calculateOverview = () => {
    const latest = data[data.length - 1];
    const earliest = data[0];
    
    return {
      efficiency: Math.round((latest.efficiency || 0) * 100) / 100,
      growth: Math.round(((latest.growth || 0) - (earliest.growth || 0)) * 100) / 100,
      revenue: Math.round((latest.revenue || 0) * 100) / 100,
      marketShare: Math.round((latest.marketShare || 0) * 100) / 100,
      prediction: analyzeTrend(data)
    };
  };

  const analyzeTrend = (data: PredictiveData[]): string => {
    const trend = data.slice(-3).every((item, i, arr) => {
      if (i === 0) return true;
      return (item.predicted || 0) >= (arr[i - 1].predicted || 0);
    });
    return trend ? "Positive growth trend detected" : "Market fluctuation observed";
  };

  const getChartLines = () => {
    switch (type) {
      case 'pricing':
        return [
          <Line key="price" type="monotone" dataKey="pricing" stroke="#2563eb" name="Current Price" />,
          <Line key="suggested" type="monotone" dataKey="suggestedPrice" stroke="#16a34a" strokeDasharray="5 5" name="Suggested Price" />
        ];
      case 'expansion':
        return [
          <Line key="score" type="monotone" dataKey="expansionScore" stroke="#2563eb" name="Expansion Score" />,
          <Line key="potential" type="monotone" dataKey="marketPotential" stroke="#16a34a" name="Market Potential" />
        ];
      default:
        return [
          <Line key="actual" type="monotone" dataKey="actual" stroke="#2563eb" name="Actual" />,
          <Line key="predicted" type="monotone" dataKey="predicted" stroke="#16a34a" strokeDasharray="5 5" name="Predicted" />
        ];
    }
  };

  const OverviewModal = () => {
    const overview = calculateOverview();

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Performance Overview</h3>
            <button 
              onClick={() => setShowOverview(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                <h4 className="font-semibold">Efficiency</h4>
              </div>
              <p className="text-2xl font-bold text-blue-600">{overview.efficiency}%</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <BarChart2 className="w-5 h-5 text-green-600 mr-2" />
                <h4 className="font-semibold">Growth Rate</h4>
              </div>
              <p className="text-2xl font-bold text-green-600">{overview.growth}%</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <DollarSign className="w-5 h-5 text-purple-600 mr-2" />
                <h4 className="font-semibold">Revenue Forecast</h4>
              </div>
              <p className="text-2xl font-bold text-purple-600">${overview.revenue}K</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h4 className="font-semibold mb-2">Market Analysis</h4>
            <p className="text-gray-700">Market Share: {overview.marketShare}%</p>
            <p className="text-gray-700">{overview.prediction}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Recommendations</h4>
            <ul className="list-disc list-inside text-gray-700">
              <li>Optimize {type === 'pricing' ? 'pricing strategy' : 'expansion plans'} based on market trends</li>
              <li>Monitor competitor activities and adjust strategies accordingly</li>
              <li>Focus on high-growth market segments</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <button
          onClick={() => setShowOverview(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <BarChart2 className="w-4 h-4 mr-2" />
          View Analysis
        </button>
      </div>
      
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => format(new Date(date), 'MMM d')}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(date) => format(new Date(date), 'MMM d, yyyy')}
              formatter={(value) => [typeof value === 'number' ? value.toLocaleString() : value, '']}
            />
            <Legend />
            {getChartLines()}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {showOverview && <OverviewModal />}
    </div>
  );
};