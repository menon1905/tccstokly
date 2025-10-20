import { localDb } from './localDb';
import { setCurrentUserId, generateId } from './db';

export interface User {
  id: string;
  email: string;
  business_name?: string;
  business_sector?: string;
  created_at: string;
}

const notifyAuthChange = () => {
  window.dispatchEvent(new CustomEvent('auth-state-change'));
};

export const auth = {
  signUp: async (email: string, password: string, businessName?: string, businessSector?: string): Promise<{ user: User; error: null } | { user: null; error: string }> => {
    try {
      const existingUser = await localDb.users.getByEmail(email);
      if (existingUser) {
        return { user: null, error: 'User already exists' };
      }

      const hashedPassword = btoa(password);
      const newUser = await localDb.users.add({
        email,
        password: hashedPassword,
        business_name: businessName || '',
        business_sector: businessSector || 'general',
      });

      setCurrentUserId(newUser.id);
      localStorage.setItem('currentUser', JSON.stringify({
        id: newUser.id,
        email: newUser.email,
        business_name: newUser.business_name,
        business_sector: newUser.business_sector
      }));

      notifyAuthChange();

      return {
        user: {
          id: newUser.id,
          email: newUser.email,
          business_name: newUser.business_name,
          business_sector: newUser.business_sector,
          created_at: newUser.created_at,
        },
        error: null,
      };
    } catch (error) {
      return { user: null, error: 'Failed to create user' };
    }
  },

  signIn: async (email: string, password: string): Promise<{ user: User; error: null } | { user: null; error: string }> => {
    try {
      const user = await localDb.users.getByEmail(email);
      if (!user) {
        return { user: null, error: 'Invalid credentials' };
      }

      const hashedPassword = btoa(password);
      if (user.password !== hashedPassword) {
        return { user: null, error: 'Invalid credentials' };
      }

      setCurrentUserId(user.id);
      localStorage.setItem('currentUser', JSON.stringify({
        id: user.id,
        email: user.email,
        business_name: user.business_name,
        business_sector: user.business_sector
      }));

      notifyAuthChange();

      return {
        user: {
          id: user.id,
          email: user.email,
          business_name: user.business_name,
          business_sector: user.business_sector,
          created_at: user.created_at,
        },
        error: null,
      };
    } catch (error) {
      return { user: null, error: 'Failed to sign in' };
    }
  },

  signOut: async (): Promise<void> => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserId');
    notifyAuthChange();
  },

  getSession: async (): Promise<{ user: User | null }> => {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      return { user: null };
    }

    try {
      const user = JSON.parse(userStr);
      return { user };
    } catch {
      return { user: null };
    }
  },

  onAuthStateChange: (callback: (event: string, user: User | null) => void) => {
    const checkAuth = () => {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          callback('SIGNED_IN', user);
        } catch {
          callback('SIGNED_OUT', null);
        }
      } else {
        callback('SIGNED_OUT', null);
      }
    };

    checkAuth();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'currentUser') {
        checkAuth();
      }
    };

    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('auth-state-change', handleAuthChange);

    return {
      unsubscribe: () => {
        window.removeEventListener('storage', handleStorage);
        window.removeEventListener('auth-state-change', handleAuthChange);
      },
    };
  },
};
