export interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  icon: string;
}

export interface PredictiveData {
  date: string;
  actual?: number;
  predicted?: number;
  marketShare?: number;
  competitorShare?: number;
  pricing?: number;
  suggestedPrice?: number;
  expansionScore?: number;
  marketPotential?: number;
  efficiency?: number;
  growth?: number;
  revenue?: number;
}

export interface RiskMetric {
  category: string;
  value: number;
  status: 'low' | 'medium' | 'high';
}

export interface CostCategory {
  name: string;
  currentCost: number;
  previousCost: number;
  predictedReduction: number;
  efficiency: number;
}

export interface CostRecommendation {
  category: string;
  impact: 'high' | 'medium' | 'high';
  potentialSavings: number;
  description: string;
  actionItems: string[];
}

export interface FlipCard {
  title: string;
  frontContent: string;
  backContent: string;
  icon: string;
}

export interface AnalysisOverview {
  efficiency: number;
  growth: number;
  revenue: number;
  marketShare: number;
  prediction: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  currentStock: number;
  minThreshold: number;
  maxThreshold: number;
  dailyDemand: number;
  predictedStockout?: string;
  reorderPoint: number;
  costPerUnit: number;
  storagePerUnit: number;
}

export interface InventoryTrend {
  date: string;
  stock: number;
  demand: number;
  predicted: number;
}

export interface InventoryData {
  items: InventoryItem[];
  trends: InventoryTrend[];
}

export type NavSection = 'dashboard' | 'analytics' | 'predictions' | 'inventory';
export type PredictionType = 'risk' | 'revenue' | 'market' | 'pricing' | 'expansion';