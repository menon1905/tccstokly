import React, { useState } from 'react';
import {
  Package,
  AlertTriangle,
  DollarSign,
  Plus,
  Search,
  Bot,
  Target,
  Sparkles,
  Trash2,
  Edit,
  Eye
} from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { ProductForm } from '../components/forms/ProductForm';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useCurrency } from '../hooks/useCurrency';
import { exportProductsToPDF } from '../utils/pdfExport';

export const Estoque: React.FC = () => {
  const { products, loading, error, refetch } = useSupabaseData();
  const { formatCurrency } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [viewingProduct, setViewingProduct] = useState<any>(null);

  const totalProducts = products?.length || 0;
  const lowStockProducts = (products || []).filter(p => p.stock <= p.min_stock).length;
  const totalValue = (products || []).reduce((sum, product) => sum + (product.price * product.stock), 0);

  // IA Predictions
  const aiPredictions = {
    reorderSuggestions: 3,
    costSavings: 2500,
    efficiency: 91
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`Tem certeza que deseja excluir o produto "${productName}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    setDeletingProductId(productId);

    try {
      if (!isSupabaseConfigured()) {
        alert('Sistema não configurado. Entre em contato com o suporte.');
        return;
      }

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      alert('Produto excluído com sucesso!');
      refetch();
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      if (error instanceof Error) {
        if (error.message.includes('foreign key constraint')) {
          alert('Não é possível excluir este produto pois ele possui vendas ou compras associadas.');
        } else {
          alert(`Erro ao excluir produto: ${error.message}`);
        }
      } else {
        alert('Erro ao excluir produto. Tente novamente.');
      }
    } finally {
      setDeletingProductId(null);
    }
  };
  const filteredProducts = (products || []).filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Estoque</h1>
          <p className="text-gray-600 mt-1">Controle inteligente de inventário</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => exportProductsToPDF(products || [])}
            className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Exportar PDF
          </button>
          <button
            onClick={() => setShowProductForm(true)}
            className="flex items-center px-6 py-2 text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Produto
          </button>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Produtos"
          value={totalProducts.toString()}
          icon={Package}
          iconColor="text-purple-600"
        />
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-600">Alerta IA</span>
            </div>
            <Bot className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {lowStockProducts}
          </p>
          <p className="text-sm text-gray-600">Produtos em falta</p>
        </div>
        <MetricCard
          title="Valor Total"
          value={`R$ ${totalValue.toLocaleString('pt-BR')}`}
          icon={DollarSign}
          iconColor="text-green-600"
        />
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Otimização IA</span>
            </div>
            <Sparkles className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            R$ {aiPredictions.costSavings.toLocaleString('pt-BR')}
          </p>
          <p className="text-sm text-gray-600">Economia potencial</p>
        </div>
      </div>

      {/* Lista de Produtos */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Produtos</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum produto cadastrado</h3>
            <p className="text-gray-600 mb-6">
              Comece adicionando seus primeiros produtos ao estoque.
            </p>
            <button 
              onClick={() => setShowProductForm(true)}
              className="flex items-center mx-auto px-6 py-3 text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Produto
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                    <p className="text-sm text-gray-600">{product.sku}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Estoque</p>
                    <p className={`font-semibold ${product.stock <= product.min_stock ? 'text-red-600' : 'text-gray-900'}`}>
                      {product.stock}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Preço</p>
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(product.price)}
                    </p>
                  </div>
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      product.stock <= product.min_stock
                        ? 'bg-red-100 text-red-800'
                        : product.stock <= product.min_stock * 2
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {product.stock <= product.min_stock
                      ? 'Baixo'
                      : product.stock <= product.min_stock * 2
                      ? 'Médio'
                      : 'Normal'}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewingProduct(product)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Visualizar detalhes"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setShowProductForm(true);
                      }}
                      className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="Editar produto"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id, product.name)}
                      disabled={deletingProductId === product.id}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Excluir produto"
                    >
                      {deletingProductId === product.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ProductForm
        isOpen={showProductForm}
        onClose={() => {
          setShowProductForm(false);
          setEditingProduct(null);
        }}
        onSuccess={() => {
          refetch();
          setEditingProduct(null);
          alert(editingProduct ? 'Produto atualizado com sucesso!' : 'Produto adicionado com sucesso!');
        }}
        product={editingProduct}
      />

      {viewingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Detalhes do Produto</h2>
              <button
                onClick={() => setViewingProduct(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-gray-500 text-2xl">&times;</span>
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Nome</p>
                  <p className="text-lg font-semibold text-gray-900">{viewingProduct.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">SKU</p>
                  <p className="text-lg font-semibold text-gray-900">{viewingProduct.sku}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Categoria</p>
                  <p className="text-lg font-semibold text-gray-900">{viewingProduct.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Fornecedor</p>
                  <p className="text-lg font-semibold text-gray-900">{viewingProduct.supplier}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Preço de Venda</p>
                  <p className="text-lg font-semibold text-green-600">{formatCurrency(viewingProduct.price)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Custo</p>
                  <p className="text-lg font-semibold text-gray-900">{formatCurrency(viewingProduct.cost)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Estoque Atual</p>
                  <p className={`text-lg font-semibold ${
                    viewingProduct.stock <= viewingProduct.min_stock ? 'text-red-600' : 'text-gray-900'
                  }`}>
                    {viewingProduct.stock} unidades
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Estoque Mínimo</p>
                  <p className="text-lg font-semibold text-gray-900">{viewingProduct.min_stock} unidades</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Margem de Lucro</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {((viewingProduct.price - viewingProduct.cost) / viewingProduct.cost * 100).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Valor Total em Estoque</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(viewingProduct.price * viewingProduct.stock)}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Cadastrado em</p>
                <p className="text-gray-900">
                  {new Date(viewingProduct.created_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
              <button
                onClick={() => setViewingProduct(null)}
                className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  setEditingProduct(viewingProduct);
                  setViewingProduct(null);
                  setShowProductForm(true);
                }}
                className="flex items-center px-6 py-3 text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar Produto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};