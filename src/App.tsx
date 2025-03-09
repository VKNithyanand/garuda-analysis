import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { MetricCard } from './components/MetricCard';
import { PredictiveChart } from './components/PredictiveChart';
import { RiskAnalysis } from './components/RiskAnalysis';
import { Navigation } from './components/Navigation';
import { FileUpload } from './components/FileUpload';
import { PredictionOptions } from './components/PredictionOptions';
import { FlipCard } from './components/FlipCard';
import { RiskGraph } from './components/RiskGraph';
import { RevenueBreakdown } from './components/analytics/RevenueBreakdown';
import { ChannelPerformance } from './components/analytics/ChannelPerformance';
import { RiskFraudAnalytics } from './components/analytics/RiskFraudAnalytics';
import { ProductAnalytics } from './components/analytics/ProductAnalytics';
import { InventoryOptimization } from './components/analytics/InventoryOptimization';
import { NavSection, PredictionType, PredictiveData, RiskMetric } from './types';

const initialMetrics = [
  {
    title: 'Revenue',
    value: '$125,000',
    change: 12.5,
    icon: 'DollarSign'
  },
  {
    title: 'Customers',
    value: '1,240',
    change: 8.2,
    icon: 'Users'
  },
  {
    title: 'Risk Score',
    value: '85/100',
    change: -2.4,
    icon: 'AlertTriangle'
  },
  {
    title: 'Efficiency',
    value: '94%',
    change: 5.1,
    icon: 'TrendingUp'
  }
];

const initialRisks = [
  { category: 'Market Volatility', value: 75, status: 'high' },
  { category: 'Operational Risk', value: 45, status: 'medium' },
  { category: 'Credit Risk', value: 30, status: 'low' },
  { category: 'Compliance Risk', value: 60, status: 'medium' }
];

const flipCards = [
  {
    title: 'Risk Assessment',
    frontContent: 'AI-powered risk scoring and automated alert system for proactive risk management.',
    backContent: 'Comprehensive analysis of potential risks and mitigation strategies.',
    icon: 'AlertTriangle',
    riskPercentage: 75,
    tip: 'Implement automated risk monitoring systems to reduce exposure by 30%'
  },
  {
    title: 'Demand Forecasting',
    frontContent: 'Machine learning algorithms analyzing historical data and market trends.',
    backContent: 'Advanced predictive modeling for future market demand.',
    icon: 'LineChart',
    riskPercentage: 45,
    tip: 'Utilize historical data patterns to improve forecast accuracy by 25%'
  },
  {
    title: 'Market Analysis',
    frontContent: 'Real-time competitor tracking and market opportunity identification.',
    backContent: 'Deep insights into market trends and competitive landscape.',
    icon: 'BarChart2',
    riskPercentage: 60,
    tip: 'Diversify market presence to reduce dependency on primary segments'
  }
];

const initialAnalyticsData = {
  revenue: [
    { name: 'Product Sales', value: 50000 + Math.random() * 20000, color: '#2563eb' },
    { name: 'Services', value: 30000 + Math.random() * 15000, color: '#16a34a' },
    { name: 'Subscriptions', value: 25000 + Math.random() * 10000, color: '#eab308' },
    { name: 'Other', value: 10000 + Math.random() * 5000, color: '#64748b' }
  ],
  channels: [
    { name: 'Online', current: 45000 + Math.random() * 10000, previous: 40000 + Math.random() * 10000 },
    { name: 'Retail', current: 35000 + Math.random() * 8000, previous: 32000 + Math.random() * 8000 },
    { name: 'Partners', current: 25000 + Math.random() * 6000, previous: 22000 + Math.random() * 6000 }
  ],
  fraud: Array.from({ length: 12 }, (_, i) => ({
    date: `2024-${(i + 1).toString().padStart(2, '0')}`,
    incidents: Math.floor(Math.random() * 20),
    riskScore: 40 + Math.random() * 30
  })),
  products: [
    { name: 'Laptop Pro X1', sales: 1200 + Math.random() * 300, growth: 15 + Math.random() * 10 },
    { name: 'Wireless Earbuds', sales: 800 + Math.random() * 200, growth: 12 + Math.random() * 8 },
    { name: 'Smart Watch Elite', sales: 600 + Math.random() * 150, growth: 8 + Math.random() * 6 }
  ],
  inventory: {
    items: [
      {
        id: '1',
        name: 'Laptop Pro X1',
        currentStock: 150,
        minThreshold: 100,
        maxThreshold: 500,
        dailyDemand: 12,
        reorderPoint: 120,
        costPerUnit: 899,
        storagePerUnit: 25
      },
      {
        id: '2',
        name: 'Wireless Earbuds',
        currentStock: 80,
        minThreshold: 100,
        maxThreshold: 400,
        dailyDemand: 8,
        reorderPoint: 150,
        costPerUnit: 129,
        storagePerUnit: 5
      },
      {
        id: '3',
        name: 'Smart Watch Elite',
        currentStock: 600,
        minThreshold: 150,
        maxThreshold: 450,
        dailyDemand: 15,
        reorderPoint: 200,
        costPerUnit: 299,
        storagePerUnit: 10
      },
      {
        id: '4',
        name: 'Premium Headphones',
        currentStock: 90,
        minThreshold: 120,
        maxThreshold: 400,
        dailyDemand: 10,
        reorderPoint: 180,
        costPerUnit: 249,
        storagePerUnit: 15
      }
    ],
    trends: Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return {
        date: date.toISOString(),
        stock: 300 + Math.random() * 100,
        demand: 250 + Math.random() * 50,
        predicted: 280 + Math.random() * 60
      };
    })
  }
};

