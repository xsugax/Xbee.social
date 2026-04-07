'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, TrendingUp, Hash, Sparkles, Users, Zap, Flame, X, UserPlus } from 'lucide-react';
import PostCard from '@/components/feed/PostCard';
import { mockTrends, mockUsers } from '@/lib/mockData';
import { formatNumber, cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import { useAuth, profileToUser } from '@/context/AuthContext';
import { getSupabase } from '@/lib/supabase';
import Avatar from '@/components/ui/Avatar';
import TrustBadge from '@/components/trust/TrustBadge';
import Link from 'next/link';
import { User } from '@/types';

type ExploreTab = 'trending' | 'news' | 'tech' | 'entertainment' | 'sports';

const tabs: { id: ExploreTab; label: string }[] = [
  { id: 'trending', label: 'Trending' },
  { id: 'news', label: 'News' },
  { id: 'tech', label: 'Technology' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'sports', label: 'Sports' },
];

export default function ExplorePage() {
  const { posts, followUser, unfollowUser, isFollowing, currentUser } = useApp();
  const { isSupabaseConfigured } = useAuth();
  const [activeTab, setActiveTab] = useState<ExploreTab>('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleUsers, setVisibleUsers] = useState(5);
  const [visiblePosts, setVisiblePosts] = useState(10);
  const [liveUsers, setLiveUsers] = useState<User[]>([]);
  const [searchingUsers, setSearchingUsers] = useState(false);

  // Search real profiles from Supabase
  useEffect(() => {
    if (!searchQuery.trim() || !isSupabaseConfigured) {
      setLiveUsers([]);
      return;
    }
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setSearchingUsers(true);
      try {
        const supabase = getSupabase();
        const q = `%${searchQuery.trim()}%`;
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .or(`username.ilike.${q},display_name.ilike.${q}`)
          .neq('id', currentUser.id)
          .limit(20);
        if (!controller.signal.aborted && data) {
          setLiveUsers(data.map(p => profileToUser(p as any)));
        }
      } catch {}
      if (!controller.signal.aborted) setSearchingUsers(false);
    }, 300);
    return () => { controller.abort(); clearTimeout(timeout); };
  }, [searchQuery, isSupabaseConfigured, currentUser.id]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    const userResults = isSupabaseConfigured ? liveUsers : mockUsers.filter(u =>
      u.displayName.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.bio.toLowerCase().includes(q)
    );
    return {
      users: userResults,
      posts: posts.filter(p =>
        p.content.toLowerCase().includes(q) ||
        p.author.displayName.toLowerCase().includes(q) ||
        p.author.username.toLowerCase().includes(q)
      ),
    };
  }, [searchQuery, posts, isSupabaseConfigured, liveUsers]);

  const hasResults = searchResults && (searchResults.users.length > 0 || searchResults.posts.length > 0);

  // Reset pagination when search query changes
  useEffect(() => {
    setVisibleUsers(5);
    setVisiblePosts(10);
  }, [searchQuery]);

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-30 glass">
        <div className="px-4 py-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-tertiary" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Xbee — people, posts, topics..."
              className="xbee-input pl-11 pr-9 rounded-full"
            />
            {searchQuery && (
              <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-theme-hover" onClick={() => setSearchQuery('')}>
                <X className="w-3.5 h-3.5 text-theme-tertiary" />
              </button>
            )}
          </div>
        </div>

        {/* Only show tabs when NOT searching */}
        {!searchQuery && (
          <div className="flex overflow-x-auto scrollbar-hide border-b border-theme">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className="flex-shrink-0 px-5 py-3 relative transition-colors hover:bg-theme-hover"
                onClick={() => setActiveTab(tab.id)}
              >
                <span className={`text-sm font-medium ${
                  activeTab === tab.id ? 'text-theme-primary font-bold' : 'text-theme-tertiary'
                }`}>
                  {tab.label}
                </span>
                {activeTab === tab.id && (
                  <motion.div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-xbee-primary rounded-full"
                    layoutId="exploreTab"
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div>
          {searchResults?.users && searchResults.users.length > 0 && (
            <div className="border-b border-theme">
              <div className="px-4 py-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-xbee-primary" />
                <span className="text-sm font-bold text-theme-primary">People</span>
                <span className="text-xs text-theme-tertiary">({searchResults.users.length})</span>
              </div>
              {searchResults.users.slice(0, visibleUsers).map((user) => (
                <Link key={user.id} href={`/profile?user=${user.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-theme-hover transition-colors">
                  <Avatar name={user.displayName} src={user.avatar} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-theme-primary truncate">{user.displayName}</span>
                      <TrustBadge score={user.trust.score} tier={user.trust.tier} size="sm" verification={user.verification} />
                    </div>
                    <p className="text-xs text-theme-tertiary truncate">@{user.username}</p>
                    <p className="text-xs text-theme-secondary mt-0.5 line-clamp-1">{user.bio}</p>
                  </div>
                  {user.id !== currentUser.id && (
                    <motion.button
                      className={cn(
                        'px-3 py-1.5 rounded-full text-xs font-bold transition-colors shrink-0',
                        isFollowing(user.id)
                          ? 'border border-theme text-theme-primary hover:border-red-500 hover:text-red-500'
                          : 'bg-xbee-primary text-white hover:bg-xbee-primary/90'
                      )}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); isFollowing(user.id) ? unfollowUser(user.id) : followUser(user.id); }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {isFollowing(user.id) ? 'Following' : 'Follow'}
                    </motion.button>
                  )}
                </Link>
              ))}
              {searchResults.users.length > visibleUsers && (
                <button className="w-full py-2.5 text-sm font-medium text-xbee-primary hover:bg-theme-hover transition-colors border-t border-theme" onClick={() => setVisibleUsers(prev => prev + 5)}>
                  Show more people ({searchResults.users.length - visibleUsers} remaining)
                </button>
              )}
            </div>
          )}
          {searchResults?.posts && searchResults.posts.length > 0 && (
            <div>
              <div className="px-4 py-3 flex items-center gap-2 border-b border-theme">
                <Hash className="w-4 h-4 text-xbee-primary" />
                <span className="text-sm font-bold text-theme-primary">Posts</span>
                <span className="text-xs text-theme-tertiary">({searchResults.posts.length})</span>
              </div>
              {searchResults.posts.slice(0, visiblePosts).map((post, index) => (
                <PostCard key={post.id} post={post} index={index} />
              ))}
              {searchResults.posts.length > visiblePosts && (
                <button className="w-full py-2.5 text-sm font-medium text-xbee-primary hover:bg-theme-hover transition-colors border-t border-theme" onClick={() => setVisiblePosts(prev => prev + 10)}>
                  Show more posts ({searchResults.posts.length - visiblePosts} remaining)
                </button>
              )}
            </div>
          )}
          {searchQuery && !hasResults && (
            <div className="py-16 text-center">
              <Search className="w-12 h-12 text-theme-tertiary mx-auto mb-3 opacity-30" />
              <p className="text-theme-tertiary font-medium">No results for &ldquo;{searchQuery}&rdquo;</p>
              <p className="text-xs text-theme-tertiary mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      )}

      {/* Default explore content (hidden during search) */}
      {!searchQuery && (
        <>
          {/* Featured Topics */}
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { title: 'AI Revolution', icon: Sparkles, keyword: 'AI', gradient: 'from-xbee-primary to-xbee-secondary' },
                { title: 'Creator Economy', icon: Zap, keyword: 'creator', gradient: 'from-xbee-secondary to-xbee-accent' },
                { title: 'Open Source', icon: Users, keyword: 'open source', gradient: 'from-emerald-500 to-cyan-500' },
                { title: 'Hot Debates', icon: Flame, keyword: 'take', gradient: 'from-orange-500 to-pink-500' },
              ].map(({ title, icon: Icon, keyword, gradient }) => {
                const count = posts.filter(p => p.content.toLowerCase().includes(keyword.toLowerCase())).length;
                return (
                  <motion.div
                    key={title}
                    className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} cursor-pointer relative overflow-hidden`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSearchQuery(keyword)}
                  >
                    <div className="absolute top-2 right-2 opacity-20">
                      <Icon className="w-16 h-16 text-white" />
                    </div>
                    <Icon className="w-6 h-6 text-white mb-2" />
                    <h3 className="text-white font-bold text-lg">{title}</h3>
                    <p className="text-white/70 text-sm">{count > 0 ? `${count} posts` : 'Explore'}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Trending Topics */}
          <div className="border-t border-theme">
            <div className="px-4 py-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-xbee-primary" />
              <h2 className="text-lg font-bold text-theme-primary">Trending Topics</h2>
            </div>
            {mockTrends.map((trend, idx) => (
              <motion.div
                key={trend.id}
                className="px-4 py-3 hover:bg-theme-hover transition-colors cursor-pointer border-b border-theme"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSearchQuery(trend.name)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-theme-tertiary">{idx + 1} · {trend.category}</span>
                </div>
                <p className="font-bold text-theme-primary mt-0.5 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-xbee-primary" />
                  {trend.name}
                </p>
                <p className="text-sm text-theme-tertiary mt-0.5">{formatNumber(trend.postCount)} posts</p>
              </motion.div>
            ))}
          </div>

          {/* Tab-filtered Posts */}
          <div className="border-t border-theme pt-1">
            {(() => {
              const tabKeywords: Record<ExploreTab, string[]> = {
                trending: [],
                news: ['breaking', 'report', 'announce', 'launch', 'update', 'news'],
                tech: ['code', 'dev', 'api', 'rust', 'css', 'react', 'deploy', 'bug', 'ship', 'build', 'auth', 'ai'],
                entertainment: ['game', 'movie', 'music', 'show', 'watch', 'stream', 'play'],
                sports: ['win', 'team', 'match', 'score', 'champion', 'league', 'training'],
              };
              const keywords = tabKeywords[activeTab];
              const filtered = keywords.length > 0
                ? posts.filter(p => keywords.some(kw => p.content.toLowerCase().includes(kw)))
                : posts.slice(0, 5);
              const display = filtered.length > 0 ? filtered.slice(0, 8) : posts.slice(0, 3);
              return display.map((post, index) => (
                <PostCard key={post.id} post={post} index={index} />
              ));
            })()}
          </div>
        </>
      )}
    </div>
  );
}
