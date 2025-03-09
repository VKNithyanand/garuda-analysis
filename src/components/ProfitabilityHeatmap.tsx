import React from 'react';
import { TrendingDown } from 'lucide-react';
import { CostCategory, CostRecommendation } from '../types';

interface Props {
  costCategories: CostCategory[];
  recommendations: CostRecommendation[];
}

export const ProfitabilityHeatmap: React.FC<Props> = ({ costCategories, recommendations }) => {
  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'bg-green-100 text-green-800';
    if (efficiency >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'low':
        return 'bg-green-50 border-green-200 text-green-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <TrendingDown className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-800">Cost Analysis</h3>
        </div>
        <div className="space-y-4">
          {costCategories.map((category, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-700">{category.name}</h4>
                <span className={`px-3 py-1 rounded-full text-sm ${getEfficiencyColor(category.efficiency)}`}>
                  {category.efficiency}% Efficient
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Current Cost</p>
                  <p className="font-semibold">${category.currentCost.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Previous Cost</p>
                  <p className="font-semibold">${category.previousCost.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Potential Savings</p>
                  <p className="font-semibold text-green-600">
                    ${category.predictedReduction.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Cost-Saving Recommendations</h3>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div key={index} className={`border rounded-lg p-4 ${getImpactColor(rec.impact)}`}>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">{rec.category}</h4>
                <span className="text-sm font-medium">
                  Potential Savings: ${rec.potentialSavings.toLocaleString()}
                </span>
              </div>
              <p className="text-sm mb-2">{rec.description}</p>
              <ul className="list-disc list-inside text-sm space-y-1">
                {rec.actionItems.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};