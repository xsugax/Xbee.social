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
      console.log('[Xbee Auth] Checking remember me:', remembered);
      if (remembered === 'true') {
        console.log('[Xbee Auth] Auto-login → skipping auth screen');
        setState('loading');
      } else {
        console.log('[Xbee Auth] No saved session → showing login');
      }
    } catch (e) {
      console.warn('[Xbee Auth] localStorage error:', e);
    }
  }, []);

  const handleAuth = () => {
    console.log('[Xbee Auth] Login successful → transitioning to loading');
    setState('loading');
  };

  // When loading finishes (LoadingScreen hides itself after ~3s), transition to app
  useEffect(() => {
    if (state === 'loading') {
      console.log('[Xbee Auth] Loading screen started');
      const timer = setTimeout(() => {
        console.log('[Xbee Auth] Loading complete → entering app');
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
