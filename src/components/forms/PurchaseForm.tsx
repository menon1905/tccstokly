import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useLocalData } from '../../hooks/useSupabaseData';

interface PurchaseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PurchaseForm: React.FC<PurchaseFormProps> = ({ isOpen, onClose, onSuccess }) => {
  const { products, addPurchase } = useLocalData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    product_id: '',
    supplier: '',
    quantity: 1,
    unit_cost: 0,
    total: 0,
    status: 'received'
  });

  useEffect(() => {
    if (formData.product_id && products) {
      const product = products.find(p => p.id === formData.product_id);
      if (product) {
        const unitCost = product.cost || 0;
        const supplier = product.supplier || '';
        const total = unitCost * formData.quantity;
        setFormData(prev => ({
          ...prev,
          unit_cost: unitCost,
          supplier: supplier,
          total: total
        }));
      }
    }
  }, [formData.product_id, formData.quantity, products]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.product_id) {
        throw new Error('Selecione um produto');
      }

      if (!formData.supplier.trim()) {
        throw new Error('Informe o fornecedor');
      }

      await addPurchase({
        product_id: formData.product_id,
        supplier: formData.supplier,
        quantity: formData.quantity,
        unit_cost: formData.unit_cost,
        total: formData.total,
        status: formData.status
      });

      setFormData({
        product_id: '',
        supplier: '',
        quantity: 1,
        unit_cost: 0,
        total: 0,
        status: 'received'
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error creating purchase:', err);
      setError(err instanceof Error ? err.message : 'Erro ao criar compra');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Nova Compra</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Produto *
              </label>
              <select
                value={formData.product_id}
                onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="">Selecione um produto</option>
                {products?.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - Custo: R$ {product.cost?.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fornecedor *
              </label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Nome do fornecedor"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custo Unitário
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.unit_cost}
                  onChange={(e) => {
                    const unitCost = parseFloat(e.target.value) || 0;
                    setFormData({
                      ...formData,
                      unit_cost: unitCost,
                      total: unitCost * formData.quantity
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.total}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-bold text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="received">Recebida</option>
                <option value="pending">Pendente</option>
                <option value="cancelled">Cancelada</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Registrar Compra'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
