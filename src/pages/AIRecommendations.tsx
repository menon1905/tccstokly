import React, { useMemo } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Package,
  Bot,
  Star,
  ShoppingCart,
  Plus,
  ChevronRight
} from 'lucide-react';
import { useLocalData } from '../hooks/useSupabaseData';
import { useCurrency } from '../hooks/useCurrency';
import { analyzeProductTrends, generatePredictiveInsights } from '../lib/aiEngine';
import { Bar } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';

export const AIRecommendations: React.FC = () => {
  const { products, sales, customers, loading } = useLocalData();
  const { formatCurrency } = useCurrency();
  const navigate = useNavigate();

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

  const hasProducts = products && products.length > 0;
  const hasSales = sales && sales.length > 0;

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

  const showNoProductsCard = !hasProducts;
  const showNoSalesCard = hasProducts && !hasSales;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Recomendações IA</h1>
          <p className="text-gray-600 mt-1">Análises baseadas nos seus dados</p>
        </div>
        <Bot className="w-10 h-10 text-blue-600" />
      </div>

      {showNoProductsCard && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-8 text-center">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Cadastre Seus Primeiros Produtos</h2>
          <p className="text-gray-700 mb-6">
            Para receber recomendações baseadas em IA, comece cadastrando os produtos do seu estoque.
          </p>
          <button
            onClick={() => navigate('/estoque')}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            Cadastrar Primeiro Produto
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      )}

      {showNoSalesCard && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-8 text-center">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Ótimo! Agora Registre Suas Vendas</h2>
          <p className="text-gray-700 mb-2">
            Você tem <span className="font-bold text-green-700">{products?.length || 0} produto(s)</span> cadastrado(s).
          </p>
          <p className="text-gray-700 mb-6">
            Para gerar análises e recomendações inteligentes, registre suas vendas no sistema.
          </p>
          <button
            onClick={() => navigate('/vendas')}
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold shadow-lg hover:shadow-xl"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Registrar Primeira Venda
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      )}

      {productAnalysis.topProducts.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
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
              <div key={item.product.id} className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-blue-600">#{index + 1}</span>
                  <span className="text-sm text-gray-600">{item.sales} vendas</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 truncate">{item.product.name}</h3>
                <p className="text-lg font-bold text-green-600">{formatCurrency(item.revenue)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {productAnalysis.growingProducts.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
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
                <h3 className="font-semibold text-gray-900 mb-1 truncate">{item.product.name}</h3>
                <p className="text-sm text-gray-600">Crescimento significativo nas vendas</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {predictiveInsights.stockAlerts.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-bold text-gray-900">Alertas de Estoque</h2>
          </div>
          <div className="space-y-3">
            {predictiveInsights.stockAlerts.map((item) => (
              <div key={item.product.id} className="bg-red-50 rounded-lg p-4 border border-red-200 flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.product.name}</h3>
                  <p className="text-sm text-gray-600">
                    Estoque atual: {item.product.stock} unidades
                  </p>
                </div>
                <div className="text-right ml-4">
                  <div className="text-sm text-gray-600">Previsão</div>
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
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <Package className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Sugestões de Reposição</h2>
          </div>
          <div className="space-y-3">
            {predictiveInsights.reorderSuggestions.map((item) => (
              <div key={item.product.id} className="bg-blue-50 rounded-lg p-4 border border-blue-200 flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.product.name}</h3>
                  <p className="text-sm text-gray-600">
                    Mínimo: {item.product.min_stock} | Atual: {item.product.stock}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <div className="text-sm text-gray-600">Sugerido</div>
                  <div className="text-lg font-bold text-blue-600">{item.suggestedQuantity} un.</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {productAnalysis.topProducts.length === 0 &&
       productAnalysis.growingProducts.length === 0 &&
       predictiveInsights.stockAlerts.length === 0 &&
       predictiveInsights.reorderSuggestions.length === 0 && (
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-12 text-center">
          <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Ainda não há dados suficientes
          </h2>
          <p className="text-gray-600">
            Continue registrando vendas para gerar análises e recomendações mais completas.
          </p>
        </div>
      )}
    </div>
  );
};
