import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Product, Sale, Customer, Purchase } from '../types';

export const useSupabaseData = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [productsRes, salesRes, customersRes, purchasesRes] = await Promise.all([
        supabase.from('products').select('*'),
        supabase.from('sales').select('*'),
        supabase.from('customers').select('*'),
        supabase.from('purchases').select('*'),
      ]);

      if (productsRes.error) throw productsRes.error;
      if (salesRes.error) throw salesRes.error;
      if (customersRes.error) throw customersRes.error;
      if (purchasesRes.error) throw purchasesRes.error;

      setProducts(productsRes.data || []);
      setSales(salesRes.data || []);
      setCustomers(customersRes.data || []);
      setPurchases(purchasesRes.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData: Omit<Product, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error) throw error;
      setProducts(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setProducts(prev => prev.map(p => p.id === id ? data : p));
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const addSale = async (saleData: Omit<Sale, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .insert([saleData])
        .select()
        .single();

      if (error) throw error;
      setSales(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateSale = async (id: string, saleData: Partial<Sale>) => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .update(saleData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setSales(prev => prev.map(s => s.id === id ? data : s));
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteSale = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSales(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const addCustomer = async (customerData: Omit<Customer, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert([customerData])
        .select()
        .single();

      if (error) throw error;
      setCustomers(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateCustomer = async (id: string, customerData: Partial<Customer>) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .update(customerData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setCustomers(prev => prev.map(c => c.id === id ? data : c));
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCustomers(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const addPurchase = async (purchaseData: Omit<Purchase, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('purchases')
        .insert([purchaseData])
        .select()
        .single();

      if (error) throw error;
      setPurchases(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updatePurchase = async (id: string, purchaseData: Partial<Purchase>) => {
    try {
      const { data, error } = await supabase
        .from('purchases')
        .update(purchaseData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setPurchases(prev => prev.map(p => p.id === id ? data : p));
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deletePurchase = async (id: string) => {
    try {
      const { error } = await supabase
        .from('purchases')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setPurchases(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    products,
    sales,
    customers,
    purchases,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    addSale,
    updateSale,
    deleteSale,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addPurchase,
    updatePurchase,
    deletePurchase,
    refetch: fetchData,
  };
};
