'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, FileText, Shield, BarChart3, Eye,
  Search, TrendingUp, MessageCircle,
  Trash2, Star, Plus,
  UserPlus, UserX, Crown, Lock,
  Globe, Activity, Zap, Power,
  ChevronDown, Copy, ExternalLink,
  ShieldCheck, Megaphone,
  Mail, Award, Flag,
  Heart, Repeat2, Bookmark, X,
  CheckCircle, AlertTriangle, Settings
} from 'lucide-react';
import Link from 'next/link';
import Avatar from '@/components/ui/Avatar';
import TrustBadge from '@/components/trust/TrustBadge';
import { formatNumber, formatTimeAgo, cn, generateId } from '@/lib/utils';
import { User, TrustTier, VerificationType } from '@/types';
import { useApp } from '@/context/AppContext';

// Password hashing for admin-created users
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'xbee_salt_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

const ADMIN_IDS = ['user-1'];
const ADMIN_USERNAMES = ['alexchen'];

type AdminTab = 'users' | 'posts' | 'analytics' | 'controls' | 'logs' | 'broadcast';

const VERIFICATION_TYPES: { value: VerificationType; label: string; color: string; desc: string }[] = [
  { value: 'none', label: 'None', color: 'text-gray-400', desc: 'No badge' },
  { value: 'identity', label: 'Identity (Blue)', color: 'text-blue-400', desc: 'Verified identity' },
  { value: 'authority', label: 'Authority (Gold)', color: 'text-amber-400', desc: 'Organization / Public figure' },
  { value: 'government', label: 'Government (Red)', color: 'text-red-400', desc: 'Government / Official' },
  { value: 'business', label: 'Business (Green)', color: 'text-emerald-400', desc: 'Verified business' },
  { value: 'celebrity', label: 'Celebrity (Purple)', color: 'text-purple-400', desc: 'Celebrity / Public figure' },
  { value: 'creator', label: 'Creator (Pink)', color: 'text-pink-400', desc: 'Verified creator' },
];

const TRUST_TIERS: TrustTier[] = ['new', 'building', 'established', 'trusted', 'authority'];

interface AdminLog {
  id: string;
  action: string;
  target: string;
  actor: string;
  time: string;
  severity: 'low' | 'medium' | 'high';
}

const initialLogs: AdminLog[] = [
  { id: '1', action: 'Platform Launched', target: 'Admin Panel', actor: 'System', time: new Date(Date.now() - 60000 * 5).toISOString(), severity: 'low' },
  { id: '2', action: 'Auto-Mod Active', target: 'Scam Detection', actor: 'AI System', time: new Date(Date.now() - 60000 * 30).toISOString(), severity: 'medium' },
  { id: '3', action: 'Trust Engine Updated', target: 'All Users', actor: 'System', time: new Date(Date.now() - 60000 * 90).toISOString(), severity: 'low' },
];

