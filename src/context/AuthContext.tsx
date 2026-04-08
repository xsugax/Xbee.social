'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const isSupabaseConfigured = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your-project-url-here'
  );

  // Fetch profile from DB
  const fetchProfile = useCallback(async (userId: string) => {
    if (!isSupabaseConfigured) return null;
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) return null;
    const userProfile = profileToUser(data);
    setProfile(userProfile);
    return userProfile;
  }, [isSupabaseConfigured]);

  // Listen for auth changes
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    const supabase = getSupabase();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        fetchProfile(s.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        fetchProfile(s.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [isSupabaseConfigured, fetchProfile]);

  // Update online status
  useEffect(() => {
    if (!isSupabaseConfigured || !user) return;
    const supabase = getSupabase();

    // Set online
    supabase.from('profiles').update({ is_online: true, last_seen: new Date().toISOString() }).eq('id', user.id).then(() => {});

    // Set offline on unload
    const handleUnload = () => {
      navigator.sendBeacon?.(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}`, JSON.stringify({ is_online: false, last_seen: new Date().toISOString() }));
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      supabase.from('profiles').update({ is_online: false, last_seen: new Date().toISOString() }).eq('id', user.id).then(() => {});
    };
  }, [isSupabaseConfigured, user]);

  const signUp = useCallback(async (email: string, password: string, username: string, displayName: string) => {
    if (!isSupabaseConfigured) return { error: 'Supabase not configured' };
    const supabase = getSupabase();

    // Check username availability
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .ilike('username', username)
      .single();

    if (existing) return { error: 'Username is already taken' };

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, display_name: displayName },
      },
    });

    if (error) return { error: error.message };

    // If Supabase requires email confirmation, session will be null
    if (data.user && !data.session) {
      return { needsConfirmation: true };
    }

    if (data.user) {
      await fetchProfile(data.user.id);
    }
    return {};
  }, [isSupabaseConfigured, fetchProfile]);

  const signIn = useCallback(async (emailOrUsername: string, password: string) => {
    if (!isSupabaseConfigured) return { error: 'Supabase not configured' };
    const supabase = getSupabase();

    let email = emailOrUsername;

    // If it's a username, look up the email
    if (!emailOrUsername.includes('@')) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('email')
        .ilike('username', emailOrUsername)
        .single();

      if (!profileData?.email) return { error: 'Account not found' };
      email = profileData.email;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message.toLowerCase().includes('email not confirmed')) {
        return { error: 'Email not confirmed. Please check your inbox or contact support.' };
      }
      return { error: error.message };
    }
    return {};
  }, [isSupabaseConfigured]);

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    const supabase = getSupabase();
    if (user) {
      await supabase.from('profiles').update({ is_online: false }).eq('id', user.id);
    }
    await supabase.auth.signOut();
    setProfile(null);
  }, [isSupabaseConfigured, user]);

  const updateUserProfile = useCallback(async (updates: Partial<Profile>): Promise<boolean> => {
    if (!isSupabaseConfigured || !user) return false;
    const supabase = getSupabase();

    // Check username collision
    if (updates.username) {
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .ilike('username', updates.username)
        .neq('id', user.id)
        .single();
      if (existing) return false;
    }

    // Strip read-only fields before update
    const { id: _id, followers_count: _fc, following_count: _foc, invites_remaining: _ir, created_at: _ca, ...allowedUpdates } = updates;

    const { error } = await supabase
      .from('profiles')
      .update({ ...allowedUpdates, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (error) return false;
    await fetchProfile(user.id);
    return true;
  }, [isSupabaseConfigured, user, fetchProfile]);

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      session,
      loading,
      signUp,
      signIn,
      signOut,
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
