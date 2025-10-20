import React, { useMemo } from 'react';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Target,
  Lightbulb,
  Package,
  Bot,
  ArrowRight,
  Star,
  Briefcase,
  Calendar,
  Zap
} from 'lucide-react';
import { useLocalData } from '../hooks/useLocalData';
import { useCurrency } from '../hooks/useCurrency';
import { getSectorInsights, analyzeProductTrends, generatePredictiveInsights } from '../lib/aiEngine';
import { auth } from '../lib/auth';
import { Bar } from 'react-chartjs-2';

export const AIRecommendations: React.FC = () => {
  const { products, sales, customers, loading } = useLocalData();
  const { formatCurrency } = useCurrency();

  const userSector = useMemo(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.business_sector || 'general';
      } catch {
        return 'general';
      }
    }
    return 'general';
  }, []);

  const sectorInsights = useMemo(() => getSectorInsights(userSector), [userSector]);

  const productAnalysis = useMemo(() => {
    if (!sales || !products || sales.length === 0 || products.length === 0) {
      return { topProducts: [], growingProducts: [], decliningProducts: [] };
    }
    return analyzeProductTrends(sales, products, 30);
  }, [sales, products]);

  const predictiveInsights = useMemo(() => {
    if (!sales || !products || sales.length === 0 || products.length === 0) {
      return { stockAlerts: [], reorderSuggestions: [] };
    }
    return generatePredictiveInsights(sales, products);
  }, [sales, products]);

  const chartData = useMemo(() => {
    if (productAnalysis.topProducts.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    return {
      labels: productAnalysis.topProducts.map(item => item.product.name),
      datasets: [
        {
          label: 'Receita (R$)',
          data: productAnalysis.topProducts.map(item => item.revenue),
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1
        }
      ]
    };
  }, [productAnalysis]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Analisando seus dados...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 xl:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Recomendações IA</h1>
          <p className="text-gray-600 mt-1">Insights personalizados para {sectorInsights.sectorName}</p>
        </div>
        <Bot className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600" />
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Setor: {sectorInsights.sectorName}</h2>
            <p className="text-gray-700 mb-4">
              Análise especializada baseada nas características do seu ramo de negócio
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/70 rounded-lg p-3">
                <div className="text-sm font-medium text-gray-600 mb-1">Produtos em Alta</div>
                <div className="text-2xl font-bold text-blue-600">{sectorInsights.trendingProducts.length}</div>
              </div>
              <div className="bg-white/70 rounded-lg p-3">
                <div className="text-sm font-medium text-gray-600 mb-1">Recomendações</div>
                <div className="text-2xl font-bold text-green-600">{sectorInsights.recommendations.length}</div>
              </div>
              <div className="bg-white/70 rounded-lg p-3">
                <div className="text-sm font-medium text-gray-600 mb-1">Oportunidades</div>
                <div className="text-2xl font-bold text-purple-600">{sectorInsights.growthOpportunities.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {productAnalysis.topProducts.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Star className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-bold text-gray-900">Top 5 Produtos (Últimos 30 Dias)</h2>
          </div>
          <div className="h-64 mb-6">
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return formatCurrency(Number(value));
                      }
                    }
                  }
                }
              }}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {productAnalysis.topProducts.map((item, index) => (
              <div key={item.product.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-blue-600">#{index + 1}</span>
                  <span className="text-sm text-gray-500">{item.sales} vendas</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.product.name}</h3>
                <p className="text-lg font-bold text-green-600">{formatCurrency(item.revenue)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {productAnalysis.growingProducts.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-900">Produtos em Crescimento</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {productAnalysis.growingProducts.map((item) => (
              <div key={item.product.id} className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-bold text-green-600">+{Math.round(item.growthRate)}%</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.product.name}</h3>
                <p className="text-sm text-gray-600">Crescimento significativo nas vendas</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {predictiveInsights.stockAlerts.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-bold text-gray-900">Alertas de Estoque</h2>
          </div>
          <div className="space-y-3">
            {predictiveInsights.stockAlerts.map((item) => (
              <div key={item.product.id} className="bg-red-50 rounded-lg p-4 border border-red-200 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.product.name}</h3>
                  <p className="text-sm text-gray-600">
                    Estoque atual: {item.product.stock} unidades
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Previsão de esgotamento</div>
                  <div className="text-lg font-bold text-red-600">
                    {item.daysUntilStockout} {item.daysUntilStockout === 1 ? 'dia' : 'dias'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {predictiveInsights.reorderSuggestions.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Package className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Sugestões de Reposição</h2>
          </div>
          <div className="space-y-3">
            {predictiveInsights.reorderSuggestions.map((item) => (
              <div key={item.product.id} className="bg-blue-50 rounded-lg p-4 border border-blue-200 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.product.name}</h3>
                  <p className="text-sm text-gray-600">
                    Estoque mínimo: {item.product.min_stock} | Atual: {item.product.stock}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Quantidade sugerida</div>
                  <div className="text-lg font-bold text-blue-600">{item.suggestedQuantity} unidades</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Target className="w-6 h-6 text-purple-600" />
            <h2 className="text-lg font-bold text-gray-900">Produtos em Alta no Setor</h2>
          </div>
          <ul className="space-y-2">
            {sectorInsights.trendingProducts.map((product, index) => (
              <li key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-900">{product}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="w-6 h-6 text-orange-600" />
            <h2 className="text-lg font-bold text-gray-900">Tendências Sazonais</h2>
          </div>
          <ul className="space-y-2">
            {sectorInsights.seasonalTrends.map((trend, index) => (
              <li key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <ArrowRight className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-900 text-sm">{trend}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Lightbulb className="w-6 h-6 text-yellow-600" />
          <h2 className="text-lg font-bold text-gray-900">Recomendações Estratégicas</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sectorInsights.recommendations.map((rec, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="w-6 h-6 bg-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">{index + 1}</span>
              </div>
              <p className="text-gray-900">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Zap className="w-6 h-6 text-green-600" />
          <h2 className="text-lg font-bold text-gray-900">Oportunidades de Crescimento</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sectorInsights.growthOpportunities.map((opp, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-white rounded-lg">
              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <p className="text-gray-900">{opp}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
