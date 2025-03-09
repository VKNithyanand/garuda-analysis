import React from 'react';
import { TrendingUp, AlertTriangle, DollarSign, LineChart, Globe } from 'lucide-react';
import { PredictionType } from '../types';

interface Props {
  selectedOption: PredictionType | null;
  onOptionSelect: (option: PredictionType) => void;
}

export const PredictionOptions: React.FC<Props> = ({ selectedOption, onOptionSelect }) => {
  const options = [
    { id: 'risk' as const, label: 'Risk Assessment', icon: AlertTriangle },
    { id: 'revenue' as const, label: 'Revenue Prediction', icon: DollarSign },
    { id: 'market' as const, label: 'Market Demand', icon: LineChart },
    { id: 'pricing' as const, label: 'Pricing Analysis', icon: TrendingUp },
    { id: 'expansion' as const, label: 'Expansion Opportunities', icon: Globe },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {options.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onOptionSelect(id)}
          className={`flex items-center p-4 rounded-lg transition-colors duration-200 ${
            selectedOption === id
              ? 'bg-blue-600 text-white'
              : 'bg-white hover:bg-blue-50 text-gray-700'
          }`}
        >
          <Icon className="w-5 h-5 mr-2" />
          <span className="font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
};