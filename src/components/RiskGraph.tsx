import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { BarChartIcon as ChartIcon, X } from 'lucide-react';

interface RiskDataPoint {
  date: string;
  riskScore: number;
  threshold: number;
}

interface Props {
  data: RiskDataPoint[];
}

export const RiskGraph: React.FC<Props> = ({ data }) => {
  const [showOverview, setShowOverview] = useState(false);

  const OverviewModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Risk Analysis Dashboard Overview</h3>
          <button 
            onClick={() => setShowOverview(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Key Risk Metrics</h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Average Risk Score</p>
                  <p className="text-2xl font-bold text-gray-900">{calculateAverageRisk(data).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Threshold Breaches</p>
                  <p className="text-2xl font-bold text-red-600">{countThresholdBreaches(data)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Risk Volatility</p>
                  <p className="text-2xl font-bold text-orange-600">{calculateRiskVolatility(data).toFixed(2)}%</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Risk Distribution</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">High Risk Days</span>
                    <span className="text-sm text-red-600 font-bold">{calculateRiskDistribution(data).high}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Medium Risk Days</span>
                    <span className="text-sm text-orange-600 font-bold">{calculateRiskDistribution(data).medium}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Low Risk Days</span>
                    <span className="text-sm text-green-600 font-bold">{calculateRiskDistribution(data).low}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Risk Insights</h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Peak Risk Period</p>
                  <p className="text-sm text-gray-600">{identifyPeakRiskPeriod(data)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Risk Pattern</p>
                  <p className="text-sm text-gray-600">{analyzeRiskPattern(data)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Threshold Analysis</p>
                  <p className="text-sm text-gray-600">{analyzeThresholdBreaches(data)}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Action Items</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="space-y-2 text-sm text-gray-600">
                  {generateActionItems(data).map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Risk Assessment Overview</h3>
        <button
          onClick={() => setShowOverview(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ChartIcon className="w-4 h-4 mr-2" />
          Detailed Analysis
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
              formatter={(value) => [`${value}`, '']}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="riskScore"
              stroke="#ef4444"
              strokeWidth={2}
              name="Risk Score"
            />
            <Line
              type="monotone"
              dataKey="threshold"
              stroke="#6b7280"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Risk Threshold"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-700 mb-2">Quick Analysis</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Average Risk Score: {calculateAverageRisk(data).toFixed(2)}</li>
          <li>• Risk Threshold Breaches: {countThresholdBreaches(data)}</li>
        </ul>
      </div>
      {showOverview && <OverviewModal />}
    </div>
  );
};

const calculateAverageRisk = (data: RiskDataPoint[]): number => {
  return data.reduce((acc, point) => acc + point.riskScore, 0) / data.length;
};

const countThresholdBreaches = (data: RiskDataPoint[]): number => {
  return data.filter(point => point.riskScore > point.threshold).length;
};

const calculateRiskVolatility = (data: RiskDataPoint[]): number => {
  const changes = data.slice(1).map((point, i) => 
    Math.abs(point.riskScore - data[i].riskScore)
  );
  return (changes.reduce((sum, change) => sum + change, 0) / changes.length) * 100 / calculateAverageRisk(data);
};

const calculateRiskDistribution = (data: RiskDataPoint[]) => {
  const distribution = {
    high: 0,
    medium: 0,
    low: 0
  };

  data.forEach(point => {
    if (point.riskScore >= 70) distribution.high++;
    else if (point.riskScore >= 40) distribution.medium++;
    else distribution.low++;
  });

  return distribution;
};

const identifyPeakRiskPeriod = (data: RiskDataPoint[]): string => {
  const peakRisk = Math.max(...data.map(point => point.riskScore));
  const peakDate = data.find(point => point.riskScore === peakRisk)?.date;
  return `Highest risk of ${peakRisk.toFixed(1)} observed on ${format(new Date(peakDate!), 'MMM d, yyyy')}`;
};

const analyzeRiskPattern = (data: RiskDataPoint[]): string => {
  const volatility = calculateRiskVolatility(data);
  if (volatility > 20) return "Highly volatile risk pattern with significant fluctuations";
  if (volatility > 10) return "Moderately volatile risk pattern with regular variations";
  return "Stable risk pattern with minimal fluctuations";
};

const analyzeThresholdBreaches = (data: RiskDataPoint[]): string => {
  const breaches = countThresholdBreaches(data);
  const breachPercentage = (breaches / data.length) * 100;
  return `${breaches} threshold breaches (${breachPercentage.toFixed(1)}% of time period)`;
};

const generateActionItems = (data: RiskDataPoint[]): string[] => {
  const actionItems = [];
  const avgRisk = calculateAverageRisk(data);
  const breaches = countThresholdBreaches(data);
  const volatility = calculateRiskVolatility(data);

  if (avgRisk > 60) {
    actionItems.push("Implement immediate risk mitigation strategies to reduce overall risk exposure");
  }
  if (breaches > 5) {
    actionItems.push("Review and adjust risk thresholds based on recent breach patterns");
  }
  if (volatility > 15) {
    actionItems.push("Develop stabilization measures to reduce risk volatility");
  }
  if (actionItems.length === 0) {
    actionItems.push("Continue monitoring current risk levels and maintain existing controls");
  }

  return actionItems;
};