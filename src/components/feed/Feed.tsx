'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Info, ArrowUp, Loader2, Sparkles, Users, UserPlus } from 'lucide-react';
import PostComposer from './PostComposer';
import PostCard from './PostCard';
import { Post, FeedMode } from '@/types';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Avatar from '@/components/ui/Avatar';

function PostSkeleton() {
  return (
    <div className="px-4 py-4 border-b border-theme animate-pulse">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-theme-hover shrink-0" />
        <div className="flex-1 space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-24 bg-theme-hover rounded" />
            <div className="h-3 w-16 bg-theme-hover rounded" />
          </div>
          <div className="h-3 w-full bg-theme-hover rounded" />
          <div className="h-3 w-3/4 bg-theme-hover rounded" />
          <div className="flex gap-8 mt-3">
            <div className="h-3 w-10 bg-theme-hover rounded" />
            <div className="h-3 w-10 bg-theme-hover rounded" />
            <div className="h-3 w-10 bg-theme-hover rounded" />
            <div className="h-3 w-10 bg-theme-hover rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

const POSTS_PER_PAGE = 10;

export default function Feed() {
  const { posts, addPost, loadMorePosts, hasMorePosts, isLoadingMorePosts, allUsers, currentUser, getConnectionStatus, sendConnectionRequest, connections, pendingSent } = useApp();
  const { isSupabaseConfigured } = useAuth();
  const reduceMotion = useReducedMotion();
  const [feedMode, setFeedMode] = useState<FeedMode>('trusted');
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const feedTopRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const sortedPosts = useMemo(() => {
    if (feedMode === 'trusted') {
      return [...posts].sort((a, b) => {
        const scoreA = ((a.credibility?.authorTrust ?? 50) * 0.4) + ((a.credibility?.contentScore ?? 50) * 0.3) + ((a.credibility?.engagementQuality ?? 0.5) * 100 * 0.3);
        const scoreB = ((b.credibility?.authorTrust ?? 50) * 0.4) + ((b.credibility?.contentScore ?? 50) * 0.3) + ((b.credibility?.engagementQuality ?? 0.5) * 100 * 0.3);
        return scoreB - scoreA;
      });
    }
    return [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [posts, feedMode]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (visibleCount < sortedPosts.length) {
            setIsLoadingMore(true);
            setTimeout(() => {
              setVisibleCount(prev => Math.min(prev + POSTS_PER_PAGE, sortedPosts.length));
              setIsLoadingMore(false);
            }, 600);
          } else if (isSupabaseConfigured && hasMorePosts && !isLoadingMorePosts) {
            loadMorePosts();
          }
        }
      },
      { threshold: 0.1 }
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [visibleCount, sortedPosts.length, isSupabaseConfigured, hasMorePosts, isLoadingMorePosts, loadMorePosts]);

  useEffect(() => {
    if (isSupabaseConfigured && sortedPosts.length > 0 && visibleCount < sortedPosts.length) {
      setVisibleCount(sortedPosts.length);
    }
  }, [sortedPosts.length, isSupabaseConfigured]);

  // People to discover — users not yet connected
  const discoverPeople = useMemo(() => {
    return allUsers
      .filter(u => u.id !== currentUser.id && !connections.has(u.id) && !pendingSent.has(u.id))
      .slice(0, 3);
  }, [allUsers, currentUser.id, connections, pendingSent]);

  const handlePost = (content: string, media?: import('@/types').MediaAttachment[]) => { addPost(content, media); };

  const emptyFeed = sortedPosts.length === 0 && !initialLoading;

  return (
    <div>
      <div className="sticky top-0 z-30 glass border-b border-theme">
        <div className="flex">
          <button className="flex-1 py-3.5 text-center relative transition-colors hover:bg-theme-hover" onClick={() => setFeedMode('trusted')}>
            <span className={cn('inline-flex items-center gap-1.5 text-[15px] font-medium', feedMode === 'trusted' ? 'text-emerald-400 font-bold' : 'text-theme-tertiary')}>
              <Shield className="w-4 h-4" /><span className="hidden xs:inline">Trusted</span> Feed
            </span>
            {feedMode === 'trusted' && <motion.div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-emerald-400 rounded-full" layoutId="feedTab" />}
          </button>
          <button className="flex-1 py-3.5 text-center relative transition-colors hover:bg-theme-hover" onClick={() => setFeedMode('raw')}>
            <span className={cn('inline-flex items-center gap-1.5 text-[15px] font-medium', feedMode === 'raw' ? 'text-xbee-primary font-bold' : 'text-theme-tertiary')}>
              <Zap className="w-4 h-4" />Raw Feed
            </span>
            {feedMode === 'raw' && <motion.div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-xbee-primary rounded-full" layoutId="feedTab" />}
          </button>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={feedMode} className={cn('px-4 py-2 text-[11px] flex items-center gap-1.5 border-b border-theme', feedMode === 'trusted' ? 'bg-emerald-500/5 text-emerald-400' : 'bg-xbee-primary/5 text-xbee-primary')} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <Info className="w-3 h-3 shrink-0" />{feedMode === 'trusted' ? 'Sorted by credibility & consistency' : 'Chronological feed, unfiltered'}
          </motion.div>
        </AnimatePresence>
      </div>

      <div ref={feedTopRef}><PostComposer onPost={handlePost} /></div>

      {initialLoading ? (
        <div>{Array.from({ length: 5 }).map((_, i) => <PostSkeleton key={i} />)}</div>
      ) : emptyFeed ? (
        <div className="py-16 text-center px-6">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-theme-hover flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-theme-tertiary opacity-40" />
          </div>
          <h2 className="text-base font-bold text-theme-primary mb-1">Your feed is empty</h2>
          <p className="text-sm text-theme-tertiary max-w-[260px] mx-auto mb-6">Follow people to see their posts here, or share something yourself!</p>
          
          {/* Discover People section when feed is empty */}
          {discoverPeople.length > 0 && (
            <div className="max-w-sm mx-auto">
              <div className="flex items-center gap-2 justify-center mb-4">
                <Users className="w-4 h-4 text-xbee-primary" />
                <span className="text-sm font-bold text-theme-primary">People to discover</span>
              </div>
              <div className="space-y-2">
                {discoverPeople.map(user => (
                  <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl bg-theme-hover/60">
                    <Link href={`/profile?user=${user.id}`}>
                      <Avatar name={user.displayName} src={user.avatar} size="sm" />
                    </Link>
                    <div className="flex-1 min-w-0 text-left">
                      <Link href={`/profile?user=${user.id}`} className="font-bold text-sm text-theme-primary hover:underline truncate block">
                        {user.displayName}
                      </Link>
                      <p className="text-xs text-theme-tertiary truncate">{user.bio?.substring(0, 60) || `@${user.username}`}</p>
                    </div>
                    <motion.button
                      className="shrink-0 px-3 py-1.5 rounded-full bg-xbee-primary text-white text-xs font-bold hover:bg-xbee-primary/90 transition-colors"
                      onClick={() => sendConnectionRequest(user.id)}
                      whileTap={{ scale: 0.95 }}
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>
                ))}
              </div>
              <Link href="/explore" className="block mt-3 text-sm text-xbee-primary hover:underline">
                Browse all users →
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div>
          <AnimatePresence initial={false}>
            {sortedPosts.slice(0, visibleCount).map((post, index) => (
              <motion.div key={post.id} initial={reduceMotion ? false : { opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.35, ease: 'easeOut' }}>
                <PostCard post={post} index={index} feedMode={feedMode} />
              </motion.div>
            ))}
          </AnimatePresence>
          {visibleCount < sortedPosts.length || (isSupabaseConfigured && hasMorePosts) ? (
            <div ref={loadMoreRef} className="py-8 flex justify-center">
              {isLoadingMore || isLoadingMorePosts ? (
                <div className="flex items-center gap-2 text-xbee-primary">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm font-medium">Loading more posts...</span>
                </div>
              ) : (
                <span className="text-sm text-theme-tertiary">Scroll for more</span>
              )}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm text-theme-tertiary">✨ You're all caught up!</p>
              <p className="text-xs text-theme-tertiary mt-1">Check back later for new posts</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
