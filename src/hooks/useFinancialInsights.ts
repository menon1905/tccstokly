import { useState, useEffect } from 'react';
import { aiLocal } from '../lib/aiLocal';

interface FinancialMetrics {
  total_revenue: number;
  total_expenses: number;
  net_profit: number;
  profit_margin: number;
  revenue_growth: number;
  expense_growth: number;
  break_even_point: number;
  cash_runway_days: number;
}

interface FinancialInsight {
  type: 'success' | 'warning' | 'danger' | 'info';
  title: string;
  description: string;
  metric?: number;
  recommendation?: string;
}

interface FinancialResponse {
  metrics: FinancialMetrics;
  insights: FinancialInsight[];
  predictions: {
    next_month_revenue: number;
    next_month_expenses: number;
    next_month_profit: number;
    confidence: number;
  };
  health_score: number;
}

export const useFinancialInsights = () => {
  const [data, setData] = useState<FinancialResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await aiLocal.financialInsights();
      setData(result);
    } catch (err) {
      console.error('Error fetching financial insights:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return { data, loading, error, refetch: fetchInsights };
};
