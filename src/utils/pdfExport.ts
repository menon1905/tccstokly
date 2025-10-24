import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const formatCurrencyForPDF = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDateForPDF = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const exportProductsToPDF = (products: any[]) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Relatório de Estoque', 14, 20);

  doc.setFontSize(10);
  doc.text(`Gerado em: ${formatDateForPDF(new Date())}`, 14, 28);

  const tableData = products.map(product => [
    product.sku,
    product.name,
    product.category,
    product.stock.toString(),
    formatCurrencyForPDF(product.cost),
    formatCurrencyForPDF(product.price),
    formatCurrencyForPDF(product.price * product.stock),
  ]);

  autoTable(doc, {
    head: [['SKU', 'Produto', 'Categoria', 'Estoque', 'Custo', 'Preço', 'Valor Total']],
    body: tableData,
    startY: 35,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [139, 92, 246] },
  });

  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const lowStock = products.filter(p => p.stock <= p.min_stock).length;

  const finalY = (doc as any).lastAutoTable.finalY || 35;
  doc.setFontSize(10);
  doc.text(`Total de Produtos: ${products.length}`, 14, finalY + 10);
  doc.text(`Produtos com Estoque Baixo: ${lowStock}`, 14, finalY + 17);
  doc.text(`Valor Total em Estoque: ${formatCurrencyForPDF(totalValue)}`, 14, finalY + 24);

  doc.save(`relatorio-estoque-${new Date().getTime()}.pdf`);
};

export const exportSalesToPDF = (sales: any[]) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Relatório de Vendas', 14, 20);

  doc.setFontSize(10);
  doc.text(`Gerado em: ${formatDateForPDF(new Date())}`, 14, 28);

  const tableData = sales.map(sale => [
    formatDateForPDF(sale.created_at),
    sale.customers?.name || 'N/A',
    sale.products?.name || 'N/A',
    sale.quantity.toString(),
    formatCurrencyForPDF(sale.unit_price),
    formatCurrencyForPDF(sale.total),
    sale.status === 'completed' ? 'Concluída' : sale.status,
  ]);

  autoTable(doc, {
    head: [['Data', 'Cliente', 'Produto', 'Qtd', 'Preço Unit.', 'Total', 'Status']],
    body: tableData,
    startY: 35,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [16, 185, 129] },
  });

  const totalRevenue = sales.reduce((sum, s) => sum + (s.total || 0), 0);
  const totalQuantity = sales.reduce((sum, s) => sum + (s.quantity || 0), 0);

  const finalY = (doc as any).lastAutoTable.finalY || 35;
  doc.setFontSize(10);
  doc.text(`Total de Vendas: ${sales.length}`, 14, finalY + 10);
  doc.text(`Quantidade Total Vendida: ${totalQuantity} unidades`, 14, finalY + 17);
  doc.text(`Receita Total: ${formatCurrencyForPDF(totalRevenue)}`, 14, finalY + 24);

  doc.save(`relatorio-vendas-${new Date().getTime()}.pdf`);
};

export const exportPurchasesToPDF = (purchases: any[]) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Relatório de Compras', 14, 20);

  doc.setFontSize(10);
  doc.text(`Gerado em: ${formatDateForPDF(new Date())}`, 14, 28);

  const tableData = purchases.map(purchase => [
    formatDateForPDF(purchase.created_at),
    purchase.supplier,
    purchase.products?.name || 'N/A',
    purchase.quantity.toString(),
    formatCurrencyForPDF(purchase.unit_cost),
    formatCurrencyForPDF(purchase.total),
    purchase.status === 'pending' ? 'Pendente' : purchase.status === 'received' ? 'Recebido' : purchase.status,
  ]);

  autoTable(doc, {
    head: [['Data', 'Fornecedor', 'Produto', 'Qtd', 'Custo Unit.', 'Total', 'Status']],
    body: tableData,
    startY: 35,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [37, 99, 235] },
  });

  const totalSpent = purchases.reduce((sum, p) => sum + (p.total || 0), 0);
  const pendingPurchases = purchases.filter(p => p.status === 'pending').length;

  const finalY = (doc as any).lastAutoTable.finalY || 35;
  doc.setFontSize(10);
  doc.text(`Total de Compras: ${purchases.length}`, 14, finalY + 10);
  doc.text(`Compras Pendentes: ${pendingPurchases}`, 14, finalY + 17);
  doc.text(`Valor Total Gasto: ${formatCurrencyForPDF(totalSpent)}`, 14, finalY + 24);

  doc.save(`relatorio-compras-${new Date().getTime()}.pdf`);
};

