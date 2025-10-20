import { useState, useEffect } from 'react';
import { aiLocal } from '../lib/aiLocal';

interface ProductAnalysis {
  product_id: string;
  product_name: string;
  current_stock: number;
  min_stock: number;
  avg_daily_sales: number;
  days_until_stockout: number;
  recommended_order: number;
  priority: 'high' | 'medium' | 'low';
  reason: string;
}

interface InventoryInsights {
  total_products: number;
  products_below_min: number;
  products_at_risk: number;
  recommendations: ProductAnalysis[];
  optimization_score: number;
  total_value_at_risk: number;
}

export const useInventoryOptimization = () => {
  const [data, setData] = useState<InventoryInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOptimization = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await aiLocal.inventoryOptimization();
      setData(result);
    } catch (err) {
      console.error('Error fetching inventory optimization:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptimization();
  }, []);

  return { data, loading, error, refetch: fetchOptimization };
};
