import { localDb } from './localDb';
import { setCurrentUserId, generateId } from './db';

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export const auth = {
  signUp: async (email: string, password: string): Promise<{ user: User; error: null } | { user: null; error: string }> => {
    try {
      const existingUser = await localDb.users.getByEmail(email);
      if (existingUser) {
        return { user: null, error: 'User already exists' };
      }

      const hashedPassword = btoa(password);
      const newUser = await localDb.users.add({
        email,
        password: hashedPassword,
      });

      setCurrentUserId(newUser.id);
      localStorage.setItem('currentUser', JSON.stringify({ id: newUser.id, email: newUser.email }));

      return {
        user: {
          id: newUser.id,
          email: newUser.email,
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
      localStorage.setItem('currentUser', JSON.stringify({ id: user.id, email: user.email }));

      return {
        user: {
          id: user.id,
          email: user.email,
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

    window.addEventListener('storage', handleStorage);

    return {
      unsubscribe: () => {
        window.removeEventListener('storage', handleStorage);
      },
    };
  },
};