export default function AdminPage() {
  const {
    allUsers, addSystemUser, deleteSystemUser, updateUserInSystem,
    posts, updatePostEngagement, deletePostById, addPost, setPosts,
    notifications, addNotification, currentUser
  } = useApp();

  const isAdmin = ADMIN_IDS.includes(currentUser.id) || ADMIN_USERNAMES.includes(currentUser.username);

  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [logs, setLogs] = useState<AdminLog[]>(initialLogs);

  // User management
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [userFilter, setUserFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [newUser, setNewUser] = useState({
    displayName: '', username: '', email: '', password: '', bio: '',
    trust: 50, verification: 'none' as VerificationType, avatar: '',
  });

  // Post management
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [engagementEdit, setEngagementEdit] = useState({ likes: 0, reposts: 0, replies: 0, views: 0 });

  // Broadcast
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Platform controls
  const [platformControls, setPlatformControls] = useState({
    registrationOpen: true,
    ghostModeEnabled: true,
    aiModeration: true,
    scamDetection: true,
    inviteOnly: false,
    maintenanceMode: false,
  });

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 flex items-center justify-center">
            <Lock className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-xl font-bold text-theme-primary mb-2">Access Denied</h1>
          <p className="text-sm text-theme-tertiary mb-4">God Mode is restricted to platform administrators.</p>
          <Link href="/" className="text-sm text-xbee-primary font-medium hover:underline">← Back to App</Link>
        </div>
      </div>
    );
  }

  const addLog = (action: string, target: string, severity: AdminLog['severity'] = 'low') => {
    setLogs(prev => [{ id: generateId(), action, target, actor: 'Admin', time: new Date().toISOString(), severity }, ...prev]);
  };

  const filteredUsers = useMemo(() => {
    let users = allUsers;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      users = users.filter(u =>
        u.displayName.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q)
      );
    }
    if (userFilter === 'verified') users = users.filter(u => u.verification !== 'none');
    if (userFilter === 'unverified') users = users.filter(u => u.verification === 'none');
    return users;
  }, [allUsers, searchQuery, userFilter]);

  const filteredPosts = useMemo(() => {
    if (!searchQuery) return posts;
    const q = searchQuery.toLowerCase();
    return posts.filter(p =>
      p.content.toLowerCase().includes(q) ||
      p.author.displayName.toLowerCase().includes(q)
    );
  }, [posts, searchQuery]);

  const handleAddUser = async () => {
    if (!newUser.displayName || !newUser.username || !newUser.password) return;

    const hashedPw = await hashPassword(newUser.password);

    const user: User = {
      id: `user-${generateId()}`,
      username: newUser.username,
      displayName: newUser.displayName,
      avatar: newUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUser.username}`,
      bio: newUser.bio || `Hello, I'm ${newUser.displayName}!`,
      verified: newUser.verification !== 'none',
      verification: newUser.verification,
      authenticityScore: newUser.trust,
      trust: {
        score: newUser.trust,
        tier: newUser.trust >= 90 ? 'authority' : newUser.trust >= 75 ? 'trusted' : newUser.trust >= 55 ? 'established' : newUser.trust >= 35 ? 'building' : 'new',
        identityVerified: newUser.verification !== 'none',
        behaviorSignals: [],
        reachMultiplier: newUser.trust >= 80 ? 2.0 : 1.0,
        monetizationUnlocked: newUser.trust >= 70,
        scamFlags: 0,
        reportCount: 0,
        accountAge: 1,
        consistencyScore: 50,
        lastUpdated: new Date().toISOString(),
      },
      followers: 0,
      following: 0,
      joinedAt: new Date().toISOString(),
      badges: [],
      streak: 0,
      invitesRemaining: 5,
    };

    addSystemUser(user);

    // Also register in auth system so they can log in
    try {
      const authUsers = JSON.parse(localStorage.getItem('xbee_users') || '[]');
      if (!authUsers.find((u: any) => u.username === newUser.username)) {
        authUsers.push({
          email: newUser.email || `${newUser.username}@xbee.social`,
          username: newUser.username,
          displayName: newUser.displayName,
          password: hashedPw,
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem('xbee_users', JSON.stringify(authUsers));
      }
    } catch {}

    addLog('User Created', `@${newUser.username}`, 'medium');
    setNewUser({ displayName: '', username: '', email: '', password: '', bio: '', trust: 50, verification: 'none', avatar: '' });
    setShowAddUser(false);
  };

  const handleDeleteUser = (userId: string, username: string) => {
    if (!confirm(`Delete user @${username}? This will also remove all their posts.`)) return;
    deleteSystemUser(userId);
    addLog('User Deleted', `@${username}`, 'high');
  };

  const handleUpdateVerification = (userId: string, verification: VerificationType) => {
    updateUserInSystem(userId, {
      verification,
      verified: verification !== 'none',
    });
    addLog('Badge Updated', `${verification} badge → ${allUsers.find(u => u.id === userId)?.username || userId}`, 'medium');
  };

  const handleUpdateTrust = (userId: string, score: number) => {
    const tier: TrustTier = score >= 90 ? 'authority' : score >= 75 ? 'trusted' : score >= 55 ? 'established' : score >= 35 ? 'building' : 'new';
    updateUserInSystem(userId, {
      trust: {
        ...allUsers.find(u => u.id === userId)!.trust,
        score,
        tier,
      },
      authenticityScore: score,
    });
    addLog('Trust Adjusted', `${allUsers.find(u => u.id === userId)?.username || userId} → ${score}`, 'medium');
  };

  const handlePostEngagement = (postId: string) => {
    updatePostEngagement(postId, engagementEdit);
    addLog('Engagement Updated', `Post ${postId.slice(0, 8)}`, 'low');
    setEditingPost(null);
  };

  const handleDeletePost = (postId: string) => {
    if (!confirm('Delete this post permanently?')) return;
    deletePostById(postId);
    addLog('Post Deleted', postId.slice(0, 12), 'high');
  };

  const handleBroadcast = () => {
    if (!broadcastMsg.trim()) return;
    allUsers.forEach(u => {
      addNotification({
        type: 'trending',
        content: broadcastMsg,
        actor: currentUser,
      });
    });
    addLog('Broadcast Sent', `"${broadcastMsg.slice(0, 50)}..." → ${allUsers.length} users`, 'medium');
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 3000);
    setBroadcastMsg('');
  };

  // Analytics
  const totalUsers = allUsers.length;
  const totalPosts = posts.length;
  const totalLikes = posts.reduce((sum, p) => sum + p.likes, 0);
  const totalViews = posts.reduce((sum, p) => sum + p.views, 0);
  const totalReposts = posts.reduce((sum, p) => sum + p.reposts, 0);
  const verifiedUsers = allUsers.filter(u => u.verification !== 'none').length;
  const avgTrust = Math.round(allUsers.reduce((sum, u) => sum + u.trust.score, 0) / Math.max(totalUsers, 1));

  const tabs: { id: AdminTab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: 'users', label: 'Users', icon: Users, count: totalUsers },
    { id: 'posts', label: 'Posts', icon: FileText, count: totalPosts },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'controls', label: 'Controls', icon: Settings },
    { id: 'logs', label: 'Logs', icon: Activity, count: logs.length },
    { id: 'broadcast', label: 'Broadcast', icon: Megaphone },
  ];

  return (
    <div className="min-h-screen">
      {/* Admin Header */}
      <div className="sticky top-0 z-40 glass border-b border-theme">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-theme-primary flex items-center gap-2">
                God Mode <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 font-bold border border-red-500/20">ADMIN</span>
              </h1>
              <p className="text-[11px] text-theme-tertiary">Full platform control — {totalUsers} users, {totalPosts} posts</p>
            </div>
          </div>
          <Link href="/" className="text-xs px-3 py-1.5 rounded-lg bg-theme-hover text-theme-secondary hover:text-theme-primary transition-colors">
            ← Back to App
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto scrollbar-hide border-t border-theme">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={cn('flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium shrink-0 relative transition-colors',
                  activeTab === tab.id ? 'text-xbee-primary' : 'text-theme-tertiary hover:text-theme-primary'
                )}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
                {tab.count !== undefined && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-theme-hover">{tab.count}</span>}
                {activeTab === tab.id && <motion.div className="absolute bottom-0 left-2 right-2 h-0.5 bg-xbee-primary rounded-full" layoutId="adminTab" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Bar (always visible) */}
      <div className="px-4 py-3 border-b border-theme">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-tertiary" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={activeTab === 'users' ? 'Search users by name, username, or ID...' : activeTab === 'posts' ? 'Search posts by content or author...' : 'Search...'}
            className="xbee-input pl-10 text-sm"
          />
          {searchQuery && (
            <button className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setSearchQuery('')}>
              <X className="w-3.5 h-3.5 text-theme-tertiary" />
            </button>
          )}
        </div>
      </div>

      {/* ═══════════════ TAB: USERS ═══════════════ */}
      {activeTab === 'users' && (
        <div>
          {/* User toolbar */}
          <div className="px-4 py-3 flex items-center justify-between border-b border-theme">
            <div className="flex gap-2">
              {(['all', 'verified', 'unverified'] as const).map(f => (
                <button key={f} className={cn('text-xs px-3 py-1.5 rounded-full transition-colors', userFilter === f ? 'bg-xbee-primary text-white' : 'bg-theme-hover text-theme-secondary')} onClick={() => setUserFilter(f)}>
                  {f.charAt(0).toUpperCase() + f.slice(1)} {f === 'all' && `(${allUsers.length})`}
                </button>
              ))}
            </div>
            <motion.button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-colors" onClick={() => setShowAddUser(!showAddUser)} whileTap={{ scale: 0.95 }}>
              <UserPlus className="w-3.5 h-3.5" /> Add User
            </motion.button>
          </div>

          {/* Add User Form */}
          <AnimatePresence>
            {showAddUser && (
              <motion.div className="px-4 py-4 border-b border-theme bg-emerald-500/5" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <h3 className="text-sm font-bold text-theme-primary mb-3 flex items-center gap-2"><UserPlus className="w-4 h-4 text-emerald-400" /> Create New User</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input className="xbee-input text-sm" placeholder="Display Name *" value={newUser.displayName} onChange={e => setNewUser(p => ({ ...p, displayName: e.target.value }))} />
                  <input className="xbee-input text-sm" placeholder="Username *" value={newUser.username} onChange={e => setNewUser(p => ({ ...p, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))} />
                  <input className="xbee-input text-sm" placeholder="Email" value={newUser.email} onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))} />
                  <input className="xbee-input text-sm" placeholder="Password *" type="password" value={newUser.password} onChange={e => setNewUser(p => ({ ...p, password: e.target.value }))} />
                  <input className="xbee-input text-sm col-span-2" placeholder="Bio" value={newUser.bio} onChange={e => setNewUser(p => ({ ...p, bio: e.target.value }))} />
                  <input className="xbee-input text-sm col-span-2" placeholder="Avatar URL (optional)" value={newUser.avatar} onChange={e => setNewUser(p => ({ ...p, avatar: e.target.value }))} />
                  <div>
                    <label className="text-[10px] text-theme-tertiary mb-1 block">Trust Score: {newUser.trust}</label>
                    <input type="range" min={0} max={100} value={newUser.trust} onChange={e => setNewUser(p => ({ ...p, trust: Number(e.target.value) }))} className="w-full accent-xbee-primary" />
                  </div>
                  <div>
                    <label className="text-[10px] text-theme-tertiary mb-1 block">Verification Badge</label>
                    <select className="xbee-input text-sm" value={newUser.verification} onChange={e => setNewUser(p => ({ ...p, verification: e.target.value as VerificationType }))}>
                      {VERIFICATION_TYPES.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <motion.button className="xbee-button-primary text-sm flex-1" onClick={handleAddUser} whileTap={{ scale: 0.95 }} disabled={!newUser.displayName || !newUser.username || !newUser.password}>
                    <UserPlus className="w-4 h-4 inline mr-1" /> Create User & Enable Login
                  </motion.button>
                  <button className="px-4 py-2 rounded-lg text-sm text-theme-secondary hover:bg-theme-hover" onClick={() => setShowAddUser(false)}>Cancel</button>
                </div>
                <p className="text-[10px] text-theme-tertiary mt-2">* The user will be able to log in with their username/email and password immediately.</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* User List */}
          <div className="divide-y divide-theme">
            {filteredUsers.map((user) => (
              <div key={user.id}>
                <div className="px-4 py-3 hover:bg-theme-hover/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar name={user.displayName} src={user.avatar} size="md" verified={user.verified} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-sm text-theme-primary truncate">{user.displayName}</span>
                        <TrustBadge score={user.trust.score} tier={user.trust.tier} size="sm" verification={user.verification} showScore />
                      </div>
                      <p className="text-xs text-theme-tertiary">@{user.username} · ID: {user.id}</p>
                      <p className="text-[10px] text-theme-tertiary mt-0.5">
                        {formatNumber(user.followers)} followers · Trust: {user.trust.score} · Joined {formatTimeAgo(user.joinedAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <motion.button
                        className="p-1.5 rounded-lg hover:bg-theme-hover text-theme-tertiary hover:text-xbee-primary"
                        onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                        whileTap={{ scale: 0.9 }}
                        title="Edit User"
                      >
                        <ChevronDown className={cn('w-4 h-4 transition-transform', expandedUser === user.id && 'rotate-180')} />
                      </motion.button>
                      {user.id !== currentUser.id && (
                        <motion.button
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-theme-tertiary hover:text-red-400"
                          onClick={() => handleDeleteUser(user.id, user.username)}
                          whileTap={{ scale: 0.9 }}
                          title="Delete User"
                        >
                          <UserX className="w-4 h-4" />
                        </motion.button>
                      )}
                    </div>
                  </div>

                  {/* Expanded God-Mode Controls */}
                  <AnimatePresence>
                    {expandedUser === user.id && (
                      <motion.div className="mt-3 p-4 rounded-xl bg-theme-tertiary border border-theme space-y-4" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                        {/* Verification Badge Selector */}
                        <div>
                          <label className="text-xs font-bold text-theme-secondary mb-2 block flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5" /> Verification Badge
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {VERIFICATION_TYPES.map(v => (
                              <motion.button
                                key={v.value}
                                className={cn(
                                  'p-2 rounded-lg text-[11px] font-medium border transition-all text-left',
                                  user.verification === v.value
                                    ? 'border-xbee-primary bg-xbee-primary/10 text-xbee-primary'
                                    : 'border-theme hover:border-theme-secondary text-theme-secondary'
                                )}
                                onClick={() => handleUpdateVerification(user.id, v.value)}
                                whileTap={{ scale: 0.95 }}
                              >
                                <span className={cn('font-bold', v.color)}>{v.label}</span>
                                <p className="text-[9px] text-theme-tertiary mt-0.5">{v.desc}</p>
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        {/* Trust Score Slider */}
                        <div>
                          <label className="text-xs font-bold text-theme-secondary mb-2 block flex items-center gap-1.5">
                            <Shield className="w-3.5 h-3.5" /> Trust Score: {user.trust.score} ({user.trust.tier})
                          </label>
                          <input type="range" min={0} max={100} value={user.trust.score} onChange={e => handleUpdateTrust(user.id, Number(e.target.value))} className="w-full accent-xbee-primary" />
                          <div className="flex justify-between text-[9px] text-theme-tertiary mt-1">
                            <span>0 (New)</span><span>35 (Building)</span><span>55 (Established)</span><span>75 (Trusted)</span><span>100 (Authority)</span>
                          </div>
                        </div>

                        {/* Quick Edit Fields */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] text-theme-tertiary mb-1 block">Display Name</label>
                            <input className="xbee-input text-xs" defaultValue={user.displayName} onBlur={e => { if (e.target.value !== user.displayName) { updateUserInSystem(user.id, { displayName: e.target.value }); addLog('Name Changed', `@${user.username}`, 'low'); } }} />
                          </div>
                          <div>
                            <label className="text-[10px] text-theme-tertiary mb-1 block">Username</label>
                            <input className="xbee-input text-xs" defaultValue={user.username} onBlur={e => { if (e.target.value !== user.username) { updateUserInSystem(user.id, { username: e.target.value }); addLog('Username Changed', `${user.username} → ${e.target.value}`, 'medium'); } }} />
                          </div>
                          <div className="col-span-2">
                            <label className="text-[10px] text-theme-tertiary mb-1 block">Bio</label>
                            <input className="xbee-input text-xs" defaultValue={user.bio} onBlur={e => { if (e.target.value !== user.bio) updateUserInSystem(user.id, { bio: e.target.value }); }} />
                          </div>
                          <div className="col-span-2">
                            <label className="text-[10px] text-theme-tertiary mb-1 block">Avatar URL</label>
                            <input className="xbee-input text-xs" defaultValue={user.avatar} onBlur={e => { if (e.target.value !== user.avatar) updateUserInSystem(user.id, { avatar: e.target.value }); }} />
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-theme">
                          <motion.button className="text-[10px] px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 font-bold" onClick={() => { handleUpdateVerification(user.id, 'authority'); handleUpdateTrust(user.id, 100); }} whileTap={{ scale: 0.9 }}>
                            ⚡ Max Authority
                          </motion.button>
                          <motion.button className="text-[10px] px-2 py-1 rounded bg-blue-500/10 text-blue-400 font-bold" onClick={() => handleUpdateVerification(user.id, 'identity')} whileTap={{ scale: 0.9 }}>
                            ✓ Blue Verify
                          </motion.button>
                          <motion.button className="text-[10px] px-2 py-1 rounded bg-red-500/10 text-red-400 font-bold" onClick={() => { handleUpdateTrust(user.id, 0); handleUpdateVerification(user.id, 'none'); }} whileTap={{ scale: 0.9 }}>
                            ☠ Nuke Trust
                          </motion.button>
                          <Link href={`/profile?user=${user.id}`}>
                            <motion.button className="text-[10px] px-2 py-1 rounded bg-theme-hover text-theme-secondary font-bold" whileTap={{ scale: 0.9 }}>
                              👤 View Profile
                            </motion.button>
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════ TAB: POSTS ═══════════════ */}
      {activeTab === 'posts' && (
        <div>
          <div className="px-4 py-3 border-b border-theme">
            <p className="text-xs text-theme-tertiary">{filteredPosts.length} posts · {totalLikes} total likes · {formatNumber(totalViews)} total views</p>
          </div>

          <div className="divide-y divide-theme">
            {filteredPosts.map((post) => (
              <div key={post.id} className="px-4 py-3 hover:bg-theme-hover/50 transition-colors">
                <div className="flex items-start gap-3">
                  <Avatar name={post.author.displayName} src={post.author.avatar} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-theme-primary">{post.author.displayName}</span>
                      <TrustBadge score={post.author.trust.score} tier={post.author.trust.tier} size="sm" verification={post.author.verification} />
                      <span className="text-[10px] text-theme-tertiary">{formatTimeAgo(post.createdAt)}</span>
                    </div>
                    <p className="text-sm text-theme-primary mt-1 line-clamp-2">{post.content}</p>

                    {/* Engagement Stats */}
                    <div className="flex items-center gap-4 mt-2 text-[11px] text-theme-tertiary">
                      <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-pink-400" /> {formatNumber(post.likes)}</span>
                      <span className="flex items-center gap-1"><Repeat2 className="w-3 h-3 text-emerald-400" /> {formatNumber(post.reposts)}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3 text-blue-400" /> {formatNumber(post.replies)}</span>
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {formatNumber(post.views)}</span>
                    </div>

                    {/* Edit Engagement */}
                    <AnimatePresence>
                      {editingPost === post.id && (
                        <motion.div className="mt-3 p-3 rounded-xl bg-theme-tertiary border border-theme" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                          <p className="text-[10px] font-bold text-theme-secondary mb-2">Set Engagement Numbers</p>
                          <div className="grid grid-cols-4 gap-2">
                            <div>
                              <label className="text-[9px] text-theme-tertiary">Likes</label>
                              <input type="number" className="xbee-input text-xs" value={engagementEdit.likes} onChange={e => setEngagementEdit(p => ({ ...p, likes: Number(e.target.value) }))} />
                            </div>
                            <div>
                              <label className="text-[9px] text-theme-tertiary">Reposts</label>
                              <input type="number" className="xbee-input text-xs" value={engagementEdit.reposts} onChange={e => setEngagementEdit(p => ({ ...p, reposts: Number(e.target.value) }))} />
                            </div>
                            <div>
                              <label className="text-[9px] text-theme-tertiary">Replies</label>
                              <input type="number" className="xbee-input text-xs" value={engagementEdit.replies} onChange={e => setEngagementEdit(p => ({ ...p, replies: Number(e.target.value) }))} />
                            </div>
                            <div>
                              <label className="text-[9px] text-theme-tertiary">Views</label>
                              <input type="number" className="xbee-input text-xs" value={engagementEdit.views} onChange={e => setEngagementEdit(p => ({ ...p, views: Number(e.target.value) }))} />
                            </div>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <motion.button className="xbee-button-primary text-[10px] flex-1 py-1.5" onClick={() => handlePostEngagement(post.id)} whileTap={{ scale: 0.95 }}>Apply</motion.button>
                            <button className="text-[10px] text-theme-tertiary px-3" onClick={() => setEditingPost(null)}>Cancel</button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Post Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <motion.button
                      className="p-1.5 rounded-lg hover:bg-xbee-primary/10 text-theme-tertiary hover:text-xbee-primary"
                      onClick={() => { setEditingPost(editingPost === post.id ? null : post.id); setEngagementEdit({ likes: post.likes, reposts: post.reposts, replies: post.replies, views: post.views }); }}
                      whileTap={{ scale: 0.9 }}
                      title="Edit Engagement"
                    >
                      <BarChart3 className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-theme-tertiary hover:text-red-400"
                      onClick={() => handleDeletePost(post.id)}
                      whileTap={{ scale: 0.9 }}
                      title="Delete Post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════ TAB: ANALYTICS ═══════════════ */}
      {activeTab === 'analytics' && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total Users', value: totalUsers, icon: Users, color: 'from-blue-500 to-indigo-600' },
              { label: 'Total Posts', value: totalPosts, icon: FileText, color: 'from-emerald-500 to-green-600' },
              { label: 'Total Likes', value: totalLikes, icon: Heart, color: 'from-pink-500 to-rose-600' },
              { label: 'Total Views', value: totalViews, icon: Eye, color: 'from-purple-500 to-violet-600' },
              { label: 'Reposts', value: totalReposts, icon: Repeat2, color: 'from-teal-500 to-cyan-600' },
              { label: 'Verified Users', value: verifiedUsers, icon: ShieldCheck, color: 'from-amber-500 to-orange-600' },
              { label: 'Avg Trust', value: avgTrust, icon: Shield, color: 'from-emerald-400 to-green-500' },
              { label: 'Notifications', value: notifications.length, icon: Megaphone, color: 'from-red-500 to-pink-600' },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div key={stat.label} className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} relative overflow-hidden`} whileHover={{ scale: 1.02 }}>
                  <div className="absolute top-2 right-2 opacity-20"><Icon className="w-10 h-10 text-white" /></div>
                  <p className="text-white/70 text-[10px] font-medium">{stat.label}</p>
                  <p className="text-white text-2xl font-black mt-1">{formatNumber(stat.value)}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Verification Distribution */}
          <div className="glass-card p-4">
            <h3 className="text-sm font-bold text-theme-primary mb-3">Badge Distribution</h3>
            <div className="space-y-2">
              {VERIFICATION_TYPES.map(v => {
                const count = allUsers.filter(u => u.verification === v.value).length;
                const pct = Math.round((count / Math.max(totalUsers, 1)) * 100);
                return (
                  <div key={v.value} className="flex items-center gap-3">
                    <span className={cn('text-xs font-medium w-28', v.color)}>{v.label}</span>
                    <div className="flex-1 h-2 bg-theme-hover rounded-full overflow-hidden">
                      <motion.div className="h-full bg-xbee-primary rounded-full" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }} />
                    </div>
                    <span className="text-xs text-theme-tertiary w-16 text-right">{count} ({pct}%)</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trust Distribution */}
          <div className="glass-card p-4">
            <h3 className="text-sm font-bold text-theme-primary mb-3">Trust Tier Distribution</h3>
            <div className="space-y-2">
              {TRUST_TIERS.map(tier => {
                const count = allUsers.filter(u => u.trust.tier === tier).length;
                const pct = Math.round((count / Math.max(totalUsers, 1)) * 100);
                return (
                  <div key={tier} className="flex items-center gap-3">
                    <span className="text-xs font-medium w-28 text-theme-primary capitalize">{tier}</span>
                    <div className="flex-1 h-2 bg-theme-hover rounded-full overflow-hidden">
                      <motion.div className={cn('h-full rounded-full', tier === 'authority' ? 'bg-amber-400' : tier === 'trusted' ? 'bg-emerald-400' : tier === 'established' ? 'bg-blue-400' : tier === 'building' ? 'bg-yellow-400' : 'bg-gray-400')} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }} />
                    </div>
                    <span className="text-xs text-theme-tertiary w-16 text-right">{count} ({pct}%)</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Posts */}
          <div className="glass-card p-4">
            <h3 className="text-sm font-bold text-theme-primary mb-3">Top Posts by Engagement</h3>
            <div className="space-y-2">
              {posts.sort((a, b) => (b.likes + b.reposts + b.views) - (a.likes + a.reposts + a.views)).slice(0, 5).map((post, i) => (
                <div key={post.id} className="flex items-center gap-3 py-2">
                  <span className="text-xs font-bold text-theme-tertiary w-5">#{i + 1}</span>
                  <Avatar name={post.author.displayName} src={post.author.avatar} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-theme-primary truncate">{post.content.slice(0, 60)}...</p>
                    <p className="text-[10px] text-theme-tertiary">{formatNumber(post.likes)} ❤ · {formatNumber(post.views)} 👁</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ TAB: CONTROLS ═══════════════ */}
      {activeTab === 'controls' && (
        <div className="p-4 space-y-4">
          <div className="glass-card p-4">
            <h3 className="text-sm font-bold text-theme-primary mb-4 flex items-center gap-2"><Power className="w-4 h-4 text-red-400" /> Platform Controls</h3>
            <div className="space-y-3">
              {[
                { key: 'registrationOpen', label: 'Open Registration', desc: 'Allow new users to sign up', icon: UserPlus },
                { key: 'ghostModeEnabled', label: 'Ghost Mode', desc: 'Users can send disappearing messages', icon: Eye },
                { key: 'aiModeration', label: 'AI Moderation', desc: 'Auto-detect harmful content', icon: Shield },
                { key: 'scamDetection', label: 'Scam Detection', desc: 'AI scam & phishing detection', icon: AlertTriangle },
                { key: 'inviteOnly', label: 'Invite-Only Mode', desc: 'Only invited users can join', icon: Lock },
                { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Show maintenance page to users', icon: Settings },
              ].map(control => {
                const Icon = control.icon;
                const isOn = platformControls[control.key as keyof typeof platformControls];
                return (
                  <div key={control.key} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-theme-secondary" />
                      <div>
                        <p className="text-sm font-medium text-theme-primary">{control.label}</p>
                        <p className="text-[10px] text-theme-tertiary">{control.desc}</p>
                      </div>
                    </div>
                    <motion.button
                      className={cn('w-11 h-6 rounded-full transition-colors relative', isOn ? 'bg-xbee-primary' : 'bg-theme-hover')}
                      onClick={() => {
                        setPlatformControls(p => ({ ...p, [control.key]: !isOn }));
                        addLog(`${control.label} ${!isOn ? 'Enabled' : 'Disabled'}`, 'Platform', 'medium');
                      }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <motion.div className="w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5" animate={{ left: isOn ? '22px' : '2px' }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
                    </motion.button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="glass-card p-4 border-red-500/20 border">
            <h3 className="text-sm font-bold text-red-400 mb-4 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Danger Zone</h3>
            <div className="space-y-2">
              <motion.button className="w-full py-2.5 rounded-xl bg-red-500/10 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-colors" onClick={() => {
                if (confirm('Reset ALL posts to default? This cannot be undone.')) {
                  try { localStorage.removeItem('xbee_posts'); } catch {}
                  window.location.reload();
                }
              }} whileTap={{ scale: 0.98 }}>
                Reset All Posts to Default
              </motion.button>
              <motion.button className="w-full py-2.5 rounded-xl bg-red-500/10 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-colors" onClick={() => {
                if (confirm('Clear ALL localStorage? You will be logged out.')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }} whileTap={{ scale: 0.98 }}>
                Factory Reset (Clear All Data)
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ TAB: LOGS ═══════════════ */}
      {activeTab === 'logs' && (
        <div>
          <div className="px-4 py-3 border-b border-theme flex items-center justify-between">
            <p className="text-xs text-theme-tertiary">{logs.length} activity logs</p>
            <button className="text-xs text-red-400 hover:text-red-300" onClick={() => { if (confirm('Clear all logs?')) setLogs([]); }}>Clear Logs</button>
          </div>
          <div className="divide-y divide-theme">
            {logs.map(log => (
              <div key={log.id} className="px-4 py-3 flex items-start gap-3">
                <div className={cn('w-2 h-2 rounded-full mt-1.5 shrink-0', log.severity === 'high' ? 'bg-red-400' : log.severity === 'medium' ? 'bg-amber-400' : 'bg-emerald-400')} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-theme-primary font-medium">{log.action}</p>
                  <p className="text-xs text-theme-tertiary">{log.target}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] text-theme-tertiary">{formatTimeAgo(log.time)}</p>
                  <p className="text-[10px] text-theme-tertiary">{log.actor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════ TAB: BROADCAST ═══════════════ */}
      {activeTab === 'broadcast' && (
        <div className="p-4 space-y-4">
          <div className="glass-card p-4">
            <h3 className="text-sm font-bold text-theme-primary mb-3 flex items-center gap-2"><Megaphone className="w-4 h-4 text-xbee-primary" /> Broadcast to All Users</h3>
            <p className="text-xs text-theme-tertiary mb-3">Send a notification to all {allUsers.length} users on the platform.</p>
            <textarea
              value={broadcastMsg}
              onChange={e => setBroadcastMsg(e.target.value)}
              className="xbee-input text-sm min-h-[100px] resize-none"
              placeholder="Type your broadcast message..."
              maxLength={500}
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-[10px] text-theme-tertiary">{broadcastMsg.length}/500</span>
              <motion.button
                className={cn('xbee-button-primary text-sm flex items-center gap-1.5', !broadcastMsg.trim() && 'opacity-50 pointer-events-none')}
                onClick={handleBroadcast}
                whileTap={{ scale: 0.95 }}
                disabled={!broadcastMsg.trim()}
              >
                <Megaphone className="w-4 h-4" /> Send to {allUsers.length} Users
              </motion.button>
            </div>
            <AnimatePresence>
              {broadcastSent && (
                <motion.div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-emerald-400 font-medium">Broadcast sent successfully!</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Broadcast Templates */}
          <div className="glass-card p-4">
            <h3 className="text-xs font-bold text-theme-secondary mb-3">Quick Templates</h3>
            <div className="space-y-2">
              {[
                '🚀 Xbee just got a major update! Check out the new features.',
                '⚠️ Scheduled maintenance tonight at 12:00 AM UTC. Brief downtime expected.',
                '🎉 We just hit a new milestone! Thank you to our amazing community.',
                '🔒 Security update: Please review your account settings.',
                '🐝 New trust features are live! Your trust score now matters more than ever.',
              ].map((template, i) => (
                <motion.button key={i} className="w-full text-left p-2.5 rounded-lg text-xs text-theme-secondary hover:bg-theme-hover transition-colors" onClick={() => setBroadcastMsg(template)} whileTap={{ scale: 0.98 }}>
                  {template}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
