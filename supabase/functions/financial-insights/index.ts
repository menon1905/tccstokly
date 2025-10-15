const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
}

interface FinancialMetrics {
  total_revenue: number;
  total_expenses: number;
  net_profit: number;
  profit_margin: number;
  revenue_growth: number;
  expense_growth: number;
  break_even_point: number;
  cash_runway_days: number;
}

interface FinancialInsight {
  type: 'success' | 'warning' | 'danger' | 'info';
  title: string;
  description: string;
  metric?: number;
  recommendation?: string;
}

interface FinancialResponse {
  metrics: FinancialMetrics;
  insights: FinancialInsight[];
  predictions: {
    next_month_revenue: number;
    next_month_expenses: number;
    next_month_profit: number;
    confidence: number;
  };
  health_score: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Edge Function started - financial-insights')
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || 
                       Deno.env.get('_SUPABASE_URL') || 
                       Deno.env.get('SUPABASE_PROJECT_URL')
    
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || 
                              Deno.env.get('_SUPABASE_SERVICE_ROLE_KEY') || 
                              Deno.env.get('SUPABASE_SERVICE_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ 
          error: 'Configuration Error',
          message: 'Missing Supabase configuration'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ 
          error: 'Unauthorized',
          message: 'Authorization header is required'
        }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const { createClient } = await import('npm:@supabase/supabase-js@2')
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    let userId: string;
    try {
      const token = authHeader.replace('Bearer ', '');
      const payload = JSON.parse(atob(token.split('.')[1]));
      userId = payload.sub;
    } catch (error) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid Token',
          message: 'Unable to extract user information'
        }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Get current period data (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()

    // Current period sales
    const { data: currentSales, error: salesError } = await supabaseClient
      .from('sales')
      .select('total, created_at')
      .eq('user_id', userId)
      .gte('created_at', thirtyDaysAgo)

    // Previous period sales (for growth comparison)
    const { data: previousSales } = await supabaseClient
      .from('sales')
      .select('total, created_at')
      .eq('user_id', userId)
      .gte('created_at', sixtyDaysAgo)
      .lt('created_at', thirtyDaysAgo)

    // Current period purchases
    const { data: currentPurchases } = await supabaseClient
      .from('purchases')
      .select('total, created_at')
      .eq('user_id', userId)
      .gte('created_at', thirtyDaysAgo)

    // Previous period purchases
    const { data: previousPurchases } = await supabaseClient
      .from('purchases')
      .select('total, created_at')
      .eq('user_id', userId)
      .gte('created_at', sixtyDaysAgo)
      .lt('created_at', thirtyDaysAgo)

    if (salesError) {
      return new Response(
        JSON.stringify({ 
          error: 'Database Error',
          message: `Failed to fetch financial data: ${salesError.message}`
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Calculate metrics
    const totalRevenue = (currentSales || []).reduce((sum, sale) => sum + (sale.total || 0), 0)
    const totalExpenses = (currentPurchases || []).reduce((sum, purchase) => sum + (purchase.total || 0), 0)
    const netProfit = totalRevenue - totalExpenses
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0

    const previousRevenue = (previousSales || []).reduce((sum, sale) => sum + (sale.total || 0), 0)
    const previousExpenses = (previousPurchases || []).reduce((sum, purchase) => sum + (purchase.total || 0), 0)

    const revenueGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0
    const expenseGrowth = previousExpenses > 0 ? ((totalExpenses - previousExpenses) / previousExpenses) * 100 : 0

    // Calculate break-even point (simplified)
    const avgDailyExpenses = totalExpenses / 30
    const avgDailyRevenue = totalRevenue / 30
    const breakEvenPoint = avgDailyRevenue > 0 ? avgDailyExpenses / avgDailyRevenue : 0

    // Calculate cash runway
    const cashRunwayDays = avgDailyExpenses > 0 && netProfit > 0 ? Math.floor(netProfit / avgDailyExpenses) : 0

    // Generate AI insights
    const insights: FinancialInsight[] = []

    // Profit analysis
    if (netProfit > 0) {
      if (profitMargin > 20) {
        insights.push({
          type: 'success',
          title: 'Margem de Lucro Excelente',
          description: `Sua margem de lucro de ${profitMargin.toFixed(1)}% está acima da média do mercado.`,
          metric: profitMargin,
          recommendation: 'Continue monitorando seus custos para manter essa performance.'
        })
      } else if (profitMargin > 10) {
        insights.push({
          type: 'info',
          title: 'Margem de Lucro Saudável',
          description: `Margem de ${profitMargin.toFixed(1)}% é adequada, mas pode ser otimizada.`,
          metric: profitMargin,
          recommendation: 'Analise oportunidades de redução de custos ou aumento de preços.'
        })
      } else {
        insights.push({
          type: 'warning',
          title: 'Margem de Lucro Baixa',
          description: `Margem de apenas ${profitMargin.toFixed(1)}% requer atenção.`,
          metric: profitMargin,
          recommendation: 'Revise sua estrutura de custos e estratégia de preços urgentemente.'
        })
      }
    } else {
      insights.push({
        type: 'danger',
        title: 'Operação no Prejuízo',
        description: 'Suas despesas estão superando a receita.',
        metric: netProfit,
        recommendation: 'Ação imediata necessária: reduza custos e aumente vendas.'
      })
    }

    // Growth analysis
    if (revenueGrowth > 15) {
      insights.push({
        type: 'success',
        title: 'Crescimento Forte',
        description: `Receita cresceu ${revenueGrowth.toFixed(1)}% vs período anterior.`,
        metric: revenueGrowth,
        recommendation: 'Excelente! Mantenha as estratégias que estão funcionando.'
      })
    } else if (revenueGrowth < 0) {
      insights.push({
        type: 'warning',
        title: 'Receita em Queda',
        description: `Receita caiu ${Math.abs(revenueGrowth).toFixed(1)}% vs período anterior.`,
        metric: revenueGrowth,
        recommendation: 'Revise sua estratégia de vendas e marketing.'
      })
    }

    // Expense control
    if (expenseGrowth > revenueGrowth && expenseGrowth > 10) {
      insights.push({
        type: 'warning',
        title: 'Despesas Crescendo Mais que Receita',
        description: `Despesas cresceram ${expenseGrowth.toFixed(1)}% vs ${revenueGrowth.toFixed(1)}% de receita.`,
        metric: expenseGrowth,
        recommendation: 'Implemente controles mais rígidos de despesas.'
      })
    } else if (expenseGrowth < 0) {
      insights.push({
        type: 'success',
        title: 'Controle de Custos Eficaz',
        description: `Despesas reduziram em ${Math.abs(expenseGrowth).toFixed(1)}%.`,
        metric: expenseGrowth,
        recommendation: 'Continue otimizando seus processos e custos.'
      })
    }

    // Cash runway
    if (cashRunwayDays > 0 && cashRunwayDays < 30) {
      insights.push({
        type: 'warning',
        title: 'Runway de Caixa Curto',
        description: `Lucro atual cobre apenas ${cashRunwayDays} dias de despesas.`,
        metric: cashRunwayDays,
        recommendation: 'Aumente suas reservas de caixa ou reduza despesas fixas.'
      })
    } else if (cashRunwayDays > 90) {
      insights.push({
        type: 'success',
        title: 'Runway de Caixa Confortável',
        description: `Você tem margem para ${cashRunwayDays} dias de operação.`,
        metric: cashRunwayDays,
        recommendation: 'Considere investir em crescimento ou expansão.'
      })
    }

    // Predictions using simple trend analysis
    const nextMonthRevenue = totalRevenue * (1 + revenueGrowth / 100)
    const nextMonthExpenses = totalExpenses * (1 + expenseGrowth / 100)
    const nextMonthProfit = nextMonthRevenue - nextMonthExpenses

    // Calculate confidence based on data consistency
    const dataPoints = (currentSales?.length || 0) + (currentPurchases?.length || 0)
    const confidence = Math.min(95, Math.max(60, 60 + (dataPoints * 0.5)))

    // Calculate overall health score
    let healthScore = 50;
    if (netProfit > 0) healthScore += 20;
    if (profitMargin > 15) healthScore += 15;
    if (revenueGrowth > 10) healthScore += 15;
    if (expenseGrowth < revenueGrowth) healthScore += 10;
    if (cashRunwayDays > 60) healthScore += 10;
    healthScore = Math.min(100, healthScore);

    const response: FinancialResponse = {
      metrics: {
        total_revenue: Math.round(totalRevenue * 100) / 100,
        total_expenses: Math.round(totalExpenses * 100) / 100,
        net_profit: Math.round(netProfit * 100) / 100,
        profit_margin: Math.round(profitMargin * 100) / 100,
        revenue_growth: Math.round(revenueGrowth * 100) / 100,
        expense_growth: Math.round(expenseGrowth * 100) / 100,
        break_even_point: Math.round(breakEvenPoint * 100) / 100,
        cash_runway_days: cashRunwayDays
      },
      insights: insights.slice(0, 5),
      predictions: {
        next_month_revenue: Math.round(nextMonthRevenue * 100) / 100,
        next_month_expenses: Math.round(nextMonthExpenses * 100) / 100,
        next_month_profit: Math.round(nextMonthProfit * 100) / 100,
        confidence: Math.round(confidence * 100) / 100
      },
      health_score: healthScore
    }

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Critical error in financial-insights function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal Server Error',
        message: `Function execution failed: ${error.message}`
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})