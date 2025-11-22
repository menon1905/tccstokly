import { useState, useEffect } from 'react';

const STORAGE_KEYS = {
  PRODUCTS: 'erp_products',
  CUSTOMERS: 'erp_customers',
  SALES: 'erp_sales',
  PURCHASES: 'erp_purchases',
  AI_INSIGHTS: 'erp_ai_insights',
};

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const getStoredData = (key: string) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error(`Error reading ${key}:`, err);
    return [];
  }
};

const saveData = (key: string, data: any[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving ${key}:`, err);
  }
};

export const useLocalData = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setProducts(getStoredData(STORAGE_KEYS.PRODUCTS));
    setCustomers(getStoredData(STORAGE_KEYS.CUSTOMERS));
    setSales(getStoredData(STORAGE_KEYS.SALES));
    setPurchases(getStoredData(STORAGE_KEYS.PURCHASES));
    setAiInsights(getStoredData(STORAGE_KEYS.AI_INSIGHTS));
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      saveData(STORAGE_KEYS.PRODUCTS, products);
    }
  }, [products, loading]);

  useEffect(() => {
    if (!loading) {
      saveData(STORAGE_KEYS.CUSTOMERS, customers);
    }
  }, [customers, loading]);

  useEffect(() => {
    if (!loading) {
      saveData(STORAGE_KEYS.SALES, sales);
    }
  }, [sales, loading]);

  useEffect(() => {
    if (!loading) {
      saveData(STORAGE_KEYS.PURCHASES, purchases);
    }
  }, [purchases, loading]);

  useEffect(() => {
    if (!loading) {
      saveData(STORAGE_KEYS.AI_INSIGHTS, aiInsights);
    }
  }, [aiInsights, loading]);

  const addProduct = (product: any) => {
    const newProduct = {
      ...product,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id: string, updates: any) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const addCustomer = (customer: any) => {
    const newCustomer = {
      ...customer,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      total_purchases: 0,
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    return newCustomer;
  };

  const updateCustomer = (id: string, updates: any) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c
      )
    );
  };

  const deleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  const addSale = (sale: any) => {
    const newSale = {
      ...sale,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const product = products.find((p) => p.id === sale.product_id);
    const customer = customers.find((c) => c.id === sale.customer_id);

    if (product) {
      newSale.products = {
        name: product.name,
        sku: product.sku,
      };
      updateProduct(product.id, {
        stock: product.stock - sale.quantity,
      });
    }

    if (customer) {
      newSale.customers = {
        name: customer.name,
        email: customer.email,
      };
      updateCustomer(customer.id, {
        total_purchases: (customer.total_purchases || 0) + sale.total,
        last_purchase: new Date().toISOString(),
      });
    }

    setSales((prev) => [newSale, ...prev]);
    return newSale;
  };

  const deleteSale = (id: string) => {
    setSales((prev) => prev.filter((s) => s.id !== id));
  };

  const addPurchase = (purchase: any) => {
    const newPurchase = {
      ...purchase,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const product = products.find((p) => p.id === purchase.product_id);

    if (product) {
      newPurchase.products = {
        name: product.name,
        sku: product.sku,
      };
      updateProduct(product.id, {
        stock: product.stock + purchase.quantity,
      });
    }

    setPurchases((prev) => [newPurchase, ...prev]);
    return newPurchase;
  };

  const deletePurchase = (id: string) => {
    setPurchases((prev) => prev.filter((p) => p.id !== id));
  };

  const refetch = () => {
    setProducts(getStoredData(STORAGE_KEYS.PRODUCTS));
    setCustomers(getStoredData(STORAGE_KEYS.CUSTOMERS));
    setSales(getStoredData(STORAGE_KEYS.SALES));
    setPurchases(getStoredData(STORAGE_KEYS.PURCHASES));
    setAiInsights(getStoredData(STORAGE_KEYS.AI_INSIGHTS));
  };

  return {
    products,
    customers,
    sales,
    purchases,
    aiInsights,
    loading,
    error,
    refetch,
    setProducts,
    setCustomers,
    setSales,
    setPurchases,
    setAiInsights,
    addProduct,
    updateProduct,
    deleteProduct,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addSale,
    deleteSale,
    addPurchase,
    deletePurchase,
  };
};
