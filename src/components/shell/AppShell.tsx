'use client';

import React, { useState, useEffect } from 'react';
import AuthScreen from '@/components/auth/AuthScreen';
import LoadingScreen from '@/components/loading/LoadingScreen';

type AppState = 'auth' | 'loading' | 'app';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>('auth');

  // Auto-login if "Remember me" was checked previously
  useEffect(() => {
    try {
      const remembered = localStorage.getItem('xbee_remembered');
      if (remembered === 'true') {
        setState('loading');
      }
    } catch (e) {
      // localStorage unavailable
    }
  }, []);

  const handleAuth = () => {
    setState('loading');
  };

  // When loading finishes (LoadingScreen hides itself after ~3s), transition to app
  useEffect(() => {
    if (state === 'loading') {
      const timer = setTimeout(() => {
        setState('app');
      }, 3800);
      return () => clearTimeout(timer);
    }
  }, [state]);

  if (state === 'auth') {
    return <AuthScreen onAuth={handleAuth} />;
  }

  if (state === 'loading') {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
