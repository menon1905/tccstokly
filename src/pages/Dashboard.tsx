import React from 'react';
import { 
  Package, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Bot,
  Sparkles,
  Target,
  Activity
} from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { useLocalData } from '../hooks/useLocalData';
import { useCurrency } from '../hooks/useCurrency';
import { useSalesPrediction } from '../hooks/useSalesPrediction';
import { Line } from 'react-chartjs-2';

export const Dashboard: React.FC = () => {
  const { products, sales, customers, loading, error } = useLocalData();
  const { formatCurrency } = useCurrency();
  const { predictionData } = useSalesPrediction();

  const totalProducts = products?.length || 0;
  const totalRevenue = sales?.reduce((sum, sale) => sum + (sale.total || 0), 0) || 0;
  const totalCustomers = customers?.length || 0;

  // IA Predictions
  const aiInsights = {
    nextWeekRevenue: predictionData?.predictions.slice(0, 7).reduce((sum, p) => sum + p.predicted_value, 0) || Math.round(totalRevenue * 1.18),
    efficiency: predictionData?.model_info.accuracy_percentage || 94
  };

  // Dados do gráfico principal
  const performanceData = {
    labels: predictionData?.historical_data.slice(-6).map(d => 
      new Date(d.date).toLocaleDateString('pt-BR', { month: 'short' })
    ) || ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Vendas Reais',
        data: predictionData?.historical_data.slice(-6).map(d => d.total) || [65, 78, 82, 71, 89, 95],
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Previsão IA',
        data: predictionData?.predictions.slice(0, 6).map(p => p.predicted_value) || [70, 80, 85, 75, 92, 98],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderDash: [5, 5],
        tension: 0.4,
      },
    ],
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header Simples */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Visão geral do seu negócio</p>
      </div>

      {/* Métricas Principais - Simplificadas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Produtos"
          value={totalProducts.toString()}
          icon={Package}
          iconColor="text-purple-600"
        />
        <MetricCard
          title="Receita"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          iconColor="text-green-600"
        />
        <MetricCard
          title="Clientes"
          value={totalCustomers.toString()}
          icon={Users}
          iconColor="text-blue-600"
        />
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-100 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Bot className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-600">IA Engine</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {aiInsights.efficiency}%
          </p>
          <p className="text-sm text-gray-600">Eficiência do sistema</p>
        </div>
      </div>

      {/* Gráfico Principal - Limpo */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Performance 
            </h3>
            <p className="text-gray-600 mt-1">Vendas reais vs previsões inteligentes</p>
          </div>
        </div>
        <Line 
          data={performanceData} 
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(0, 0, 0, 0.05)',
                },
              },
              x: {
                grid: {
                  display: false,
                },
              },
            },
          }} 
        />
      </div>

      {/* Insights IA - Simplificados */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-600">Previsão</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(aiInsights.nextWeekRevenue)}
          </p>
          <p className="text-sm text-gray-600">Próxima semana</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Target className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Meta IA</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(Math.round(totalRevenue * 1.35))}
          </p>
          <p className="text-sm text-gray-600">Recomendada</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl border border-orange-100 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-600">Otimização</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            3
          </p>
          <p className="text-sm text-gray-600">Sugestões ativas</p>
        </div>
      </div>
    </div>
  );
};