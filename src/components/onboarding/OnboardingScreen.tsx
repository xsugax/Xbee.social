'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Check, ArrowRight, Sparkles, Users } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import TrustBadge from '@/components/trust/TrustBadge';
import { useAuth, profileToUser } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { getSupabase } from '@/lib/supabase';
import { User } from '@/types';
import { mockUsers } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const MAX_FOLLOWS = 5;

export default function OnboardingScreen({ onComplete }: { onComplete: () => void }) {
  const { isSupabaseConfigured, user: authUser } = useAuth();
  const { followUser, following } = useApp();
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [ready, setReady] = useState(false);

  // Wait for Supabase data to settle before checking auto-skip
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 600);
    return () => clearTimeout(timer);
  }, []);

  // If user already follows people (existing user on new device), auto-skip
  useEffect(() => {
    if (ready && following.size > 0) {
      onComplete();
    }
  }, [ready, following.size, onComplete]);

  // Fetch suggested users
  useEffect(() => {
    async function loadSuggestions() {
      if (isSupabaseConfigured && authUser) {
        const supabase = getSupabase();
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', authUser.id)
          .order('followers_count', { ascending: false })
          .limit(15);

        if (data && data.length > 0) {
          setSuggestions(data.map(p => profileToUser(p)));
        }
      } else {
        // Demo mode: use mock users
        setSuggestions(mockUsers.slice(0, 15));
      }
      setLoading(false);
    }
    loadSuggestions();
  }, [isSupabaseConfigured, authUser]);

  const toggleSelect = (userId: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else if (next.size < MAX_FOLLOWS) {
        next.add(userId);
      }
      return next;
    });
  };

  const handleContinue = async () => {
    setCompleting(true);
    for (const userId of selected) {
      await followUser(userId);
    }
    onComplete();
  };

  return (
    <div className="min-h-screen bg-theme-primary flex flex-col">
      {/* Header */}
      <div className="pt-12 pb-6 px-6 text-center">
        <motion.div
          className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-xbee-primary to-xbee-secondary flex items-center justify-center"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <span className="text-3xl">🐝</span>
        </motion.div>
        <motion.h1
          className="text-2xl font-bold text-theme-primary mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Welcome to Xbee!
        </motion.h1>
        <motion.p
          className="text-sm text-theme-tertiary max-w-[300px] mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Follow up to {MAX_FOLLOWS} people to build your feed. You&apos;ll see their posts and updates.
        </motion.p>
      </div>

      {/* Counter */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-theme-tertiary">
            <Users className="w-3.5 h-3.5 inline mr-1" />
            Following {selected.size} of {MAX_FOLLOWS}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: MAX_FOLLOWS }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'w-2 h-2 rounded-full transition-colors duration-200',
                  i < selected.size ? 'bg-xbee-primary' : 'bg-theme-hover'
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Suggestions list */}
      <div className="flex-1 overflow-y-auto px-4 pb-32">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl animate-pulse">
                <div className="w-12 h-12 rounded-full bg-theme-hover" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-28 bg-theme-hover rounded" />
                  <div className="h-3 w-40 bg-theme-hover rounded" />
                </div>
                <div className="w-20 h-8 bg-theme-hover rounded-full" />
              </div>
            ))}
          </div>
        ) : suggestions.length === 0 ? (
          <div className="text-center py-12">
            <Sparkles className="w-10 h-10 text-xbee-primary mx-auto mb-3 opacity-50" />
            <p className="text-sm text-theme-secondary font-medium">You&apos;re one of the first here!</p>
            <p className="text-xs text-theme-tertiary mt-1">Start posting and invite friends to grow the community.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {suggestions.map((user, index) => {
              const isSelected = selected.has(user.id);
              return (
                <motion.button
                  key={user.id}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left',
                    isSelected ? 'bg-xbee-primary/10 border border-xbee-primary/30' : 'hover:bg-theme-hover border border-transparent'
                  )}
                  onClick={() => toggleSelect(user.id)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <Avatar name={user.displayName} src={user.avatar} size="md" verified={user.verified} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-theme-primary truncate">{user.displayName}</span>
                      {user.verified && <TrustBadge score={user.trust.score} tier={user.trust.tier} size="sm" verification={user.verification} />}
                    </div>
                    <span className="text-xs text-theme-tertiary">@{user.username}</span>
                    {user.bio && (
                      <p className="text-xs text-theme-secondary mt-0.5 line-clamp-1">{user.bio}</p>
                    )}
                  </div>
                  <div className={cn(
                    'shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200',
                    isSelected ? 'bg-xbee-primary text-white' : 'border border-theme text-theme-tertiary'
                  )}>
                    {isSelected ? <Check className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom buttons */}
      <div className="fixed bottom-0 left-0 right-0 glass border-t border-theme px-6 py-4 space-y-2.5">
        <motion.button
          className={cn(
            'w-full py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200',
            selected.size > 0 || suggestions.length === 0
              ? 'bg-xbee-primary text-white shadow-glow'
              : 'bg-theme-hover text-theme-tertiary'
          )}
          onClick={handleContinue}
          disabled={completing}
          whileTap={{ scale: 0.98 }}
        >
          {completing ? 'Setting up...' : (
            <>
              Continue to Xbee <ArrowRight className="w-4 h-4" />
            </>
          )}
        </motion.button>
        {suggestions.length > 0 && selected.size === 0 && (
          <button
            className="w-full text-center text-xs text-theme-tertiary hover:text-theme-secondary transition-colors py-1"
            onClick={onComplete}
          >
            Skip for now
          </button>
        )}
      </div>
    </div>
  );
}
