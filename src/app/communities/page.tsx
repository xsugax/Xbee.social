'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Search, Plus, Radio, Shield, Sparkles, Hash, Mic,
  Lock, DollarSign, X, Check, Image, AlertCircle,
  Crown, MessageSquare, ArrowRight
} from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import { mockCommunities, currentUser } from '@/lib/mockData';
import { formatNumber, cn } from '@/lib/utils';
import DemoBadge from '@/components/ui/DemoBadge';

type CommunityTab = 'discover' | 'joined' | 'live';

function getJoinedIds(): string[] {
  try { return JSON.parse(localStorage.getItem('xbee_joined_communities') || '[]'); }
  catch { return []; }
}
function saveJoinedIds(ids: string[]) {
  localStorage.setItem('xbee_joined_communities', JSON.stringify(ids));
}

export default function CommunitiesPage() {
  const [activeTab, setActiveTab] = useState<CommunityTab>('discover');
  const [joinedIds, setJoinedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createDesc, setCreateDesc] = useState('');
  const [createCategory, setCreateCategory] = useState('General');
  const [createPrivate, setCreatePrivate] = useState(false);
  const [createError, setCreateError] = useState('');
  const [customCommunities, setCustomCommunities] = useState<any[]>([]);

  useEffect(() => {
    setJoinedIds(getJoinedIds());
    try { setCustomCommunities(JSON.parse(localStorage.getItem('xbee_custom_communities') || '[]')); } catch {}
  }, []);

  const allCommunities = [...mockCommunities, ...customCommunities];

  const toggleJoin = useCallback((id: string) => {
    setJoinedIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      saveJoinedIds(next);
      return next;
    });
  }, []);

  const handleCreateCommunity = () => {
    setCreateError('');
    if (!createName.trim() || createName.trim().length < 3) { setCreateError('Name must be at least 3 characters'); return; }
    if (!createDesc.trim()) { setCreateError('Please add a description'); return; }
    const newComm = {
      id: `custom-${Date.now()}`,
      name: createName.trim(),
      description: createDesc.trim(),
      category: createCategory,
      members: 1,
      verified: false,
      isLive: false,
      liveParticipants: 0,
      trustRequired: 0,
      paidAccess: false,
      price: 0,
    };
    const updated = [...customCommunities, newComm];
    setCustomCommunities(updated);
    localStorage.setItem('xbee_custom_communities', JSON.stringify(updated));
    setJoinedIds(prev => { const next = [...prev, newComm.id]; saveJoinedIds(next); return next; });
    setCreateName(''); setCreateDesc(''); setCreateCategory('General'); setCreatePrivate(false);
    setShowCreate(false);
  };

  const liveCommunities = allCommunities.filter(c => c.isLive);

  const filtered = allCommunities.filter(c => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!c.name.toLowerCase().includes(q) && !c.description.toLowerCase().includes(q) && !c.category.toLowerCase().includes(q)) return false;
    }
    if (activeTab === 'joined') return joinedIds.includes(c.id);
    if (activeTab === 'live') return c.isLive;
    return true;
  });

  return (
    <div>
      <DemoBadge />
      <div className="sticky top-0 z-30 glass">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-theme-primary">Communities</h1>
          <div className="flex items-center gap-2">
            <motion.button className="p-2 rounded-full hover:bg-theme-hover text-theme-secondary" whileTap={{ scale: 0.9 }} onClick={() => setShowSearch(!showSearch)}>
              <Search className="w-5 h-5" />
            </motion.button>
            <motion.button className="xbee-button-primary text-sm px-4 py-2" whileTap={{ scale: 0.95 }} onClick={() => setShowCreate(true)}>
              <Plus className="w-4 h-4" /> Create
            </motion.button>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div className="px-4 pb-3" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-tertiary" />
                <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search communities..." className="xbee-input pl-10 py-2 rounded-full text-sm" autoFocus />
                {searchQuery && (
                  <button className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setSearchQuery('')}><X className="w-4 h-4 text-theme-tertiary" /></button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex border-b border-theme">
          {(['discover', 'joined', 'live'] as CommunityTab[]).map((tab) => (
            <button key={tab} className="flex-1 py-3 relative transition-colors hover:bg-theme-hover" onClick={() => setActiveTab(tab)}>
              <span className={cn('text-sm font-medium capitalize flex items-center justify-center gap-1.5', activeTab === tab ? 'text-theme-primary font-bold' : 'text-theme-tertiary')}>
                {tab === 'live' && <Radio className="w-3.5 h-3.5 text-xbee-danger animate-pulse-soft" />}
                {tab}
                {tab === 'joined' && joinedIds.length > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-xbee-primary/20 text-xbee-primary font-bold">{joinedIds.length}</span>}
                {tab === 'live' && liveCommunities.length > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-xbee-danger/20 text-xbee-danger font-bold">{liveCommunities.length}</span>}
              </span>
              {activeTab === tab && <motion.div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-xbee-primary rounded-full" layoutId="communityTab" />}
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
              <motion.div key={comm.id} className="shrink-0 w-48 p-3 rounded-2xl bg-gradient-to-br from-xbee-danger/20 to-xbee-secondary/20 border border-xbee-danger/20 cursor-pointer" whileHover={{ scale: 1.03 }} onClick={() => { if(!joinedIds.includes(comm.id)) toggleJoin(comm.id); setActiveTab('live'); }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-xbee-primary to-xbee-secondary flex items-center justify-center text-white text-xs font-bold">{comm.name.charAt(0)}</div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-theme-primary truncate">{comm.name}</p>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-xbee-danger animate-pulse" /><span className="text-xs text-xbee-danger">{comm.liveParticipants} listening</span></div>
                  </div>
                </div>
                <p className="text-xs text-theme-secondary mt-1 flex items-center gap-1"><Mic className="w-3 h-3" /> Audio + Chat</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty states */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="w-16 h-16 rounded-2xl bg-xbee-primary/10 flex items-center justify-center mb-4"><Users className="w-8 h-8 text-xbee-primary" /></div>
          <h3 className="text-lg font-bold text-theme-primary mb-1">
            {activeTab === 'joined' ? 'No communities joined yet' : activeTab === 'live' ? 'No live sessions right now' : 'No communities found'}
          </h3>
          <p className="text-sm text-theme-tertiary text-center max-w-xs">
            {activeTab === 'joined' ? 'Discover and join communities to see them here' : activeTab === 'live' ? 'Check back later for live audio sessions' : 'Try a different search term'}
          </p>
          {activeTab === 'joined' && (
            <motion.button className="xbee-button-primary mt-4 text-sm" onClick={() => setActiveTab('discover')} whileTap={{ scale: 0.95 }}>
              <ArrowRight className="w-4 h-4" /> Discover Communities
            </motion.button>
          )}
        </div>
      )}

      {/* Communities Grid */}
      <div className="p-4 space-y-3">
        {filtered.map((community, idx) => {
          const trustLocked = community.trustRequired !== undefined && currentUser.trust.score < community.trustRequired;
          const isJoined = joinedIds.includes(community.id);
          return (
            <motion.div key={community.id} className={cn('glass-card p-4 cursor-pointer transition-all', trustLocked ? 'opacity-60 border-orange-500/20' : 'hover:border-xbee-primary/30')} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} whileHover={trustLocked ? {} : { y: -2 }}>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-xbee-primary to-xbee-secondary flex items-center justify-center text-white text-xl font-bold shrink-0">{community.name.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-theme-primary text-lg">{community.name}</h3>
                    {community.verified && <Sparkles className="w-4 h-4 text-xbee-primary shrink-0" />}
                    {community.isLive && <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-xbee-danger/10 text-xbee-danger text-xs font-medium"><Radio className="w-3 h-3 animate-pulse-soft" /> Live</span>}
                    {community.paidAccess && <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20"><DollarSign className="w-3 h-3" /> ${community.price}/mo</span>}
                    {community.trustRequired !== undefined && community.trustRequired > 0 && (
                      <span className={cn('flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border', trustLocked ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20')}>
                        <Shield className="w-3 h-3" /> Trust {community.trustRequired}+
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-theme-secondary mt-1 line-clamp-2">{community.description}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="flex items-center gap-1.5 text-sm text-theme-tertiary"><Users className="w-4 h-4" /> {formatNumber(community.members)} members</span>
                    <span className="flex items-center gap-1.5 text-sm text-theme-tertiary"><Hash className="w-4 h-4" /> {community.category}</span>
                    {community.isLive && <span className="flex items-center gap-1.5 text-sm text-xbee-danger"><Mic className="w-4 h-4" /> {community.liveParticipants} listening</span>}
                  </div>
                  {trustLocked && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-orange-400"><Lock className="w-3 h-3" /> Your trust score ({currentUser.trust.score}) is below the {community.trustRequired} required</div>
                  )}
                </div>
                <motion.button
                  className={cn('text-sm px-4 py-2 shrink-0 rounded-xl font-bold transition-colors', trustLocked ? 'bg-theme-tertiary text-theme-tertiary cursor-not-allowed' : isJoined ? 'bg-theme-tertiary text-theme-primary hover:bg-red-500/10 hover:text-red-400 border border-theme' : 'xbee-button-primary')}
                  whileTap={trustLocked ? {} : { scale: 0.95 }}
                  disabled={trustLocked}
                  onClick={() => !trustLocked && toggleJoin(community.id)}
                >
                  {trustLocked ? <Lock className="w-4 h-4" /> : isJoined ? 'Joined' : 'Join'}
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Create Community Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Create community" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCreate(false)}>
            <motion.div className="glass-card w-full max-w-md p-5" initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-theme-primary">Create Community</h3>
                <button onClick={() => setShowCreate(false)} className="p-1 rounded-full hover:bg-theme-hover"><X className="w-5 h-5 text-theme-secondary" /></button>
              </div>
              {createError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-4">
                  <AlertCircle className="w-4 h-4 text-red-400" /><span className="text-sm text-red-400">{createError}</span>
                </div>
              )}
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-theme-tertiary mb-1 block">Community Name</label>
                  <input className="xbee-input w-full py-2.5" placeholder="e.g. Tech Innovators" value={createName} onChange={(e) => setCreateName(e.target.value)} maxLength={50} />
                </div>
                <div>
                  <label className="text-xs text-theme-tertiary mb-1 block">Description</label>
                  <textarea className="xbee-input w-full py-2.5 resize-none h-20" placeholder="What's your community about?" value={createDesc} onChange={(e) => setCreateDesc(e.target.value)} maxLength={200} />
                </div>
                <div>
                  <label className="text-xs text-theme-tertiary mb-1 block">Category</label>
                  <select className="xbee-input w-full py-2.5" value={createCategory} onChange={(e) => setCreateCategory(e.target.value)}>
                    {['General', 'Technology', 'Design', 'Business', 'Science', 'Art', 'Music', 'Gaming', 'Sports', 'Education'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div><p className="text-sm text-theme-primary font-medium">Private Community</p><p className="text-xs text-theme-tertiary">Members must be approved</p></div>
                  <div className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${createPrivate ? 'bg-xbee-primary' : 'bg-theme-tertiary'}`} onClick={() => setCreatePrivate(!createPrivate)}>
                    <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow-sm ${createPrivate ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
                  </div>
                </div>
                <motion.button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-sm mt-2 flex items-center justify-center gap-2" onClick={handleCreateCommunity} whileTap={{ scale: 0.98 }}>
                  <Plus className="w-4 h-4" /> Create Community
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}