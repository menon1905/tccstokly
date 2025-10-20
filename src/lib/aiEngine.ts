interface SalesData {
  created_at: string;
  total: number;
  quantity: number;
  product_id: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
}

export interface SectorInsights {
  sector: string;
  sectorName: string;
  trendingProducts: string[];
  recommendations: string[];
  seasonalTrends: string[];
  growthOpportunities: string[];
}

const SECTOR_DATA: Record<string, SectorInsights> = {
  retail: {
    sector: 'retail',
    sectorName: 'Varejo / Comércio',
    trendingProducts: ['Produtos de higiene', 'Alimentos não perecíveis', 'Bebidas', 'Snacks', 'Produtos de limpeza'],
    recommendations: [
      'Mantenha estoque de itens essenciais sempre disponível',
      'Produtos de alta rotação devem ter reposição automática',
      'Ofereça promoções em dias de menor movimento',
      'Crie combos de produtos complementares'
    ],
    seasonalTrends: [
      'Dezembro: Aumentar estoque de bebidas e alimentos festivos',
      'Janeiro: Produtos de dieta e academia',
      'Junho/Julho: Produtos para o frio'
    ],
    growthOpportunities: [
      'Implementar programa de fidelidade',
      'Venda online com delivery',
      'Parcerias com aplicativos de entrega'
    ]
  },
  food: {
    sector: 'food',
    sectorName: 'Alimentação / Restaurante',
    trendingProducts: ['Pratos executivos', 'Combos promocionais', 'Sobremesas', 'Bebidas naturais', 'Opções veganas'],
    recommendations: [
      'Acompanhe o desempenho dos pratos mais vendidos',
      'Ajuste cardápio baseado em sazonalidade',
      'Controle rigoroso de validade dos ingredientes',
      'Ofereça opções do dia para otimizar ingredientes'
    ],
    seasonalTrends: [
      'Verão: Pratos leves, saladas, sucos naturais',
      'Inverno: Sopas, caldos, bebidas quentes',
      'Fim de semana: Pratos especiais e porções maiores'
    ],
    growthOpportunities: [
      'Sistema de pedidos online',
      'Parcerias com apps de delivery',
      'Cardápio digital com QR Code',
      'Programa de cashback para clientes frequentes'
    ]
  },
  fashion: {
    sector: 'fashion',
    sectorName: 'Moda / Vestuário',
    trendingProducts: ['Roupas casuais', 'Jeans', 'Camisetas básicas', 'Tênis', 'Acessórios'],
    recommendations: [
      'Acompanhe tendências de moda sazonais',
      'Mantenha mix de produtos básicos e trendy',
      'Gerencie tamanhos com base no histórico de vendas',
      'Faça liquidações programadas de coleções antigas'
    ],
    seasonalTrends: [
      'Primavera/Verão: Roupas leves, cores vibrantes',
      'Outono/Inverno: Casacos, malhas, cores neutras',
      'Datas especiais: Dia das Mães, Natal, Dia dos Namorados'
    ],
    growthOpportunities: [
      'Presença em redes sociais com looks do dia',
      'Personal stylist online',
      'Sistema de pré-venda de coleções',
      'Programa de renovação de guarda-roupa'
    ]
  },
  electronics: {
    sector: 'electronics',
    sectorName: 'Eletrônicos / Tecnologia',
    trendingProducts: ['Smartphones', 'Fones de ouvido', 'Carregadores', 'Capas e películas', 'Smart devices'],
    recommendations: [
      'Acompanhe lançamentos de grandes marcas',
      'Mantenha estoque de acessórios populares',
      'Ofereça garantia estendida',
      'Crie pacotes de produtos complementares'
    ],
    seasonalTrends: [
      'Black Friday: Maior volume de vendas do ano',
      'Janeiro: Produtos em promoção',
      'Volta às aulas: Notebooks, tablets'
    ],
    growthOpportunities: [
      'Serviço de assistência técnica',
      'Trade-in de aparelhos usados',
      'Assinatura de produtos e serviços',
      'Vendas corporativas'
    ]
  },
  pharmacy: {
    sector: 'pharmacy',
    sectorName: 'Farmácia / Saúde',
    trendingProducts: ['Medicamentos OTC', 'Vitaminas', 'Suplementos', 'Higiene pessoal', 'Dermocosméticos'],
    recommendations: [
      'Controle rigoroso de validade de medicamentos',
      'Mantenha estoque de medicamentos essenciais',
      'Ofereça programa de desconto para crônicos',
      'Acompanhe receitas controladas com atenção'
    ],
    seasonalTrends: [
      'Inverno: Antigripais, vitamina C, xaropes',
      'Verão: Protetores solares, repelentes',
      'O ano todo: Medicamentos para doenças crônicas'
    ],
    growthOpportunities: [
      'Serviços de vacinação',
      'Testes rápidos (COVID, gravidez, etc)',
      'Programa de acompanhamento farmacêutico',
      'Delivery de medicamentos'
    ]
  },
  construction: {
    sector: 'construction',
    sectorName: 'Construção / Materiais',
    trendingProducts: ['Cimento', 'Tintas', 'Ferramentas', 'Material elétrico', 'Hidráulico'],
    recommendations: [
      'Ofereça orçamentos para obras completas',
      'Mantenha relacionamento com construtoras',
      'Crie kits para tipos específicos de obras',
      'Tenha expertise técnica para orientar clientes'
    ],
    seasonalTrends: [
      'Verão: Maior volume de obras e reformas',
      'Fim de ano: Planejamento de reformas para o ano seguinte',
      'Pós-chuvas: Reparos e impermeabilização'
    ],
    growthOpportunities: [
      'Parcerias com arquitetos e engenheiros',
      'Serviço de entrega em obra',
      'Aluguel de ferramentas e equipamentos',
      'Vendas para construtoras (B2B)'
    ]
  },
  automotive: {
    sector: 'automotive',
    sectorName: 'Automotivo / Peças',
    trendingProducts: ['Óleo de motor', 'Filtros', 'Baterias', 'Pneus', 'Lâmpadas'],
    recommendations: [
      'Mantenha catálogo organizado por marca/modelo',
      'Ofereça instalação de peças',
      'Crie programa de revisões programadas',
      'Mantenha estoque de itens de alta rotatividade'
    ],
    seasonalTrends: [
      'Verão: Ar-condicionado, fluidos de arrefecimento',
      'Inverno: Baterias, limpadores de para-brisa',
      'O ano todo: Óleo, filtros, freios'
    ],
    growthOpportunities: [
      'Serviço de oficina mecânica',
      'Vendas para frotas (táxis, Uber)',
      'Sistema de agendamento online',
      'Programa de manutenção preventiva'
    ]
  },
  beauty: {
    sector: 'beauty',
    sectorName: 'Beleza / Cosméticos',
    trendingProducts: ['Maquiagem', 'Produtos para cabelo', 'Skincare', 'Perfumes', 'Esmaltes'],
    recommendations: [
      'Acompanhe tendências de beleza em redes sociais',
      'Ofereça testes de produtos',
      'Crie kits temáticos',
      'Tenha consultores de beleza'
    ],
    seasonalTrends: [
      'Verão: Protetores solares, produtos para pele oleosa',
      'Inverno: Hidratantes, produtos para pele seca',
      'Datas especiais: Dia das Mães, Natal, Dia dos Namorados'
    ],
    growthOpportunities: [
      'Serviços de makeup e penteado',
      'Assinatura de produtos de beleza',
      'Parcerias com influenciadores',
      'Workshops e cursos de maquiagem'
    ]
  },
  sports: {
    sector: 'sports',
    sectorName: 'Esportes / Fitness',
    trendingProducts: ['Roupas esportivas', 'Tênis de corrida', 'Suplementos', 'Acessórios de treino', 'Equipamentos'],
    recommendations: [
      'Mantenha produtos para diferentes modalidades',
      'Ofereça consultoria para escolha de equipamentos',
      'Crie combos para iniciantes',
      'Acompanhe eventos esportivos da região'
    ],
    seasonalTrends: [
      'Janeiro: Pico de vendas (resoluções de ano novo)',
      'Verão: Roupas leves, produtos para corrida',
      'O ano todo: Suplementos, acessórios'
    ],
    growthOpportunities: [
      'Parcerias com academias',
      'Patrocínio de eventos esportivos',
      'Sistema de pontos por check-in em treinos',
      'Vendas corporativas (empresas com programas wellness)'
    ]
  },
  books: {
    sector: 'books',
    sectorName: 'Livraria / Papelaria',
    trendingProducts: ['Best-sellers', 'Material escolar', 'Cadernos', 'Canetas', 'Artigos de escritório'],
    recommendations: [
      'Acompanhe lançamentos literários',
      'Crie seções temáticas',
      'Ofereça clube de leitura',
      'Mantenha estoque forte em períodos escolares'
    ],
    seasonalTrends: [
      'Janeiro/Fevereiro: Pico de material escolar',
      'Novembro/Dezembro: Livros para presentes',
      'Férias: Livros de entretenimento'
    ],
    growthOpportunities: [
      'Eventos com autores',
      'Clube de assinatura de livros',
      'Espaço para leitura e café',
      'Vendas para escolas e empresas'
    ]
  },
  services: {
    sector: 'services',
    sectorName: 'Serviços',
    trendingProducts: ['Pacotes mensais', 'Combos de serviços', 'Atendimento express', 'Planos anuais', 'Serviços premium'],
    recommendations: [
      'Ofereça pacotes com desconto',
      'Crie programas de fidelidade',
      'Mantenha agenda organizada',
      'Solicite avaliações dos clientes'
    ],
    seasonalTrends: [
      'Fim de ano: Serviços para festas e eventos',
      'Início de ano: Renovações e planos anuais',
      'O ano todo: Manutenção e serviços recorrentes'
    ],
    growthOpportunities: [
      'Agendamento online',
      'Sistema de assinatura mensal',
      'Programa de indicação',
      'Expansão de serviços complementares'
    ]
  },
  general: {
    sector: 'general',
    sectorName: 'Geral / Outros',
    trendingProducts: ['Produtos diversos', 'Itens variados', 'Mix de categorias'],
    recommendations: [
      'Analise quais categorias performam melhor',
      'Mantenha mix diversificado',
      'Teste novos produtos regularmente',
      'Ouça feedback dos clientes'
    ],
    seasonalTrends: [
      'Adapte-se às necessidades sazonais',
      'Acompanhe tendências do mercado',
      'Prepare-se para datas comemorativas'
    ],
    growthOpportunities: [
      'Identifique nicho mais lucrativo',
      'Especialize-se gradualmente',
      'Expanda canais de venda',
      'Construa presença digital'
    ]
  }
};

