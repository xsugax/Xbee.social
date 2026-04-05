'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Search, Plus, Radio, Shield, Sparkles, ArrowRight, Hash, Mic, MessageSquare,
  Lock, DollarSign
} from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import { mockCommunities, currentUser } from '@/lib/mockData';
import { formatNumber, cn } from '@/lib/utils';

type CommunityTab = 'discover' | 'joined' | 'live';

export default function CommunitiesPage() {
  const [activeTab, setActiveTab] = useState<CommunityTab>('discover');

  const liveCommunities = mockCommunities.filter(c => c.isLive);

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-30 glass">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-theme-primary">Communities</h1>
          <div className="flex items-center gap-2">
            <motion.button className="p-2 rounded-full hover:bg-theme-hover text-theme-secondary" whileTap={{ scale: 0.9 }}>
              <Search className="w-5 h-5" />
            </motion.button>
            <motion.button className="xbee-button-primary text-sm px-4 py-2" whileTap={{ scale: 0.95 }}>
              <Plus className="w-4 h-4" /> Create
            </motion.button>
          </div>
        </div>

        <div className="flex border-b border-theme">
          {(['discover', 'joined', 'live'] as CommunityTab[]).map((tab) => (
            <button
              key={tab}
              className="flex-1 py-3 relative transition-colors hover:bg-theme-hover"
              onClick={() => setActiveTab(tab)}
            >
              <span className={cn(
                'text-sm font-medium capitalize flex items-center justify-center gap-1.5',
                activeTab === tab ? 'text-theme-primary font-bold' : 'text-theme-tertiary'
              )}>
                {tab === 'live' && <Radio className="w-3.5 h-3.5 text-xbee-danger animate-pulse-soft" />}
                {tab}
              </span>
              {activeTab === tab && (
                <motion.div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-xbee-primary rounded-full"
                  layoutId="communityTab"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Live Now Banner */}
      {liveCommunities.length > 0 && activeTab !== 'live' && (
        <div className="px-4 py-3 border-b border-theme">
          <div className="flex items-center gap-2 mb-3">
            <Radio className="w-4 h-4 text-xbee-danger animate-pulse-soft" />
            <span className="text-sm font-bold text-theme-primary">Live Now</span>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
            {liveCommunities.map((comm) => (
              <motion.div
                key={comm.id}
                className="shrink-0 w-48 p-3 rounded-2xl bg-gradient-to-br from-xbee-danger/20 to-xbee-secondary/20 border border-xbee-danger/20 cursor-pointer"
                whileHover={{ scale: 1.03 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-xbee-primary to-xbee-secondary flex items-center justify-center text-white text-xs font-bold">
                    {comm.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-theme-primary truncate">{comm.name}</p>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-xbee-danger animate-pulse" />
                      <span className="text-xs text-xbee-danger">{comm.liveParticipants} listening</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-theme-secondary mt-1 flex items-center gap-1">
                  <Mic className="w-3 h-3" /> Audio + Chat
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Communities Grid */}
      <div className="p-4 space-y-3">
        {mockCommunities.map((community, idx) => {
          const trustLocked = community.trustRequired !== undefined && currentUser.trust.score < community.trustRequired;
          return (
            <motion.div
              key={community.id}
              className={cn(
                'glass-card p-4 cursor-pointer transition-all',
                trustLocked ? 'opacity-60 border-orange-500/20' : 'hover:border-xbee-primary/30',
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={trustLocked ? {} : { y: -2 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-xbee-primary to-xbee-secondary flex items-center justify-center text-white text-xl font-bold shrink-0">
                  {community.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-theme-primary text-lg">{community.name}</h3>
                    {community.verified && <Sparkles className="w-4 h-4 text-xbee-primary shrink-0" />}
                    {community.isLive && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-xbee-danger/10 text-xbee-danger text-xs font-medium">
                        <Radio className="w-3 h-3 animate-pulse-soft" /> Live
                      </span>
                    )}
                    {community.paidAccess && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                        <DollarSign className="w-3 h-3" /> ${community.price}/mo
                      </span>
                    )}
                    {community.trustRequired !== undefined && community.trustRequired > 0 && (
                      <span className={cn(
                        'flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border',
                        trustLocked
                          ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                      )}>
                        <Shield className="w-3 h-3" /> Trust {community.trustRequired}+
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-theme-secondary mt-1 line-clamp-2">{community.description}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="flex items-center gap-1.5 text-sm text-theme-tertiary">
                      <Users className="w-4 h-4" /> {formatNumber(community.members)} members
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-theme-tertiary">
                      <Hash className="w-4 h-4" /> {community.category}
                    </span>
                    {community.isLive && (
                      <span className="flex items-center gap-1.5 text-sm text-xbee-danger">
                        <Mic className="w-4 h-4" /> {community.liveParticipants} listening
                      </span>
                    )}
                  </div>

                  {/* Trust Lock banner */}
                  {trustLocked && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-orange-400">
                      <Lock className="w-3 h-3" />
                      Your trust score ({currentUser.trust.score}) is below the {community.trustRequired} required
                    </div>
                  )}
                </div>
                <motion.button
                  className={cn(
                    'text-sm px-4 py-2 shrink-0',
                    trustLocked ? 'xbee-button-secondary opacity-50 cursor-not-allowed' : 'xbee-button-primary',
                  )}
                  whileTap={trustLocked ? {} : { scale: 0.95 }}
                  disabled={trustLocked}
                >
                  {trustLocked ? <Lock className="w-4 h-4" /> : 'Join'}
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
