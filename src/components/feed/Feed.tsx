'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Info, ArrowUp, Loader2, Sparkles } from 'lucide-react';
import PostComposer from './PostComposer';
import PostCard from './PostCard';
import { mockUsers } from '@/lib/mockData';
import { Post, FeedMode } from '@/types';
import { useApp } from '@/context/AppContext';
import { generateId, cn } from '@/lib/utils';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { useAuth } from '@/context/AuthContext';

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

const SIMULATED_POSTS = [
  { content: "Just discovered that CSS container queries work in all major browsers now. The responsive design game just changed forever!", authorIdx: 0 },
  { content: "Shipped our first production Rust microservice today. Memory usage: 12MB. The Go equivalent was 180MB. I'm sold.", authorIdx: 2 },
  { content: "Hot take: The best meetings are the ones that get cancelled.\n\nProtect your team's deep work time. That's where the magic happens.", authorIdx: 4 },
  { content: "We just hit 1M daily active users on our platform.\n\nThe secret? We replied to every single customer support ticket personally for the first 2 years.", authorIdx: 5 },
  { content: "PSA: If your app has a loading spinner that shows for 50ms, please just remove it. That flash is worse than waiting.", authorIdx: 8 },
  { content: "Debugging tip that saves me hours:\n\nInstead of console.log(data), use console.table(data).\n\nWorks with arrays and objects.", authorIdx: 6 },
  { content: "Rebuilt our entire auth system this weekend using passkeys. Zero passwords, zero phishing risk, 2-second login.", authorIdx: 7 },
  { content: "The hardest part of building a startup isn't the code.\n\nIt's staring at an empty analytics dashboard for 6 months and still believing.", authorIdx: 5 },
];

const POSTS_PER_PAGE = 10;

export default function Feed() {
  const { posts, addPost, loadMorePosts, hasMorePosts, isLoadingMorePosts } = useApp();
  const { isSupabaseConfigured } = useAuth();
  const reduceMotion = useReducedMotion();
  const [feedMode, setFeedMode] = useState<FeedMode>('trusted');
  const [pendingPosts, setPendingPosts] = useState<Post[]>([]);
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const simIndexRef = useRef(0);
  const feedTopRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isSupabaseConfigured) return; // No fake posts in live mode
    const interval = setInterval(() => {
      if (simIndexRef.current >= SIMULATED_POSTS.length) simIndexRef.current = 0;
      const sim = SIMULATED_POSTS[simIndexRef.current];
      const author = mockUsers[sim.authorIdx] || mockUsers[0];
      const incoming: Post = {
        id: generateId(), author, content: sim.content,
        likes: Math.floor(Math.random() * 500) + 10, reposts: Math.floor(Math.random() * 100),
        replies: Math.floor(Math.random() * 50), views: Math.floor(Math.random() * 10000) + 500,
        liked: false, reposted: false, bookmarked: false, createdAt: new Date().toISOString(),
        credibility: { authorTrust: author.trust.score, contentScore: 70 + Math.floor(Math.random() * 25), engagementQuality: 0.6 + Math.random() * 0.35, viralityBrake: author.trust.score < 50 },
      };
      setPendingPosts(prev => [incoming, ...prev]);
      simIndexRef.current++;
    }, 15000);
    return () => clearInterval(interval);
  }, [isSupabaseConfigured]);

  const showPending = useCallback(() => {
    pendingPosts.forEach(p => addPost(p.content, p.media));
    setPendingPosts([]);
    feedTopRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [pendingPosts, addPost]);

  // Infinite scroll observer — moved after sortedPosts definition
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

  const handlePost = (content: string, media?: import('@/types').MediaAttachment[]) => { addPost(content, media); };

  // Auto-expand visible count when server loads more posts
  useEffect(() => {
    if (isSupabaseConfigured && sortedPosts.length > 0 && visibleCount < sortedPosts.length) {
      setVisibleCount(sortedPosts.length);
    }
  }, [sortedPosts.length, isSupabaseConfigured]);

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
      <div
        className={cn(
          'w-full py-2.5 bg-xbee-primary/10 hover:bg-xbee-primary/20 text-xbee-primary text-sm font-medium flex items-center justify-center gap-2 border-b border-theme cursor-pointer transition-all duration-300',
          pendingPosts.length > 0 ? 'opacity-100 max-h-12' : 'opacity-0 max-h-0 overflow-hidden pointer-events-none'
        )}
        onClick={showPending}
        role="button"
        tabIndex={pendingPosts.length > 0 ? 0 : -1}
      >
        <ArrowUp className="w-4 h-4" />Show {pendingPosts.length} new post{pendingPosts.length > 1 ? 's' : ''}
      </div>
      <div ref={feedTopRef}><PostComposer onPost={handlePost} /></div>
      {initialLoading ? (
        <div>{Array.from({ length: 5 }).map((_, i) => <PostSkeleton key={i} />)}</div>
      ) : sortedPosts.length === 0 ? (
        <div className="py-16 text-center px-6">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-theme-hover flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-theme-tertiary opacity-40" />
          </div>
          <h2 className="text-base font-bold text-theme-primary mb-1">Your feed is empty</h2>
          <p className="text-sm text-theme-tertiary max-w-[260px] mx-auto">Follow people to see their posts here, or share something yourself!</p>
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
            <p className="text-sm text-theme-tertiary">✨ You&apos;re all caught up!</p>
            <p className="text-xs text-theme-tertiary mt-1">Check back later for new posts</p>
          </div>
        )}
      </div>
      )}
    </div>
  );
}