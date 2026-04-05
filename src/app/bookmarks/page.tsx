'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bookmark } from 'lucide-react';
import PostCard from '@/components/feed/PostCard';
import { useApp } from '@/context/AppContext';

export default function BookmarksPage() {
  const { posts } = useApp();
  const bookmarkedPosts = posts.filter(p => p.bookmarked);

  return (
    <div>
      <div className="sticky top-0 z-30 glass border-b border-theme px-4 py-3">
        <h1 className="text-xl font-bold text-theme-primary">Bookmarks</h1>
        <p className="text-xs text-theme-tertiary mt-0.5">{bookmarkedPosts.length} saved posts</p>
      </div>

      {bookmarkedPosts.length === 0 ? (
        <div className="py-20 text-center">
          <Bookmark className="w-16 h-16 text-theme-tertiary mx-auto mb-4 opacity-30" />
          <h2 className="text-xl font-bold text-theme-primary mb-2">No bookmarks yet</h2>
          <p className="text-sm text-theme-tertiary max-w-[300px] mx-auto">
            Save posts to your bookmarks by tapping the bookmark icon on any post. They&apos;ll show up here.
          </p>
        </div>
      ) : (
        <div>
          {bookmarkedPosts.map((post, index) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <PostCard post={post} index={index} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
