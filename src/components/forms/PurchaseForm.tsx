import React from 'react';
import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import {
  BarChart3,
  Bot,
  Package,
  ShoppingCart,
  ShoppingBag,
  DollarSign,
  Users,
  Users2,
  FileText,
  Settings,
  HelpCircle,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  onClose?: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { name: 'Assistente IA', href: '/ai-assistant', icon: Bot, badge: 'AI-Powered' },
  { name: 'Recomendações IA', href: '/ai-recommendations', icon: Sparkles },
  { name: 'Estoque', href: '/estoque', icon: Package },
  { name: 'Vendas', href: '/vendas', icon: ShoppingCart },
  { name: 'Compras', href: '/compras', icon: ShoppingBag },
  { name: 'Financeiro', href: '/financeiro', icon: DollarSign },
  { name: 'RH', href: '/rh', icon: Users },
  { name: 'CRM', href: '/crm', icon: Users2 },
  { name: 'Relatórios', href: '/relatorios', icon: FileText },
  { name: 'Configurações', href: '/configuracoes', icon: Settings },
];

const support = [
  { name: 'Comunidade', href: '/comunidade', icon: MessageSquare },
  { name: 'Ajuda & Suporte', href: '/ajuda', icon: HelpCircle },
];

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 h-screen">
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        {/* Close button for mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors mr-3"
          >
            <X className="w-5 h-5" />
          </button>
      // Mock success for Bolt v2 migration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Mock purchase created:', {
        product_id: formData.product_id,
        quantity: parseInt(formData.quantity),
        unit_cost: parseFloat(formData.unit_cost),
        supplier: formData.supplier,
        status: 'pending',
      });
          <NavLink
            key={item.name}
            to={item.href}
            onClick={onClose}
            className={({ isActive }) =>
              `group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon
              className="flex-shrink-0 w-5 h-5 mr-3"
              aria-hidden="true"
            />
            <span className="flex-1">{item.name}</span>
            {item.badge && (
              <span className="ml-2 px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}

        <div className="pt-6 mt-6 border-t border-gray-200">
          <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            SUPORTE
          </p>
          <div className="mt-2 space-y-1">
            {support.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  `group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon
                  className="flex-shrink-0 w-5 h-5 mr-3"
                  aria-hidden="true"
                />
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};