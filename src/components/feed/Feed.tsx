'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Info, ArrowUp } from 'lucide-react';
import PostComposer from './PostComposer';
import PostCard from './PostCard';
import { mockPosts, mockUsers } from '@/lib/mockData';
import { Post, FeedMode } from '@/types';
import { currentUser } from '@/lib/mockData';
import { generateId } from '@/lib/utils';
import { cn } from '@/lib/utils';

const SIMULATED_POSTS = [
  { content: "Just discovered that CSS container queries work in all major browsers now. The responsive design game just changed forever 🙌", authorIdx: 0 },
  { content: "Shipped our first production Rust microservice today. Memory usage: 12MB. The Go equivalent was 180MB. I'm sold. 🦀", authorIdx: 2 },
  { content: "Hot take: The best meetings are the ones that get cancelled.\n\nProtect your team's deep work time. That's where the magic happens.", authorIdx: 4 },
  { content: "We just hit 1M daily active users on our platform.\n\nThe secret? We replied to every single customer support ticket personally for the first 2 years. Every. Single. One.", authorIdx: 5 },
  { content: "PSA: If your app has a loading spinner that shows for 50ms, please just remove it. That flash is worse than waiting.\n\nUse a 300ms delay before showing load states. Your UX will thank you.", authorIdx: 8 },
  { content: "Debugging tip that saves me hours:\n\nInstead of console.log(data), use console.table(data).\n\nWorks with arrays and objects. You'll see why you missed this your entire career.", authorIdx: 6 },
  { content: "Rebuilt our entire auth system this weekend using passkeys. Zero passwords, zero phishing risk, 2-second login.\n\nPasswords are dead. We just haven't buried them yet.", authorIdx: 7 },
  { content: "The hardest part of building a startup isn't the code.\n\nIt's staring at an empty analytics dashboard for 6 months and still believing.", authorIdx: 5 },
];

export default function Feed() {
  const [feedMode, setFeedMode] = useState<FeedMode>('trusted');
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [pendingPosts, setPendingPosts] = useState<Post[]>([]);
  const simIndexRef = useRef(0);
  const feedTopRef = useRef<HTMLDivElement>(null);

  // Simulate live incoming posts from other users
  useEffect(() => {
    const interval = setInterval(() => {
      if (simIndexRef.current >= SIMULATED_POSTS.length) {
        simIndexRef.current = 0; // cycle
      }
      const sim = SIMULATED_POSTS[simIndexRef.current];
      const author = mockUsers[sim.authorIdx] || mockUsers[0];
      const incoming: Post = {
        id: generateId(),
        author,
        content: sim.content,
        likes: Math.floor(Math.random() * 500) + 10,
        reposts: Math.floor(Math.random() * 100),
        replies: Math.floor(Math.random() * 50),
        views: Math.floor(Math.random() * 10000) + 500,
        liked: false, reposted: false, bookmarked: false,
        createdAt: new Date().toISOString(),
        credibility: {
          authorTrust: author.trust.score,
          contentScore: 70 + Math.floor(Math.random() * 25),
          engagementQuality: 0.6 + Math.random() * 0.35,
          viralityBrake: author.trust.score < 50,
        },
      };
      setPendingPosts(prev => [incoming, ...prev]);
      simIndexRef.current++;
    }, 15000); // new post every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const showPending = useCallback(() => {
    setPosts(prev => [...pendingPosts, ...prev]);
    setPendingPosts([]);
    feedTopRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [pendingPosts]);

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

  const handlePost = (content: string, media?: import('@/types').MediaAttachment[]) => {
    const newPost: Post = {
      id: generateId(),
      author: currentUser,
      content,
      media,
      likes: 0, reposts: 0, replies: 0, views: 0,
      liked: false, reposted: false, bookmarked: false,
      createdAt: new Date().toISOString(),
      credibility: {
        authorTrust: currentUser.trust.score,
        contentScore: 80,
        engagementQuality: 1.0,
        viralityBrake: false,
      },
    };
    setPosts(prev => [newPost, ...prev]);
  };

  return (
    <div>
      {/* Feed Mode Selector */}
      <div className="sticky top-0 z-30 glass border-b border-theme">
        <div className="flex">
          <button
            className="flex-1 py-3.5 text-center relative transition-colors hover:bg-theme-hover"
            onClick={() => setFeedMode('trusted')}
          >
            <span className={cn(
              'inline-flex items-center gap-1.5 text-[15px] font-medium',
              feedMode === 'trusted' ? 'text-emerald-400 font-bold' : 'text-theme-tertiary'
            )}>
              <Shield className="w-4 h-4" />
              Trusted Feed
            </span>
            {feedMode === 'trusted' && (
              <motion.div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-emerald-400 rounded-full" layoutId="feedTab" />
            )}
          </button>
          <button
            className="flex-1 py-3.5 text-center relative transition-colors hover:bg-theme-hover"
            onClick={() => setFeedMode('raw')}
          >
            <span className={cn(
              'inline-flex items-center gap-1.5 text-[15px] font-medium',
              feedMode === 'raw' ? 'text-xbee-primary font-bold' : 'text-theme-tertiary'
            )}>
              <Zap className="w-4 h-4" />
              Raw Feed
            </span>
            {feedMode === 'raw' && (
              <motion.div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-xbee-primary rounded-full" layoutId="feedTab" />
            )}
          </button>
        </div>

        {/* Feed mode description */}
        <AnimatePresence mode="wait">
          <motion.div
            key={feedMode}
            className={cn(
              'px-4 py-2 text-[11px] flex items-center gap-1.5 border-b border-theme',
              feedMode === 'trusted' ? 'bg-emerald-500/5 text-emerald-400' : 'bg-xbee-primary/5 text-xbee-primary'
            )}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Info className="w-3 h-3 shrink-0" />
            {feedMode === 'trusted'
              ? 'Sorted by credibility, relevance & consistency — not virality'
              : 'Chronological feed — all posts, unfiltered'
            }
          </motion.div>
        </AnimatePresence>
      </div>

      {/* New posts available bar */}
      <AnimatePresence>
        {pendingPosts.length > 0 && (
          <motion.button
            className="w-full py-2.5 bg-xbee-primary/10 hover:bg-xbee-primary/20 text-xbee-primary text-sm font-medium flex items-center justify-center gap-2 border-b border-theme transition-colors"
            onClick={showPending}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <ArrowUp className="w-4 h-4" />
            Show {pendingPosts.length} new post{pendingPosts.length > 1 ? 's' : ''}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Composer */}
      <div ref={feedTopRef}>
        <PostComposer onPost={handlePost} />
      </div>

      {/* Posts */}
      <div>
        <AnimatePresence initial={false}>
          {sortedPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <PostCard post={post} index={index} feedMode={feedMode} />
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="py-8 text-center">
          <div className="inline-flex items-center gap-2 text-theme-tertiary">
            <div className="w-5 h-5 border-2 border-xbee-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Loading more posts...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
