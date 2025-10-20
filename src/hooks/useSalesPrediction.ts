import { useState, useEffect } from 'react';
import { aiLocal } from '../lib/aiLocal';

interface PredictionResult {
  date: string;
  predicted_value: number;
  confidence_interval: {
    lower: number;
    upper: number;
  };
}

interface ModelInfo {
  type: string;
  data_points: number;
  days_analyzed: number;
  slope: number;
  intercept: number;
  accuracy_percentage: number;
  rmse: number;
}

interface SalesPredictionData {
  predictions: PredictionResult[];
  model_info: ModelInfo;
  historical_data: { date: string; total: number }[];
}

export const useSalesPrediction = () => {
  const [predictionData, setPredictionData] = useState<SalesPredictionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPredictions = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await aiLocal.salesPrediction();
      setPredictionData(result as SalesPredictionData);
    } catch (err) {
      console.error('Error generating predictions:', err);
      setError('Erro ao gerar previsões');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  return {
    predictionData,
    loading,
    error,
    refetch: fetchPredictions,
  };
};