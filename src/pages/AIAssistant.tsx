import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign,
  Package,
  Users,
  Sparkles
} from 'lucide-react';
import { useLocalData } from '../hooks/useSupabaseData';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export const AIAssistant: React.FC = () => {
  const { products, sales, customers, loading } = useLocalData();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [hasInitialized, setHasInitialized] = useState(false);

  // Generate personalized welcome message based on user data
  useEffect(() => {
    if (!loading && !hasInitialized) {
      const totalProducts = products?.length || 0;
      const totalSales = sales?.length || 0;
      const totalCustomers = customers?.length || 0;
      
      let welcomeMessage = 'Olá! Sou seu assistente de IA para o STOKLY ERP. ';
      
      if (totalProducts === 0 && totalSales === 0 && totalCustomers === 0) {
        welcomeMessage += 'Vejo que você está começando agora! Posso ajudá-lo a configurar seu sistema, cadastrar produtos, ou responder qualquer dúvida sobre o ERP.';
      } else if (totalProducts > 0 && totalSales === 0) {
        welcomeMessage += `Vejo que você já tem ${totalProducts} produto(s) cadastrado(s). Que tal registrar suas primeiras vendas? Posso ajudá-lo com isso ou analisar seu estoque.`;
      } else if (totalSales > 0) {
        const totalRevenue = sales?.reduce((sum, sale) => sum + (sale.total || 0), 0) || 0;
        welcomeMessage += `Ótimo! Você já tem ${totalSales} venda(s) registrada(s) e ${totalProducts} produto(s). Posso analisar sua performance, sugerir otimizações ou ajudar com relatórios.`;
      } else {
        welcomeMessage += 'Como posso ajudá-lo hoje? Posso analisar suas vendas, sugerir otimizações ou responder perguntas sobre seu negócio.';
      }
      
      setMessages([{
        id: '1',
        type: 'ai',
        content: welcomeMessage,
        timestamp: new Date(),
      }]);
      
      setHasInitialized(true);
    }
  }, [loading, products, sales, customers, hasInitialized]);

  const quickActions = [
    {
      icon: TrendingUp,
      title: 'Analisar Vendas',
      description: 'Obter insights sobre performance de vendas',
      prompt: 'Analise minhas vendas dos últimos 30 dias',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Package,
      title: 'Otimizar Estoque',
      description: 'Sugestões para gerenciamento de inventário',
      prompt: 'Como posso otimizar meu estoque atual?',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: DollarSign,
      title: 'Análise Financeira',
      description: 'Revisar saúde financeira do negócio',
      prompt: 'Faça uma análise da minha situação financeira',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Users,
      title: 'Segmentar Clientes',
      description: 'Identificar oportunidades com clientes',
      prompt: 'Como posso segmentar melhor meus clientes?',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');

    const thinkingMessage: Message = {
      id: 'thinking',
      type: 'ai',
      content: 'Pensando...',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, thinkingMessage]);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: currentInput,
          context: {
            products,
            sales,
            customers,
          },
        }),
      });

      const data = await response.json();

      setMessages(prev => prev.filter(m => m.id !== 'thinking'));

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.response || 'Desculpe, ocorreu um erro ao processar sua mensagem.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      setMessages(prev => prev.filter(m => m.id !== 'thinking'));
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Desculpe, houve um erro ao processar sua mensagem. Tente novamente.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleQuickAction = (prompt: string) => {
    setInputValue(prompt);
  };

  const generateAIResponse_OLD_UNUSED = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Análise de vendas
    if (input.includes('analis') && input.includes('venda')) {
      const totalSales = sales?.length || 0;
      const totalRevenue = sales?.reduce((sum, sale) => sum + (sale.total || 0), 0) || 0;
      
      if (totalSales === 0) {
        return `Para analisar suas vendas, preciso que você registre algumas vendas no sistema primeiro.

📋 **Como começar:**
1. Vá para a página "Vendas"
2. Clique em "Nova Venda"
3. Registre suas vendas dos últimos dias
4. Volte aqui para uma análise completa

Com dados de vendas, posso fornecer insights sobre performance, tendências e oportunidades de crescimento.`;
      }

      const ticketMedio = totalRevenue / totalSales;
      return `📊 **Análise das suas vendas:**

**Números principais:**
• Total de vendas: ${totalSales}
• Receita total: R$ ${totalRevenue.toLocaleString('pt-BR')}
• Ticket médio: R$ ${ticketMedio.toLocaleString('pt-BR')}

**Insights:**
${totalSales < 10 ? '• Aumente a frequência de vendas para melhor análise' : '• Boa frequência de vendas registradas'}
${ticketMedio < 100 ? '• Oportunidade para aumentar ticket médio' : '• Ticket médio está em bom patamar'}

**Recomendações:**
• Identifique seus produtos mais vendidos
• Analise padrões de compra dos clientes
• Considere estratégias para aumentar o ticket médio`;
    }

    // Otimização de estoque
    if (input.includes('otimiz') && input.includes('estoque')) {
      const totalProducts = products?.length || 0;
      const lowStockProducts = (products || []).filter(p => p.stock <= p.min_stock).length;
      
      if (totalProducts === 0) {
        return `Para otimizar seu estoque, primeiro você precisa cadastrar produtos.

📦 **Primeiros passos:**
1. Vá para "Estoque" → "Adicionar Produto"
2. Cadastre seus principais produtos
3. Defina estoque mínimo para cada um
4. Volte aqui para dicas de otimização

Com produtos cadastrados, posso ajudar com estratégias de reposição e controle.`;
      }

      return `📦 **Otimização do seu estoque:**

**Status atual:**
• Total de produtos: ${totalProducts}
• Produtos em falta: ${lowStockProducts}
• ${lowStockProducts > 0 ? '⚠️ Atenção para reposição' : '✅ Níveis adequados'}

**Estratégias de otimização:**
• **Curva ABC**: Classifique produtos por importância
• **Estoque de segurança**: Mantenha reserva para produtos críticos  
• **Giro de estoque**: Monitore produtos parados
• **Previsão de demanda**: Use histórico de vendas

**Ações imediatas:**
${lowStockProducts > 0 ? '• Reabastecer produtos em falta' : '• Revisar níveis mínimos'}
• Analisar produtos com baixo giro
• Configurar alertas automáticos`;
    }

    // Análise financeira
    if (input.includes('financeiro') || input.includes('análise financeira')) {
      const totalRevenue = sales?.reduce((sum, sale) => sum + (sale.total || 0), 0) || 0;
      const totalSales = sales?.length || 0;
      
      if (totalRevenue === 0) {
        return `Para análise financeira, preciso de dados de vendas e custos.

💰 **O que fazer:**
1. Registre suas vendas no sistema
2. Configure custos dos produtos
3. Registre compras de fornecedores
4. Volte para análise completa

Com esses dados, posso calcular margem de lucro, fluxo de caixa e ROI.`;
      }

      return `💰 **Análise financeira:**

**Performance atual:**
• Receita total: R$ ${totalRevenue.toLocaleString('pt-BR')}
• Número de vendas: ${totalSales}
• Ticket médio: R$ ${(totalRevenue / totalSales).toLocaleString('pt-BR')}

**Indicadores importantes:**
• **Margem bruta**: Receita - Custos dos produtos
• **Fluxo de caixa**: Entradas vs Saídas
• **ROI**: Retorno sobre investimento

**Próximos passos:**
• Configure custos para calcular margem real
• Monitore fluxo de caixa diário
• Defina metas financeiras mensais`;
    }

    // Segmentação de clientes
    if (input.includes('segment') && input.includes('cliente')) {
      const totalCustomers = customers?.length || 0;
      
      if (totalCustomers === 0) {
        return `Para segmentar clientes, primeiro cadastre-os no CRM.

👥 **Como começar:**
1. Vá para "CRM" → "Novo Cliente"
2. Cadastre informações básicas
3. Registre histórico de compras
4. Volte para estratégias de segmentação

Com dados de clientes, posso sugerir segmentações por valor, frequência e comportamento.`;
      }

      return `👥 **Segmentação de clientes:**

**Base atual:**
• Total de clientes: ${totalCustomers}
• Clientes ativos: ${(customers || []).filter(c => c.status === 'active').length}

**Critérios de segmentação:**
• **Por valor**: Alto, médio e baixo ticket
• **Por frequência**: Compradores frequentes vs esporádicos  
• **Por recência**: Clientes recentes vs antigos
• **Por comportamento**: Padrões de compra

**Estratégias por segmento:**
• **VIPs**: Atendimento premium, ofertas exclusivas
• **Frequentes**: Programa de fidelidade
• **Novos**: Onboarding e primeira impressão
• **Inativos**: Campanhas de reativação`;
    }

    // Conceitos básicos de negócios
    if (input.includes('o que é') || input.includes('conceito de')) {
      if (input.includes('erp')) {
        return `🏢 **ERP (Enterprise Resource Planning)**

É um sistema que integra todos os processos da empresa em uma única plataforma.

**Principais módulos:**
• Financeiro (receitas, despesas, fluxo de caixa)
• Estoque (controle de produtos e movimentações)  
• Vendas (gestão comercial e clientes)
• Compras (fornecedores e aquisições)
• RH (funcionários e folha de pagamento)

**Benefícios principais:**
• Dados integrados em tempo real
• Redução de erros manuais
• Decisões baseadas em informações precisas
• Maior produtividade da equipe

O STOKLY é um ERP completo com inteligência artificial integrada.`;
      }
      
      if (input.includes('crm')) {
        return `👥 **CRM (Customer Relationship Management)**

Sistema para gerenciar relacionamentos com clientes de forma estratégica.

**Funcionalidades principais:**
• Cadastro completo de clientes
• Histórico de compras e interações
• Segmentação por perfil e comportamento
• Campanhas de marketing direcionadas

**Benefícios diretos:**
• Maior retenção de clientes
• Atendimento mais personalizado
• Identificação de oportunidades de venda
• Aumento do ticket médio

No STOKLY, o CRM está integrado com vendas e estoque para visão completa do cliente.`;
      }
      
      if (input.includes('kpi')) {
        return `📊 **KPIs (Key Performance Indicators)**

Indicadores que medem o desempenho do seu negócio.

**KPIs essenciais para varejo:**
• **Receita total**: Soma de todas as vendas
• **Ticket médio**: Receita ÷ número de vendas
• **Margem de lucro**: (Receita - Custos) ÷ Receita × 100
• **Giro de estoque**: Vendas ÷ estoque médio
• **Taxa de conversão**: Vendas ÷ visitantes × 100

**Como usar:**
• Defina metas para cada KPI
• Monitore mensalmente
• Compare com períodos anteriores
• Tome ações baseadas nos resultados

No STOKLY, esses KPIs são calculados automaticamente.`;
      }
    }

    // Tutoriais do STOKLY
    if (input.includes('como usar') || input.includes('tutorial') || input.includes('ajuda')) {
      if (input.includes('estoque')) {
        return `📦 **Como usar o Estoque no STOKLY:**

**1. Adicionar produto:**
• Clique em "Adicionar Produto"
• Preencha nome, SKU e categoria
• Defina preço de venda e custo
• Configure estoque inicial e mínimo

**2. Monitorar estoque:**
• Produtos em vermelho = estoque baixo
• Use a busca para encontrar produtos
• Acompanhe alertas no painel principal

**3. Dicas importantes:**
• SKU deve ser único para cada produto
• Defina estoque mínimo realista
• Atualize custos regularmente

Precisa de ajuda com algum produto específico?`;
      }
      
      if (input.includes('vendas')) {
        return `🛒 **Como registrar vendas no STOKLY:**

**1. Preparação:**
• Tenha produtos cadastrados no estoque
• Cadastre clientes no CRM (recomendado)

**2. Registrar venda:**
• Vá em "Vendas" → "Nova Venda"
• Selecione cliente e produto
• Informe quantidade
• Sistema calcula total automaticamente

**3. Após registrar:**
• Estoque é atualizado automaticamente
• Venda aparece nos relatórios
• IA analisa dados para insights

**Dica:** Registre todas as vendas para análises precisas da IA.`;
      }
    }

    // Resposta padrão mais focada
    return `Posso ajudá-lo com informações sobre gestão empresarial e uso do STOKLY ERP.

**Tópicos que posso abordar:**
• **Análises**: "Analise minhas vendas", "Como otimizar estoque"
• **Conceitos**: "O que é ERP", "O que é CRM", "O que são KPIs"
• **Tutoriais**: "Como usar estoque", "Como registrar vendas"
• **Estratégias**: "Segmentar clientes", "Análise financeira"

Pode reformular sua pergunta de forma mais específica? Por exemplo:
- "Analise minhas vendas dos últimos 30 dias"
- "Como otimizar meu estoque atual?"
- "O que é fluxo de caixa?"`;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="h-96 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assistente IA</h1>
            <p className="text-sm text-gray-600">Powered by STOKLY AI Engine</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Online</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Sparkles className="w-5 h-5 text-purple-600 mr-2" />
          Ações Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleQuickAction(action.prompt)}
              className="flex flex-col items-start p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all text-left"
            >
              <div className={`p-3 rounded-lg ${action.bgColor} mb-3`}>
                <action.icon className={`w-5 h-5 ${action.color}`} />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">{action.title}</h4>
              <p className="text-sm text-gray-600">{action.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 bg-white rounded-xl border border-gray-200 flex flex-col">
        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl px-4 py-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.type === 'ai' && (
                  <div className="flex items-center mb-2">
                    <Bot className="w-4 h-4 text-purple-600 mr-2" />
                    <span className="text-sm font-medium text-purple-600">STOKLY AI</span>
                  </div>
                )}
                <div className="whitespace-pre-line">{message.content}</div>
                <div className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Faça uma pergunta sobre seu negócio..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12"
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="flex items-center justify-center w-12 h-12 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};