export function getSectorInsights(sector: string = 'general'): SectorInsights {
  return SECTOR_DATA[sector] || SECTOR_DATA.general;
}

export function analyzeProductTrends(
  sales: SalesData[],
  products: Product[],
  days: number = 30
): {
  topProducts: Array<{ product: Product; sales: number; revenue: number }>;
  growingProducts: Array<{ product: Product; growthRate: number }>;
  decliningProducts: Array<{ product: Product; declineRate: number }>;
} {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const recentSales = sales.filter(
    (sale) => new Date(sale.created_at) >= cutoffDate
  );

  const productSalesMap = new Map<string, { quantity: number; revenue: number }>();

  recentSales.forEach((sale) => {
    const current = productSalesMap.get(sale.product_id) || { quantity: 0, revenue: 0 };
    productSalesMap.set(sale.product_id, {
      quantity: current.quantity + sale.quantity,
      revenue: current.revenue + sale.total
    });
  });

  const topProducts = Array.from(productSalesMap.entries())
    .map(([productId, data]) => {
      const product = products.find((p) => p.id === productId);
      return product ? { product, sales: data.quantity, revenue: data.revenue } : null;
    })
    .filter((item): item is { product: Product; sales: number; revenue: number } => item !== null)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const halfwayDate = new Date(cutoffDate.getTime() + (Date.now() - cutoffDate.getTime()) / 2);

  const firstHalfSales = recentSales.filter(
    (sale) => new Date(sale.created_at) < halfwayDate
  );
  const secondHalfSales = recentSales.filter(
    (sale) => new Date(sale.created_at) >= halfwayDate
  );

  const firstHalfMap = new Map<string, number>();
  const secondHalfMap = new Map<string, number>();

  firstHalfSales.forEach((sale) => {
    firstHalfMap.set(sale.product_id, (firstHalfMap.get(sale.product_id) || 0) + sale.quantity);
  });

  secondHalfSales.forEach((sale) => {
    secondHalfMap.set(sale.product_id, (secondHalfMap.get(sale.product_id) || 0) + sale.quantity);
  });

  const growthData: Array<{ productId: string; growthRate: number }> = [];

  secondHalfMap.forEach((secondHalf, productId) => {
    const firstHalf = firstHalfMap.get(productId) || 0;
    if (firstHalf > 0) {
      const growthRate = ((secondHalf - firstHalf) / firstHalf) * 100;
      growthData.push({ productId, growthRate });
    }
  });

  const growingProducts = growthData
    .filter((item) => item.growthRate > 20)
    .sort((a, b) => b.growthRate - a.growthRate)
    .slice(0, 5)
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { product, growthRate: item.growthRate } : null;
    })
    .filter((item): item is { product: Product; growthRate: number } => item !== null);

  const decliningProducts = growthData
    .filter((item) => item.growthRate < -20)
    .sort((a, b) => a.growthRate - b.growthRate)
    .slice(0, 5)
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { product, growthRate: item.growthRate } : null;
    })
    .filter((item): item is { product: Product; declineRate: number } => item !== null);

  return {
    topProducts,
    growingProducts,
    decliningProducts
  };
}

