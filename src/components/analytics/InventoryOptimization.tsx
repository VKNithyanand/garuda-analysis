import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Package, AlertTriangle, TrendingUp, Bell } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { toast } from 'react-hot-toast';

interface InventoryItem {
  id: string;
  name: string;
  currentStock: number;
  minThreshold: number;
  maxThreshold: number;
  dailyDemand: number;
  predictedStockout?: string;
  reorderPoint: number;
  storagePerUnit: number;
  costPerUnit: number;
}

interface InventoryTrend {
  date: string;
  stock: number;
  demand: number;
  predicted: number;
}

interface Props {
  inventoryData: {
    items: InventoryItem[];
    trends: InventoryTrend[];
  };
}

export const InventoryOptimization: React.FC<Props> = ({ inventoryData }) => {
  const [showOverview, setShowOverview] = useState(false);
  const [showCriticalList, setShowCriticalList] = useState(false);
  const [showOverstockList, setShowOverstockList] = useState(false);
  const [stockPredictions, setStockPredictions] = useState<{ [key: string]: Date }>({});

  useEffect(() => {
    const predictions = calculateStockPredictions(inventoryData.items);
    setStockPredictions(predictions);

    Object.entries(predictions).forEach(([itemName, date]) => {
      const daysUntilStockout = Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilStockout <= 7) {
        toast.error(
          `Critical: ${itemName} will stock out in ${daysUntilStockout} days!`,
          {
            duration: 5000,
            icon: '⚠️',
          }
        );
      }
    });
  }, [inventoryData]);

  const calculateStockPredictions = (items: InventoryItem[]) => {
    const predictions: { [key: string]: Date } = {};
    
    items.forEach(item => {
      if (item.dailyDemand > 0) {
        const daysUntilStockout = Math.floor(item.currentStock / item.dailyDemand);
        predictions[item.name] = addDays(new Date(), daysUntilStockout);
      }
    });

    return predictions;
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock <= item.minThreshold) return 'stockout-risk';
    if (item.currentStock >= item.maxThreshold) return 'overstock';
    return 'optimal';
  };

  const calculateDaysUntilStockout = (item: InventoryItem) => {
    if (item.dailyDemand <= 0) return Infinity;
    return Math.floor(item.currentStock / item.dailyDemand);
  };

  const stockoutRiskItems = inventoryData.items.filter(
    item => getStockStatus(item) === 'stockout-risk'
  );

  const overstockItems = inventoryData.items.filter(
    item => getStockStatus(item) === 'overstock'
  );

  const CriticalItemsList = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Critical Items Analysis</h3>
          <button 
            onClick={() => setShowCriticalList(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {stockoutRiskItems.map(item => {
            const daysUntilStockout = calculateDaysUntilStockout(item);
            const potentialLoss = (item.minThreshold - item.currentStock) * (item.costPerUnit * 0.3);

            return (
              <div key={item.id} className="border rounded-lg p-4 bg-red-50">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold">{item.name}</h4>
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                    Critical
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Current Stock</p>
                    <p className="text-xl font-bold text-red-600">{item.currentStock} units</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Days Until Stockout</p>
                    <p className="text-xl font-bold text-red-600">{daysUntilStockout} days</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Daily Demand</p>
                    <p className="text-lg font-semibold">{item.dailyDemand} units</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Potential Loss</p>
                    <p className="text-lg font-semibold text-red-600">${potentialLoss.toFixed(2)}</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h5 className="font-medium mb-2">Recommended Actions</h5>
                  <ul className="space-y-2 text-sm">
                    <li>• Order {item.minThreshold - item.currentStock} units immediately</li>
                    <li>• Review reorder point (currently {item.reorderPoint})</li>
                    <li>• Consider expedited shipping options</li>
                    <li>• Monitor daily demand patterns</li>
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const OverstockItemsList = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Overstock Items Analysis</h3>
          <button 
            onClick={() => setShowOverstockList(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {overstockItems.map(item => {
            const excessStock = item.currentStock - item.maxThreshold;
            const storageWaste = excessStock * item.storagePerUnit;
            const capitalTied = excessStock * item.costPerUnit;

            return (
              <div key={item.id} className="border rounded-lg p-4 bg-yellow-50">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold">{item.name}</h4>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    Overstock
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Current Stock</p>
                    <p className="text-xl font-bold text-yellow-600">{item.currentStock} units</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Excess Units</p>
                    <p className="text-xl font-bold text-yellow-600">{excessStock} units</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Storage Cost Waste</p>
                    <p className="text-lg font-semibold">${storageWaste.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Capital Tied Up</p>
                    <p className="text-lg font-semibold">${capitalTied.toFixed(2)}</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h5 className="font-medium mb-2">Optimization Strategies</h5>
                  <ul className="space-y-2 text-sm">
                    <li>• Consider promotional activities to reduce stock</li>
                    <li>• Analyze ordering patterns to prevent future overstock</li>
                    <li>• Review storage optimization options</li>
                    <li>• Adjust max threshold if demand patterns have changed</li>
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const InventoryOverview = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Inventory Analysis Overview</h3>
          <button 
            onClick={() => setShowOverview(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-semibold mb-4">Stock Level Analysis</h4>
            <div className="space-y-4">
              {inventoryData.items.map(item => {
                const status = getStockStatus(item);
                const statusColor = status === 'stockout-risk' ? 'red' : status === 'overstock' ? 'yellow' : 'green';
                
                return (
                  <div key={item.id} className={`border rounded-lg p-4 bg-${statusColor}-50`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{item.name}</span>
                      <span className={`text-${statusColor}-600`}>
                        {item.currentStock} units
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Min:</span>
                        <span className="ml-1">{item.minThreshold}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Max:</span>
                        <span className="ml-1">{item.maxThreshold}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Daily:</span>
                        <span className="ml-1">{item.dailyDemand}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Demand Forecast</h4>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={inventoryData.trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => format(new Date(date), 'MMM d')}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(date) => format(new Date(date), 'MMM d, yyyy')}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="demand" 
                    stroke="#2563eb" 
                    name="Actual Demand"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#16a34a" 
                    strokeDasharray="5 5" 
                    name="Predicted Demand"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-4">Inventory Health Metrics</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 bg-blue-50">
                <h5 className="font-medium mb-2">Stock Efficiency</h5>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round((inventoryData.items.filter(item => 
                    item.currentStock >= item.minThreshold && 
                    item.currentStock <= item.maxThreshold
                  ).length / inventoryData.items.length) * 100)}%
                </p>
                <p className="text-sm text-gray-600">Optimal stock level</p>
              </div>
              
              <div className="border rounded-lg p-4 bg-red-50">
                <h5 className="font-medium mb-2">Critical Items</h5>
                <p className="text-2xl font-bold text-red-600">
                  {stockoutRiskItems.length}
                </p>
                <p className="text-sm text-gray-600">Items at risk of stockout</p>
              </div>

              <div className="border rounded-lg p-4 bg-yellow-50">
                <h5 className="font-medium mb-2">Overstock Items</h5>
                <p className="text-2xl font-bold text-yellow-600">
                  {overstockItems.length}
                </p>
                <p className="text-sm text-gray-600">Items exceeding max threshold</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Recommendations</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stockoutRiskItems.length > 0 && (
                <div className="border rounded-lg p-4 bg-blue-50">
                  <h5 className="font-medium mb-2">Stock-out Prevention</h5>
                  <ul className="text-sm space-y-2">
                    <li>• Place immediate orders for high-risk items</li>
                    <li>• Review and adjust reorder points</li>
                    <li>• Consider expedited shipping options</li>
                  </ul>
                </div>
              )}
              {overstockItems.length > 0 && (
                <div className="border rounded-lg p-4 bg-blue-50">
                  <h5 className="font-medium mb-2">Overstock Management</h5>
                  <ul className="text-sm space-y-2">
                    <li>• Consider promotional activities</li>
                    <li>• Review storage costs</li>
                    <li>• Adjust future order quantities</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Package className="w-6 h-6 text-blue-600 mr-2" />
          <h3 className="text-xl font-semibold">Demand & Inventory Optimization</h3>
        </div>
        <button
          onClick={() => setShowOverview(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          View Analysis
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={inventoryData.items}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="currentStock" name="Current Stock" fill="#2563eb" />
              <Bar dataKey="minThreshold" name="Min Threshold" fill="#ef4444" />
              <Bar dataKey="maxThreshold" name="Max Threshold" fill="#eab308" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <h4 className="font-semibold">Critical Items</h4>
              </div>
              <button
                onClick={() => setShowCriticalList(true)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View All
              </button>
            </div>
            <div className="space-y-2">
              {stockoutRiskItems.slice(0, 3).map(item => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-3 border rounded-lg bg-red-50"
                >
                  <span className="font-medium">{item.name}</span>
                  <div className="text-right">
                    <span className="text-red-600 block">
                      {item.currentStock} units left
                    </span>
                    <span className="text-sm text-red-500">
                      {calculateDaysUntilStockout(item)} days remaining
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Package className="w-5 h-5 text-yellow-600 mr-2" />
                <h4 className="font-semibold">Overstock Items</h4>
              </div>
              <button
                onClick={() => setShowOverstockList(true)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View All
              </button>
            </div>
            <div className="space-y-2">
              {overstockItems.slice(0, 3).map(item => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-3 border rounded-lg bg-yellow-50"
                >
                  <span className="font-medium">{item.name}</span>
                  <div className="text-right">
                    <span className="text-yellow-600 block">
                      {item.currentStock} units
                    </span>
                    <span className="text-sm text-yellow-500">
                      {item.currentStock - item.maxThreshold} units excess
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showOverview && <InventoryOverview />}
      {showCriticalList && <CriticalItemsList />}
      {showOverstockList && <OverstockItemsList />}
    </div>
  );
};