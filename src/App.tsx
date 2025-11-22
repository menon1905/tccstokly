import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { DataProvider } from './contexts/DataContext';
import { Dashboard } from './pages/Dashboard';
import { Estoque } from './pages/Estoque';
import { Vendas } from './pages/Vendas';
import { Compras } from './pages/Compras';
import { CRM } from './pages/CRM';
import { Financeiro } from './pages/Financeiro';
import { Relatorios } from './pages/Relatorios';
import { AIAssistant } from './pages/AIAssistant';
import { AIRecommendations } from './pages/AIRecommendations';
import { Comunidade } from './pages/Comunidade';
import { Ajuda } from './pages/Ajuda';
import { RH } from './pages/RH';
import { Configuracoes } from './pages/Configuracoes';

function App() {
  return (
    <DataProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/ai-recommendations" element={<AIRecommendations />} />
            <Route path="/estoque" element={<Estoque />} />
            <Route path="/vendas" element={<Vendas />} />
            <Route path="/compras" element={<Compras />} />
            <Route path="/financeiro" element={<Financeiro />} />
            <Route path="/rh" element={<RH />} />
            <Route path="/crm" element={<CRM />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
            <Route path="/comunidade" element={<Comunidade />} />
            <Route path="/ajuda" element={<Ajuda />} />
          </Routes>
        </Layout>
      </Router>
    </DataProvider>
  );
}

export default App;
