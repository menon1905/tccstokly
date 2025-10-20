import { supabase } from './supabase';

export const aiLocal = {
  salesPrediction: async () => {
    const { data: sales, error } = await supabase.from('sales').select('*');

    if (error) {
      console.error('Error fetching sales:', error);
      return {
        error: 'Failed to fetch sales data',
        message: error.message,
        predictions: [],
        model_info: {
          type: 'error',
          data_points: 0,
          days_analyzed: 0,
          slope: 0,
          intercept: 0,
          accuracy_percentage: 0,
          rmse: 0
        },
        historical_data: []
      };
    }

    if (!sales || sales.length < 7) {
      return {
        error: 'Insufficient data',
        message: `Need at least 7 sales for predictions. Found ${sales?.length || 0} records.`,
        predictions: [],
        model_info: {
          type: 'insufficient_data',
          data_points: 0,
          days_analyzed: 0,
          slope: 0,
          intercept: 0,
          accuracy_percentage: 0,
          rmse: 0
        },
        historical_data: []
      };
    }

    const dailySales = new Map<string, number>();
    sales.forEach((sale) => {
      const date = new Date(sale.created_at).toISOString().split('T')[0];
      dailySales.set(date, (dailySales.get(date) || 0) + sale.total);
    });

    const sortedSales = Array.from(dailySales.entries())
      .map(([date, total]) => ({ date, total }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const regressionData = sortedSales.map((sale, index) => ({
      x: index,
      y: sale.total
    }));

    const n = regressionData.length;
    const sumX = regressionData.reduce((sum, point) => sum + point.x, 0);
    const sumY = regressionData.reduce((sum, point) => sum + point.y, 0);
    const sumXY = regressionData.reduce((sum, point) => sum + point.x * point.y, 0);
    const sumXX = regressionData.reduce((sum, point) => sum + point.x * point.x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const salesValues = sortedSales.map(s => s.total);
    const residuals = regressionData.map(point => point.y - (slope * point.x + intercept));
    const mean = salesValues.reduce((sum, val) => sum + val, 0) / salesValues.length;
    const variance = residuals.reduce((sum, residual) => sum + residual * residual, 0) / residuals.length;
    const stdDev = Math.sqrt(variance);

    const predictions = [];
    const lastDataPoint = regressionData.length - 1;
    const startDate = new Date(sortedSales[0].date);

    for (let i = 1; i <= 30; i++) {
      const futureX = lastDataPoint + i;
      const predictedValue = slope * futureX + intercept;

      const futureDate = new Date(startDate);
      futureDate.setDate(futureDate.getDate() + futureX);
      const dayOfWeek = futureDate.getDay();

      const seasonalityFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.1 : 1.0;
      const adjustedPrediction = Math.max(0, predictedValue * seasonalityFactor);

      const confidenceMargin = 2 * stdDev;

      predictions.push({
        date: futureDate.toISOString().split('T')[0],
        predicted_value: Math.round(adjustedPrediction * 100) / 100,
        confidence_interval: {
          lower: Math.max(0, Math.round((adjustedPrediction - confidenceMargin) * 100) / 100),
          upper: Math.round((adjustedPrediction + confidenceMargin) * 100) / 100
        }
      });
    }

    const mse = residuals.reduce((sum, residual) => sum + residual * residual, 0) / residuals.length;
    const rmse = Math.sqrt(mse);
    const accuracy = Math.max(0, Math.min(100, 100 - (rmse / mean) * 100));

    return {
      predictions,
      model_info: {
        type: 'linear_regression_with_seasonality',
        data_points: sales.length,
        days_analyzed: sortedSales.length,
        slope: Math.round(slope * 100) / 100,
        intercept: Math.round(intercept * 100) / 100,
        accuracy_percentage: Math.round(accuracy * 100) / 100,
        rmse: Math.round(rmse * 100) / 100
      },
      historical_data: sortedSales
    };
  },

  inventoryOptimization: async () => {
    const { data: products } = await supabase.from('products').select('*');

    if (!products || products.length === 0) {
      return {
        total_products: 0,
        products_below_min: 0,
        products_at_risk: 0,
        recommendations: [],
        optimization_score: 100,
        total_value_at_risk: 0
      };
    }

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data: allSales } = await supabase.from('sales').select('*');
    const sales = allSales?.filter(s => s.created_at >= thirtyDaysAgo) || [];

    const salesByProduct = new Map<string, number[]>();
    sales.forEach((sale) => {
      if (!salesByProduct.has(sale.product_id)) {
        salesByProduct.set(sale.product_id, []);
      }
      salesByProduct.get(sale.product_id)!.push(sale.quantity);
    });

    const recommendations = [];
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

      if (product.stock < product.min_stock) {
        priority = 'high';
        reason = 'Estoque abaixo do mínimo';
        recommendedOrder = Math.ceil((product.min_stock * 2) - product.stock);
        productsBelowMin++;
        totalValueAtRisk += product.price * recommendedOrder;
      } else if (daysUntilStockout < 7 && avgDailySales > 0) {
        priority = 'high';
        reason = `Estoque acaba em ${daysUntilStockout} dias`;
        recommendedOrder = Math.ceil(avgDailySales * 14);
        productsAtRisk++;
        totalValueAtRisk += product.price * recommendedOrder;
      } else if (daysUntilStockout < 14 && avgDailySales > 0) {
        priority = 'medium';
        reason = `Estoque acaba em ${daysUntilStockout} dias`;
        recommendedOrder = Math.ceil(avgDailySales * 14);
        productsAtRisk++;
      } else if (product.stock <= product.min_stock * 1.5) {
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

    recommendations.sort((a, b) => {
      if (a.priority === b.priority) {
        return a.days_until_stockout - b.days_until_stockout;
      }
      return a.priority === 'high' ? -1 : 1;
    });

    const healthyProducts = products.length - productsBelowMin - productsAtRisk;
    const optimizationScore = products.length > 0
      ? Math.round((healthyProducts / products.length) * 100)
      : 100;

    return {
      total_products: products.length,
      products_below_min: productsBelowMin,
      products_at_risk: productsAtRisk,
      recommendations: recommendations.slice(0, 10),
      optimization_score: optimizationScore,
      total_value_at_risk: Math.round(totalValueAtRisk * 100) / 100
    };
  },

  financialInsights: async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();

    const { data: allSales } = await supabase.from('sales').select('*');
    const { data: allPurchases } = await supabase.from('purchases').select('*');

    const currentSales = allSales?.filter(s => s.created_at >= thirtyDaysAgo) || [];
    const previousSales = allSales?.filter(s => s.created_at >= sixtyDaysAgo && s.created_at < thirtyDaysAgo) || [];

    const currentPurchases = allPurchases?.filter(p => p.created_at >= thirtyDaysAgo) || [];
    const previousPurchases = allPurchases?.filter(p => p.created_at >= sixtyDaysAgo && p.created_at < thirtyDaysAgo) || [];

    const totalRevenue = currentSales.reduce((sum, sale) => sum + (sale.total || 0), 0);
    const totalExpenses = currentPurchases.reduce((sum, purchase) => sum + (purchase.total || 0), 0);
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    const previousRevenue = previousSales.reduce((sum, sale) => sum + (sale.total || 0), 0);
    const previousExpenses = previousPurchases.reduce((sum, purchase) => sum + (purchase.total || 0), 0);

    const revenueGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;
    const expenseGrowth = previousExpenses > 0 ? ((totalExpenses - previousExpenses) / previousExpenses) * 100 : 0;

    const avgDailyExpenses = totalExpenses / 30;
    const avgDailyRevenue = totalRevenue / 30;
    const breakEvenPoint = avgDailyRevenue > 0 ? avgDailyExpenses / avgDailyRevenue : 0;
    const cashRunwayDays = avgDailyExpenses > 0 && netProfit > 0 ? Math.floor(netProfit / avgDailyExpenses) : 0;

    const insights = [];

    if (netProfit > 0) {
      if (profitMargin > 20) {
        insights.push({
          type: 'success',
          title: 'Margem de Lucro Excelente',
          description: `Sua margem de lucro de ${profitMargin.toFixed(1)}% está acima da média do mercado.`,
          metric: profitMargin,
          recommendation: 'Continue monitorando seus custos para manter essa performance.'
        });
      } else if (profitMargin > 10) {
        insights.push({
          type: 'info',
          title: 'Margem de Lucro Saudável',
          description: `Margem de ${profitMargin.toFixed(1)}% é adequada, mas pode ser otimizada.`,
          metric: profitMargin,
          recommendation: 'Analise oportunidades de redução de custos ou aumento de preços.'
        });
      } else {
        insights.push({
          type: 'warning',
          title: 'Margem de Lucro Baixa',
          description: `Margem de apenas ${profitMargin.toFixed(1)}% requer atenção.`,
          metric: profitMargin,
          recommendation: 'Revise sua estrutura de custos e estratégia de preços urgentemente.'
        });
      }
    } else {
      insights.push({
        type: 'danger',
        title: 'Operação no Prejuízo',
        description: 'Suas despesas estão superando a receita.',
        metric: netProfit,
        recommendation: 'Ação imediata necessária: reduza custos e aumente vendas.'
      });
    }

    if (revenueGrowth > 15) {
      insights.push({
        type: 'success',
        title: 'Crescimento Forte',
        description: `Receita cresceu ${revenueGrowth.toFixed(1)}% vs período anterior.`,
        metric: revenueGrowth,
        recommendation: 'Excelente! Mantenha as estratégias que estão funcionando.'
      });
    } else if (revenueGrowth < 0) {
      insights.push({
        type: 'warning',
        title: 'Receita em Queda',
        description: `Receita caiu ${Math.abs(revenueGrowth).toFixed(1)}% vs período anterior.`,
        metric: revenueGrowth,
        recommendation: 'Revise sua estratégia de vendas e marketing.'
      });
    }

    const nextMonthRevenue = totalRevenue * (1 + revenueGrowth / 100);
    const nextMonthExpenses = totalExpenses * (1 + expenseGrowth / 100);
    const nextMonthProfit = nextMonthRevenue - nextMonthExpenses;

    const dataPoints = currentSales.length + currentPurchases.length;
    const confidence = Math.min(95, Math.max(60, 60 + (dataPoints * 0.5)));

    let healthScore = 50;
    if (netProfit > 0) healthScore += 20;
    if (profitMargin > 15) healthScore += 15;
    if (revenueGrowth > 10) healthScore += 15;
    if (expenseGrowth < revenueGrowth) healthScore += 10;
    if (cashRunwayDays > 60) healthScore += 10;
    healthScore = Math.min(100, healthScore);

    return {
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
    };
  }
};
