import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { AIPanel } from './AIPanel';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-hidden">
          <div className="flex h-full">
            <div className="flex-1 overflow-y-auto">{children}</div>
            <AIPanel />
          </div>
        </main>
      </div>
    </div>
  );
};