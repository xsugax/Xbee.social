'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Bell, Shield, Palette, Globe, Eye, Database,
  Fingerprint, Smartphone, Key, ChevronRight, Languages, WifiOff,
  Crown, CreditCard, Building2, Scale, FileText, HelpCircle,
  ExternalLink, Heart, X, Check, Lock, Trash2, Download, AlertCircle,
  CheckCircle2, Loader2, LogOut
} from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useApp } from '@/context/AppContext';

// Settings storage
function getSettings(): Record<string, boolean> {
  try { return JSON.parse(localStorage.getItem('xbee_settings') || '{}'); }
  catch { return {}; }
}
function saveSetting(key: string, value: boolean) {
  const settings = getSettings();
  settings[key] = value;
  localStorage.setItem('xbee_settings', JSON.stringify(settings));
}

export default function SettingsPage() {
  const { currentUser } = useApp();
  const [settings, setSettings] = useState<Record<string, boolean>>({});
  const [showModal, setShowModal] = useState<string | null>(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
  const [proProcessing, setProProcessing] = useState(false);
  const [exported, setExported] = useState(false);

  useEffect(() => {
    const saved = getSettings();
    setSettings({
      twoFactor: saved.twoFactor ?? true,
      biometric: saved.biometric ?? false,
      shadowBanTransparency: saved.shadowBanTransparency ?? true,
      notifLikes: saved.notifLikes ?? true,
      notifComments: saved.notifComments ?? true,
      notifFollows: saved.notifFollows ?? true,
      notifMessages: saved.notifMessages ?? true,
      notifSound: saved.notifSound ?? true,
      lowDataMode: saved.lowDataMode ?? false,
      aiEnhancement: saved.aiEnhancement ?? true,
      smartReplies: saved.smartReplies ?? true,
      contentRecs: saved.contentRecs ?? true,
      scamDetection: saved.scamDetection ?? true,
      trustInsights: saved.trustInsights ?? true,
      autoTranslate: saved.autoTranslate ?? false,
      privateProfile: saved.privateProfile ?? false,
      showOnline: saved.showOnline ?? true,
      readReceipts: saved.readReceipts ?? true,
    });
  }, []);

  const toggle = useCallback((key: string) => {
    setSettings(prev => {
      const next = { ...prev, [key]: !prev[key] };
      saveSetting(key, next[key]);
      return next;
    });
  }, []);

  const handlePasswordChange = () => {
    setPasswordMsg({ type: '', text: '' });
    if (!oldPassword) { setPasswordMsg({ type: 'error', text: 'Enter current password' }); return; }
    if (newPassword.length < 6) { setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters' }); return; }
    if (newPassword !== confirmPassword) { setPasswordMsg({ type: 'error', text: 'Passwords do not match' }); return; }

    try {
      const users = JSON.parse(localStorage.getItem('xbee_users') || '[]');
      const session = JSON.parse(localStorage.getItem('xbee_session') || '{}');
      const idx = users.findIndex((u: any) => u.email === session.email || u.username === session.username);
      if (idx === -1 || users[idx].password !== oldPassword) {
        setPasswordMsg({ type: 'error', text: 'Current password is incorrect' });
        return;
      }
      users[idx].password = newPassword;
      localStorage.setItem('xbee_users', JSON.stringify(users));
      setPasswordMsg({ type: 'success', text: 'Password updated successfully!' });
      setOldPassword(''); setNewPassword(''); setConfirmPassword('');
      setTimeout(() => setShowModal(null), 1500);
    } catch {
      setPasswordMsg({ type: 'error', text: 'Password update failed' });
    }
  };

  const handleExportData = () => {
    const data = {
      profile: currentUser,
      settings: getSettings(),
      session: JSON.parse(localStorage.getItem('xbee_session') || '{}'),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `xbee-data-export-${Date.now()}.json`;
    a.click(); URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('xbee_session');
    localStorage.removeItem('xbee_remembered');
    localStorage.removeItem('xbee_auth');
    window.location.reload();
  };

  const handleProUpgrade = () => {
    setProProcessing(true);
    setTimeout(() => {
      setProProcessing(false);
      setShowModal('pro-success');
    }, 2000);
  };

  const ToggleSwitch = ({ id }: { id: string }) => (
    <div
      className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${settings[id] ? 'bg-xbee-primary' : 'bg-theme-tertiary'}`}
      onClick={() => toggle(id)}
    >
      <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow-sm ${settings[id] ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
    </div>
  );

  return (
    <div>
      <div className="sticky top-0 z-30 glass border-b border-theme">
        <div className="px-4 py-3"><h1 className="text-xl font-bold text-theme-primary">Settings</h1></div>
      </div>

      <div className="p-4 space-y-6">
        {/* Xbee Pro Card */}
        <motion.div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-yellow-600/10 border border-amber-500/15 p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-black text-theme-primary">Xbee Pro</h3>
              <p className="text-xs text-theme-secondary">Premium membership</p>
            </div>
            <span className="ml-auto px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 text-xs font-bold border border-amber-500/20">$9.99/mo</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {['Higher Trust multiplier', 'Priority reach', 'Verified badge', 'Advanced analytics', 'Ad-free experience', 'Early features'].map((perk) => (
              <div key={perk} className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-amber-400" />
                <span className="text-xs text-theme-secondary">{perk}</span>
              </div>
            ))}
          </div>
          <motion.button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20" onClick={() => setShowModal('pro')} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
            <CreditCard className="w-4 h-4" /> Upgrade to Pro
          </motion.button>
        </motion.div>

        {/* Theme */}
        <motion.div className="glass-card p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-xbee-primary" />
              <div><h3 className="font-medium text-theme-primary">Appearance</h3><p className="text-sm text-theme-secondary">Choose your theme</p></div>
            </div>
            <ThemeToggle />
          </div>
        </motion.div>

        {/* Account Section */}
        <motion.div className="glass-card overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="px-5 py-3 border-b border-theme"><h2 className="text-sm font-bold text-theme-tertiary uppercase tracking-wider">Account</h2></div>
          <motion.div className="flex items-center gap-4 px-5 py-3.5 hover:bg-theme-hover transition-colors cursor-pointer border-b border-theme" onClick={() => setShowModal('account')} whileTap={{ scale: 0.99 }}>
            <User className="w-5 h-5 text-theme-secondary shrink-0" />
            <div className="flex-1"><p className="text-sm font-medium text-theme-primary">Account Information</p><p className="text-xs text-theme-tertiary">Username, email, phone</p></div>
            <ChevronRight className="w-4 h-4 text-theme-tertiary" />
          </motion.div>
          <motion.div className="flex items-center gap-4 px-5 py-3.5 hover:bg-theme-hover transition-colors cursor-pointer border-b border-theme" onClick={() => setShowModal('password')} whileTap={{ scale: 0.99 }}>
            <Key className="w-5 h-5 text-theme-secondary shrink-0" />
            <div className="flex-1"><p className="text-sm font-medium text-theme-primary">Change Password</p><p className="text-xs text-theme-tertiary">Update your password</p></div>
            <ChevronRight className="w-4 h-4 text-theme-tertiary" />
          </motion.div>
          <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-theme-hover transition-colors cursor-pointer border-b border-theme">
            <Fingerprint className="w-5 h-5 text-theme-secondary shrink-0" />
            <div className="flex-1"><p className="text-sm font-medium text-theme-primary">Two-Factor Authentication</p><p className="text-xs text-theme-tertiary">Add extra security</p></div>
            <ToggleSwitch id="twoFactor" />
          </div>
          <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-theme-hover transition-colors cursor-pointer">
            <Smartphone className="w-5 h-5 text-theme-secondary shrink-0" />
            <div className="flex-1"><p className="text-sm font-medium text-theme-primary">Biometric Login</p><p className="text-xs text-theme-tertiary">Face ID / Fingerprint</p></div>
            <ToggleSwitch id="biometric" />
          </div>
        </motion.div>

        {/* Privacy Section */}
        <motion.div className="glass-card overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="px-5 py-3 border-b border-theme"><h2 className="text-sm font-bold text-theme-tertiary uppercase tracking-wider">Privacy & Safety</h2></div>
          <div className="flex items-center gap-4 px-5 py-3.5 border-b border-theme">
            <Shield className="w-5 h-5 text-theme-secondary shrink-0" />
            <div className="flex-1"><p className="text-sm font-medium text-theme-primary">Private Profile</p><p className="text-xs text-theme-tertiary">Only followers see your posts</p></div>
            <ToggleSwitch id="privateProfile" />
          </div>
          <div className="flex items-center gap-4 px-5 py-3.5 border-b border-theme">
            <Eye className="w-5 h-5 text-theme-secondary shrink-0" />
            <div className="flex-1"><p className="text-sm font-medium text-theme-primary">Show Online Status</p><p className="text-xs text-theme-tertiary">Others see when you are active</p></div>
            <ToggleSwitch id="showOnline" />
          </div>
          <div className="flex items-center gap-4 px-5 py-3.5 border-b border-theme">
            <CheckCircle2 className="w-5 h-5 text-theme-secondary shrink-0" />
            <div className="flex-1"><p className="text-sm font-medium text-theme-primary">Read Receipts</p><p className="text-xs text-theme-tertiary">Show when you have read messages</p></div>
            <ToggleSwitch id="readReceipts" />
          </div>
          <motion.div className="flex items-center gap-4 px-5 py-3.5 hover:bg-theme-hover transition-colors cursor-pointer" onClick={handleExportData} whileTap={{ scale: 0.99 }}>
            <Database className="w-5 h-5 text-theme-secondary shrink-0" />
            <div className="flex-1"><p className="text-sm font-medium text-theme-primary">Export Your Data</p><p className="text-xs text-theme-tertiary">{exported ? 'Downloaded!' : 'Download all your data as JSON'}</p></div>
            {exported ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4 text-theme-tertiary" />}
          </motion.div>
        </motion.div>

        {/* Notification Preferences */}
        <motion.div className="glass-card overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="px-5 py-3 border-b border-theme"><h2 className="text-sm font-bold text-theme-tertiary uppercase tracking-wider">Notifications</h2></div>
          {[
            { id: 'notifLikes', label: 'Likes', desc: 'When someone likes your post' },
            { id: 'notifComments', label: 'Comments', desc: 'When someone comments on your post' },
            { id: 'notifFollows', label: 'New Followers', desc: 'When someone follows you' },
            { id: 'notifMessages', label: 'Messages', desc: 'New direct messages' },
            { id: 'notifSound', label: 'Notification Sound', desc: 'Play bee buzz sound' },
          ].map((item) => (
            <div key={item.id} className="flex items-center gap-4 px-5 py-3.5 border-b border-theme last:border-0">
              <Bell className="w-5 h-5 text-theme-secondary shrink-0" />
              <div className="flex-1"><p className="text-sm font-medium text-theme-primary">{item.label}</p><p className="text-xs text-theme-tertiary">{item.desc}</p></div>
              <ToggleSwitch id={item.id} />
            </div>
          ))}
        </motion.div>

        {/* Preferences */}
        <motion.div className="glass-card overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <div className="px-5 py-3 border-b border-theme"><h2 className="text-sm font-bold text-theme-tertiary uppercase tracking-wider">Preferences</h2></div>
          <div className="flex items-center gap-4 px-5 py-3.5 border-b border-theme">
            <Languages className="w-5 h-5 text-theme-secondary shrink-0" />
            <div className="flex-1"><p className="text-sm font-medium text-theme-primary">Auto-Translate</p><p className="text-xs text-theme-tertiary">Translate foreign language posts</p></div>
            <ToggleSwitch id="autoTranslate" />
          </div>
          <div className="flex items-center gap-4 px-5 py-3.5">
            <WifiOff className="w-5 h-5 text-theme-secondary shrink-0" />
            <div className="flex-1"><p className="text-sm font-medium text-theme-primary">Low Data Mode</p><p className="text-xs text-theme-tertiary">Reduce data usage on mobile</p></div>
            <ToggleSwitch id="lowDataMode" />
          </div>
        </motion.div>

        {/* AI Settings */}
        <motion.div className="glass-card p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10" />
              <svg width="20" height="20" viewBox="0 0 48 48" fill="none" className="relative z-10"><path d="M10 8L21 22.5L10 38H14L23 27L31 38H38L26.5 22L37 8H33L24.5 18.5L17 8H10Z" fill="white" /></svg>
            </div>
            <div><h3 className="font-bold text-theme-primary">Xbee AI</h3><p className="text-sm text-theme-secondary">Intelligence layer settings</p></div>
          </div>
          <div className="space-y-3">
            {[
              { id: 'aiEnhancement', label: 'AI Post Enhancement', desc: 'Suggest improvements to your posts' },
              { id: 'smartReplies', label: 'Smart Replies', desc: 'AI-suggested message replies' },
              { id: 'contentRecs', label: 'Content Recommendations', desc: 'AI-curated feed personalization' },
              { id: 'scamDetection', label: 'Scam Detection', desc: 'Alert on suspicious messages & users' },
              { id: 'trustInsights', label: 'Trust Score Insights', desc: 'AI tips to improve your trust score' },
            ].map((s) => (
              <div key={s.id} className="flex items-center justify-between py-2">
                <div><p className="text-sm font-medium text-theme-primary">{s.label}</p><p className="text-xs text-theme-tertiary">{s.desc}</p></div>
                <ToggleSwitch id={s.id} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* About */}
        <motion.div className="glass-card overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <div className="px-5 py-3 border-b border-theme"><h2 className="text-sm font-bold text-theme-tertiary uppercase tracking-wider">About</h2></div>
          {[
            { icon: Building2, label: 'About Xbee Technologies', desc: 'Our mission & company' },
            { icon: FileText, label: 'Terms of Service', desc: 'Legal terms' },
            { icon: Shield, label: 'Privacy Policy', desc: 'How we protect your data' },
            { icon: Scale, label: 'Content Policy', desc: 'Community guidelines' },
            { icon: HelpCircle, label: 'Help Center', desc: 'FAQs & support' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.label} className="flex items-center gap-4 px-5 py-3.5 hover:bg-theme-hover transition-colors cursor-pointer border-b border-theme last:border-0" whileTap={{ scale: 0.99 }}>
                <Icon className="w-5 h-5 text-theme-secondary shrink-0" />
                <div className="flex-1"><p className="text-sm font-medium text-theme-primary">{item.label}</p><p className="text-xs text-theme-tertiary">{item.desc}</p></div>
                <ExternalLink className="w-4 h-4 text-theme-tertiary" />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Logout */}
        <motion.button className="w-full py-3 rounded-xl border border-red-500/20 text-red-400 font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-500/5 transition-colors" onClick={handleLogout} whileTap={{ scale: 0.98 }}>
          <LogOut className="w-4 h-4" /> Sign Out
        </motion.button>

        {/* Footer */}
        <div className="text-center py-6 space-y-2">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10" />
              <svg width="16" height="16" viewBox="0 0 48 48" fill="none" className="relative z-10"><path d="M10 8L21 22.5L10 38H14L23 27L31 38H38L26.5 22L37 8H33L24.5 18.5L17 8H10Z" fill="white" /></svg>
            </div>
            <div className="text-left"><p className="text-sm font-black text-theme-primary">Xbee Technologies</p><p className="text-[10px] text-theme-tertiary">Est. 1996</p></div>
          </div>
          <p className="text-xs text-theme-tertiary italic max-w-[300px] mx-auto">&ldquo;To restore trust, intelligence, and real human value in digital communication.&rdquo;</p>
          <p className="text-xs text-theme-tertiary">Xbee Messenger v2.0.0</p>
          <p className="text-[11px] text-theme-tertiary flex items-center justify-center gap-1">Made with <Heart className="w-3 h-3 text-xbee-danger" fill="currentColor" /> by Xbee Technologies</p>
          <p className="text-[10px] text-theme-tertiary">&copy; 1996-2026 Xbee Technologies, Inc. All rights reserved.</p>
        </div>
      </div>

      {/* ==================== MODALS ==================== */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(null)}>
            <motion.div className="glass-card w-full max-w-md max-h-[80vh] overflow-y-auto" initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()}>

              {/* Account Info */}
              {showModal === 'account' && (
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-theme-primary">Account Information</h3>
                    <button onClick={() => setShowModal(null)} className="p-1 rounded-full hover:bg-theme-hover"><X className="w-5 h-5 text-theme-secondary" /></button>
                  </div>
                  <div className="space-y-4">
                    <div className="p-3 rounded-xl bg-theme-tertiary">
                      <p className="text-xs text-theme-tertiary mb-1">Display Name</p>
                      <p className="text-sm font-bold text-theme-primary">{currentUser.displayName}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-theme-tertiary">
                      <p className="text-xs text-theme-tertiary mb-1">Username</p>
                      <p className="text-sm font-bold text-theme-primary">@{currentUser.username}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-theme-tertiary">
                      <p className="text-xs text-theme-tertiary mb-1">Email</p>
                      <p className="text-sm font-bold text-theme-primary">{(() => { try { return JSON.parse(localStorage.getItem('xbee_session') || '{}').email || 'Not set'; } catch { return 'Not set'; } })()}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-theme-tertiary">
                      <p className="text-xs text-theme-tertiary mb-1">Trust Score</p>
                      <p className="text-sm font-bold text-emerald-400">{currentUser.trust.score} ({currentUser.trust.tier})</p>
                    </div>
                    <div className="p-3 rounded-xl bg-theme-tertiary">
                      <p className="text-xs text-theme-tertiary mb-1">Verification</p>
                      <p className="text-sm font-bold text-xbee-primary capitalize">{currentUser.verification}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Password Change */}
              {showModal === 'password' && (
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-theme-primary">Change Password</h3>
                    <button onClick={() => setShowModal(null)} className="p-1 rounded-full hover:bg-theme-hover"><X className="w-5 h-5 text-theme-secondary" /></button>
                  </div>
                  {passwordMsg.text && (
                    <div className={`flex items-center gap-2 p-3 rounded-xl mb-4 ${passwordMsg.type === 'error' ? 'bg-red-500/10 border border-red-500/20' : 'bg-emerald-500/10 border border-emerald-500/20'}`}>
                      {passwordMsg.type === 'error' ? <AlertCircle className="w-4 h-4 text-red-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      <span className={`text-sm ${passwordMsg.type === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>{passwordMsg.text}</span>
                    </div>
                  )}
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-theme-tertiary mb-1 block">Current Password</label>
                      <input type="password" className="xbee-input w-full py-2.5" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="Enter current password" />
                    </div>
                    <div>
                      <label className="text-xs text-theme-tertiary mb-1 block">New Password</label>
                      <input type="password" className="xbee-input w-full py-2.5" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min. 6 characters" />
                    </div>
                    <div>
                      <label className="text-xs text-theme-tertiary mb-1 block">Confirm New Password</label>
                      <input type="password" className="xbee-input w-full py-2.5" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter new password" />
                    </div>
                    <motion.button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-sm mt-2" onClick={handlePasswordChange} whileTap={{ scale: 0.98 }}>
                      Update Password
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Pro Upgrade */}
              {showModal === 'pro' && (
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-theme-primary flex items-center gap-2"><Crown className="w-5 h-5 text-amber-400" /> Xbee Pro</h3>
                    <button onClick={() => setShowModal(null)} className="p-1 rounded-full hover:bg-theme-hover"><X className="w-5 h-5 text-theme-secondary" /></button>
                  </div>
                  <div className="space-y-3 mb-6">
                    {['2x Trust Score multiplier', 'Priority content reach', 'Gold verified badge', 'Advanced analytics dashboard', 'Ad-free experience', 'Early access to new features', 'Custom profile themes', 'Priority support'].map((perk) => (
                      <div key={perk} className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400 shrink-0" /><span className="text-sm text-theme-primary">{perk}</span></div>
                    ))}
                  </div>
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-4 text-center">
                    <p className="text-3xl font-black text-amber-400">$9.99<span className="text-sm font-medium text-theme-tertiary">/month</span></p>
                    <p className="text-xs text-theme-tertiary mt-1">Cancel anytime. No commitment.</p>
                  </div>
                  <motion.button className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60" onClick={handleProUpgrade} disabled={proProcessing} whileTap={{ scale: 0.98 }}>
                    {proProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CreditCard className="w-4 h-4" /> Subscribe to Pro</>}
                  </motion.button>
                </div>
              )}

              {/* Pro Success */}
              {showModal === 'pro-success' && (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
                    <Crown className="w-8 h-8 text-amber-400" />
                  </div>
                  <h3 className="text-xl font-bold text-theme-primary mb-2">Welcome to Xbee Pro!</h3>
                  <p className="text-sm text-theme-secondary mb-4">All premium features are now active.</p>
                  <motion.button className="px-6 py-2.5 rounded-xl bg-amber-500 text-white font-bold text-sm" onClick={() => setShowModal(null)} whileTap={{ scale: 0.98 }}>Got it!</motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}