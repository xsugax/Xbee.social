'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, TrendingUp, ArrowUp, ArrowDown, Minus, Sparkles, Shield, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { formatNumber, cn } from '@/lib/utils';
import { mockTrends, mockUsers, currentUser } from '@/lib/mockData';
import TrustBadge from '@/components/trust/TrustBadge';
import TrustScoreCard from '@/components/trust/TrustScoreCard';
import { useLayout } from '@/context/LayoutContext';

export default function RightSidebar() {
  const { rightSidebarCollapsed, toggleRightSidebar } = useLayout();

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
            className="xbee-input pl-11 py-2.5 rounded-full bg-theme-tertiary"
          />
        </div>
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
          <span className="text-xbee-primary text-sm cursor-pointer hover:underline">Show more</span>
        </div>
      </div>

      {/* Suggested Users */}
      <div className="glass-card mt-4 overflow-hidden">
        <div className="px-4 py-3 border-b border-theme">
          <h2 className="text-xl font-bold text-theme-primary">Who to follow</h2>
        </div>
        {mockUsers.slice(0, 3).map((user, idx) => (
          <motion.div
            key={user.id}
            className="flex items-center gap-3 px-4 py-3 hover:bg-theme-hover transition-colors cursor-pointer"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-xbee-secondary to-xbee-accent flex items-center justify-center text-white font-bold text-sm shrink-0">
              {user.displayName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-bold text-sm text-theme-primary truncate">{user.displayName}</span>
                <TrustBadge score={user.trust.score} tier={user.trust.tier} size="sm" verification={user.verification} />
              </div>
              <span className="text-sm text-theme-secondary">@{user.username}</span>
            </div>
            <motion.button
              className="xbee-button-secondary text-sm px-4 py-1.5"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Follow
            </motion.button>
          </motion.div>
        ))}
        <div className="px-4 py-3">
          <span className="text-xbee-primary text-sm cursor-pointer hover:underline">Show more</span>
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
            <motion.div
              key={i}
              className="p-3 rounded-xl bg-theme-tertiary hover:bg-theme-hover transition-colors cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-sm text-theme-primary font-medium">{topic}</p>
              <p className="text-xs text-xbee-primary mt-1">Join conversation →</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 px-4 pb-4">
        <p className="text-xs text-theme-tertiary">
          Terms · Privacy · Content Policy · Cookie Policy
        </p>
        <p className="text-xs text-theme-tertiary mt-1">
          &copy; 1996–2026 Xbee Technologies, Inc.
        </p>
      </div>
    </aside>
    </>
  );
}
