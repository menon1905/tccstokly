import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle auth state change from URL
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          throw error;
        }

        // Check if we have URL parameters for email confirmation
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        const accessToken = urlParams.get('access_token') || hashParams.get('access_token');
        const refreshToken = urlParams.get('refresh_token') || hashParams.get('refresh_token');
        const type = urlParams.get('type') || hashParams.get('type');
        const tokenHash = urlParams.get('token_hash') || hashParams.get('token_hash');

        if (accessToken && refreshToken) {
          // Set the session with the tokens from the URL
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            console.error('Set session error:', sessionError);
            throw sessionError;
          }

          if (sessionData.user) {
            setStatus('success');
            setMessage('Email confirmado com sucesso! Redirecionando...');
            
            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
              navigate('/', { replace: true });
            }, 2000);
            return;
          }
        }

        // If we have a session already, redirect
        if (data.session && data.user) {
          setStatus('success');
          setMessage('Já autenticado! Redirecionando...');
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 1000);
          return;
        }

        // If no session and no tokens, show error
        throw new Error('Não foi possível confirmar o email. Tente fazer login novamente.');
        
      } catch (error) {
        console.error('Erro na confirmação:', error);
        setStatus('error');
        if (error instanceof Error) {
          setMessage(`Erro na confirmação: ${error.message}`);
        } else {
          setMessage('Erro desconhecido na confirmação do email');
        }
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-white font-bold text-2xl">S</span>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">STOKLY ERP</h1>
        
        {status === 'loading' && (
          <div className="space-y-4">
            <Loader className="w-8 h-8 text-purple-600 mx-auto animate-spin" />
            <p className="text-gray-600">Confirmando seu email...</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="space-y-4">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto" />
            <p className="text-green-600 font-medium">{message}</p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="space-y-4">
            <XCircle className="w-8 h-8 text-red-600 mx-auto" />
            <p className="text-red-600 font-medium">{message}</p>
            <button
              onClick={() => navigate('/', { replace: true })}
              className="w-full px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Voltar ao Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};