export function generatePredictiveInsights(
  sales: SalesData[],
  products: Product[]
): {
  stockAlerts: Array<{ product: Product; daysUntilStockout: number }>;
  reorderSuggestions: Array<{ product: Product; suggestedQuantity: number }>;
} {
  const last30Days = sales.filter((sale) => {
    const saleDate = new Date(sale.created_at);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    return saleDate >= cutoff;
  });

  const productDemand = new Map<string, number>();

  last30Days.forEach((sale) => {
    const current = productDemand.get(sale.product_id) || 0;
    productDemand.set(sale.product_id, current + sale.quantity);
  });

  const stockAlerts: Array<{ product: Product; daysUntilStockout: number }> = [];
  const reorderSuggestions: Array<{ product: Product; suggestedQuantity: number }> = [];

  products.forEach((product) => {
    const monthlyDemand = productDemand.get(product.id) || 0;
    const dailyDemand = monthlyDemand / 30;

    if (dailyDemand > 0) {
      const daysUntilStockout = Math.floor(product.stock / dailyDemand);

      if (daysUntilStockout < 7) {
        stockAlerts.push({ product, daysUntilStockout });
      }

      if (product.stock < product.min_stock) {
        const suggestedQuantity = Math.ceil(dailyDemand * 30 - product.stock);
        reorderSuggestions.push({ product, suggestedQuantity });
      }
    }
  });

  stockAlerts.sort((a, b) => a.daysUntilStockout - b.daysUntilStockout);
  reorderSuggestions.sort((a, b) => b.suggestedQuantity - a.suggestedQuantity);

  return {
    stockAlerts: stockAlerts.slice(0, 5),
    reorderSuggestions: reorderSuggestions.slice(0, 5)
  };
}
