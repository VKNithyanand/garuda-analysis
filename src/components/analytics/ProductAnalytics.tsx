import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Package } from 'lucide-react';

interface ProductData {
  name: string;
  sales: number;
  growth: number;
}

interface Props {
  data: ProductData[];
}

export const ProductAnalytics: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center mb-6">
        <Package className="w-6 h-6 text-blue-600 mr-2" />
        <h3 className="text-xl font-semibold">Product Analytics</h3>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="sales"
              name="Sales"
              fill="#2563eb"
            />
            <Bar
              yAxisId="right"
              dataKey="growth"
              name="Growth %"
              fill="#16a34a"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};