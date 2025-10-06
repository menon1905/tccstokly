import React from 'react';
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { AIPanel } from './AIPanel';
import { Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          onAIPanelClick={() => setAiPanelOpen(!aiPanelOpen)}
        />
        <main className="flex-1 overflow-hidden">
          <div className="flex h-full">
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
            
            {/* AI Panel - Hidden on mobile by default */}
            <div className={`
              ${aiPanelOpen ? 'block' : 'hidden'} lg:block
              fixed lg:static inset-y-0 right-0 z-30 w-80 bg-white border-l border-gray-100
              transform transition-transform duration-300 ease-in-out
            `}>
              <AIPanel onClose={() => setAiPanelOpen(false)} />
            </div>
            
            {/* AI Panel mobile overlay */}
            {aiPanelOpen && (
              <div 
                className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
                onClick={() => setAiPanelOpen(false)}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};