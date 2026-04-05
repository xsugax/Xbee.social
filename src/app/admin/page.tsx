'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, FileText, Shield, Settings, BarChart3, Eye, Ban,
  CheckCircle, XCircle, Search, TrendingUp, MessageCircle,
  AlertTriangle, Trash2, Pin, Star, ArrowLeft, Plus, Edit3,
  UserPlus, UserX, Crown, Lock, Unlock, Volume2, Send,
  Globe, Activity, Clock, Zap, Power, Database, RefreshCw,
  ChevronDown, ChevronUp, Copy, ExternalLink, Download,
  ShieldCheck, ShieldOff, Megaphone, ToggleLeft, ToggleRight,
  Mail, Hash, Calendar, Award, Flag, Slash, EyeOff
} from 'lucide-react';
import Link from 'next/link';
import Avatar from '@/components/ui/Avatar';
import TrustBadge from '@/components/trust/TrustBadge';
import { mockUsers, currentUser, mockPosts } from '@/lib/mockData';
import { formatNumber, formatTimeAgo, cn } from '@/lib/utils';
import { User, Post, TrustTier, VerificationType } from '@/types';

type AdminTab = 'users' | 'posts' | 'analytics' | 'controls' | 'logs' | 'broadcast';

// Simulated activity log
const initialLogs = [
  { id: '1', action: 'User Banned', target: 'spambot_99', actor: 'Admin', time: new Date(Date.now() - 60000 * 5).toISOString(), severity: 'high' as const },
  { id: '2', action: 'Post Removed', target: 'post-suspicious-link', actor: 'Auto-Mod', time: new Date(Date.now() - 60000 * 12).toISOString(), severity: 'medium' as const },
  { id: '3', action: 'Trust Score Adjusted', target: 'jamesk', actor: 'Admin', time: new Date(Date.now() - 60000 * 30).toISOString(), severity: 'low' as const },
  { id: '4', action: 'User Verified', target: 'sarahdev', actor: 'Admin', time: new Date(Date.now() - 60000 * 60).toISOString(), severity: 'low' as const },
  { id: '5', action: 'Scam Detected', target: 'Message from user-3', actor: 'AI System', time: new Date(Date.now() - 60000 * 90).toISOString(), severity: 'high' as const },
  { id: '6', action: 'Invite Code Generated', target: 'XBEE-ADMIN-001', actor: 'Admin', time: new Date(Date.now() - 60000 * 120).toISOString(), severity: 'low' as const },
  { id: '7', action: 'Platform Settings Changed', target: 'Ghost Mode enabled', actor: 'Admin', time: new Date(Date.now() - 60000 * 180).toISOString(), severity: 'medium' as const },
  { id: '8', action: 'Mass DM Sent', target: '11 users', actor: 'Admin', time: new Date(Date.now() - 60000 * 240).toISOString(), severity: 'medium' as const },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  // User management state
  const [managedUsers, setManagedUsers] = useState<(User & { banned?: boolean; suspended?: boolean; muted?: boolean })[]>(
    [currentUser, ...mockUsers].map(u => ({ ...u, banned: false, suspended: false, muted: false }))
  );
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ displayName: '', username: '', bio: '', trust: 50 });
  const [userSort, setUserSort] = useState<'trust' | 'followers' | 'newest'>('trust');
  const [userFilter, setUserFilter] = useState<'all' | 'verified' | 'unverified' | 'banned' | 'low-trust'>('all');
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);

  // Post management state
  const [managedPosts, setManagedPosts] = useState<(Post & { pinned?: boolean; hidden?: boolean; promoted?: boolean })[]>(
    mockPosts.map(p => ({ ...p, pinned: false, hidden: false, promoted: false }))
  );

  // Logs
  const [logs] = useState(initialLogs);

  // Broadcast state
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState<'all' | 'verified' | 'low-trust'>('all');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Platform controls state
  const [controls, setControls] = useState({
    aiCommentEngine: true,
    controlledVirality: true,
    scamDetection: true,
    ghostMode: true,
    newUserRestrictions: false,
    inviteOnly: false,
    trustTransparency: true,
    monetization: true,
    maintenanceMode: false,
    registrationOpen: true,
    mediaUploads: true,
    aiChatEnabled: true,
    profanityFilter: true,
    rateLimiting: true,
    globalMaxPosts: 100,
    newUserMaxPosts: 10,
    minTrustToPost: 0,
    minTrustToMessage: 0,
  });

  const filteredUsers = useMemo(() => {
    let result = managedUsers;
    if (searchQuery) {
      result = result.filter(u =>
        u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    switch (userFilter) {
      case 'verified': result = result.filter(u => u.verified); break;
      case 'unverified': result = result.filter(u => !u.verified); break;
      case 'banned': result = result.filter(u => u.banned); break;
      case 'low-trust': result = result.filter(u => u.trust.score < 50); break;
    }
    switch (userSort) {
      case 'trust': result = [...result].sort((a, b) => b.trust.score - a.trust.score); break;
      case 'followers': result = [...result].sort((a, b) => b.followers - a.followers); break;
      case 'newest': result = [...result].sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()); break;
    }
    return result;
  }, [managedUsers, searchQuery, userFilter, userSort]);

  const toggleBan = (userId: string) => {
    setManagedUsers(prev => prev.map(u => u.id === userId ? { ...u, banned: !u.banned, suspended: false } : u));
  };
  const toggleSuspend = (userId: string) => {
    setManagedUsers(prev => prev.map(u => u.id === userId ? { ...u, suspended: !u.suspended } : u));
  };
  const toggleMute = (userId: string) => {
    setManagedUsers(prev => prev.map(u => u.id === userId ? { ...u, muted: !u.muted } : u));
  };
  const toggleVerify = (userId: string) => {
    setManagedUsers(prev => prev.map(u => u.id === userId ? { ...u, verified: !u.verified, verification: u.verified ? 'none' as VerificationType : 'identity' as VerificationType } : u));
  };
  const setTrustScore = (userId: string, score: number) => {
    setManagedUsers(prev => prev.map(u => {
      if (u.id !== userId) return u;
      const tier: TrustTier = score >= 90 ? 'authority' : score >= 70 ? 'trusted' : score >= 50 ? 'established' : score >= 25 ? 'building' : 'new';
      return { ...u, trust: { ...u.trust, score, tier } };
    }));
  };
  const resetTrust = (userId: string) => {
    setTrustScore(userId, 50);
  };
  const deleteUser = (userId: string) => {
    setManagedUsers(prev => prev.filter(u => u.id !== userId));
  };
  const addUser = () => {
    if (!newUser.displayName || !newUser.username) return;
    const id = `user-${Date.now()}`;
    const u: User & { banned?: boolean; suspended?: boolean; muted?: boolean } = {
      id,
      username: newUser.username.toLowerCase().replace(/\s/g, '_'),
      displayName: newUser.displayName,
      avatar: '',
      bio: newUser.bio,
      verified: false,
      verification: 'none',
      authenticityScore: 50,
      trust: {
        score: newUser.trust,
        tier: newUser.trust >= 90 ? 'authority' : newUser.trust >= 70 ? 'trusted' : newUser.trust >= 50 ? 'established' : newUser.trust >= 25 ? 'building' : 'new',
        identityVerified: false,
        behaviorSignals: [],
        reachMultiplier: 1.0,
        monetizationUnlocked: false,
        scamFlags: 0,
        reportCount: 0,
        accountAge: 0,
        consistencyScore: 50,
        lastUpdated: new Date().toISOString(),
      },
      followers: 0, following: 0,
      joinedAt: new Date().toISOString(),
      badges: [],
      streak: 0,
      invitesRemaining: 0,
      banned: false, suspended: false, muted: false,
    };
    setManagedUsers(prev => [u, ...prev]);
    setNewUser({ displayName: '', username: '', bio: '', trust: 50 });
    setShowAddUser(false);
  };

  const togglePostPin = (postId: string) => {
    setManagedPosts(prev => prev.map(p => p.id === postId ? { ...p, pinned: !p.pinned } : p));
  };
  const togglePostHide = (postId: string) => {
    setManagedPosts(prev => prev.map(p => p.id === postId ? { ...p, hidden: !p.hidden } : p));
  };
  const togglePostPromote = (postId: string) => {
    setManagedPosts(prev => prev.map(p => p.id === postId ? { ...p, promoted: !p.promoted } : p));
  };
  const deletePost = (postId: string) => {
    setManagedPosts(prev => prev.filter(p => p.id !== postId));
  };

  const handleBroadcast = () => {
    if (!broadcastMsg.trim()) return;
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 3000);
    setBroadcastMsg('');
  };

  const toggleControl = (key: keyof typeof controls) => {
    setControls(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const allUsers = managedUsers;

  const tabs: { id: AdminTab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: 'users', label: 'Users', icon: Users, count: allUsers.length },
    { id: 'posts', label: 'Posts', icon: FileText, count: managedPosts.length },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'controls', label: 'Controls', icon: Settings },
    { id: 'logs', label: 'Logs', icon: Activity },
    { id: 'broadcast', label: 'Broadcast', icon: Megaphone },
  ];

  return (
    <div className="min-h-screen bg-theme-primary">
      {/* Admin Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50 shadow-2xl">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <motion.button className="p-2 rounded-lg hover:bg-white/10 text-slate-300" whileTap={{ scale: 0.9 }} title="Back to Site">
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
              </Link>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-black text-white tracking-tight">Xbee Admin</h1>
                  <p className="text-[10px] text-slate-400 -mt-0.5">SUPERADMIN CONTROL PANEL</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium text-emerald-400">System Online</span>
              </div>
              <Avatar name={currentUser.displayName} src={currentUser.avatar} size="sm" />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-0 -mb-px scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={cn(
                    'px-4 py-3 relative transition-colors whitespace-nowrap flex items-center gap-2 text-sm font-medium rounded-t-lg',
                    activeTab === tab.id ? 'bg-theme-primary text-white border-t-2 border-x border-t-red-500 border-x-slate-700/50' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  )}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-bold', activeTab === tab.id ? 'bg-red-500/20 text-red-400' : 'bg-slate-700 text-slate-400')}>{tab.count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">

        {/* ═══════════════════════════════════════════════ USERS TAB ═══════════════════════════════════════════════ */}
        {activeTab === 'users' && (
          <div>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-tertiary" />
                <input
                  type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, username, or ID..."
                  className="w-full bg-theme-tertiary text-theme-primary rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder:text-theme-tertiary outline-none focus:ring-2 focus:ring-red-500/30 border border-theme"
                />
              </div>
              <select value={userFilter} onChange={(e) => setUserFilter(e.target.value as typeof userFilter)} className="bg-theme-tertiary text-theme-primary text-sm rounded-xl px-3 py-2.5 border border-theme outline-none">
                <option value="all">All Users</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
                <option value="banned">Banned</option>
                <option value="low-trust">Low Trust</option>
              </select>
              <select value={userSort} onChange={(e) => setUserSort(e.target.value as typeof userSort)} className="bg-theme-tertiary text-theme-primary text-sm rounded-xl px-3 py-2.5 border border-theme outline-none">
                <option value="trust">Sort: Trust</option>
                <option value="followers">Sort: Followers</option>
                <option value="newest">Sort: Newest</option>
              </select>
              <motion.button
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-red-500/20"
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setShowAddUser(!showAddUser)}
              >
                <UserPlus className="w-4 h-4" />
                Add User
              </motion.button>
            </div>

            {/* Add User Form */}
            <AnimatePresence>
              {showAddUser && (
                <motion.div className="glass-card p-5 mb-5 border-2 border-red-500/20" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <h3 className="text-sm font-bold text-theme-primary mb-3 flex items-center gap-2"><UserPlus className="w-4 h-4 text-red-400" /> Create New User</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input type="text" placeholder="Display Name *" value={newUser.displayName} onChange={e => setNewUser(p => ({ ...p, displayName: e.target.value }))}
                      className="bg-theme-tertiary text-theme-primary rounded-lg px-3 py-2 text-sm border border-theme outline-none focus:ring-2 focus:ring-red-500/30" />
                    <input type="text" placeholder="Username *" value={newUser.username} onChange={e => setNewUser(p => ({ ...p, username: e.target.value }))}
                      className="bg-theme-tertiary text-theme-primary rounded-lg px-3 py-2 text-sm border border-theme outline-none focus:ring-2 focus:ring-red-500/30" />
                    <input type="text" placeholder="Bio" value={newUser.bio} onChange={e => setNewUser(p => ({ ...p, bio: e.target.value }))}
                      className="bg-theme-tertiary text-theme-primary rounded-lg px-3 py-2 text-sm border border-theme outline-none focus:ring-2 focus:ring-red-500/30 sm:col-span-2" />
                    <div className="sm:col-span-2">
                      <label className="text-xs text-theme-tertiary mb-1 block">Initial Trust Score: {newUser.trust}</label>
                      <input type="range" min={0} max={100} value={newUser.trust} onChange={e => setNewUser(p => ({ ...p, trust: parseInt(e.target.value) }))}
                        className="w-full accent-red-500" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <motion.button className="px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-lg" whileTap={{ scale: 0.95 }} onClick={addUser}>Create User</motion.button>
                    <motion.button className="px-4 py-2 bg-theme-tertiary text-theme-primary text-sm rounded-lg" whileTap={{ scale: 0.95 }} onClick={() => setShowAddUser(false)}>Cancel</motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
              {[
                { label: 'Total', value: allUsers.length, color: 'text-theme-primary' },
                { label: 'Verified', value: allUsers.filter(u => u.verified).length, color: 'text-emerald-400' },
                { label: 'Low Trust', value: allUsers.filter(u => u.trust.score < 50).length, color: 'text-orange-400' },
                { label: 'Banned', value: allUsers.filter(u => u.banned).length, color: 'text-red-400' },
                { label: 'Suspended', value: allUsers.filter(u => u.suspended).length, color: 'text-yellow-400' },
              ].map(s => (
                <div key={s.label} className="glass-card p-3 text-center">
                  <p className={cn('text-2xl font-bold', s.color)}>{s.value}</p>
                  <p className="text-[11px] text-theme-tertiary">{s.label}</p>
                </div>
              ))}
            </div>

            {/* User List */}
            <div className="space-y-2">
              {filteredUsers.map((user) => (
                <motion.div
                  key={user.id}
                  className={cn(
                    'glass-card overflow-hidden transition-colors',
                    user.banned && 'opacity-60 border-red-500/30',
                    user.suspended && 'border-yellow-500/30'
                  )}
                  initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                >
                  <div className="p-3 flex items-center gap-3 cursor-pointer" onClick={() => setExpandedUserId(expandedUserId === user.id ? null : user.id)}>
                    <div className="relative">
                      <Avatar name={user.displayName} src={user.avatar} size="md" verified={user.verified} />
                      {user.banned && <div className="absolute inset-0 bg-red-500/30 rounded-full flex items-center justify-center"><Ban className="w-5 h-5 text-red-400" /></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={cn('font-bold text-sm truncate', user.banned ? 'text-red-400 line-through' : 'text-theme-primary')}>{user.displayName}</span>
                        <TrustBadge score={user.trust.score} tier={user.trust.tier} size="sm" verification={user.verification} />
                        {user.banned && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-bold">BANNED</span>}
                        {user.suspended && <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 font-bold">SUSPENDED</span>}
                        {user.muted && <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold">MUTED</span>}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-theme-tertiary mt-0.5">
                        <span>@{user.username}</span>
                        <span>•</span>
                        <span>{formatNumber(user.followers)} followers</span>
                        <span>•</span>
                        <span>Trust: {user.trust.score}</span>
                        <span>•</span>
                        <span>ID: {user.id}</span>
                      </div>
                    </div>
                    <div className="shrink-0">
                      {expandedUserId === user.id ? <ChevronUp className="w-4 h-4 text-theme-tertiary" /> : <ChevronDown className="w-4 h-4 text-theme-tertiary" />}
                    </div>
                  </div>

                  {/* Expanded Controls */}
                  <AnimatePresence>
                    {expandedUserId === user.id && (
                      <motion.div
                        className="px-3 pb-3 border-t border-theme pt-3"
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      >
                        {/* User Details Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                          <div className="p-2 rounded-lg bg-theme-tertiary/50">
                            <p className="text-[10px] text-theme-tertiary">Account Age</p>
                            <p className="text-sm font-bold text-theme-primary">{user.trust.accountAge}d</p>
                          </div>
                          <div className="p-2 rounded-lg bg-theme-tertiary/50">
                            <p className="text-[10px] text-theme-tertiary">Scam Flags</p>
                            <p className={cn('text-sm font-bold', user.trust.scamFlags > 0 ? 'text-red-400' : 'text-emerald-400')}>{user.trust.scamFlags}</p>
                          </div>
                          <div className="p-2 rounded-lg bg-theme-tertiary/50">
                            <p className="text-[10px] text-theme-tertiary">Reports</p>
                            <p className={cn('text-sm font-bold', user.trust.reportCount > 0 ? 'text-orange-400' : 'text-emerald-400')}>{user.trust.reportCount}</p>
                          </div>
                          <div className="p-2 rounded-lg bg-theme-tertiary/50">
                            <p className="text-[10px] text-theme-tertiary">Reach Multiplier</p>
                            <p className="text-sm font-bold text-theme-primary">{user.trust.reachMultiplier}x</p>
                          </div>
                          <div className="p-2 rounded-lg bg-theme-tertiary/50">
                            <p className="text-[10px] text-theme-tertiary">Consistency</p>
                            <p className="text-sm font-bold text-theme-primary">{user.trust.consistencyScore}%</p>
                          </div>
                          <div className="p-2 rounded-lg bg-theme-tertiary/50">
                            <p className="text-[10px] text-theme-tertiary">Streak</p>
                            <p className="text-sm font-bold text-theme-primary">{user.streak}🔥</p>
                          </div>
                          <div className="p-2 rounded-lg bg-theme-tertiary/50">
                            <p className="text-[10px] text-theme-tertiary">Following</p>
                            <p className="text-sm font-bold text-theme-primary">{formatNumber(user.following)}</p>
                          </div>
                          <div className="p-2 rounded-lg bg-theme-tertiary/50">
                            <p className="text-[10px] text-theme-tertiary">Joined</p>
                            <p className="text-sm font-bold text-theme-primary">{new Date(user.joinedAt).toLocaleDateString()}</p>
                          </div>
                        </div>

                        {/* Trust Slider */}
                        <div className="mb-3 p-2 rounded-lg bg-theme-tertiary/50">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-theme-primary">Trust Score: {user.trust.score}</span>
                            <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full',
                              user.trust.tier === 'authority' ? 'bg-emerald-500/20 text-emerald-400' :
                              user.trust.tier === 'trusted' ? 'bg-blue-500/20 text-blue-400' :
                              user.trust.tier === 'established' ? 'bg-purple-500/20 text-purple-400' :
                              user.trust.tier === 'building' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-slate-500/20 text-slate-400'
                            )}>{user.trust.tier.toUpperCase()}</span>
                          </div>
                          <input
                            type="range" min={0} max={100} value={user.trust.score}
                            onChange={(e) => setTrustScore(user.id, parseInt(e.target.value))}
                            className="w-full accent-red-500"
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                          <Link href={`/profile?user=${user.id}`}>
                            <motion.button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-medium hover:bg-blue-500/20" whileTap={{ scale: 0.95 }}>
                              <Eye className="w-3 h-3" /> View Profile
                            </motion.button>
                          </Link>
                          <motion.button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20" whileTap={{ scale: 0.95 }} onClick={() => toggleVerify(user.id)}>
                            {user.verified ? <><ShieldOff className="w-3 h-3" /> Unverify</> : <><ShieldCheck className="w-3 h-3" /> Verify</>}
                          </motion.button>
                          <motion.button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-400 text-xs font-medium hover:bg-purple-500/20" whileTap={{ scale: 0.95 }} onClick={() => toggleMute(user.id)}>
                            {user.muted ? <><Volume2 className="w-3 h-3" /> Unmute</> : <><EyeOff className="w-3 h-3" /> Mute</>}
                          </motion.button>
                          <motion.button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-yellow-500/10 text-yellow-400 text-xs font-medium hover:bg-yellow-500/20" whileTap={{ scale: 0.95 }} onClick={() => toggleSuspend(user.id)}>
                            {user.suspended ? <><Unlock className="w-3 h-3" /> Unsuspend</> : <><Lock className="w-3 h-3" /> Suspend</>}
                          </motion.button>
                          <motion.button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-500/10 text-slate-400 text-xs font-medium hover:bg-slate-500/20" whileTap={{ scale: 0.95 }} onClick={() => resetTrust(user.id)}>
                            <RefreshCw className="w-3 h-3" /> Reset Trust
                          </motion.button>
                          <motion.button
                            className={cn('flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium', user.banned ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-red-500/10 text-red-400 hover:bg-red-500/20')}
                            whileTap={{ scale: 0.95 }} onClick={() => toggleBan(user.id)}
                          >
                            {user.banned ? <><CheckCircle className="w-3 h-3" /> Unban</> : <><Ban className="w-3 h-3" /> Ban</>}
                          </motion.button>
                          <motion.button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium hover:bg-red-500/20" whileTap={{ scale: 0.95 }} onClick={() => deleteUser(user.id)}>
                            <Trash2 className="w-3 h-3" /> Delete
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-theme-tertiary text-sm">No users match your filters</div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════ POSTS TAB ═══════════════════════════════════════════════ */}
        {activeTab === 'posts' && (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {[
                { label: 'Total Posts', value: managedPosts.length, color: 'text-theme-primary' },
                { label: 'Reach Limited', value: managedPosts.filter(p => p.reachLimited).length, color: 'text-orange-400' },
                { label: 'Pinned', value: managedPosts.filter(p => p.pinned).length, color: 'text-blue-400' },
                { label: 'Hidden', value: managedPosts.filter(p => p.hidden).length, color: 'text-red-400' },
              ].map(s => (
                <div key={s.label} className="glass-card p-3 text-center">
                  <p className={cn('text-2xl font-bold', s.color)}>{s.value}</p>
                  <p className="text-[11px] text-theme-tertiary">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              {managedPosts.map((post) => (
                <motion.div
                  key={post.id}
                  className={cn(
                    'glass-card overflow-hidden transition-colors',
                    post.hidden && 'opacity-50',
                    post.pinned && 'border-blue-500/30',
                    post.promoted && 'border-amber-500/30'
                  )}
                  initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                >
                  <div className="p-3 cursor-pointer" onClick={() => setSelectedPostId(selectedPostId === post.id ? null : post.id)}>
                    <div className="flex items-start gap-3">
                      <Avatar name={post.author.displayName} src={post.author.avatar} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                          <span className="font-bold text-sm text-theme-primary">{post.author.displayName}</span>
                          <TrustBadge score={post.author.trust.score} tier={post.author.trust.tier} size="sm" verification={post.author.verification} />
                          {post.pinned && <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">📌 PINNED</span>}
                          {post.hidden && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-bold">HIDDEN</span>}
                          {post.promoted && <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">⭐ PROMOTED</span>}
                        </div>
                        <p className="text-sm text-theme-primary line-clamp-2">{post.content}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-theme-tertiary">
                          <span>❤️ {formatNumber(post.likes)}</span>
                          <span>🔁 {formatNumber(post.reposts)}</span>
                          <span>💬 {formatNumber(post.replies)}</span>
                          <span>👁️ {formatNumber(post.views)}</span>
                          <span className="ml-auto">{formatTimeAgo(post.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {selectedPostId === post.id && (
                      <motion.div className="px-3 pb-3 border-t border-theme pt-3 flex flex-wrap items-center gap-2" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                        <motion.button className={cn('flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium', post.pinned ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20')} whileTap={{ scale: 0.95 }} onClick={() => togglePostPin(post.id)}>
                          <Pin className="w-3 h-3" /> {post.pinned ? 'Unpin' : 'Pin'}
                        </motion.button>
                        <motion.button className={cn('flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium', post.promoted ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20')} whileTap={{ scale: 0.95 }} onClick={() => togglePostPromote(post.id)}>
                          <Star className="w-3 h-3" /> {post.promoted ? 'Demote' : 'Promote'}
                        </motion.button>
                        <motion.button className={cn('flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium', post.hidden ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20')} whileTap={{ scale: 0.95 }} onClick={() => togglePostHide(post.id)}>
                          {post.hidden ? <><Eye className="w-3 h-3" /> Show</> : <><EyeOff className="w-3 h-3" /> Hide</>}
                        </motion.button>
                        <Link href={`/profile?user=${post.author.id}`}>
                          <motion.button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-400 text-xs font-medium hover:bg-purple-500/20" whileTap={{ scale: 0.95 }}>
                            <ExternalLink className="w-3 h-3" /> Author Profile
                          </motion.button>
                        </Link>
                        <motion.button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium hover:bg-red-500/20" whileTap={{ scale: 0.95 }} onClick={() => deletePost(post.id)}>
                          <Trash2 className="w-3 h-3" /> Delete
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════ ANALYTICS TAB ═══════════════════════════════════════════════ */}
        {activeTab === 'analytics' && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: TrendingUp, label: 'Total Engagement', value: formatNumber(managedPosts.reduce((a, p) => a + p.likes + p.reposts + p.replies, 0)), sub: '+18.5%', subColor: 'text-emerald-400' },
                { icon: Eye, label: 'Total Views', value: formatNumber(managedPosts.reduce((a, p) => a + p.views, 0)), sub: '+24.2%', subColor: 'text-blue-400' },
                { icon: Users, label: 'Total Users', value: allUsers.length.toString(), sub: `${allUsers.filter(u => u.verified).length} verified`, subColor: 'text-purple-400' },
                { icon: Shield, label: 'Avg Trust', value: Math.round(allUsers.reduce((a, u) => a + u.trust.score, 0) / allUsers.length).toString(), sub: 'Excellent', subColor: 'text-emerald-400' },
              ].map(s => (
                <div key={s.label} className="glass-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <s.icon className={cn('w-4 h-4', s.subColor)} />
                    <span className="text-[11px] font-bold text-theme-tertiary">{s.label}</span>
                  </div>
                  <p className="text-3xl font-bold text-theme-primary">{s.value}</p>
                  <p className={cn('text-xs mt-1', s.subColor)}>{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Trust Distribution */}
            <div className="glass-card p-4">
              <h3 className="text-sm font-bold text-theme-primary mb-3">Trust Score Distribution</h3>
              <div className="space-y-2">
                {[
                  { tier: 'Authority (90-100)', count: allUsers.filter(u => u.trust.score >= 90).length, color: 'bg-emerald-500', pct: (allUsers.filter(u => u.trust.score >= 90).length / allUsers.length * 100) },
                  { tier: 'Trusted (70-89)', count: allUsers.filter(u => u.trust.score >= 70 && u.trust.score < 90).length, color: 'bg-blue-500', pct: (allUsers.filter(u => u.trust.score >= 70 && u.trust.score < 90).length / allUsers.length * 100) },
                  { tier: 'Established (50-69)', count: allUsers.filter(u => u.trust.score >= 50 && u.trust.score < 70).length, color: 'bg-purple-500', pct: (allUsers.filter(u => u.trust.score >= 50 && u.trust.score < 70).length / allUsers.length * 100) },
                  { tier: 'Building (25-49)', count: allUsers.filter(u => u.trust.score >= 25 && u.trust.score < 50).length, color: 'bg-yellow-500', pct: (allUsers.filter(u => u.trust.score >= 25 && u.trust.score < 50).length / allUsers.length * 100) },
                  { tier: 'New (0-24)', count: allUsers.filter(u => u.trust.score < 25).length, color: 'bg-slate-500', pct: (allUsers.filter(u => u.trust.score < 25).length / allUsers.length * 100) },
                ].map(d => (
                  <div key={d.tier}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-theme-primary font-medium">{d.tier}</span>
                      <span className="text-theme-tertiary">{d.count} user{d.count !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-theme-tertiary/30 overflow-hidden">
                      <div className={cn('h-full rounded-full transition-all', d.color)} style={{ width: `${d.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Posts */}
            <div className="glass-card p-4">
              <h3 className="text-sm font-bold text-theme-primary mb-3">Top Posts by Engagement</h3>
              <div className="space-y-3">
                {[...managedPosts].sort((a, b) => (b.likes + b.reposts) - (a.likes + a.reposts)).slice(0, 5).map((post, i) => (
                  <div key={post.id} className="flex items-center gap-3">
                    <span className="text-sm font-bold text-theme-tertiary w-5">{i + 1}</span>
                    <Avatar name={post.author.displayName} src={post.author.avatar} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-theme-primary truncate">{post.content.substring(0, 60)}...</p>
                      <p className="text-[10px] text-theme-tertiary">{formatNumber(post.likes + post.reposts)} engagements • {formatNumber(post.views)} views</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Health */}
            <div className="glass-card p-4">
              <h3 className="text-sm font-bold text-theme-primary mb-3">Content Health</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-center">
                  <p className="text-2xl font-bold text-emerald-400">{Math.round(managedPosts.reduce((a, p) => a + p.credibility.contentScore, 0) / managedPosts.length)}%</p>
                  <p className="text-[10px] text-theme-tertiary mt-1">Avg Content Score</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10 text-center">
                  <p className="text-2xl font-bold text-blue-400">{Math.round(managedPosts.reduce((a, p) => a + p.credibility.engagementQuality * 100, 0) / managedPosts.length)}%</p>
                  <p className="text-[10px] text-theme-tertiary mt-1">Engagement Quality</p>
                </div>
                <div className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/10 text-center sm:col-span-1 col-span-2">
                  <p className="text-2xl font-bold text-orange-400">{managedPosts.filter(p => p.credibility.viralityBrake).length}</p>
                  <p className="text-[10px] text-theme-tertiary mt-1">Virality Brakes Active</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════ CONTROLS TAB ═══════════════════════════════════════════════ */}
        {activeTab === 'controls' && (
          <div className="space-y-5">
            {/* Safety & Moderation */}
            <div>
              <h3 className="text-sm font-bold text-theme-primary mb-3 flex items-center gap-2"><Shield className="w-4 h-4 text-red-400" /> Safety & Moderation</h3>
              <div className="space-y-2">
                {([
                  { key: 'scamDetection' as const, label: 'AI Scam Detection', desc: 'AI-powered scam, phishing, and impersonation detection in all messages', icon: ShieldCheck },
                  { key: 'controlledVirality' as const, label: 'Controlled Virality', desc: 'Limit reach of viral content from low-trust accounts', icon: Zap },
                  { key: 'profanityFilter' as const, label: 'Profanity Filter', desc: 'Auto-filter offensive language in posts and comments', icon: Flag },
                  { key: 'rateLimiting' as const, label: 'Rate Limiting', desc: 'Throttle rapid posting/messaging to prevent spam', icon: Clock },
                  { key: 'newUserRestrictions' as const, label: 'New User Restrictions', desc: 'Limit new accounts until trust is established', icon: UserX },
                ]).map(({ key, label, desc, icon: Icon }) => (
                  <div key={key} className="glass-card p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 mr-4">
                      <Icon className="w-5 h-5 text-theme-tertiary shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-theme-primary">{label}</p>
                        <p className="text-xs text-theme-tertiary mt-0.5">{desc}</p>
                      </div>
                    </div>
                    <div className={cn('w-12 h-7 rounded-full relative cursor-pointer transition-colors', controls[key] ? 'bg-emerald-500' : 'bg-slate-600')} onClick={() => toggleControl(key)}>
                      <div className={cn('w-5 h-5 rounded-full bg-white absolute top-1 transition-transform shadow-sm', controls[key] ? 'translate-x-[22px]' : 'translate-x-1')} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-sm font-bold text-theme-primary mb-3 flex items-center gap-2"><Zap className="w-4 h-4 text-amber-400" /> Features</h3>
              <div className="space-y-2">
                {([
                  { key: 'aiCommentEngine' as const, label: 'AI Comment Engine', desc: 'Enable AI-powered comment suggestions on posts', icon: MessageCircle },
                  { key: 'ghostMode' as const, label: 'Ghost Mode', desc: 'Allow disappearing messages in private chats', icon: EyeOff },
                  { key: 'aiChatEnabled' as const, label: 'Xbee AI Chat', desc: 'Enable the Xbee AI assistant for all users', icon: Zap },
                  { key: 'monetization' as const, label: 'Monetization', desc: 'Enable tipping, subscriptions, and paid communities', icon: Crown },
                  { key: 'trustTransparency' as const, label: 'Trust Score Transparency', desc: 'Show trust score breakdown to all users', icon: Eye },
                  { key: 'mediaUploads' as const, label: 'Media Uploads', desc: 'Allow users to upload images and videos', icon: Globe },
                ]).map(({ key, label, desc, icon: Icon }) => (
                  <div key={key} className="glass-card p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 mr-4">
                      <Icon className="w-5 h-5 text-theme-tertiary shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-theme-primary">{label}</p>
                        <p className="text-xs text-theme-tertiary mt-0.5">{desc}</p>
                      </div>
                    </div>
                    <div className={cn('w-12 h-7 rounded-full relative cursor-pointer transition-colors', controls[key] ? 'bg-emerald-500' : 'bg-slate-600')} onClick={() => toggleControl(key)}>
                      <div className={cn('w-5 h-5 rounded-full bg-white absolute top-1 transition-transform shadow-sm', controls[key] ? 'translate-x-[22px]' : 'translate-x-1')} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Access Control */}
            <div>
              <h3 className="text-sm font-bold text-theme-primary mb-3 flex items-center gap-2"><Lock className="w-4 h-4 text-purple-400" /> Access Control</h3>
              <div className="space-y-2">
                {([
                  { key: 'inviteOnly' as const, label: 'Invite-Only Mode', desc: 'Require invite code for new registrations', icon: Mail },
                  { key: 'registrationOpen' as const, label: 'Open Registration', desc: 'Allow new users to sign up', icon: UserPlus },
                  { key: 'maintenanceMode' as const, label: 'Maintenance Mode', desc: 'Show maintenance page to all non-admin users', icon: Power },
                ]).map(({ key, label, desc, icon: Icon }) => (
                  <div key={key} className="glass-card p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 mr-4">
                      <Icon className="w-5 h-5 text-theme-tertiary shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-theme-primary">{label}</p>
                        <p className="text-xs text-theme-tertiary mt-0.5">{desc}</p>
                      </div>
                    </div>
                    <div className={cn('w-12 h-7 rounded-full relative cursor-pointer transition-colors', controls[key] ? 'bg-emerald-500' : 'bg-slate-600')} onClick={() => toggleControl(key)}>
                      <div className={cn('w-5 h-5 rounded-full bg-white absolute top-1 transition-transform shadow-sm', controls[key] ? 'translate-x-[22px]' : 'translate-x-1')} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Limits */}
            <div>
              <h3 className="text-sm font-bold text-theme-primary mb-3 flex items-center gap-2"><Database className="w-4 h-4 text-blue-400" /> Platform Limits</h3>
              <div className="glass-card p-4 space-y-4">
                {([
                  { key: 'globalMaxPosts' as const, label: 'Max Posts/Day (Global)', min: 10, max: 1000 },
                  { key: 'newUserMaxPosts' as const, label: 'Max Posts/Day (New Users)', min: 1, max: 100 },
                  { key: 'minTrustToPost' as const, label: 'Min Trust Score to Post', min: 0, max: 50 },
                  { key: 'minTrustToMessage' as const, label: 'Min Trust Score to Message', min: 0, max: 50 },
                ] as const).map(({ key, label, min, max }) => (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-theme-primary">{label}</span>
                      <span className="text-xs font-bold text-red-400">{controls[key]}</span>
                    </div>
                    <input type="range" min={min} max={max} value={controls[key] as number}
                      onChange={e => setControls(prev => ({ ...prev, [key]: parseInt(e.target.value) }))}
                      className="w-full accent-red-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════ LOGS TAB ═══════════════════════════════════════════════ */}
        {activeTab === 'logs' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-theme-primary flex items-center gap-2"><Activity className="w-4 h-4 text-red-400" /> Activity Log</h3>
              <span className="text-[11px] text-theme-tertiary">{logs.length} entries</span>
            </div>
            <div className="space-y-2">
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  className={cn(
                    'glass-card p-3 flex items-center gap-3 border-l-4',
                    log.severity === 'high' ? 'border-l-red-500' : log.severity === 'medium' ? 'border-l-yellow-500' : 'border-l-emerald-500'
                  )}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                >
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                    log.severity === 'high' ? 'bg-red-500/10' : log.severity === 'medium' ? 'bg-yellow-500/10' : 'bg-emerald-500/10'
                  )}>
                    {log.severity === 'high' ? <AlertTriangle className="w-4 h-4 text-red-400" /> :
                     log.severity === 'medium' ? <Clock className="w-4 h-4 text-yellow-400" /> :
                     <CheckCircle className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-theme-primary">{log.action}</span>
                      <span className={cn('text-[10px] px-1.5 py-0.5 rounded font-bold',
                        log.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                        log.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-emerald-500/20 text-emerald-400'
                      )}>{log.severity.toUpperCase()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-theme-tertiary mt-0.5">
                      <span>Target: {log.target}</span>
                      <span>•</span>
                      <span>By: {log.actor}</span>
                      <span>•</span>
                      <span>{formatTimeAgo(log.time)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════ BROADCAST TAB ═══════════════════════════════════════════════ */}
        {activeTab === 'broadcast' && (
          <div className="max-w-xl mx-auto">
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-theme-primary mb-1 flex items-center gap-2"><Megaphone className="w-5 h-5 text-red-400" /> Send Platform Broadcast</h3>
              <p className="text-xs text-theme-tertiary mb-4">Send a message to all users or a targeted group. This will appear as a system notification.</p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-theme-primary mb-1 block">Target Audience</label>
                  <select value={broadcastTarget} onChange={e => setBroadcastTarget(e.target.value as typeof broadcastTarget)}
                    className="w-full bg-theme-tertiary text-theme-primary text-sm rounded-xl px-3 py-2.5 border border-theme outline-none">
                    <option value="all">All Users ({allUsers.length})</option>
                    <option value="verified">Verified Users ({allUsers.filter(u => u.verified).length})</option>
                    <option value="low-trust">Low Trust Users ({allUsers.filter(u => u.trust.score < 50).length})</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-theme-primary mb-1 block">Message</label>
                  <textarea
                    value={broadcastMsg} onChange={e => setBroadcastMsg(e.target.value)}
                    placeholder="Type your broadcast message..."
                    className="w-full bg-theme-tertiary text-theme-primary text-sm rounded-xl px-3 py-2.5 border border-theme outline-none focus:ring-2 focus:ring-red-500/30 min-h-[120px] resize-none"
                    rows={5}
                  />
                  <p className="text-[10px] text-theme-tertiary mt-1">{broadcastMsg.length}/500 characters</p>
                </div>

                <motion.button
                  className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={handleBroadcast}
                  disabled={!broadcastMsg.trim()}
                >
                  <Send className="w-4 h-4" />
                  Send Broadcast
                </motion.button>

                <AnimatePresence>
                  {broadcastSent && (
                    <motion.div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm font-medium text-emerald-400">Broadcast sent to {broadcastTarget === 'all' ? allUsers.length : broadcastTarget === 'verified' ? allUsers.filter(u => u.verified).length : allUsers.filter(u => u.trust.score < 50).length} users</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-card p-5 mt-4">
              <h3 className="text-sm font-bold text-theme-primary mb-3">Quick Admin Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <motion.button className="p-3 rounded-xl bg-red-500/5 border border-red-500/10 text-left hover:bg-red-500/10 transition-colors" whileTap={{ scale: 0.97 }}>
                  <Ban className="w-5 h-5 text-red-400 mb-1" />
                  <p className="text-xs font-bold text-theme-primary">Ban All Low Trust</p>
                  <p className="text-[10px] text-theme-tertiary">Ban users with trust &lt; 25</p>
                </motion.button>
                <motion.button className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-left hover:bg-emerald-500/10 transition-colors" whileTap={{ scale: 0.97 }}>
                  <RefreshCw className="w-5 h-5 text-emerald-400 mb-1" />
                  <p className="text-xs font-bold text-theme-primary">Reset All Trust</p>
                  <p className="text-[10px] text-theme-tertiary">Set all users to 50 trust</p>
                </motion.button>
                <motion.button className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 text-left hover:bg-amber-500/10 transition-colors" whileTap={{ scale: 0.97 }}>
                  <Trash2 className="w-5 h-5 text-amber-400 mb-1" />
                  <p className="text-xs font-bold text-theme-primary">Purge Hidden Posts</p>
                  <p className="text-[10px] text-theme-tertiary">Permanently delete hidden posts</p>
                </motion.button>
                <motion.button className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 text-left hover:bg-purple-500/10 transition-colors" whileTap={{ scale: 0.97 }}>
                  <Download className="w-5 h-5 text-purple-400 mb-1" />
                  <p className="text-xs font-bold text-theme-primary">Export Data</p>
                  <p className="text-[10px] text-theme-tertiary">Download user & post data</p>
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
