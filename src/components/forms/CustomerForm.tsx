import React, { useState } from 'react';
import { X, Users, Save } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import { formatCPF, validateCPF, formatPhone } from '../../utils/validation';

interface CustomerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  customer?: any;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({ isOpen, onClose, onSuccess, customer }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    company: ''
  });
  const [cpfError, setCpfError] = useState('');

  React.useEffect(() => {
    if (customer && isOpen) {
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        cpf: customer.cpf || '',
        company: customer.company || ''
      });
    } else if (!customer && isOpen) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        cpf: '',
        company: ''
      });
      setCpfError('');
    }
  }, [customer, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!isSupabaseConfigured()) {
        alert('Sistema não configurado. Entre em contato com o suporte.');
        setLoading(false);
        return;
      }

      // Check authentication
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        alert('Você precisa estar logado para adicionar clientes.');
        setLoading(false);
        return;
      }

      if (!validateCPF(formData.cpf)) {
        setCpfError('CPF inválido');
        setLoading(false);
        return;
      }

      const customerData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        cpf: formData.cpf.replace(/\D/g, ''),
        company: formData.company || null,
        status: 'active',
      };

      let error;
      if (customer) {
        // Update existing customer
        const result = await supabase
          .from('customers')
          .update(customerData)
          .eq('id', customer.id);
        error = result.error;
      } else {
        // Insert new customer
        const result = await supabase
          .from('customers')
          .insert([{ ...customerData, user_id: user.id }]);
        error = result.error;
      }

      if (error) throw error;

      setFormData({
        name: '',
        email: '',
        phone: '',
        cpf: '',
        company: ''
      });
      setCpfError('');

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        alert('Erro de conexão: Verifique se o Supabase está configurado corretamente.');
      } else if (error instanceof Error && (error.message.includes('row-level security policy') || error.message.includes('42501'))) {
        alert('Erro de permissão: Configure as políticas RLS no Supabase ou use a chave de serviço.');
      } else {
        alert('Erro ao adicionar cliente. Verifique se o email já não está cadastrado.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'cpf') {
      const formatted = formatCPF(value);
      setFormData(prev => ({ ...prev, cpf: formatted }));
      setCpfError('');
    } else if (name === 'phone') {
      const formatted = formatPhone(value);
      setFormData(prev => ({ ...prev, phone: formatted }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {customer ? 'Editar Cliente' : 'Novo Cliente'}
              </h2>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Novo Cliente</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Ex: João Silva"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="joao@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CPF *
            </label>
            <input
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              required
              maxLength={14}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                cpfError ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="000.000.000-00"
            />
            {cpfError && (
              <p className="text-sm text-red-600 mt-1">{cpfError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefone *
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              maxLength={15}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="(11) 99999-9999"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Empresa (Opcional)
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Nome da empresa"
            />
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-6 py-3 text-white bg-orange-600 rounded-xl hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {loading ? 'Salvando...' : 'Salvar Cliente'}
              {loading ? 'Salvando...' : (customer ? 'Atualizar Cliente' : 'Salvar Cliente')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};