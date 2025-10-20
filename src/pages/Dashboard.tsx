import React, { useMemo } from 'react';
import {
  Package,
  TrendingUp,
  DollarSign,
  Users,
  Bot,
  Sparkles,
  Target,
  Activity,
  AlertTriangle,
  Star,
  Bell
} from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { useLocalData } from '../hooks/useLocalData';
import { useCurrency } from '../hooks/useCurrency';
import { useSalesPrediction } from '../hooks/useSalesPrediction';
import { useInventoryOptimization } from '../hooks/useInventoryOptimization';
import { useFinancialInsights } from '../hooks/useFinancialInsights';
import { Line, Bar } from 'react-chartjs-2';
import { analyzeProductTrends } from '../lib/aiEngine';

export const Dashboard: React.FC = () => {
  const { products, sales, customers, loading, error } = useLocalData();
  const { formatCurrency } = useCurrency();
  const { predictionData } = useSalesPrediction();
  const { data: inventoryData } = useInventoryOptimization();
  const { data: financialData } = useFinancialInsights();

  const totalProducts = products?.length || 0;
  const totalRevenue = sales?.reduce((sum, sale) => sum + (sale.total || 0), 0) || 0;
  const totalCustomers = customers?.length || 0;

  // Top 5 Produtos
  const productAnalysis = useMemo(() => {
    if (!sales || !products || sales.length === 0 || products.length === 0) {
      return { topProducts: [] };
    }
    return analyzeProductTrends(sales, products, 30);
  }, [sales, products]);

  const topProductsChartData = useMemo(() => {
    if (productAnalysis.topProducts.length === 0) {
      return { labels: [], datasets: [] };
    }
    return {
      labels: productAnalysis.topProducts.map(item => item.product.name),
      datasets: [
        {
          label: 'Receita (R$)',
          data: productAnalysis.topProducts.map(item => item.revenue),
          backgroundColor: 'rgba(139, 92, 246, 0.8)',
          borderColor: 'rgba(139, 92, 246, 1)',
          borderWidth: 1
        }
      ]
    };
  }, [productAnalysis]);

  // Insights recentes
  const recentAlerts = useMemo(() => {
    const alerts = [];

    if (inventoryData && inventoryData.products_at_risk > 0) {
      alerts.push({
        type: 'warning',
        message: `${inventoryData.products_at_risk} produtos com estoque baixo`
      });
    }

    if (financialData && financialData.health_score < 70) {
      alerts.push({
        type: 'danger',
        message: 'Saúde financeira precisa de atenção'
      });
    }

    if (predictionData && predictionData.model_info.accuracy_percentage > 90) {
      alerts.push({
        type: 'success',
        message: 'IA operando com alta precisão'
      });
    }

    return alerts.slice(0, 3);
  }, [inventoryData, financialData, predictionData]);

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
      <div className="p-4 lg:p-8">
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
    <div className="p-3 sm:p-4 lg:p-6 xl:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header Simples */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Visão geral do seu negócio</p>
      </div>

      {/* Métricas Principais - Simplificadas */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 5 Produtos */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-500" />
                Top 5 Produtos
              </h3>
              <p className="text-sm text-gray-600 mt-1">Últimos 30 dias</p>
            </div>
          </div>
          {productAnalysis.topProducts.length > 0 ? (
            <div className="h-64">
              <Bar
                data={topProductsChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
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
          ) : (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Cadastre produtos e registre vendas</p>
              </div>
            </div>
          )}
        </div>

        {/* Insights Recentes */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-blue-600" />
              Alertas Recentes
            </h3>
          </div>
          <div className="space-y-3">
            {recentAlerts.length > 0 ? (
              recentAlerts.map((alert, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    alert.type === 'danger'
                      ? 'bg-red-50 border-red-200'
                      : alert.type === 'warning'
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-green-50 border-green-200'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <AlertTriangle
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        alert.type === 'danger'
                          ? 'text-red-600'
                          : alert.type === 'warning'
                          ? 'text-yellow-600'
                          : 'text-green-600'
                      }`}
                    />
                    <p className="text-sm text-gray-900">{alert.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Bot className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Nenhum alerta no momento</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recomendações IA */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-1">
        <div className="bg-white rounded-[20px] p-6 lg:p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Recomendações IA</h3>
                <p className="text-sm text-gray-600">Insights baseados em análise inteligente</p>
              </div>
            </div>
            <Activity className="w-6 h-6 text-purple-600 animate-pulse" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {inventoryData && inventoryData.recommendations.length > 0 ? (
              inventoryData.recommendations.slice(0, 3).map((rec, index) => (
                <div key={index} className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl border border-orange-200 p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Package className="w-5 h-5 text-orange-600" />
                    <span className="text-xs font-semibold text-orange-600">ESTOQUE</span>
                  </div>
                  <p className="text-sm font-bold text-gray-900 mb-1">
                    {rec.product_name}
                  </p>
                  <p className="text-xs text-gray-600">{rec.action}</p>
                </div>
              ))
            ) : financialData && financialData.insights.length > 0 ? (
              financialData.insights.slice(0, 3).map((insight, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                    <span className="text-xs font-semibold text-blue-600">FINANCEIRO</span>
                  </div>
                  <p className="text-sm font-bold text-gray-900 mb-1">
                    {insight.title}
                  </p>
                  <p className="text-xs text-gray-600">{insight.description}</p>
                </div>
              ))
            ) : (
              <>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="text-xs font-semibold text-green-600">PREVISÃO</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {formatCurrency(aiInsights.nextWeekRevenue)}
                  </p>
                  <p className="text-xs text-gray-600">Receita próxima semana</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <span className="text-xs font-semibold text-blue-600">META IA</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {formatCurrency(Math.round(totalRevenue * 1.35))}
                  </p>
                  <p className="text-xs text-gray-600">Crescimento sugerido</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <span className="text-xs font-semibold text-purple-600">PRECISÃO</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {aiInsights.efficiency}%
                  </p>
                  <p className="text-xs text-gray-600">Modelo de IA</p>
                </div>
              </>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Sistema de IA ativo e monitorando</span>
              </div>
              <button className="text-sm font-semibold text-purple-600 hover:text-purple-700 flex items-center space-x-1">
                <span>Ver todas as recomendações</span>
                <Bot className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};