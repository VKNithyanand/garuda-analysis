import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { FlipCard as FlipCardType } from '../types';

interface Props extends FlipCardType {
  riskPercentage?: number;
  tip?: string;
}

export const FlipCard: React.FC<Props> = ({ title, frontContent, backContent, icon, riskPercentage, tip }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const IconComponent = Icons[icon as keyof typeof Icons];

  return (
    <div
      className="relative h-64 w-full perspective-1000"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div className={`absolute w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Front */}
        <div className="absolute w-full h-full bg-white rounded-xl shadow-lg p-6 backface-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <IconComponent className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
            </div>
          </div>
          <p className="text-gray-600">{backContent}</p>
          {riskPercentage && (
            <div className="mt-4 p-2 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">Current Risk Level: {riskPercentage}%</p>
            </div>
          )}
        </div>

        {/* Back */}
        <div className="absolute w-full h-full bg-blue-600 text-white rounded-xl shadow-lg p-6 rotate-y-180 backface-hidden">
          <h3 className="text-xl font-semibold mb-4">{title}</h3>
          <p className="mb-4">{frontContent}</p>
          {tip && (
            <div className="mt-auto">
              <p className="text-sm bg-white/10 p-3 rounded-lg">💡 {tip}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};