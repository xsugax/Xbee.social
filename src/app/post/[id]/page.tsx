'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, FileQuestion } from 'lucide-react';
import PostCard from '@/components/feed/PostCard';
import { useApp } from '@/context/AppContext';

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const { posts } = useApp();
  const postId = params.id as string;
  const post = posts.find(p => p.id === postId);

  return (
    <div>
      <div className="sticky top-0 z-30 glass border-b border-theme px-4 py-3 flex items-center gap-3">
        <motion.button className="p-1.5 rounded-full hover:bg-theme-hover" onClick={() => router.back()} whileTap={{ scale: 0.9 }}>
          <ArrowLeft className="w-5 h-5 text-theme-primary" />
        </motion.button>
        <h1 className="text-xl font-bold text-theme-primary">Post</h1>
      </div>

      {post ? (
        <PostCard post={post} index={0} />
      ) : (
        <div className="py-20 text-center">
          <FileQuestion className="w-16 h-16 text-theme-tertiary mx-auto mb-4 opacity-30" />
          <h2 className="text-xl font-bold text-theme-primary mb-2">Post not found</h2>
          <p className="text-sm text-theme-tertiary">This post may have been deleted or doesn&apos;t exist.</p>
          <motion.button className="xbee-button-primary mt-4 text-sm" onClick={() => router.push('/')} whileTap={{ scale: 0.95 }}>Back to Home</motion.button>
        </div>
      )}
    </div>
  );
}
