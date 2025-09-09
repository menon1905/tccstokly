import { useState, useEffect } from 'react';

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
      // Simulate API delay for realistic experience
      await new Promise(resolve => setTimeout(resolve, 800));

      // Generate realistic mock prediction data
      const mockPredictions: PredictionResult[] = [];
      const baseValue = 4500;
      
      for (let i = 1; i <= 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        
        // Create realistic growth trend with some seasonality
        const trend = i * 45; // Growing trend
        const seasonality = Math.sin((i / 7) * Math.PI) * 300; // Weekly pattern
        const randomVariation = (Math.random() - 0.5) * 800;
        const predictedValue = baseValue + trend + seasonality + randomVariation;
        
        mockPredictions.push({
          date: date.toISOString().split('T')[0],
          predicted_value: Math.max(1000, Math.round(predictedValue)),
          confidence_interval: {
            lower: Math.max(500, Math.round(predictedValue * 0.75)),
            upper: Math.round(predictedValue * 1.25)
          }
        });
      }
      
      // Generate realistic historical data
      const mockHistorical = [];
      for (let i = 30; i >= 1; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        const baseHistorical = 3500 + (30 - i) * 35;
        const historicalSeasonality = Math.sin(((30 - i) / 7) * Math.PI) * 250;
        const randomVar = (Math.random() - 0.5) * 600;
        
        mockHistorical.push({
          date: date.toISOString().split('T')[0],
          total: Math.max(800, Math.round(baseHistorical + historicalSeasonality + randomVar))
        });
      }
      
      setPredictionData({
        predictions: mockPredictions,
        model_info: {
          type: 'advanced_ml_model',
          data_points: 30,
          days_analyzed: 30,
          slope: 45,
          intercept: 3500,
          accuracy_percentage: 87.5,
          rmse: 425
        },
        historical_data: mockHistorical
      });
      
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