export const exportCustomersToPDF = (customers: any[]) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Relatório de Clientes', 14, 20);

  doc.setFontSize(10);
  doc.text(`Gerado em: ${formatDateForPDF(new Date())}`, 14, 28);

  const tableData = customers.map(customer => [
    customer.name,
    customer.email,
    customer.phone,
    customer.company || '-',
    formatCurrencyForPDF(customer.total_purchases || 0),
    customer.status === 'active' ? 'Ativo' : 'Inativo',
  ]);

  autoTable(doc, {
    head: [['Nome', 'Email', 'Telefone', 'Empresa', 'Total Compras', 'Status']],
    body: tableData,
    startY: 35,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [234, 88, 12] },
  });

  const totalValue = customers.reduce((sum, c) => sum + (c.total_purchases || 0), 0);
  const activeCustomers = customers.filter(c => c.status === 'active').length;

  const finalY = (doc as any).lastAutoTable.finalY || 35;
  doc.setFontSize(10);
  doc.text(`Total de Clientes: ${customers.length}`, 14, finalY + 10);
  doc.text(`Clientes Ativos: ${activeCustomers}`, 14, finalY + 17);
  doc.text(`Valor Total em Vendas: ${formatCurrencyForPDF(totalValue)}`, 14, finalY + 24);

  doc.save(`relatorio-clientes-${new Date().getTime()}.pdf`);
};

export const exportFinancialReportToPDF = (data: {
  sales: any[];
  purchases: any[];
  startDate?: string;
  endDate?: string;
}) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Relatório Financeiro', 14, 20);

  doc.setFontSize(10);
  doc.text(`Gerado em: ${formatDateForPDF(new Date())}`, 14, 28);
  if (data.startDate && data.endDate) {
    doc.text(`Período: ${formatDateForPDF(data.startDate)} a ${formatDateForPDF(data.endDate)}`, 14, 35);
  }

  const totalRevenue = data.sales.reduce((sum, s) => sum + (s.total || 0), 0);
  const totalExpenses = data.purchases.reduce((sum, p) => sum + (p.total || 0), 0);
  const profit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (profit / totalRevenue * 100).toFixed(2) : '0.00';

  const startY = data.startDate && data.endDate ? 45 : 38;

  doc.setFontSize(12);
  doc.text('Resumo Financeiro', 14, startY);

  doc.setFontSize(10);
  doc.text(`Receita Total: ${formatCurrencyForPDF(totalRevenue)}`, 14, startY + 10);
  doc.text(`Despesas Totais: ${formatCurrencyForPDF(totalExpenses)}`, 14, startY + 17);
  doc.text(`Lucro: ${formatCurrencyForPDF(profit)}`, 14, startY + 24);
  doc.text(`Margem de Lucro: ${profitMargin}%`, 14, startY + 31);

  doc.setFontSize(12);
  doc.text('Detalhamento de Vendas', 14, startY + 45);

  const salesData = data.sales.slice(0, 20).map(sale => [
    formatDateForPDF(sale.created_at),
    sale.customers?.name || 'N/A',
    sale.products?.name || 'N/A',
    formatCurrencyForPDF(sale.total),
  ]);

  autoTable(doc, {
    head: [['Data', 'Cliente', 'Produto', 'Valor']],
    body: salesData,
    startY: startY + 50,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [16, 185, 129] },
  });

  const salesFinalY = (doc as any).lastAutoTable.finalY || startY + 50;

  doc.setFontSize(12);
  doc.text('Detalhamento de Compras', 14, salesFinalY + 15);

  const purchasesData = data.purchases.slice(0, 20).map(purchase => [
    formatDateForPDF(purchase.created_at),
    purchase.supplier,
    purchase.products?.name || 'N/A',
    formatCurrencyForPDF(purchase.total),
  ]);

  autoTable(doc, {
    head: [['Data', 'Fornecedor', 'Produto', 'Valor']],
    body: purchasesData,
    startY: salesFinalY + 20,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [37, 99, 235] },
  });

  doc.save(`relatorio-financeiro-${new Date().getTime()}.pdf`);
};
