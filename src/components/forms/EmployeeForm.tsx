import React, { useState } from 'react';
import { X, Users, Save } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';

interface EmployeeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  employee?: any;
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({ isOpen, onClose, onSuccess, employee }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    salary: '',
    hire_date: new Date().toISOString().split('T')[0],
    address: '',
    birth_date: '',
    document_number: ''
  });

  // Preencher formulário quando editando
  React.useEffect(() => {
    if (employee && isOpen) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        position: employee.position || '',
        department: employee.department || '',
        salary: employee.salary?.toString() || '',
        hire_date: employee.hire_date ? employee.hire_date.split('T')[0] : new Date().toISOString().split('T')[0],
        address: employee.address || '',
        birth_date: employee.birth_date ? employee.birth_date.split('T')[0] : '',
        document_number: employee.document_number || ''
      });
    } else if (!employee && isOpen) {
      // Reset form for new employee
      setFormData({
        name: '',
        email: '',
        phone: '',
        position: '',
        department: '',
        salary: '',
        hire_date: new Date().toISOString().split('T')[0],
        address: '',
        birth_date: '',
        document_number: ''
      });
    }
  }, [employee, isOpen]);

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
        alert('Você precisa estar logado para adicionar funcionários.');
        setLoading(false);
        return;
      }

      const employeeData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          position: formData.position,
          department: formData.department,
          salary: parseFloat(formData.salary),
          hire_date: formData.hire_date,
          address: formData.address,
          birth_date: formData.birth_date || null,
          document_number: formData.document_number,
          status: 'active',
      };

      let error;
      if (employee) {
        // Update existing employee
        const result = await supabase
          .from('employees')
          .update(employeeData)
          .eq('id', employee.id);
        error = result.error;
      } else {
        // Insert new employee
        const result = await supabase
          .from('employees')
          .insert([{ ...employeeData, user_id: user.id }]);
        error = result.error;
      }

      if (error) throw error;

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        position: '',
        department: '',
        salary: '',
        hire_date: new Date().toISOString().split('T')[0],
        address: '',
        birth_date: '',
        document_number: ''
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao adicionar funcionário:', error);
      if (error instanceof Error) {
        if (error.message.includes('duplicate key value violates unique constraint')) {
          alert('Erro: O email informado já está cadastrado.');
        } else {
          alert(`Erro ao adicionar funcionário: ${error.message}`);
        }
      } else {
        alert('Erro ao adicionar funcionário. Verifique sua conexão e tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Novo Funcionário</h2>
            <h2 className="text-2xl font-bold text-gray-900">
              {employee ? 'Editar Funcionário' : 'Novo Funcionário'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: João Silva Santos"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="joao@empresa.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CPF/Documento
              </label>
              <input
                type="text"
                name="document_number"
                value={formData.document_number}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="000.000.000-00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cargo *
              </label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Desenvolvedor Frontend"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departamento *
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione um departamento</option>
                <option value="Tecnologia">Tecnologia</option>
                <option value="Vendas">Vendas</option>
                <option value="Marketing">Marketing</option>
                <option value="Financeiro">Financeiro</option>
                <option value="Recursos Humanos">Recursos Humanos</option>
                <option value="Operações">Operações</option>
                <option value="Atendimento">Atendimento</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salário *
              </label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Admissão *
              </label>
              <input
                type="date"
                name="hire_date"
                value={formData.hire_date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Nascimento
              </label>
              <input
                type="date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Endereço
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Rua, número, bairro, cidade - UF"
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
              className="flex items-center px-6 py-3 text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {loading ? 'Salvando...' : (employee ? 'Atualizar Funcionário' : 'Salvar Funcionário')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};