function App() {
  const [activeSection, setActiveSection] = useState<NavSection>('dashboard');
  const [selectedPrediction, setSelectedPrediction] = useState<PredictionType>('risk');
  const [hasUploadedFile, setHasUploadedFile] = useState(false);
  const [metrics, setMetrics] = useState(initialMetrics);
  const [risks, setRisks] = useState(initialRisks);
  const [riskData, setRiskData] = useState(() => generateInitialData());
  const [revenueData, setRevenueData] = useState(() => generateRevenueData());
  const [marketData, setMarketData] = useState(() => generateMarketData());
  const [pricingData, setPricingData] = useState(() => generatePricingData());
  const [expansionData, setExpansionData] = useState(() => generateExpansionData());
  const [analyticsData, setAnalyticsData] = useState(initialAnalyticsData);

  function generateInitialData() {
    const data = [];
    const startDate = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      data.push({
        date: date.toISOString(),
        riskScore: 50 + Math.random() * 30,
        threshold: 70
      });
    }
    return data;
  }

  function generateRevenueData() {
    const data = [];
    const startDate = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      data.push({
        date: date.toISOString(),
        actual: i < 15 ? 50000 + Math.random() * 10000 : undefined,
        predicted: 52000 + Math.random() * 12000,
        efficiency: 85 + Math.random() * 10,
        growth: 5 + Math.random() * 3,
        revenue: 100 + Math.random() * 50
      });
    }
    return data;
  }

  function generateMarketData() {
    const data = [];
    const startDate = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      data.push({
        date: date.toISOString(),
        marketShare: 25 + Math.random() * 10,
        competitorShare: 20 + Math.random() * 8,
        efficiency: 80 + Math.random() * 15,
        growth: 4 + Math.random() * 4,
        revenue: 90 + Math.random() * 60
      });
    }
    return data;
  }

  function generatePricingData() {
    const data = [];
    const startDate = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      data.push({
        date: date.toISOString(),
        pricing: 100 + Math.random() * 20,
        suggestedPrice: 110 + Math.random() * 15,
        efficiency: 82 + Math.random() * 12,
        growth: 3 + Math.random() * 5,
        revenue: 95 + Math.random() * 55
      });
    }
    return data;
  }

  function generateExpansionData() {
    const data = [];
    const startDate = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      data.push({
        date: date.toISOString(),
        expansionScore: 60 + Math.random() * 25,
        marketPotential: 70 + Math.random() * 20,
        efficiency: 75 + Math.random() * 20,
        growth: 6 + Math.random() * 4,
        revenue: 85 + Math.random() * 65
      });
    }
    return data;
  }

  const handleFileSelect = (file: File) => {
    toast.success('File uploaded successfully! Analyzing data...', {
      duration: 3000,
      position: 'top-right',
      icon: '📊'
    });

    setTimeout(() => {
      const newMetrics = [...metrics];
      newMetrics[0].value = `$${(120000 + Math.random() * 10000).toFixed(0)}`;
      newMetrics[0].change = Math.round((Math.random() * 20 - 10) * 10) / 10;
      newMetrics[1].value = (1200 + Math.round(Math.random() * 100)).toString();
      newMetrics[1].change = Math.round((Math.random() * 15 - 5) * 10) / 10;
      newMetrics[2].value = `${Math.round(70 + Math.random() * 20)}/100`;
      newMetrics[2].change = Math.round((Math.random() * 10 - 5) * 10) / 10;
      newMetrics[3].value = `${Math.round(85 + Math.random() * 10)}%`;
      newMetrics[3].change = Math.round((Math.random() * 8 - 2) * 10) / 10;
      setMetrics(newMetrics);

      const newRisks = [
        { category: 'Market Volatility', value: 55 + Math.random() * 30, status: 'medium' },
        { category: 'Operational Risk', value: 35 + Math.random() * 30, status: 'medium' },
        { category: 'Credit Risk', value: 20 + Math.random() * 30, status: 'low' },
        { category: 'Compliance Risk', value: 40 + Math.random() * 30, status: 'medium' }
      ].map(risk => ({
        ...risk,
        status: risk.value >= 70 ? 'high' : risk.value >= 40 ? 'medium' : 'low'
      }));
      setRisks(newRisks);

      switch (selectedPrediction) {
        case 'risk':
          setRiskData(generateInitialData());
          break;
        case 'revenue':
          setRevenueData(generateRevenueData());
          break;
        case 'market':
          setMarketData(generateMarketData());
          break;
        case 'pricing':
          setPricingData(generatePricingData());
          break;
        case 'expansion':
          setExpansionData(generateExpansionData());
          break;
      }

      setAnalyticsData({
        ...initialAnalyticsData,
        inventory: {
          ...initialAnalyticsData.inventory,
          items: initialAnalyticsData.inventory.items.map(item => ({
            ...item,
            currentStock: Math.floor(Math.random() * (item.maxThreshold - item.minThreshold) + item.minThreshold)
          }))
        }
      });

      setHasUploadedFile(true);
    }, 1500);
  };

  const renderPredictionGraph = () => {
    if (!hasUploadedFile) return null;

    switch (selectedPrediction) {
      case 'risk':
        return <RiskGraph data={riskData} />;
      case 'revenue':
        return <PredictiveChart data={revenueData} title="Revenue Forecast" type="revenue" />;
      case 'market':
        return <PredictiveChart data={marketData} title="Market Share Analysis" type="market" />;
      case 'pricing':
        return <PredictiveChart data={pricingData} title="Pricing Analysis" type="pricing" />;
      case 'expansion':
        return <PredictiveChart data={expansionData} title="Expansion Opportunities" type="expansion" />;
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <>
            <FileUpload 
              onFileSelect={handleFileSelect} 
              showReupload={hasUploadedFile}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {metrics.map((metric, index) => (
                <MetricCard key={index} {...metric} />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <PredictiveChart data={revenueData} title="Revenue Trends" type="revenue" />
              </div>
              <div>
                <RiskAnalysis risks={risks} />
              </div>
            </div>
          </>
        );

      case 'predictions':
        return (
          <>
            <FileUpload 
              onFileSelect={handleFileSelect} 
              showReupload={hasUploadedFile}
            />
            <PredictionOptions
              selectedOption={selectedPrediction}
              onOptionSelect={setSelectedPrediction}
            />
            {renderPredictionGraph()}
            {selectedPrediction && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {flipCards.map((card, index) => (
                  <FlipCard key={index} {...card} />
                ))}
              </div>
            )}
          </>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <FileUpload 
              onFileSelect={handleFileSelect} 
              showReupload={hasUploadedFile}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RevenueBreakdown data={analyticsData.revenue} />
              <ChannelPerformance data={analyticsData.channels} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RiskFraudAnalytics data={analyticsData.fraud} />
              <ProductAnalytics data={analyticsData.products} />
            </div>
          </div>
        );

      case 'inventory':
        return (
          <div className="space-y-6">
            <FileUpload 
              onFileSelect={handleFileSelect} 
              showReupload={hasUploadedFile}
            />
            <InventoryOptimization inventoryData={analyticsData.inventory} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Toaster />
      <Navigation activeSection={activeSection} onNavigate={setActiveSection} />
      <div className="ml-64 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default App;