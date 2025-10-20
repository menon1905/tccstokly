import { supabase } from './supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
  };
}

export const supabaseAuth = {
  signUp: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });

      if (error) {
        return { user: null, error: error.message };
      }

      // Se o usuário foi criado mas não temos sessão (email precisa ser confirmado)
      if (data.user && !data.session) {
        return {
          user: null,
          error: 'Verifique seu email para confirmar a conta antes de fazer login.'
        };
      }

      // Se temos uma sessão, o usuário foi auto-confirmado e já está logado
      return {
        user: data.user ? {
          id: data.user.id,
          email: data.user.email || '',
          user_metadata: data.user.user_metadata
        } : null,
        error: null
      };
    } catch (err: any) {
      return { user: null, error: err.message || 'Failed to create user' };
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, error: error.message };
      }

      return {
        user: data.user ? {
          id: data.user.id,
          email: data.user.email || '',
          user_metadata: data.user.user_metadata
        } : null,
        error: null
      };
    } catch (err: any) {
      return { user: null, error: err.message || 'Failed to sign in' };
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
  },

  getSession: async () => {
    const { data: { session } } = await supabase.auth.getSession();

    return {
      user: session?.user ? {
        id: session.user.id,
        email: session.user.email || '',
        user_metadata: session.user.user_metadata
      } : null
    };
  },

  onAuthStateChange: (callback: (event: string, user: User | null) => void) => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const user = session?.user ? {
        id: session.user.id,
        email: session.user.email || '',
        user_metadata: session.user.user_metadata
      } : null;

      callback(event, user);
    });

    return {
      unsubscribe: () => {
        subscription.unsubscribe();
      }
    };
  }
};
