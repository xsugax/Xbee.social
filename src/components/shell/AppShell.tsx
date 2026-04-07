'use client';

import React, { useState, useEffect } from 'react';
import AuthScreen from '@/components/auth/AuthScreen';
import LoadingScreen from '@/components/loading/LoadingScreen';
import { useAuth } from '@/context/AuthContext';

type AppState = 'auth' | 'loading' | 'app';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { profile, loading: authLoading, isSupabaseConfigured } = useAuth();
  const [state, setState] = useState<AppState>('auth');

  useEffect(() => {
    if (authLoading) return;

    if (isSupabaseConfigured) {
      // Supabase mode: rely on session
      if (profile) {
        setState(prev => prev === 'app' ? 'app' : 'loading');
      } else {
        setState('auth');
      }
    } else {
      // Fallback: localStorage mode (demo)
      try {
        const remembered = localStorage.getItem('xbee_remembered');
        if (remembered === 'true') {
          setState('loading');
        }
      } catch {}
    }
  }, [authLoading, profile, isSupabaseConfigured]);

  const handleAuth = () => {
    setState('loading');
  };

  // When loading finishes, transition to app
  useEffect(() => {
    if (state === 'loading') {
      const timer = setTimeout(() => {
        setState('app');
      }, 3800);
      return () => clearTimeout(timer);
    }
  }, [state]);

  if (authLoading) {
    return <LoadingScreen />;
  }

  if (state === 'auth') {
    return <AuthScreen onAuth={handleAuth} />;
  }

  if (state === 'loading') {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
