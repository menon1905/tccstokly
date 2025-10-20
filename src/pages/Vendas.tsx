import React, { useState } from 'react';
import { 
  ShoppingCart, 
  TrendingUp, 
  DollarSign, 
  Plus,
  Search,
  Bot,
  Target,
  Calendar
} from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { useLocalData } from '../hooks/useLocalData';
import { useCurrency } from '../hooks/useCurrency';
import { useSalesPrediction } from '../hooks/useSalesPrediction';
import { Line } from 'react-chartjs-2';
import { SaleForm } from '../components/forms/SaleForm';

export const Vendas: React.FC = () => {
  const { sales, loading, error, refetch } = useLocalData();
  const { formatCurrency } = useCurrency();
  const { predictionData, loading: predictionLoading } = useSalesPrediction();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSaleForm, setShowSaleForm] = useState(false);

  const totalSales = sales?.length || 0;
  const totalRevenue = sales?.reduce((sum, sale) => sum + (sale.total || 0), 0) || 0;

  // Prepare chart data with predictions
  const prepareChartData = () => {
    const historicalLabels: string[] = [];
    const historicalData: number[] = [];
    const predictionLabels: string[] = [];
    const predictedValues: number[] = [];
    const confidenceUpper: number[] = [];
    const confidenceLower: number[] = [];

    // Add historical data
    if (predictionData?.historical_data) {
      predictionData.historical_data.forEach((item) => {
        historicalLabels.push(new Date(item.date).toLocaleDateString('pt-BR'));
        historicalData.push(item.total);
      });
    }

    // Add prediction data
    if (predictionData?.predictions) {
      predictionData.predictions.forEach((item) => {
        predictionLabels.push(new Date(item.date).toLocaleDateString('pt-BR'));
        predictedValues.push(item.predicted_value);
        confidenceUpper.push(item.confidence_interval.upper);
        confidenceLower.push(item.confidence_interval.lower);
      });
    }

    // Combine labels
    const allLabels = [...historicalLabels, ...predictionLabels];

    // Prepare datasets
    const datasets = [
      {
        label: 'Vendas Reais',
        data: [...historicalData, ...Array(predictionLabels.length).fill(null)],
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        pointRadius: 4,
      },
      {
        label: 'Previsão IA',
        data: [...Array(historicalLabels.length).fill(null), ...predictedValues],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderDash: [5, 5],
        tension: 0.4,
        pointRadius: 4,
      },
      {
        label: 'Intervalo de Confiança (Superior)',
        data: [...Array(historicalLabels.length).fill(null), ...confidenceUpper],
        borderColor: 'rgba(16, 185, 129, 0.3)',
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
        borderDash: [2, 2],
        tension: 0.4,
        pointRadius: 0,
        fill: '+1',
      },
      {
        label: 'Intervalo de Confiança (Inferior)',
        data: [...Array(historicalLabels.length).fill(null), ...confidenceLower],
        borderColor: 'rgba(16, 185, 129, 0.3)',
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
        borderDash: [2, 2],
        tension: 0.4,
        pointRadius: 0,
        fill: false,
      },
    ];

    return { labels: allLabels, datasets };
  };

  const chartData = prepareChartData();

  // Calculate AI predictions from model
  const aiPredictions = {
    nextWeekSales: predictionData?.predictions.slice(0, 7).reduce((sum, p) => sum + p.predicted_value, 0) || 0,
    nextMonthRevenue: predictionData?.predictions.reduce((sum, p) => sum + p.predicted_value, 0) || 0,
    confidence: predictionData?.model_info.accuracy_percentage || 0
  };

  const filteredSales = (sales || []).filter(sale =>
    (sale.customers?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sale.products?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando vendas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 xl:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Vendas</h1>
          <p className="text-gray-600 mt-1">Análise inteligente de vendas</p>
        </div>
        <button 
          onClick={() => setShowSaleForm(true)}
          className="flex items-center px-4 sm:px-6 py-2 sm:py-3 text-white bg-green-600 rounded-lg sm:rounded-xl hover:bg-green-700 transition-colors text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Venda
        </button>
      </div>

      {/* Métricas com IA */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <MetricCard
          title="Vendas Realizadas"
          value={totalSales.toString()}
          icon={ShoppingCart}
          iconColor="text-purple-600"
        />
        <MetricCard
          title="Receita Total"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          iconColor="text-green-600"
        />
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl border border-blue-100 p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-blue-600" />
              <span className="text-xs sm:text-sm font-medium text-blue-600">Previsão IA</span>
            </div>
            <div className="text-xs text-blue-500 bg-blue-100 px-1 sm:px-2 py-1 rounded-full">
              {Math.round(aiPredictions.confidence)}%
            </div>
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(aiPredictions.nextWeekSales)}
          </p>
          <p className="text-xs sm:text-sm text-gray-600">Vendas próxima semana</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl sm:rounded-2xl border border-emerald-100 p-3 sm:p-4 lg:p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Target className="w-5 h-5 text-emerald-600" />
            <span className="text-xs sm:text-sm font-medium text-emerald-600">Meta IA</span>
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(aiPredictions.nextMonthRevenue)}
          </p>
          <p className="text-xs sm:text-sm text-gray-600">Previsão próximos 30 dias</p>
        </div>
      </div>

      {/* AI Suggestions Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Sugestões de IA para Vendas</h3>
              <p className="text-sm text-purple-100">Otimize suas vendas com inteligência artificial</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <p className="text-xs text-purple-100 mb-1">MELHOR HORÁRIO</p>
            <p className="text-xl font-bold">14h - 17h</p>
            <p className="text-xs text-purple-100 mt-1">35% mais conversões</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <p className="text-xs text-purple-100 mb-1">PRODUTOS COMBO</p>
            <p className="text-xl font-bold">+{totalSales > 0 ? Math.round(totalRevenue * 0.15) : 0}</p>
            <p className="text-xs text-purple-100 mt-1">Potencial de upsell</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <p className="text-xs text-purple-100 mb-1">CRESCIMENTO</p>
            <p className="text-xl font-bold">+18%</p>
            <p className="text-xs text-purple-100 mt-1">Próximos 30 dias (IA)</p>
          </div>
        </div>
      </div>

      {/* Gráfico Principal */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-3 sm:p-4 lg:p-6 xl:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900">Vendas vs Previsão IA</h3>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              {predictionLoading ? 'Carregando previsões...' : 
               predictionData ? `Modelo: ${predictionData.model_info.type} (${predictionData.model_info.data_points} pontos de dados)` :
               'Dados históricos e previsões inteligentes'}
            </p>
          </div>
          {predictionData && (
            <div className="text-right text-xs sm:text-sm text-gray-600 hidden sm:block">
              <p>Precisão: {Math.round(predictionData.model_info.accuracy_percentage)}%</p>
              <p>RMSE: {formatCurrency(predictionData.model_info.rmse)}</p>
            </div>
          )}
        </div>
        <div className="h-48 sm:h-64 lg:h-80">
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'top' as const,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(0, 0, 0, 0.05)',
                },
                ticks: {
                  callback: function(value) {
                    return formatCurrency(Number(value));
                  }
                }
              },
              x: {
                grid: {
                  display: false,
                },
              },
            },
            interaction: {
              intersect: false,
              mode: 'index' as const,
            },
          }}
        />
        </div>
      </div>

      {/* Lista de Vendas - Simplificada */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-3 sm:p-4 lg:p-6 xl:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Vendas Recentes</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar vendas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredSales.slice(0, 5).map((sale) => (
            <div key={sale.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl gap-3 sm:gap-0">
              <div>
                <p className="font-medium text-gray-900 text-sm sm:text-base">{sale.customers?.name || 'Cliente não encontrado'}</p>
                <p className="text-xs sm:text-sm text-gray-600">{sale.products?.name || 'Produto não encontrado'}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 text-sm sm:text-base">
                  {formatCurrency(sale.total)}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  {new Date(sale.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SaleForm
        isOpen={showSaleForm}
        onClose={() => setShowSaleForm(false)}
        onSuccess={() => {
          refetch();
          alert('Venda registrada com sucesso!');
        }}
      />
    </div>
  );
};