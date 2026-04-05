'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Hash, Sparkles, Users, Zap, Flame } from 'lucide-react';
import PostCard from '@/components/feed/PostCard';
import { mockPosts, mockTrends, mockCommunities } from '@/lib/mockData';
import { formatNumber } from '@/lib/utils';

type ExploreTab = 'trending' | 'news' | 'tech' | 'entertainment' | 'sports';

const tabs: { id: ExploreTab; label: string }[] = [
  { id: 'trending', label: 'Trending' },
  { id: 'news', label: 'News' },
  { id: 'tech', label: 'Technology' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'sports', label: 'Sports' },
];

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<ExploreTab>('trending');
  const [searchQuery, setSearchQuery] = useState('');

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
              placeholder="Search Xbee"
              className="xbee-input pl-11 rounded-full"
            />
          </div>
        </div>

        {/* Tabs */}
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
      </div>

      {/* Featured Topics */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {[
            { title: 'AI Revolution', icon: Sparkles, posts: '245K', gradient: 'from-xbee-primary to-xbee-secondary' },
            { title: 'Creator Economy', icon: Zap, posts: '89K', gradient: 'from-xbee-secondary to-xbee-accent' },
            { title: 'Open Source', icon: Users, posts: '156K', gradient: 'from-emerald-500 to-cyan-500' },
            { title: 'Hot Debates', icon: Flame, posts: '312K', gradient: 'from-orange-500 to-pink-500' },
          ].map(({ title, icon: Icon, posts, gradient }) => (
            <motion.div
              key={title}
              className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} cursor-pointer relative overflow-hidden`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute top-2 right-2 opacity-20">
                <Icon className="w-16 h-16 text-white" />
              </div>
              <Icon className="w-6 h-6 text-white mb-2" />
              <h3 className="text-white font-bold text-lg">{title}</h3>
              <p className="text-white/70 text-sm">{posts} posts</p>
            </motion.div>
          ))}
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

      {/* Trending Posts */}
      <div className="border-t border-theme pt-1">
        {mockPosts.slice(0, 3).map((post, index) => (
          <PostCard key={post.id} post={post} index={index} />
        ))}
      </div>
    </div>
  );
}
