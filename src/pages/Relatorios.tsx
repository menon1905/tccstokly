import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  Calendar,
  Filter,
  TrendingUp,
  BarChart3,
  PieChart,
  Users,
  Package,
  DollarSign
} from 'lucide-react';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { useCurrency } from '../hooks/useCurrency';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { exportFinancialReportToPDF, exportSalesToPDF, exportProductsToPDF, exportCustomersToPDF } from '../utils/pdfExport';

export const Relatorios: React.FC = () => {
  const { products, sales, customers, purchases, loading } = useSupabaseData();
  const { formatCurrency } = useCurrency();
  const [selectedReport, setSelectedReport] = useState('sales');
  const [dateRange, setDateRange] = useState('month');

  const reports = [
    {
      id: 'sales',
      name: 'Relatório de Vendas',
      description: 'Análise completa das vendas por período',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      id: 'inventory',
      name: 'Relatório de Estoque',
      description: 'Status do inventário e movimentações',
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      id: 'customers',
      name: 'Relatório de Clientes',
      description: 'Análise do comportamento dos clientes',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'financial',
      name: 'Relatório Financeiro',
      description: 'Receitas, despesas e lucratividade',
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  // Sales Report Data
  const salesReportData = {
    labels: (sales || []).length > 0 ? (sales || []).map((_, index) => `Venda ${index + 1}`) : ['Sem Dados'],
    datasets: [
      {
        label: 'Vendas (Unidades)',
        data: (sales || []).length > 0 ? (sales || []).map(sale => sale.quantity || 0) : [0],
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Customer Segmentation
  const customerSegmentData = {
    labels: ['Novos Clientes', 'Clientes Recorrentes', 'Clientes VIP'],
    datasets: [
      {
        data: (customers || []).length > 0 ? [(customers || []).length, 0, 0] : [0, 0, 0],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  // Product Performance
  const productPerformanceData = {
    labels: (products || []).length > 0 ? (products || []).slice(0, 5).map(p => p.name) : ['Sem Produtos'],
    datasets: [
      {
        label: 'Vendas por Produto',
        data: (products || []).length > 0 ? (products || []).slice(0, 5).map(product => {
          // Calcular vendas reais para cada produto
          const productSales = (sales || []).filter(sale => sale.product_id === product.id);
          return productSales.reduce((sum, sale) => sum + (sale.quantity || 0), 0);
        }) : [0],
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'sales':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Total de Vendas</h4>
                <p className="text-2xl font-bold text-green-600">{(sales || []).length}</p>
                <p className="text-sm text-gray-600">Este período</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Receita Total</h4>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency((sales || []).reduce((sum, sale) => sum + (sale.total || 0), 0))}
                </p>
                <p className="text-sm text-gray-600">Este período</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Ticket Médio</h4>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency((sales || []).length > 0 ? 
                    (sales || []).reduce((sum, sale) => sum + (sale.total || 0), 0) / (sales || []).length : 0)}
                </p>
                <p className="text-sm text-gray-600">Por venda</p>
              </div>
            </div>
            <div className="bg-white rounded-lg border p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Vendas por Período</h4>
              <Bar data={salesReportData} options={chartOptions} />
            </div>
          </div>
        );
      
      case 'inventory':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Total de Produtos</h4>
                <p className="text-2xl font-bold text-purple-600">{(products || []).length}</p>
                <p className="text-sm text-gray-600">Cadastrados</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Valor do Estoque</h4>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency((products || []).reduce((sum, product) => sum + ((product.price || 0) * (product.stock || 0)), 0))}
                </p>
                <p className="text-sm text-gray-600">Total em produtos</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Produtos em Falta</h4>
                <p className="text-2xl font-bold text-red-600">
                  {(products || []).filter(p => (p.stock || 0) <= (p.min_stock || 0)).length}
                </p>
                <p className="text-sm text-gray-600">Precisam reposição</p>
              </div>
            </div>
            <div className="bg-white rounded-lg border p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Performance dos Produtos</h4>
              <Line data={productPerformanceData} options={chartOptions} />
            </div>
          </div>
        );
      
      case 'customers':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Total de Clientes</h4>
                <p className="text-2xl font-bold text-blue-600">{(customers || []).length}</p>
                <p className="text-sm text-gray-600">Base ativa</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Novos Clientes</h4>
                <p className="text-2xl font-bold text-blue-600">
                  {(customers || []).filter(c => {
                    const createdDate = new Date(c.created_at);
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    return createdDate >= thirtyDaysAgo;
                  }).length}
                </p>
                <p className="text-sm text-gray-600">Este mês</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Valor Médio por Cliente</h4>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency((customers || []).length > 0 ? 
                    (customers || []).reduce((sum, customer) => sum + (customer.total_purchases || 0), 0) / (customers || []).length : 0)}
                </p>
                <p className="text-sm text-gray-600">Lifetime value</p>
              </div>
            </div>
            <div className="bg-white rounded-lg border p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Segmentação de Clientes</h4>
              <div className="flex justify-center">
                <div className="w-64 h-64">
                  <Doughnut data={customerSegmentData} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom' as const,
                      },
                    },
                  }} />
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'financial':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Receita Total</h4>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency((sales || []).reduce((sum, sale) => sum + (sale.total || 0), 0))}
                </p>
                <p className="text-sm text-gray-600">Este período</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Despesas</h4>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency((purchases || []).reduce((sum, purchase) => sum + (purchase.total || 0), 0))}
                </p>
                <p className="text-sm text-gray-600">Este período</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Lucro Líquido</h4>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(
                    (sales || []).reduce((sum, sale) => sum + (sale.total || 0), 0) - 
                    (purchases || []).reduce((sum, purchase) => sum + (purchase.total || 0), 0)
                  )}
                </p>
                <p className="text-sm text-gray-600">Receita - Despesas</p>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="week">Esta Semana</option>
            <option value="month">Este Mês</option>
            <option value="quarter">Este Trimestre</option>
            <option value="year">Este Ano</option>
          </select>
          <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Filtros Avançados
          </button>
          <button
            onClick={() => {
              if (selectedReport === 'sales') {
                exportSalesToPDF(sales || []);
              } else if (selectedReport === 'inventory') {
                exportProductsToPDF(products || []);
              } else if (selectedReport === 'customers') {
                exportCustomersToPDF(customers || []);
              } else if (selectedReport === 'financial') {
                exportFinancialReportToPDF({ sales: sales || [], purchases: purchases || [] });
              }
            }}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Report Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tipos de Relatório</h3>
            <div className="space-y-2">
              {reports.map((report) => (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  className={`w-full flex items-start space-x-3 p-3 rounded-lg transition-colors text-left ${
                    selectedReport === report.id
                      ? 'bg-purple-50 border border-purple-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${report.bgColor}`}>
                    <report.icon className={`w-4 h-4 ${report.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{report.name}</h4>
                    <p className="text-xs text-gray-600 mt-1">{report.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {reports.find(r => r.id === selectedReport)?.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Período: {dateRange === 'week' ? 'Esta Semana' : 
                           dateRange === 'month' ? 'Este Mês' :
                           dateRange === 'quarter' ? 'Este Trimestre' : 'Este Ano'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  <Eye className="w-4 h-4 mr-2" />
                  Visualizar
                </button>
                <button
                  onClick={() => {
                    if (selectedReport === 'sales') {
                      exportSalesToPDF(sales || []);
                    } else if (selectedReport === 'inventory') {
                      exportProductsToPDF(products || []);
                    } else if (selectedReport === 'customers') {
                      exportCustomersToPDF(customers || []);
                    } else if (selectedReport === 'financial') {
                      exportFinancialReportToPDF({ sales: sales || [], purchases: purchases || [] });
                    }
                  }}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>
              </div>
            </div>

            {renderReportContent()}
          </div>
        </div>
      </div>

      {/* Quick Reports */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Relatórios Rápidos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Top 10 Produtos', description: 'Mais vendidos do mês' },
            { name: 'Clientes Inativos', description: 'Não compraram em 30 dias' },
            { name: 'Produtos em Falta', description: 'Estoque abaixo do mínimo' },
            { name: 'Análise de Margem', description: 'Lucratividade por produto' },
          ].map((quickReport, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <FileText className="w-5 h-5 text-gray-600" />
                <Download className="w-4 h-4 text-gray-400" />
              </div>
              <h4 className="font-medium text-gray-900 text-sm mb-1">{quickReport.name}</h4>
              <p className="text-xs text-gray-600">{quickReport.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};