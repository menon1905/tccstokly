import { getDB, generateId, getCurrentUserId } from './db';

export const localDb = {
  products: {
    getAll: async () => {
      const db = await getDB();
      const userId = getCurrentUserId();
      return await db.getAllFromIndex('products', 'by-user', userId);
    },
    getById: async (id: string) => {
      const db = await getDB();
      return await db.get('products', id);
    },
    add: async (product: any) => {
      const db = await getDB();
      const userId = getCurrentUserId();
      const newProduct = {
        ...product,
        id: generateId(),
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      await db.add('products', newProduct);
      return newProduct;
    },
    update: async (id: string, product: any) => {
      const db = await getDB();
      const existing = await db.get('products', id);
      if (!existing) throw new Error('Product not found');
      const updated = {
        ...existing,
        ...product,
        id,
        updated_at: new Date().toISOString(),
      };
      await db.put('products', updated);
      return updated;
    },
    delete: async (id: string) => {
      const db = await getDB();
      await db.delete('products', id);
    },
  },

  customers: {
    getAll: async () => {
      const db = await getDB();
      const userId = getCurrentUserId();
      return await db.getAllFromIndex('customers', 'by-user', userId);
    },
    getById: async (id: string) => {
      const db = await getDB();
      return await db.get('customers', id);
    },
    add: async (customer: any) => {
      const db = await getDB();
      const userId = getCurrentUserId();
      const newCustomer = {
        ...customer,
        id: generateId(),
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      await db.add('customers', newCustomer);
      return newCustomer;
    },
    update: async (id: string, customer: any) => {
      const db = await getDB();
      const existing = await db.get('customers', id);
      if (!existing) throw new Error('Customer not found');
      const updated = {
        ...existing,
        ...customer,
        id,
        updated_at: new Date().toISOString(),
      };
      await db.put('customers', updated);
      return updated;
    },
    delete: async (id: string) => {
      const db = await getDB();
      await db.delete('customers', id);
    },
  },

  sales: {
    getAll: async () => {
      const db = await getDB();
      const userId = getCurrentUserId();
      const sales = await db.getAllFromIndex('sales', 'by-user', userId);

      const products = await localDb.products.getAll();
      const customers = await localDb.customers.getAll();

      return sales.map(sale => ({
        ...sale,
        products: products.find(p => p.id === sale.product_id),
        customers: customers.find(c => c.id === sale.customer_id),
      }));
    },
    getById: async (id: string) => {
      const db = await getDB();
      return await db.get('sales', id);
    },
    add: async (sale: any) => {
      const db = await getDB();
      const userId = getCurrentUserId();
      const newSale = {
        ...sale,
        id: generateId(),
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      await db.add('sales', newSale);
      return newSale;
    },
    update: async (id: string, sale: any) => {
      const db = await getDB();
      const existing = await db.get('sales', id);
      if (!existing) throw new Error('Sale not found');
      const updated = {
        ...existing,
        ...sale,
        id,
        updated_at: new Date().toISOString(),
      };
      await db.put('sales', updated);
      return updated;
    },
    delete: async (id: string) => {
      const db = await getDB();
      await db.delete('sales', id);
    },
  },

  purchases: {
    getAll: async () => {
      const db = await getDB();
      const userId = getCurrentUserId();
      const purchases = await db.getAllFromIndex('purchases', 'by-user', userId);

      const products = await localDb.products.getAll();

      return purchases.map(purchase => ({
        ...purchase,
        products: products.find(p => p.id === purchase.product_id),
      }));
    },
    getById: async (id: string) => {
      const db = await getDB();
      return await db.get('purchases', id);
    },
    add: async (purchase: any) => {
      const db = await getDB();
      const userId = getCurrentUserId();
      const newPurchase = {
        ...purchase,
        id: generateId(),
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      await db.add('purchases', newPurchase);
      return newPurchase;
    },
    update: async (id: string, purchase: any) => {
      const db = await getDB();
      const existing = await db.get('purchases', id);
      if (!existing) throw new Error('Purchase not found');
      const updated = {
        ...existing,
        ...purchase,
        id,
        updated_at: new Date().toISOString(),
      };
      await db.put('purchases', updated);
      return updated;
    },
    delete: async (id: string) => {
      const db = await getDB();
      await db.delete('purchases', id);
    },
  },

  employees: {
    getAll: async () => {
      const db = await getDB();
      const userId = getCurrentUserId();
      return await db.getAllFromIndex('employees', 'by-user', userId);
    },
    getById: async (id: string) => {
      const db = await getDB();
      return await db.get('employees', id);
    },
    add: async (employee: any) => {
      const db = await getDB();
      const userId = getCurrentUserId();
      const newEmployee = {
        ...employee,
        id: generateId(),
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      await db.add('employees', newEmployee);
      return newEmployee;
    },
    update: async (id: string, employee: any) => {
      const db = await getDB();
      const existing = await db.get('employees', id);
      if (!existing) throw new Error('Employee not found');
      const updated = {
        ...existing,
        ...employee,
        id,
        updated_at: new Date().toISOString(),
      };
      await db.put('employees', updated);
      return updated;
    },
    delete: async (id: string) => {
      const db = await getDB();
      await db.delete('employees', id);
    },
  },

  users: {
    getByEmail: async (email: string) => {
      const db = await getDB();
      return await db.getFromIndex('users', 'by-email', email);
    },
    add: async (user: any) => {
      const db = await getDB();
      const newUser = {
        ...user,
        id: generateId(),
        created_at: new Date().toISOString(),
      };
      await db.add('users', newUser);
      return newUser;
    },
  },
};
