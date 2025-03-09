import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertTriangle } from 'lucide-react';

interface FraudData {
  date: string;
  incidents: number;
  riskScore: number;
}

interface Props {
  data: FraudData[];
}

export const RiskFraudAnalytics: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center mb-6">
        <AlertTriangle className="w-6 h-6 text-red-600 mr-2" />
        <h3 className="text-xl font-semibold">Risk & Fraud Analytics</h3>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="incidents"
              stroke="#ef4444"
              name="Fraud Incidents"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="riskScore"
              stroke="#eab308"
              name="Risk Score"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};