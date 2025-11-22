import React, { useState } from 'react';
import {
  ShoppingBag,
  Truck,
  DollarSign,
  Package,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  MoreVertical,
  Clock,
  CheckCircle,
  XCircle,
  Trash2,
  X
} from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { useLocalData } from '../hooks/useLocalData';
import { useCurrency } from '../hooks/useCurrency';
import { PurchaseForm } from '../components/forms/PurchaseForm';
import { supabase } from '../lib/supabase';
import { exportPurchasesToPDF } from '../utils/pdfExport';

export const Compras: React.FC = () => {
  const { purchases, loading, refetch } = useLocalData();
  const { formatCurrency } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [viewingPurchase, setViewingPurchase] = useState<any>(null);
  const [deletingPurchaseId, setDeletingPurchaseId] = useState<string | null>(null);

  const totalPurchases = purchases.length;
  const totalSpent = (purchases || []).reduce((sum, purchase) => sum + (purchase.total || 0), 0);
  const pendingPurchases = (purchases || []).filter(p => p.status === 'pending').length;
  const suppliers = [...new Set((purchases || []).map(p => p.supplier))].length;

  const filteredPurchases = (purchases || []).filter(purchase =>
    (purchase.supplier || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (purchase.products?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'received':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'received':
        return 'Recebido';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeletePurchase = async (purchaseId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta compra? Esta ação não pode ser desfeita.')) {
      return;
    }

    setDeletingPurchaseId(purchaseId);

    try {
      const { error } = await supabase
        .from('purchases')
        .delete()
        .eq('id', purchaseId);

      if (error) throw error;

      alert('Compra excluída com sucesso!');
      refetch();
    } catch (error) {
      console.error('Erro ao excluir compra:', error);
      alert('Erro ao excluir compra. Tente novamente.');
    } finally {
      setDeletingPurchaseId(null);
    }
  };

  if (loading) {
    return (
      <>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>

        <PurchaseForm
          isOpen={showPurchaseForm}
          onClose={() => setShowPurchaseForm(false)}
          onSuccess={() => {
            refetch();
            alert('Compra registrada com sucesso!');
          }}
        />
      </>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Compras</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => exportPurchasesToPDF(purchases || [])}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar PDF
          </button>
          <button 
            onClick={() => setShowPurchaseForm(true)}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Compra
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Compras"
          value={totalPurchases.toString()}
          subtitle="Pedidos realizados"
          icon={ShoppingBag}
          iconColor="text-purple-600"
        />
        <MetricCard
          title="Valor Total"
          value={formatCurrency(totalSpent)}
          subtitle="Gasto em compras"
          icon={DollarSign}
          iconColor="text-green-600"
        />
        <MetricCard
          title="Compras Pendentes"
          value={pendingPurchases.toString()}
          subtitle="Aguardando entrega"
          icon={Clock}
          iconColor="text-yellow-600"
        />
        <MetricCard
          title="Fornecedores Ativos"
          value={suppliers.toString()}
          subtitle="Parceiros comerciais"
          icon={Truck}
          iconColor="text-blue-600"
        />
      </div>

      {/* Purchases Table */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Histórico de Compras</h3>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar compras..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID da Compra
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fornecedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Custo Unitário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPurchases.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{purchase.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {purchase.supplier}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {purchase.products?.name || 'Produto não encontrado'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {purchase.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(purchase.unit_cost || 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(purchase.total || 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(purchase.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(purchase.status)}
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(purchase.status)}`}
                      >
                        {getStatusText(purchase.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setViewingPurchase(purchase)}
                        className="text-blue-600 hover:text-blue-700 transition-colors"
                        title="Visualizar detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePurchase(purchase.id)}
                        disabled={deletingPurchaseId === purchase.id}
                        className="text-red-600 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Excluir compra"
                      >
                        {deletingPurchaseId === purchase.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PurchaseForm
        isOpen={showPurchaseForm}
        onClose={() => setShowPurchaseForm(false)}
        onSuccess={() => {
          refetch();
          alert('Compra registrada com sucesso!');
        }}
      />

      {viewingPurchase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Detalhes da Compra</h2>
              <button
                onClick={() => setViewingPurchase(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Fornecedor</p>
                <p className="text-lg font-semibold text-gray-900">{viewingPurchase.supplier}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Produto</p>
                <p className="text-lg font-semibold text-gray-900">{viewingPurchase.products?.name || 'N/A'}</p>
                <p className="text-sm text-gray-500">SKU: {viewingPurchase.products?.sku || 'N/A'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Quantidade</p>
                  <p className="text-lg font-semibold text-gray-900">{viewingPurchase.quantity} un.</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Custo Unitário</p>
                  <p className="text-lg font-semibold text-gray-900">{formatCurrency(viewingPurchase.unit_cost)}</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-1">Custo Total</p>
                <p className="text-2xl font-bold text-blue-900">{formatCurrency(viewingPurchase.total)}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Data da Compra</p>
                <p className="text-gray-900">
                  {new Date(viewingPurchase.created_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(viewingPurchase.status)}
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                    getStatusColor(viewingPurchase.status)
                  }`}>
                    {getStatusText(viewingPurchase.status)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
              <button
                onClick={() => setViewingPurchase(null)}
                className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};