import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface BoltDB extends DBSchema {
  products: {
    key: string;
    value: {
      id: string;
      name: string;
      sku: string;
      category: string;
      price: number;
      cost: number;
      stock: number;
      min_stock: number;
      supplier: string;
      description: string;
      created_at: string;
      updated_at: string;
      user_id: string;
    };
    indexes: { 'by-user': string; 'by-sku': string };
  };
  customers: {
    key: string;
    value: {
      id: string;
      name: string;
      email: string;
      phone: string;
      company: string;
      total_purchases: number;
      last_purchase: string | null;
      status: string;
      created_at: string;
      updated_at: string;
      user_id: string;
    };
    indexes: { 'by-user': string; 'by-email': string };
  };
  sales: {
    key: string;
    value: {
      id: string;
      product_id: string;
      customer_id: string;
      quantity: number;
      unit_price: number;
      total: number;
      status: string;
      created_at: string;
      updated_at: string;
      user_id: string;
    };
    indexes: { 'by-user': string; 'by-date': string };
  };
  purchases: {
    key: string;
    value: {
      id: string;
      product_id: string;
      quantity: number;
      unit_cost: number;
      total: number;
      supplier: string;
      status: string;
      created_at: string;
      updated_at: string;
      user_id: string;
    };
    indexes: { 'by-user': string; 'by-date': string };
  };
  employees: {
    key: string;
    value: {
      id: string;
      name: string;
      email: string;
      phone: string;
      position: string;
      department: string;
      salary: number;
      hire_date: string;
      address: string;
      birth_date: string;
      document_number: string;
      status: string;
      user_id: string;
      created_at: string;
      updated_at: string;
    };
    indexes: { 'by-user': string; 'by-email': string };
  };
  users: {
    key: string;
    value: {
      id: string;
      email: string;
      password: string;
      created_at: string;
    };
    indexes: { 'by-email': string };
  };
}

let dbInstance: IDBPDatabase<BoltDB> | null = null;

export const initDB = async (): Promise<IDBPDatabase<BoltDB>> => {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<BoltDB>('bolt-erp-db', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('products')) {
        const productStore = db.createObjectStore('products', { keyPath: 'id' });
        productStore.createIndex('by-user', 'user_id');
        productStore.createIndex('by-sku', 'sku');
      }

      if (!db.objectStoreNames.contains('customers')) {
        const customerStore = db.createObjectStore('customers', { keyPath: 'id' });
        customerStore.createIndex('by-user', 'user_id');
        customerStore.createIndex('by-email', 'email');
      }

      if (!db.objectStoreNames.contains('sales')) {
        const salesStore = db.createObjectStore('sales', { keyPath: 'id' });
        salesStore.createIndex('by-user', 'user_id');
        salesStore.createIndex('by-date', 'created_at');
      }

      if (!db.objectStoreNames.contains('purchases')) {
        const purchasesStore = db.createObjectStore('purchases', { keyPath: 'id' });
        purchasesStore.createIndex('by-user', 'user_id');
        purchasesStore.createIndex('by-date', 'created_at');
      }

      if (!db.objectStoreNames.contains('employees')) {
        const employeeStore = db.createObjectStore('employees', { keyPath: 'id' });
        employeeStore.createIndex('by-user', 'user_id');
        employeeStore.createIndex('by-email', 'email');
      }

      if (!db.objectStoreNames.contains('users')) {
        const userStore = db.createObjectStore('users', { keyPath: 'id' });
        userStore.createIndex('by-email', 'email');
      }
    },
  });

  return dbInstance;
};

export const getDB = async (): Promise<IDBPDatabase<BoltDB>> => {
  if (!dbInstance) {
    return await initDB();
  }
  return dbInstance;
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const getCurrentUserId = (): string => {
  return localStorage.getItem('currentUserId') || 'default-user';
};

export const setCurrentUserId = (userId: string): void => {
  localStorage.setItem('currentUserId', userId);
};
