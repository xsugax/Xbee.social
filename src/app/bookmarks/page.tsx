'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bookmark } from 'lucide-react';
import PostCard from '@/components/feed/PostCard';
import EmptyState from '@/components/ui/EmptyState';
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
        <EmptyState
          icon={Bookmark}
          title="No bookmarks yet"
          description="Save posts to your bookmarks by tapping the bookmark icon on any post. They'll show up here."
        />
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
