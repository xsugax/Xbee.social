'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AuthScreen from '@/components/auth/AuthScreen';
import LoadingScreen from '@/components/loading/LoadingScreen';
import OnboardingScreen from '@/components/onboarding/OnboardingScreen';
import { useAuth } from '@/context/AuthContext';

type AppState = 'auth' | 'loading' | 'onboarding' | 'app';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { profile, loading: authLoading, isSupabaseConfigured } = useAuth();
  const [state, setState] = useState<AppState>('auth');

  useEffect(() => {
    if (authLoading) return;

    if (isSupabaseConfigured) {
      // Supabase mode: rely on session
      if (profile) {
        setState(prev => prev === 'app' || prev === 'onboarding' ? prev : 'loading');
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

  // When loading finishes, check if onboarding needed
  useEffect(() => {
    if (state === 'loading') {
      const timer = setTimeout(() => {
        let userId = 'local';
        if (isSupabaseConfigured && profile) {
          userId = profile.id;
        } else {
          try {
            const session = JSON.parse(localStorage.getItem('xbee_session') || '{}');
            userId = session.username || 'local';
          } catch {}
        }
        const onboarded = localStorage.getItem(`xbee_onboarded_${userId}`);
        setState(onboarded ? 'app' : 'onboarding');
      }, 3800);
      return () => clearTimeout(timer);
    }
  }, [state, profile, isSupabaseConfigured]);

  const handleOnboardingComplete = useCallback(() => {
    let userId = 'local';
    if (isSupabaseConfigured && profile) {
      userId = profile.id;
    } else {
      try {
        const session = JSON.parse(localStorage.getItem('xbee_session') || '{}');
        userId = session.username || 'local';
      } catch {}
    }
    localStorage.setItem(`xbee_onboarded_${userId}`, 'true');
    setState('app');
  }, [isSupabaseConfigured, profile]);

  if (authLoading) {
    return <LoadingScreen />;
  }

  if (state === 'auth') {
    return <AuthScreen onAuth={handleAuth} />;
  }

  if (state === 'loading') {
    return <LoadingScreen />;
  }

  if (state === 'onboarding') {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return <>{children}</>;
}
