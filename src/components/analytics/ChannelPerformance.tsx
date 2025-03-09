import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart2 } from 'lucide-react';

interface ChannelData {
  name: string;
  current: number;
  previous: number;
}

interface Props {
  data: ChannelData[];
}

export const ChannelPerformance: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center mb-6">
        <BarChart2 className="w-6 h-6 text-blue-600 mr-2" />
        <h3 className="text-xl font-semibold">Channel Performance</h3>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']} />
            <Legend />
            <Bar dataKey="current" name="Current Period" fill="#2563eb" />
            <Bar dataKey="previous" name="Previous Period" fill="#93c5fd" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};