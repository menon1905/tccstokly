import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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

      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('No active session');
      }

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(
        `${supabaseUrl}/functions/v1/financial-insights`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch financial insights');
      }

      const result = await response.json();
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
