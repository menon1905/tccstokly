import React, { useState } from 'react';
import { Package, PackagePlus, Search, MoreVertical, CreditCard as Edit, Trash2, Bot, AlertTriangle, TrendingUp } from 'lucide-react';
import { useLocalData } from '../hooks/useLocalData';
import { ProductForm } from '../components/forms/ProductForm';
import { useCurrency } from '../hooks/useCurrency';
import { useInventoryOptimization } from '../hooks/useInventoryOptimization';

export const Estoque: React.FC = () => {
  const { products, loading, error, addProduct, updateProduct, deleteProduct } = useLocalData();
  const { formatCurrency } = useCurrency();
  const { data: aiData, loading: aiLoading } = useInventoryOptimization();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = async (productData: any) => {
    await addProduct(productData);
    setShowForm(false);
  };

  const handleUpdateProduct = async (productData: any) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, productData);
      setEditingProduct(null);
      setShowForm(false);
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setShowForm(true);
    setActiveDropdown(null);
  };

  const handleDelete = async (productId: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      await deleteProduct(productId);
      setActiveDropdown(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-600">Carregando produtos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-600">Erro: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Estoque</h1>
          <p className="text-gray-600 mt-1">Gerencie seus produtos com inteligência artificial</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <PackagePlus className="w-5 h-5 mr-2" />
          Novo Produto
        </button>
      </div>

      {aiData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Bot className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">Score IA</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {aiData.optimization_score}%
            </p>
            <p className="text-sm text-gray-600">Otimização de estoque</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl border border-orange-100 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-600">Produtos em Risco</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {aiData.products_at_risk + aiData.products_below_min}
            </p>
            <p className="text-sm text-gray-600">Necessitam atenção</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-600">Valor em Risco</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {formatCurrency(aiData.total_value_at_risk)}
            </p>
            <p className="text-sm text-gray-600">Para reposição</p>
          </div>
        </div>
      )}

      {aiData && aiData.recommendations.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Bot className="w-5 h-5 mr-2 text-purple-600" />
            Recomendações IA
          </h3>
          <div className="space-y-3">
            {aiData.recommendations.slice(0, 5).map((rec) => (
              <div
                key={rec.product_id}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  rec.priority === 'high'
                    ? 'bg-red-50 border border-red-200'
                    : 'bg-yellow-50 border border-yellow-200'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      rec.priority === 'high'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {rec.priority === 'high' ? 'URGENTE' : 'ATENÇÃO'}
                    </span>
                    <span className="font-medium text-gray-900">{rec.product_name}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{rec.reason}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Estoque atual: {rec.current_stock} un. | Mínimo: {rec.min_stock} un.
                    {rec.avg_daily_sales > 0 && ` | Média vendas: ${rec.avg_daily_sales.toFixed(1)} un/dia`}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-sm font-medium text-gray-900">Repor:</p>
                  <p className="text-2xl font-bold text-purple-600">{rec.recommended_order}</p>
                  <p className="text-xs text-gray-500">unidades</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estoque
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    {searchTerm ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.sku}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.stock > product.min_stock
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock} un.
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCurrency(product.price || 0)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === product.id ? null : product.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      {activeDropdown === product.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                          <button
                            onClick={() => handleEdit(product)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <ProductForm
              product={editingProduct}
              onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
              onCancel={() => {
                setShowForm(false);
                setEditingProduct(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
