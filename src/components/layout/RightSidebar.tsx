'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, TrendingUp, ArrowUp, ArrowDown, Minus, Sparkles, Shield, PanelRightClose, PanelRightOpen, X } from 'lucide-react';
import { formatNumber, cn } from '@/lib/utils';
import { mockTrends, mockUsers } from '@/lib/mockData';
import TrustBadge from '@/components/trust/TrustBadge';
import TrustScoreCard from '@/components/trust/TrustScoreCard';
import Avatar from '@/components/ui/Avatar';
import { useLayout } from '@/context/LayoutContext';
import { useApp } from '@/context/AppContext';
import { useAuth, profileToUser } from '@/context/AuthContext';
import { getSupabase } from '@/lib/supabase';
import Link from 'next/link';
import { User } from '@/types';

export default function RightSidebar() {
  const { rightSidebarCollapsed, toggleRightSidebar } = useLayout();
  const { currentUser, posts, followUser, unfollowUser, isFollowing } = useApp();
  const { isSupabaseConfigured } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [liveSearchUsers, setLiveSearchUsers] = useState<User[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const debounceTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(debounceTimer.current);
  }, [searchQuery]);

  // Live search users from Supabase
  useEffect(() => {
    if (!isSupabaseConfigured || !debouncedQuery.trim()) { setLiveSearchUsers([]); return; }
    const controller = new AbortController();
    (async () => {
      try {
        const supabase = getSupabase();
        const q = `%${debouncedQuery.trim()}%`;
        const { data } = await supabase.from('profiles').select('*').or(`username.ilike.${q},display_name.ilike.${q}`).neq('id', currentUser.id).limit(5);
        if (!controller.signal.aborted && data) setLiveSearchUsers(data.map(p => profileToUser(p as any)));
      } catch {}
    })();
    return () => controller.abort();
  }, [debouncedQuery, isSupabaseConfigured, currentUser.id]);

  // Load suggested users from Supabase (random profiles not yet followed)
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    (async () => {
      try {
        const supabase = getSupabase();
        const { data } = await supabase.from('profiles').select('*').neq('id', currentUser.id).limit(10);
        if (data) {
          const users = data.map(p => profileToUser(p as any));
          const notFollowed = users.filter(u => !isFollowing(u.id));
          setSuggestedUsers(notFollowed.length > 0 ? notFollowed.slice(0, 3) : users.slice(0, 3));
        }
      } catch {}
    })();
  }, [isSupabaseConfigured, currentUser.id, isFollowing]);

  const searchResults = debouncedQuery.trim() ? {
    users: isSupabaseConfigured ? liveSearchUsers : mockUsers.filter(u => u.displayName.toLowerCase().includes(debouncedQuery.toLowerCase()) || u.username.toLowerCase().includes(debouncedQuery.toLowerCase())),
    posts: posts.filter(p => p.content.toLowerCase().includes(debouncedQuery.toLowerCase())).slice(0, 3),
  } : null;

  // Suggest users for "Who to Follow"
  const fallbackUsers = isSupabaseConfigured
    ? suggestedUsers
    : (() => {
        const notFollowed = mockUsers.filter(u => u.id !== currentUser.id && !isFollowing(u.id)).slice(0, 3);
        return notFollowed.length > 0 ? notFollowed : mockUsers.filter(u => u.id !== currentUser.id).slice(0, 3);
      })();

  return (
    <>
      {/* Collapsed toggle button */}
      {rightSidebarCollapsed && (
        <motion.button
          className="fixed right-3 top-3 z-50 p-2.5 rounded-xl glass border border-theme hover:bg-theme-hover transition-colors max-lg:hidden"
          onClick={toggleRightSidebar}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileTap={{ scale: 0.9 }}
          title="Expand sidebar"
        >
          <PanelRightOpen className="w-5 h-5 text-theme-secondary" />
        </motion.button>
      )}

      <aside className={cn(
        'fixed right-0 top-0 h-screen border-l border-theme bg-theme-primary py-3 px-5 overflow-y-auto scrollbar-hide max-lg:hidden transition-all duration-300',
        rightSidebarCollapsed ? 'w-0 px-0 opacity-0 pointer-events-none border-l-0' : 'w-[350px] max-xl:w-[300px] opacity-100'
      )}>
        {/* Collapse button */}
        <div className="flex items-center justify-end mb-1">
          <motion.button
            className="p-1.5 rounded-lg hover:bg-theme-hover transition-colors"
            onClick={toggleRightSidebar}
            whileTap={{ scale: 0.9 }}
            title="Collapse sidebar"
          >
            <PanelRightClose className="w-4 h-4 text-theme-tertiary" />
          </motion.button>
        </div>

        {/* Search */}
        <div className="sticky top-0 pb-3 bg-theme-primary z-10">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-tertiary" />
          <input
            type="text"
            placeholder="Search Xbee"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="xbee-input pl-11 pr-9 py-2.5 rounded-full bg-theme-tertiary"
          />
          {searchQuery && (
            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-theme-hover" onClick={() => setSearchQuery('')}>
              <X className="w-3.5 h-3.5 text-theme-tertiary" />
            </button>
          )}
        </div>
        {/* Quick search results dropdown */}
        <AnimatePresence>
          {searchResults && (searchResults.users.length > 0 || searchResults.posts.length > 0) && (
            <motion.div
              className="absolute left-0 right-0 mt-1 mx-2 glass-card max-h-[300px] overflow-y-auto z-50"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
            >
              {searchResults.users.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-[10px] font-bold text-theme-tertiary uppercase tracking-wider">People</div>
                  {searchResults.users.slice(0, 3).map((user) => (
                    <Link key={user.id} href={`/profile?user=${user.id}`} className="flex items-center gap-2 px-3 py-2 hover:bg-theme-hover transition-colors" onClick={() => setSearchQuery('')}>
                      <Avatar name={user.displayName} src={user.avatar} size="sm" />
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-xs text-theme-primary truncate block">{user.displayName}</span>
                        <span className="text-[10px] text-theme-tertiary">@{user.username}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              {searchResults.posts.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-[10px] font-bold text-theme-tertiary uppercase tracking-wider border-t border-theme">Posts</div>
                  {searchResults.posts.map((post) => (
                    <div key={post.id} className="px-3 py-2 hover:bg-theme-hover transition-colors cursor-pointer">
                      <p className="text-xs text-theme-primary line-clamp-2">{post.content}</p>
                      <span className="text-[10px] text-theme-tertiary">by @{post.author.username}</span>
                    </div>
                  ))}
                </div>
              )}
              <Link href="/explore" className="block px-3 py-2 text-xs text-xbee-primary hover:bg-theme-hover text-center border-t border-theme" onClick={() => setSearchQuery('')}>
                See all results
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Your Trust Score (compact) */}
      <div className="mt-3">
        <TrustScoreCard trust={currentUser.trust} compact />
      </div>

      {/* AI Curated Trends */}
      <div className="glass-card mt-3 overflow-hidden">
        <div className="px-4 py-3 border-b border-theme">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-xbee-primary" />
            <h2 className="text-xl font-bold text-theme-primary">Trends</h2>
            <span className="text-xs bg-xbee-primary/10 text-xbee-primary px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI Curated
            </span>
          </div>
        </div>
        {mockTrends.map((trend, idx) => (
          <motion.div
            key={trend.id}
            className="trend-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-theme-tertiary">{trend.category}</span>
              {trend.change === 'up' && <ArrowUp className="w-3.5 h-3.5 text-xbee-success" />}
              {trend.change === 'down' && <ArrowDown className="w-3.5 h-3.5 text-xbee-danger" />}
              {trend.change === 'stable' && <Minus className="w-3.5 h-3.5 text-theme-tertiary" />}
            </div>
            <p className="font-bold text-theme-primary text-[15px] mt-0.5">#{trend.name}</p>
            <p className="text-xs text-theme-tertiary mt-0.5">{formatNumber(trend.postCount)} posts</p>
            {trend.description && (
              <p className="text-xs text-theme-secondary mt-1">{trend.description}</p>
            )}
          </motion.div>
        ))}
        <div className="px-4 py-3">
          <Link href="/explore" className="text-xbee-primary text-sm hover:underline">Show more</Link>
        </div>
      </div>

      {/* Suggested Users */}
      <div className="glass-card mt-4 overflow-hidden">
        <div className="px-4 py-3 border-b border-theme">
          <h2 className="text-xl font-bold text-theme-primary">Who to follow</h2>
        </div>
        {fallbackUsers.map((user, idx) => (
          <motion.div
            key={user.id}
            className="flex items-center gap-3 px-4 py-3 hover:bg-theme-hover transition-colors cursor-pointer"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Link href={`/profile?user=${user.id}`} className="shrink-0">
              <Avatar name={user.displayName} src={user.avatar} size="md" />
            </Link>
            <div className="flex-1 min-w-0">
              <Link href={`/profile?user=${user.id}`}>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-sm text-theme-primary truncate">{user.displayName}</span>
                  <TrustBadge score={user.trust.score} tier={user.trust.tier} size="sm" verification={user.verification} />
                </div>
                <span className="text-sm text-theme-secondary">@{user.username}</span>
              </Link>
            </div>
            <motion.button
              className={cn(
                'text-sm px-4 py-1.5 rounded-full font-bold transition-colors',
                isFollowing(user.id)
                  ? 'border border-theme text-theme-primary hover:border-red-500 hover:text-red-500'
                  : 'bg-xbee-primary text-white hover:bg-xbee-primary/90'
              )}
              onClick={() => isFollowing(user.id) ? unfollowUser(user.id) : followUser(user.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isFollowing(user.id) ? 'Following' : 'Follow'}
            </motion.button>
          </motion.div>
        ))}
        <div className="px-4 py-3">
          <Link href="/explore" className="text-xbee-primary text-sm hover:underline">Show more</Link>
        </div>
      </div>

      {/* Smart Conversations */}
      <div className="glass-card mt-4 overflow-hidden">
        <div className="px-4 py-3 border-b border-theme">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-xbee-secondary" />
            <h2 className="text-xl font-bold text-theme-primary">Smart Topics</h2>
          </div>
        </div>
        <div className="p-4 space-y-3">
          {['What is the future of open-source AI?', 'Best practices for system design in 2026', 'How to build a personal brand as a developer'].map((topic, i) => (
            <Link key={i} href="/communities">
              <motion.div
                className="p-3 rounded-xl bg-theme-tertiary hover:bg-theme-hover transition-colors cursor-pointer mb-3"
                whileHover={{ scale: 1.02 }}
              >
                <p className="text-sm text-theme-primary font-medium">{topic}</p>
                <p className="text-xs text-xbee-primary mt-1">Join conversation →</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 px-4 pb-4">
        <p className="text-xs text-theme-tertiary">
          <Link href="/settings" className="hover:underline">Terms</Link> · <Link href="/settings" className="hover:underline">Privacy</Link> · <Link href="/settings" className="hover:underline">Content Policy</Link> · <Link href="/settings" className="hover:underline">Cookie Policy</Link>
        </p>
        <p className="text-xs text-theme-tertiary mt-1">
          &copy; 1996–2026 Xbee Technologies, Inc.
        </p>
      </div>
    </aside>
    </>
  );
}
