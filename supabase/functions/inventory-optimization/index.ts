const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
}

interface ProductAnalysis {
  product_id: string;
  product_name: string;
  current_stock: number;
  min_stock: number;
  avg_daily_sales: number;
  days_until_stockout: number;
  recommended_order: number;
  priority: 'high' | 'medium' | 'low';
  reason: string;
}

interface InventoryInsights {
  total_products: number;
  products_below_min: number;
  products_at_risk: number;
  recommendations: ProductAnalysis[];
  optimization_score: number;
  total_value_at_risk: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Edge Function started - inventory-optimization')
    
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

    // Get products
    const { data: products, error: productsError } = await supabaseClient
      .from('products')
      .select('id, name, stock, min_stock, price')
      .eq('user_id', userId)

    if (productsError) {
      return new Response(
        JSON.stringify({ 
          error: 'Database Error',
          message: `Failed to fetch products: ${productsError.message}`
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (!products || products.length === 0) {
      return new Response(
        JSON.stringify({ 
          total_products: 0,
          products_below_min: 0,
          products_at_risk: 0,
          recommendations: [],
          optimization_score: 100,
          total_value_at_risk: 0
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Get sales data from last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const { data: sales, error: salesError } = await supabaseClient
      .from('sales')
      .select('product_id, quantity, created_at')
      .eq('user_id', userId)
      .gte('created_at', thirtyDaysAgo)

    // Calculate daily sales average per product
    const salesByProduct = new Map<string, number[]>();
    
    if (sales && sales.length > 0) {
      sales.forEach((sale) => {
        if (!salesByProduct.has(sale.product_id)) {
          salesByProduct.set(sale.product_id, []);
        }
        salesByProduct.get(sale.product_id)!.push(sale.quantity);
      });
    }

    // Analyze each product
    const recommendations: ProductAnalysis[] = [];
    let productsBelowMin = 0;
    let productsAtRisk = 0;
    let totalValueAtRisk = 0;

    products.forEach((product) => {
      const productSales = salesByProduct.get(product.id) || [];
      const totalSales = productSales.reduce((sum, qty) => sum + qty, 0);
      const avgDailySales = productSales.length > 0 ? totalSales / 30 : 0;
      
      const daysUntilStockout = avgDailySales > 0 
        ? Math.floor(product.stock / avgDailySales)
        : 999;

      let priority: 'high' | 'medium' | 'low' = 'low';
      let reason = '';
      let recommendedOrder = 0;

      // Critical: Below minimum stock
      if (product.stock < product.min_stock) {
        priority = 'high';
        reason = 'Estoque abaixo do mínimo';
        recommendedOrder = Math.ceil((product.min_stock * 2) - product.stock);
        productsBelowMin++;
        totalValueAtRisk += product.price * recommendedOrder;
      }
      // Warning: Will run out in less than 7 days
      else if (daysUntilStockout < 7 && avgDailySales > 0) {
        priority = 'high';
        reason = `Estoque acaba em ${daysUntilStockout} dias`;
        recommendedOrder = Math.ceil(avgDailySales * 14);
        productsAtRisk++;
        totalValueAtRisk += product.price * recommendedOrder;
      }
      // Attention: Will run out in less than 14 days
      else if (daysUntilStockout < 14 && avgDailySales > 0) {
        priority = 'medium';
        reason = `Estoque acaba em ${daysUntilStockout} dias`;
        recommendedOrder = Math.ceil(avgDailySales * 14);
        productsAtRisk++;
      }
      // Low stock approaching minimum
      else if (product.stock <= product.min_stock * 1.5) {
        priority = 'medium';
        reason = 'Estoque próximo do mínimo';
        recommendedOrder = Math.ceil(avgDailySales * 14);
      }

      if (priority === 'high' || priority === 'medium') {
        recommendations.push({
          product_id: product.id,
          product_name: product.name,
          current_stock: product.stock,
          min_stock: product.min_stock,
          avg_daily_sales: Math.round(avgDailySales * 100) / 100,
          days_until_stockout: daysUntilStockout,
          recommended_order: recommendedOrder,
          priority,
          reason
        });
      }
    });

    // Sort by priority (high first) and then by days until stockout
    recommendations.sort((a, b) => {
      if (a.priority === b.priority) {
        return a.days_until_stockout - b.days_until_stockout;
      }
      return a.priority === 'high' ? -1 : 1;
    });

    // Calculate optimization score
    const healthyProducts = products.length - productsBelowMin - productsAtRisk;
    const optimizationScore = products.length > 0 
      ? Math.round((healthyProducts / products.length) * 100)
      : 100;

    const response: InventoryInsights = {
      total_products: products.length,
      products_below_min: productsBelowMin,
      products_at_risk: productsAtRisk,
      recommendations: recommendations.slice(0, 10),
      optimization_score: optimizationScore,
      total_value_at_risk: Math.round(totalValueAtRisk * 100) / 100
    };

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Critical error in inventory-optimization function:', error)
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