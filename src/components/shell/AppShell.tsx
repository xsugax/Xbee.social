'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import AuthScreen from '@/components/auth/AuthScreen';
import LoadingScreen from '@/components/loading/LoadingScreen';
import OnboardingScreen from '@/components/onboarding/OnboardingScreen';
import { useAuth } from '@/context/AuthContext';

type AppState = 'loading' | 'auth' | 'onboarding' | 'app';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { profile, loading: authLoading, isSupabaseConfigured } = useAuth();
  const [state, setState] = useState<AppState>('loading');
  const hasCheckedSession = useRef(false);

  // Determine if a user is already authenticated (session exists)
  useEffect(() => {
    if (authLoading || hasCheckedSession.current) return;
    hasCheckedSession.current = true;

    if (isSupabaseConfigured) {
      // Supabase mode: rely on session
      if (profile) {
        setState('loading'); // loading screen will transition to app
      } else {
        // No session — loading screen first, then auth
        setState('loading');
      }
    } else {
      // Fallback: localStorage mode (demo)
      try {
        const remembered = localStorage.getItem('xbee_remembered');
        const session = localStorage.getItem('xbee_session');
        if (remembered === 'true' && session) {
          setState('loading'); // loading screen → will detect session → app
        } else {
          setState('loading'); // loading screen first, then auth
        }
      } catch {
        setState('loading');
      }
    }
  }, [authLoading, profile, isSupabaseConfigured]);

  const handleAuth = useCallback(() => {
    setState('loading');
  }, []);

  // When loading finishes, determine next state
  useEffect(() => {
    if (state !== 'loading') return;

    const timer = setTimeout(() => {
      if (isSupabaseConfigured) {
        // Supabase mode
        if (profile) {
          // Check onboarding
          const onboarded = localStorage.getItem(`xbee_onboarded_${profile.id}`);
          setState(onboarded ? 'app' : 'onboarding');
        } else {
          setState('auth');
        }
      } else {
        // LocalStorage mode
        try {
          const session = localStorage.getItem('xbee_session');
          const remembered = localStorage.getItem('xbee_remembered');

          if (session && remembered === 'true') {
            const parsed = JSON.parse(session);
            const userId = parsed.username || 'local';
            const onboarded = localStorage.getItem(`xbee_onboarded_${userId}`);
            setState(onboarded ? 'app' : 'onboarding');
          } else {
            setState('auth');
          }
        } catch {
          setState('auth');
        }
      }
      }, 1500); // 1.5s loading screen

    return () => clearTimeout(timer);
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
    // Also ensure remember-me is set so they skip auth on next visit
    if (!isSupabaseConfigured) {
      try { localStorage.setItem('xbee_remembered', 'true'); } catch {}
    }
    setState('app');
  }, [isSupabaseConfigured, profile]);

  if (authLoading) {
    return <LoadingScreen />;
  }

  // Always show LoadingScreen in loading state (3-5 seconds for everyone)
  if (state === 'loading') {
    return <LoadingScreen />;
  }

  if (state === 'auth') {
    return <AuthScreen onAuth={handleAuth} />;
  }

  if (state === 'onboarding') {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return <>{children}</>;
}
