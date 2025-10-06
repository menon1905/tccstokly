import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { AIPanel } from './AIPanel';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);
  const closeAiPanel = () => setAiPanelOpen(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={closeSidebar}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar onClose={closeSidebar} />
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          onAIPanelClick={() => setAiPanelOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      
      {/* AI Panel */}
      <div className={`
        fixed inset-y-0 right-0 z-50 transform transition-transform duration-300 ease-in-out xl:translate-x-0 xl:static xl:inset-0
        ${aiPanelOpen ? 'translate-x-0' : 'translate-x-full xl:translate-x-0'}
      `}>
        <AIPanel onClose={closeAiPanel} />
      </div>
      
      {/* AI Panel mobile overlay */}
      {aiPanelOpen && (
        <div
          className="fixed inset-0 z-40 xl:hidden"
          onClick={closeAiPanel}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
      )}
    </div>
  );
};