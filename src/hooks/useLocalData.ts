import { useState, useEffect } from 'react';
import { localDb } from '../lib/localDb';
import { initDB } from '../lib/db';

export const useLocalData = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError(null);

      await initDB();

      const [productsData, salesData, purchasesData, customersData, employeesData] = await Promise.all([
        localDb.products.getAll(),
        localDb.sales.getAll(),
        localDb.purchases.getAll(),
        localDb.customers.getAll(),
        localDb.employees.getAll(),
      ]);

      setProducts(productsData);
      setSales(salesData);
      setPurchases(purchasesData);
      setCustomers(customersData);
      setEmployees(employeesData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const addProduct = async (productData: any) => {
    try {
      const newProduct = await localDb.products.add(productData);
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (err) {
      console.error('Error adding product:', err);
      throw err;
    }
  };

  const updateProduct = async (id: string, productData: any) => {
    try {
      const updated = await localDb.products.update(id, productData);
      setProducts(prev => prev.map(p => p.id === id ? updated : p));
      return updated;
    } catch (err) {
      console.error('Error updating product:', err);
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await localDb.products.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
      throw err;
    }
  };

  const addCustomer = async (customerData: any) => {
    try {
      const newCustomer = await localDb.customers.add(customerData);
      setCustomers(prev => [...prev, newCustomer]);
      return newCustomer;
    } catch (err) {
      console.error('Error adding customer:', err);
      throw err;
    }
  };

  const updateCustomer = async (id: string, customerData: any) => {
    try {
      const updated = await localDb.customers.update(id, customerData);
      setCustomers(prev => prev.map(c => c.id === id ? updated : c));
      return updated;
    } catch (err) {
      console.error('Error updating customer:', err);
      throw err;
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      await localDb.customers.delete(id);
      setCustomers(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Error deleting customer:', err);
      throw err;
    }
  };

  const addSale = async (saleData: any) => {
    try {
      const newSale = await localDb.sales.add(saleData);
      const salesData = await localDb.sales.getAll();
      setSales(salesData);
      return newSale;
    } catch (err) {
      console.error('Error adding sale:', err);
      throw err;
    }
  };

  const addPurchase = async (purchaseData: any) => {
    try {
      const newPurchase = await localDb.purchases.add(purchaseData);
      const purchasesData = await localDb.purchases.getAll();
      setPurchases(purchasesData);
      return newPurchase;
    } catch (err) {
      console.error('Error adding purchase:', err);
      throw err;
    }
  };

  const addEmployee = async (employeeData: any) => {
    try {
      const newEmployee = await localDb.employees.add(employeeData);
      setEmployees(prev => [...prev, newEmployee]);
      return newEmployee;
    } catch (err) {
      console.error('Error adding employee:', err);
      throw err;
    }
  };

  const updateEmployee = async (id: string, employeeData: any) => {
    try {
      const updated = await localDb.employees.update(id, employeeData);
      setEmployees(prev => prev.map(e => e.id === id ? updated : e));
      return updated;
    } catch (err) {
      console.error('Error updating employee:', err);
      throw err;
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      await localDb.employees.delete(id);
      setEmployees(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      console.error('Error deleting employee:', err);
      throw err;
    }
  };

  return {
    products,
    sales,
    purchases,
    customers,
    employees,
    loading,
    error,
    refetch: fetchAll,
    addProduct,
    updateProduct,
    deleteProduct,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addSale,
    addPurchase,
    addEmployee,
    updateEmployee,
    deleteEmployee,
  };
};
