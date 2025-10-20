import React from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Lightbulb,
  Package,
  Users,
  DollarSign,
  ShoppingCart,
  Bot,
  ArrowRight,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react';
import { useLocalData } from '../hooks/useLocalData';

export const AIRecommendations: React.FC = () => {
  const { products, sales, customers, loading } = useLocalData();

  // Gerar recomendações baseadas nos dados reais
  const generateRecommendations = () => {
    const recommendations = [];

    // Recomendações de Estoque
    const lowStockProducts = (products || []).filter(p => p.stock <= p.min_stock);
    if (lowStockProducts.length > 0) {
      recommendations.push({
        id: 'low-stock',
        type: 'alert',
        priority: 'high',
        category: 'Estoque',
        title: 'Produtos com Estoque Baixo',
        description: `${lowStockProducts.length} produto(s) precisam de reposição urgente`,
        impact: 'Alto',
        effort: 'Baixo',
        icon: AlertTriangle,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        actions: [
          'Reabastecer produtos em falta',
          'Configurar alertas automáticos',
          'Revisar níveis mínimos de estoque'
        ]
      });
    }

    // Recomendações de Vendas
    if ((sales || []).length > 0) {
      recommendations.push({
        id: 'sales-optimization',
        type: 'optimization',
        priority: 'medium',
        category: 'Vendas',
        title: 'Otimização de Vendas',
        description: 'Identifique oportunidades para aumentar suas vendas',
        impact: 'Alto',
        effort: 'Médio',
        icon: TrendingUp,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        actions: [
          'Focar nos produtos mais vendidos',
          'Criar promoções para produtos parados',
          'Analisar padrões de compra dos clientes'
        ]
      });
    }

    // Recomendações de Clientes
    if ((customers || []).length > 0) {
      recommendations.push({
        id: 'customer-retention',
        type: 'suggestion',
        priority: 'medium',
        category: 'CRM',
        title: 'Retenção de Clientes',
        description: 'Estratégias para manter seus clientes engajados',
        impact: 'Alto',
        effort: 'Médio',
        icon: Users,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        actions: [
          'Implementar programa de fidelidade',
          'Enviar ofertas personalizadas',
          'Acompanhar satisfação do cliente'
        ]
      });
    }

    // Recomendações de Preços
    if ((products || []).length > 0) {
      recommendations.push({
        id: 'pricing-strategy',
        type: 'optimization',
        priority: 'low',
        category: 'Financeiro',
        title: 'Estratégia de Preços',
        description: 'Otimize seus preços para maximizar lucros',
        impact: 'Médio',
        effort: 'Alto',
        icon: DollarSign,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        actions: [
          'Analisar margem de lucro por produto',
          'Comparar preços com concorrentes',
          'Testar diferentes estratégias de preço'
        ]
      });
    }

    // Recomendações padrão se não houver dados
    if (recommendations.length === 0) {
      recommendations.push(
        {
          id: 'add-products',
          type: 'suggestion',
          priority: 'high',
          category: 'Primeiros Passos',
          title: 'Adicione Seus Primeiros Produtos',
          description: 'Comece cadastrando produtos no seu estoque',
          impact: 'Alto',
          effort: 'Baixo',
          icon: Package,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          actions: [
            'Ir para a página de Estoque',
            'Cadastrar produtos principais',
            'Definir preços e margens'
          ]
        },
        {
          id: 'add-customers',
          type: 'suggestion',
          priority: 'medium',
          category: 'Primeiros Passos',
          title: 'Cadastre Seus Clientes',
          description: 'Organize sua base de clientes no CRM',
          impact: 'Médio',
          effort: 'Baixo',
          icon: Users,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          actions: [
            'Ir para a página de CRM',
            'Adicionar informações dos clientes',
            'Segmentar por tipo de cliente'
          ]
        }
      );
    }

    return recommendations;
  };

  const recommendations = generateRecommendations();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return 'Normal';
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Sparkles className="w-8 h-8 text-purple-600 mr-3" />
            Recomendações IA
          </h1>
          <p className="text-gray-600 mt-1">Insights inteligentes para otimizar seu negócio</p>
        </div>
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-purple-600" />
          <span className="text-sm font-medium text-purple-600">STOKLY AI Engine</span>
        </div>
      </div>

      {/* Status da IA */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Sistema IA Ativo</h3>
              <p className="text-sm text-gray-600">Analisando seus dados em tempo real</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-600">Online</span>
            </div>
            <p className="text-xs text-gray-500">{recommendations.length} recomendações ativas</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{recommendations.filter(r => r.priority === 'high').length}</p>
            <p className="text-xs text-gray-600">Alta Prioridade</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{recommendations.filter(r => r.priority === 'medium').length}</p>
            <p className="text-xs text-gray-600">Média Prioridade</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{recommendations.filter(r => r.priority === 'low').length}</p>
            <p className="text-xs text-gray-600">Baixa Prioridade</p>
          </div>
        </div>
      </div>

      {/* Recomendações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recommendations.map((recommendation) => (
          <div key={recommendation.id} className={`bg-white rounded-2xl border ${recommendation.borderColor} p-6 hover:shadow-lg transition-all`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-xl ${recommendation.bgColor}`}>
                  <recommendation.icon className={`w-6 h-6 ${recommendation.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{recommendation.title}</h3>
                  <p className="text-sm text-gray-600">{recommendation.category}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(recommendation.priority)}`}>
                {getPriorityText(recommendation.priority)}
              </span>
            </div>

            <p className="text-gray-700 mb-4">{recommendation.description}</p>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Target className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Impacto: {recommendation.impact}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Esforço: {recommendation.effort}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <h4 className="text-sm font-medium text-gray-900 flex items-center">
                <Lightbulb className="w-4 h-4 text-yellow-500 mr-2" />
                Ações Recomendadas:
              </h4>
              <ul className="space-y-1">
                {recommendation.actions.map((action, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                    {action}
                  </li>
                ))}
              </ul>
            </div>

            <button className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
              <span>Implementar Recomendação</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        ))}
      </div>

      {/* Insights Adicionais */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Star className="w-5 h-5 text-yellow-500 mr-2" />
          Insights Personalizados
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <ShoppingCart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Vendas</h4>
            <p className="text-sm text-gray-600 mt-1">
              {(sales || []).length === 0 
                ? 'Registre suas primeiras vendas para receber insights personalizados'
                : `Analisando ${(sales || []).length} vendas para otimizações`
              }
            </p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <Package className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Estoque</h4>
            <p className="text-sm text-gray-600 mt-1">
              {(products || []).length === 0
                ? 'Adicione produtos para receber recomendações de estoque'
                : `Monitorando ${(products || []).length} produtos em tempo real`
              }
            </p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Clientes</h4>
            <p className="text-sm text-gray-600 mt-1">
              {(customers || []).length === 0
                ? 'Cadastre clientes para insights de relacionamento'
                : `Analisando comportamento de ${(customers || []).length} clientes`
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};