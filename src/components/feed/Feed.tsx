'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Info, ArrowUp, Loader2 } from 'lucide-react';
import PostComposer from './PostComposer';
import PostCard from './PostCard';
import { mockUsers } from '@/lib/mockData';
import { Post, FeedMode } from '@/types';
import { useApp } from '@/context/AppContext';
import { generateId, cn } from '@/lib/utils';

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
  const { posts, addPost } = useApp();
  const [feedMode, setFeedMode] = useState<FeedMode>('trusted');
  const [pendingPosts, setPendingPosts] = useState<Post[]>([]);
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const simIndexRef = useRef(0);
  const feedTopRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
  }, []);

  const showPending = useCallback(() => {
    pendingPosts.forEach(p => addPost(p.content, p.media));
    setPendingPosts([]);
    feedTopRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [pendingPosts, addPost]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && visibleCount < sortedPosts.length) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount(prev => Math.min(prev + POSTS_PER_PAGE, sortedPosts.length));
            setIsLoadingMore(false);
          }, 600);
        }
      },
      { threshold: 0.1 }
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  });

  const sortedPosts = useMemo(() => {
    if (feedMode === 'trusted') {
      return [...posts].sort((a, b) => {
        const scoreA = (a.credibility.authorTrust * 0.4) + (a.credibility.contentScore * 0.3) + (a.credibility.engagementQuality * 100 * 0.3);
        const scoreB = (b.credibility.authorTrust * 0.4) + (b.credibility.contentScore * 0.3) + (b.credibility.engagementQuality * 100 * 0.3);
        return scoreB - scoreA;
      });
    }
    return [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [posts, feedMode]);

  const handlePost = (content: string, media?: import('@/types').MediaAttachment[]) => { addPost(content, media); };

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
      <AnimatePresence>
        {pendingPosts.length > 0 && (
          <motion.button className="w-full py-2.5 bg-xbee-primary/10 hover:bg-xbee-primary/20 text-xbee-primary text-sm font-medium flex items-center justify-center gap-2 border-b border-theme" onClick={showPending} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <ArrowUp className="w-4 h-4" />Show {pendingPosts.length} new post{pendingPosts.length > 1 ? 's' : ''}
          </motion.button>
        )}
      </AnimatePresence>
      <div ref={feedTopRef}><PostComposer onPost={handlePost} /></div>
      <div>
        <AnimatePresence initial={false}>
          {sortedPosts.slice(0, visibleCount).map((post, index) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: 'easeOut' }}>
              <PostCard post={post} index={index} feedMode={feedMode} />
            </motion.div>
          ))}
        </AnimatePresence>
        {visibleCount < sortedPosts.length ? (
          <div ref={loadMoreRef} className="py-8 flex justify-center">
            {isLoadingMore ? (
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
    </div>
  );
}