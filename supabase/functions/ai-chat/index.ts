import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ChatMessage {
  role: string;
  content: string;
}

interface ChatRequest {
  message: string;
  context?: {
    products?: any[];
    sales?: any[];
    customers?: any[];
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { message, context }: ChatRequest = await req.json();

    const hasProducts = context?.products && context.products.length > 0;
    const hasSales = context?.sales && context.sales.length > 0;
    const hasCustomers = context?.customers && context.customers.length > 0;

    let systemPrompt = `Você é um assistente de IA especializado em gestão empresarial e ERP chamado STOKLY AI.

Seu papel é ajudar o usuário a gerenciar seu negócio, responder perguntas sobre gestão, e fornecer insights baseados nos dados disponíveis.

Seja direto, útil e amigável. Use linguagem clara e objetiva.

`;

    if (!hasProducts) {
      systemPrompt += `IMPORTANTE: O usuário ainda não cadastrou produtos no sistema. Oriente-o a cadastrar produtos antes de fazer análises detalhadas. Você pode responder perguntas sobre conceitos de negócios e como usar o sistema.\n`;
    } else if (!hasSales) {
      systemPrompt += `CONTEXTO: O usuário tem ${context?.products?.length || 0} produto(s) cadastrado(s), mas ainda não registrou vendas. Incentive-o a registrar vendas para análises mais completas.\n`;
    } else {
      const totalRevenue = context?.sales?.reduce((sum: number, sale: any) => sum + (sale.total || 0), 0) || 0;
      systemPrompt += `DADOS DISPONÍVEIS:\n- Produtos: ${context?.products?.length || 0}\n- Vendas: ${context?.sales?.length || 0}\n- Receita total: R$ ${totalRevenue.toLocaleString('pt-BR')}\n- Clientes: ${context?.customers?.length || 0}\n\nUse esses dados para fornecer análises e insights relevantes.\n`;
    }

    const response = generateAIResponse(message, systemPrompt, context);

    return new Response(
      JSON.stringify({ response }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});

function generateAIResponse(message: string, systemPrompt: string, context?: any): string {
  const input = message.toLowerCase();

  if (input.includes('olá') || input.includes('oi') || input.includes('hello')) {
    if (!context?.products || context.products.length === 0) {
      return 'Olá! 👋 Sou o STOKLY AI, seu assistente de gestão empresarial.\n\nVejo que você está começando. Para aproveitar ao máximo o sistema, recomendo cadastrar seus produtos primeiro. Depois podemos analisar vendas, estoque e muito mais!\n\nComo posso ajudá-lo hoje?';
    }
    return `Olá! 👋 Sou o STOKLY AI.\n\nVejo que você já tem ${context.products.length} produto(s) cadastrado(s). Como posso ajudá-lo hoje? Posso analisar dados, responder dúvidas ou dar sugestões sobre seu negócio.`;
  }

  if (input.includes('produto') && input.includes('cadastr')) {
    return 'Para cadastrar produtos:\n\n1. Vá para a página "Estoque"\n2. Clique em "Adicionar Produto"\n3. Preencha as informações:\n   - Nome do produto\n   - SKU (código único)\n   - Categoria\n   - Preço de venda\n   - Custo\n   - Quantidade em estoque\n   - Estoque mínimo\n\n📌 Dica: Defina um estoque mínimo realista para receber alertas de reposição.';
  }

  if ((input.includes('venda') || input.includes('vender')) && input.includes('como')) {
    if (!context?.products || context.products.length === 0) {
      return 'Para registrar vendas, você precisa ter produtos cadastrados primeiro.\n\n1. Cadastre seus produtos em "Estoque"\n2. Depois vá em "Vendas" → "Nova Venda"\n3. Selecione o cliente e produtos\n4. O sistema calcula automaticamente';
    }
    return 'Para registrar uma venda:\n\n1. Vá para "Vendas"\n2. Clique em "Nova Venda"\n3. Selecione o cliente\n4. Escolha os produtos e quantidades\n5. O valor total é calculado automaticamente\n6. Confirme a venda\n\nO estoque é atualizado automaticamente!';
  }

  if (input.includes('analise') || input.includes('análise')) {
    if (!context?.sales || context.sales.length === 0) {
      return 'Para fazer análises detalhadas, preciso que você registre algumas vendas no sistema.\n\nCom dados de vendas, posso fornecer:\n- Top produtos mais vendidos\n- Tendências de crescimento\n- Previsões de estoque\n- Análises financeiras\n- Insights personalizados\n\nRegistre suas vendas e volte aqui!';
    }

    const totalSales = context.sales.length;
    const totalRevenue = context.sales.reduce((sum: number, sale: any) => sum + (sale.total || 0), 0);
    const avgTicket = totalRevenue / totalSales;

    return `📊 Análise dos seus dados:\n\n**Performance:**\n- Total de vendas: ${totalSales}\n- Receita total: R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n- Ticket médio: R$ ${avgTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n\n**Insights:**\n${totalSales < 10 ? '- Registre mais vendas para análises mais precisas' : '- Boa base de dados para análises'}\n${avgTicket < 100 ? '- Oportunidade para aumentar ticket médio' : '- Ticket médio saudável'}\n\nPosso ajudar com alguma análise específica?`;
  }

  if (input.includes('estoque') && (input.includes('baixo') || input.includes('falta'))) {
    if (!context?.products || context.products.length === 0) {
      return 'Você ainda não tem produtos cadastrados. Cadastre seus produtos para monitorar níveis de estoque!';
    }

    const lowStock = context.products.filter((p: any) => p.stock <= p.min_stock);
    if (lowStock.length === 0) {
      return `✅ Boas notícias! Todos os seus ${context.products.length} produtos estão com estoque adequado.\n\nContinue monitorando regularmente para evitar rupturas.`;
    }

    return `⚠️ Atenção! ${lowStock.length} produto(s) com estoque baixo:\n\n${lowStock.slice(0, 5).map((p: any) => `- ${p.name}: ${p.stock} unidades (mínimo: ${p.min_stock})`).join('\n')}\n\nRecomendo reabastecer esses produtos em breve.`;
  }

  if (input.includes('o que é') || input.includes('explique')) {
    if (input.includes('erp')) {
      return '**ERP (Enterprise Resource Planning)**\n\nÉ um sistema integrado que gerencia todos os processos da empresa:\n\n📦 Estoque - controle de produtos\n💰 Financeiro - receitas e despesas\n🛒 Vendas - gestão comercial\n👥 CRM - relacionamento com clientes\n📊 Relatórios - análises e decisões\n\nBenefício: Tudo conectado, dados em tempo real, decisões mais inteligentes!';
    }
    if (input.includes('crm')) {
      return '**CRM (Customer Relationship Management)**\n\nSistema para gerenciar relacionamento com clientes:\n\n- Cadastro completo de clientes\n- Histórico de compras\n- Segmentação por perfil\n- Campanhas personalizadas\n- Análise de comportamento\n\nResultado: Clientes mais satisfeitos, vendas mais efetivas!';
    }
  }

  if (input.includes('ajuda') || input.includes('ajudar')) {
    return 'Posso ajudá-lo com:\n\n**Uso do sistema:**\n- Como cadastrar produtos, clientes, vendas\n- Como usar cada módulo do ERP\n\n**Análises:**\n- Performance de vendas\n- Situação do estoque\n- Análises financeiras\n\n**Conceitos:**\n- O que é ERP, CRM, KPIs\n- Estratégias de gestão\n\n**Recomendações:**\n- Insights baseados nos seus dados\n- Sugestões de melhorias\n\nO que você gostaria de saber?';
  }

  return `Entendi sua pergunta: "${message}"\n\nPosso ajudar com:\n\n- Análise de vendas e estoque\n- Como usar o sistema\n- Conceitos de gestão (ERP, CRM, KPIs)\n- Estratégias para seu negócio\n\nPoderia reformular sua pergunta de forma mais específica? Por exemplo:\n- "Como cadastrar produtos?"\n- "Analise minhas vendas"\n- "Quais produtos estão com estoque baixo?"\n- "O que é fluxo de caixa?"`;
}
