'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { getSupabase } from '@/lib/supabase';
import { Profile } from '@/lib/database.types';
import { User, TrustProfile, VerificationType } from '@/types';

interface AuthState {
  user: SupabaseUser | null;
  profile: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string, displayName: string) => Promise<{ error?: string; needsConfirmation?: boolean }>;
  signIn: (emailOrUsername: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<boolean>;
  isSupabaseConfigured: boolean;
}

const AuthContext = createContext<AuthState | null>(null);

// Convert DB profile to app User type
const validTiers = ['new', 'building', 'established', 'trusted', 'authority', 'diamond', 'legendary'];
const validVerifications = ['none', 'identity', 'authority', 'government', 'business', 'celebrity', 'creator', 'official'];

function profileToUser(profile: Profile): User {
  const trust: TrustProfile = {
    score: profile.trust_score ?? 50,
    tier: (validTiers.includes(profile.trust_tier) ? profile.trust_tier : 'new') as User['trust']['tier'],
    identityVerified: profile.verification !== 'none',
    behaviorSignals: [],
    reachMultiplier: profile.trust_score >= 80 ? 2.0 : 1.0,
    monetizationUnlocked: profile.trust_score >= 70,
    scamFlags: 0,
    reportCount: 0,
    accountAge: Math.floor((Date.now() - new Date(profile.created_at).getTime()) / 86400000),
    consistencyScore: 50,
    lastUpdated: profile.updated_at,
  };

  return {
    id: profile.id,
    username: profile.username,
    displayName: profile.display_name,
    avatar: profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`,
    coverImage: (profile as any).cover_image || '',
    bio: profile.bio,
    verified: profile.verified,
    verification: (validVerifications.includes(profile.verification) ? profile.verification : 'none') as VerificationType,
    authenticityScore: profile.trust_score,
    trust,
    followers: profile.followers_count,
    following: profile.following_count,
    joinedAt: profile.created_at,
    badges: (profile.badges as any[]) || [],
    streak: profile.streak,
    invitesRemaining: profile.invites_remaining,
  };
}

// ─── LocalStorage auth helpers ───────────────────────────────────
interface LocalUser {
  email: string;
  username: string;
  displayName: string;
  password: string; // hashed
  createdAt: string;
}

function getLocalUsers(): LocalUser[] {
  try { return JSON.parse(localStorage.getItem('xbee_users') || '[]'); } catch { return []; }
}

function saveLocalUsers(users: LocalUser[]) {
  localStorage.setItem('xbee_users', JSON.stringify(users));
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'xbee_salt_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function ensureLocalDefaults() {
  const users = getLocalUsers();
  const defaults: LocalUser[] = [
    { email: 'test@xbee.com', username: 'testuser', displayName: 'Test User', password: 'test1234', createdAt: '2024-01-01' },
    { email: 'alex@xbee.com', username: 'alexchen', displayName: 'Alex Chen', password: 'alex1234', createdAt: '2024-01-01' },
    { email: 'demo@xbee.com', username: 'demo', displayName: 'Demo Account', password: 'demo1234', createdAt: '2024-06-01' },
  ];
  let changed = false;
  for (const d of defaults) {
    if (!users.find(u => u.email === d.email)) {
      users.push(d);
      changed = true;
    }
  }
  if (changed) saveLocalUsers(users);
}

// Check if Supabase env vars exist — but also detect if they actually work
const SUPABASE_ENVS_SET = !!(
  typeof process !== 'undefined' &&
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your-project-url-here'
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(SUPABASE_ENVS_SET);
  const supabaseChecked = useRef(false);

  // On mount: test if Supabase actually works; if not, fall back to localStorage
  useEffect(() => {
    ensureLocalDefaults();

    if (!SUPABASE_ENVS_SET) {
      setIsSupabaseConfigured(false);
      setLoading(false);
      return;
    }

    // Test Supabase connectivity
    async function testSupabase() {
      try {
        const supabase = getSupabase();
        // Timeout-based check: if the fetch takes >3s or throws, assume broken
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);
        const { error } = await supabase.from('profiles').select('id', { count: 'exact', head: true }).abortSignal(controller.signal);
        clearTimeout(timeout);
        if (error) {
          throw error;
        }
        // Supabase works — proceed normally
        setIsSupabaseConfigured(true);

        // Get initial session
        const { data: { session: s } } = await supabase.auth.getSession();
        setSession(s);
        setUser(s?.user ?? null);
        if (s?.user) {
          const { data } = await supabase.from('profiles').select('*').eq('id', s.user.id).single();
          if (data) setProfile(profileToUser(data));
        }
        setLoading(false);

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
          setSession(s);
          setUser(s?.user ?? null);
          if (s?.user) {
            supabase.from('profiles').select('*').eq('id', s.user.id).single().then(({ data }) => {
              if (data) setProfile(profileToUser(data));
            });
          } else {
            setProfile(null);
          }
        });

        supabaseChecked.current = true;
        return () => subscription.unsubscribe();
      } catch {
        // Supabase is configured but unreachable — fall back to localStorage
        console.warn('Supabase unreachable. Falling back to localStorage auth.');
        setIsSupabaseConfigured(false);
        setLoading(false);
      }
    }

    testSupabase();
  }, []);

  // Update online status (Supabase mode only)
  useEffect(() => {
    if (!isSupabaseConfigured || !user) return;
    const supabase = getSupabase();

    supabase.from('profiles').update({ is_online: true, last_seen: new Date().toISOString() }).eq('id', user.id).then(() => {});

    const handleUnload = () => {
      navigator.sendBeacon?.(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}`, JSON.stringify({ is_online: false, last_seen: new Date().toISOString() }));
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      supabase.from('profiles').update({ is_online: false, last_seen: new Date().toISOString() }).eq('id', user.id).then(() => {});
    };
  }, [isSupabaseConfigured, user]);

  // ─── Sign Up ──────────────────────────────────────────────
  const signUp = useCallback(async (email: string, password: string, username: string, displayName: string) => {
    if (isSupabaseConfigured) {
      // Supabase signup
      try {
        const supabase = getSupabase();
        const { data: existing } = await supabase.from('profiles').select('id').ilike('username', username).single();
        if (existing) return { error: 'Username is already taken' };

        const { data, error } = await supabase.auth.signUp({
          email, password,
          options: { data: { username, display_name: displayName } },
        });
        if (error) return { error: error.message };
        if (data.user && !data.session) return { needsConfirmation: true };
        if (data.user) {
          const { data: profData } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
          if (profData) setProfile(profileToUser(profData));
        }
        return {};
      } catch (e: any) {
        return { error: 'Network error. Please try again.' };
      }
    }

    // LocalStorage signup
    const users = getLocalUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { error: 'An account with this email already exists' };
    }
    if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
      return { error: 'This username is already taken' };
    }
    const hashedPw = await hashPassword(password);
    users.push({ email: email.toLowerCase(), username: username.toLowerCase(), displayName: displayName.trim(), password: hashedPw, createdAt: new Date().toISOString() });
    saveLocalUsers(users);

    // Auto-login
    localStorage.setItem('xbee_session', JSON.stringify({ email: email.toLowerCase(), username: username.toLowerCase(), displayName: displayName.trim(), loggedInAt: new Date().toISOString() }));
    localStorage.setItem('xbee_remembered', 'true');
    try { localStorage.setItem('xbee_profile', JSON.stringify({ displayName: displayName.trim(), username: username.toLowerCase() })); } catch {}
    return {};
  }, [isSupabaseConfigured]);

  // ─── Sign In ───────────────────────────────────────────────
  const signIn = useCallback(async (emailOrUsername: string, password: string) => {
    if (isSupabaseConfigured) {
      try {
        const supabase = getSupabase();
        let email = emailOrUsername;
        if (!email.includes('@')) {
          const { data } = await supabase.from('profiles').select('email').ilike('username', emailOrUsername).single();
          if (!data?.email) return { error: 'Account not found' };
          email = data.email;
        }
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.toLowerCase().includes('email not confirmed')) {
            return { error: 'Email not confirmed. Please check your inbox.' };
          }
          return { error: error.message };
        }
        return {};
      } catch (e: any) {
        return { error: 'Network error. Please try again.' };
      }
    }

    // LocalStorage signin
    const users = getLocalUsers();
    const id = emailOrUsername.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === id || u.username.toLowerCase() === id);
    if (!user) return { error: 'Account not found. Check your email or username.' };
    const hashedPass = await hashPassword(password);
    if (user.password !== hashedPass && user.password !== password) {
      return { error: 'Incorrect password. Try again.' };
    }
    localStorage.setItem('xbee_session', JSON.stringify({ email: user.email, username: user.username, displayName: user.displayName, loggedInAt: new Date().toISOString() }));
    localStorage.setItem('xbee_remembered', 'true');
    try {
      const existing = JSON.parse(localStorage.getItem('xbee_profile') || '{}');
      localStorage.setItem('xbee_profile', JSON.stringify({ ...existing, displayName: user.displayName, username: user.username }));
    } catch {}
    return {};
  }, [isSupabaseConfigured]);

  // ─── Sign Out ──────────────────────────────────────────────
  const signOut = useCallback(async () => {
    if (isSupabaseConfigured) {
      try {
        const supabase = getSupabase();
        if (user) {
          await supabase.from('profiles').update({ is_online: false }).eq('id', user.id);
        }
        await supabase.auth.signOut();
      } catch {}
    } else {
      // Clear session
      try { localStorage.removeItem('xbee_session'); } catch {}
      try { localStorage.removeItem('xbee_profile'); } catch {}
      try { localStorage.removeItem('xbee_remembered'); } catch {}
    }
    setProfile(null);
    setUser(null);
    setSession(null);
  }, [isSupabaseConfigured, user]);

  // ─── Update Profile ────────────────────────────────────────
  const updateUserProfile = useCallback(async (updates: Partial<Profile>): Promise<boolean> => {
    if (!isSupabaseConfigured || !user) return false;
    try {
      const supabase = getSupabase();
      if (updates.username) {
        const { data: existing } = await supabase.from('profiles').select('id').ilike('username', updates.username).neq('id', user.id).single();
        if (existing) return false;
      }
      const { id: _id, followers_count: _fc, following_count: _foc, invites_remaining: _ir, created_at: _ca, ...allowedUpdates } = updates;
      const { error } = await supabase.from('profiles').update({ ...allowedUpdates, updated_at: new Date().toISOString() }).eq('id', user.id);
      if (error) return false;
      const { data: profData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (profData) setProfile(profileToUser(profData));
      return true;
    } catch { return false; }
  }, [isSupabaseConfigured, user]);

  return (
    <AuthContext.Provider value={{
      user, profile, session, loading,
      signUp, signIn, signOut,
      updateProfile: updateUserProfile,
      isSupabaseConfigured,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export { profileToUser };
