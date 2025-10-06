import React from 'react';
import { Search, User, LogOut, Menu, Bot } from 'lucide-react';
import { useAuth } from './AuthProvider';

interface HeaderProps {
  onMenuClick: () => void;
  onAIPanelClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, onAIPanelClick }) => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    if (confirm('Tem certeza que deseja sair?')) {
      await signOut();
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        {/* Logo for mobile */}
        <div className="lg:hidden flex items-center">
          <span className="text-lg font-bold text-purple-600">STOKLY</span>
        </div>
        
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Pergunte à IA ou busque no sistema..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* AI Panel toggle for mobile */}
          <button
            onClick={onAIPanelClick}
            className="lg:hidden p-2 text-gray-400 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
          >
            <Bot className="w-5 h-5" />
          </button>
          
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {user?.user_metadata?.name || user?.email || 'Usuário'}
            </p>
            <p className="text-xs text-gray-500">
              {user?.email}
            </p>
          </div>
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-2">
            <User className="w-4 h-4 text-white" />
          </div>
          <button
            onClick={handleSignOut}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            title="Sair"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};