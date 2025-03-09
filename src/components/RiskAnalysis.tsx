import React from 'react';
import { RiskMetric } from '../types';
import { AlertTriangle } from 'lucide-react';

interface Props {
  risks: RiskMetric[];
}

export const RiskAnalysis: React.FC<Props> = ({ risks }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'low':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'high':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
      <div className="flex items-center space-x-2 mb-6">
        <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Risk Analysis</h3>
      </div>
      <div className="space-y-4">
        {risks.map((risk, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-200">{risk.category}</span>
            <div className="flex items-center space-x-4">
              <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 dark:bg-blue-400 rounded-full h-2"
                  style={{ width: `${risk.value}%` }}
                />
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(risk.status)}`}>
                {risk.status.charAt(0).toUpperCase() + risk.status.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};