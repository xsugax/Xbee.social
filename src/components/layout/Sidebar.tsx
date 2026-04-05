'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Search, Bell, Mail, Users, User, DollarSign, Settings,
  PenSquare, Shield, Crown, ShieldCheck, X, Sparkles, Check,
  Zap, Eye, Lock, MessageCircle, Bookmark
} from 'lucide-react';
import { cn } from '@/lib/utils';
import TrustBadge from '@/components/trust/TrustBadge';
import { useApp } from '@/context/AppContext';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/explore', label: 'Explore', icon: Search },
  { href: '/notifications', label: 'Notifications', icon: Bell, badgeKey: 'notifications' as const },
  { href: '/messages', label: 'Messages', icon: Mail, badgeKey: 'messages' as const },
  { href: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
  { href: '/communities', label: 'Communities', icon: Users },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/monetization', label: 'Monetization', icon: DollarSign },
  { href: '/settings', label: 'Settings', icon: Settings },
];

const proFeatures = [
  { icon: Eye, label: 'Profile Analytics', desc: 'See who viewed your profile' },
  { icon: Lock, label: 'Ghost Mode Pro', desc: 'Invisible browsing everywhere' },
  { icon: Sparkles, label: 'AI Priority', desc: 'Faster, smarter AI responses' },
  { icon: Shield, label: 'Verified Badge', desc: 'Blue checkmark on your profile' },
  { icon: Zap, label: '10x Reach', desc: 'Posts shown to 10x more people' },
  { icon: MessageCircle, label: 'Priority DMs', desc: 'Your messages go to top of inbox' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { currentUser, unreadCount, conversations, addPost } = useApp();
  const msgUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  const [showPro, setShowPro] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const [composeText, setComposeText] = useState('');

  const handleQuickPost = () => {
    if (!composeText.trim()) return;
    addPost(composeText);
    setComposeText('');
    setShowCompose(false);
  };

  return (
    <>
      <aside className="fixed left-0 top-0 h-screen w-[275px] border-r border-theme bg-theme-primary flex flex-col justify-between py-3 px-3 z-40 max-xl:w-[88px] max-lg:hidden">
        <div>
          <Link href="/" className="flex items-center gap-2.5 px-4 py-3 mb-1">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/15 relative overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10" />
              <svg width="22" height="22" viewBox="0 0 48 48" fill="none" className="relative z-10">
                <path d="M10 8L21 22.5L10 38H14L23 27L31 38H38L26.5 22L37 8H33L24.5 18.5L17 8H10Z" fill="white" />
              </svg>
            </div>
            <div className="max-xl:hidden">
              <span className="text-xl font-black text-gradient tracking-tight">Xbee</span>
              <p className="text-[9px] text-theme-tertiary tracking-[0.15em] uppercase font-medium -mt-0.5">Technologies</p>
            </div>
          </Link>

          <nav className="mt-1 space-y-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div className={cn('sidebar-link relative', isActive && 'sidebar-link-active')} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
                    <div className="relative">
                      <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 1.5} />
                      {item.badgeKey === 'notifications' && unreadCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-xbee-primary text-white text-[11px] font-bold rounded-full flex items-center justify-center px-1">{unreadCount}</span>
                      )}
                      {item.badgeKey === 'messages' && msgUnread > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-xbee-primary text-white text-[11px] font-bold rounded-full flex items-center justify-center px-1">{msgUnread}</span>
                      )}
                    </div>
                    <span className="max-xl:hidden">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}

            {/* Admin link for qualified users */}
            {currentUser.trust.score >= 90 && (
              <Link href="/admin">
                <motion.div className={cn('sidebar-link relative', pathname === '/admin' && 'sidebar-link-active')} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
                  <Shield className="w-6 h-6" strokeWidth={pathname === '/admin' ? 2.5 : 1.5} />
                  <span className="max-xl:hidden">Admin</span>
                </motion.div>
              </Link>
            )}
          </nav>

          {/* Xbee Pro CTA */}
          <motion.div
            className="mt-3 mx-1 p-3 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/10 cursor-pointer max-xl:hidden"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowPro(true)}
          >
            <div className="flex items-center gap-2 mb-1">
              <Crown className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-amber-400">Xbee Pro</span>
            </div>
            <p className="text-[11px] text-theme-tertiary">Unlock advanced features & higher reach</p>
          </motion.div>

          {/* Post Button */}
          <motion.button
            className="xbee-button-primary w-full mt-3 py-3.5 text-base max-xl:w-12 max-xl:h-12 max-xl:p-0 max-xl:mx-auto"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCompose(true)}
          >
            <PenSquare className="w-5 h-5 xl:hidden" />
            <span className="max-xl:hidden">Post</span>
          </motion.button>
        </div>

        {/* User Profile */}
        <Link href="/profile">
          <motion.div className="flex items-center gap-3 p-3 rounded-full hover:bg-theme-hover transition-colors cursor-pointer" whileHover={{ scale: 1.02 }}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-xbee-primary to-xbee-secondary flex items-center justify-center text-white font-bold text-sm shrink-0 relative overflow-hidden">
              {currentUser.avatar ? <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" /> : currentUser.displayName.charAt(0)}
              <div className="absolute -bottom-0.5 -right-0.5">
                <TrustBadge score={currentUser.trust.score} tier={currentUser.trust.tier} size="sm" verification={currentUser.verification} />
              </div>
            </div>
            <div className="max-xl:hidden flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-bold text-sm text-theme-primary truncate">{currentUser.displayName}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-theme-secondary">@{currentUser.username}</span>
                <span className="text-[10px] text-emerald-400 font-bold">{currentUser.trust.score}</span>
              </div>
            </div>
            <span className="max-xl:hidden text-theme-secondary"></span>
          </motion.div>
        </Link>
      </aside>

      {/* Quick Compose Modal */}
      <AnimatePresence>
        {showCompose && (
          <motion.div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[10vh] p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCompose(false)}>
            <motion.div className="glass-card w-full max-w-lg" initial={{ scale: 0.95, y: -20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: -20 }} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-4 py-3 border-b border-theme">
                <button className="text-sm text-theme-tertiary hover:text-theme-primary" onClick={() => setShowCompose(false)}>Cancel</button>
                <motion.button className={cn('xbee-button-primary py-2 px-5 text-sm', !composeText.trim() && 'opacity-50 pointer-events-none')} onClick={handleQuickPost} whileTap={{ scale: 0.95 }} disabled={!composeText.trim()}>Post</motion.button>
              </div>
              <div className="p-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-xbee-primary to-xbee-secondary flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden">
                    {currentUser.avatar ? <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" /> : currentUser.displayName.charAt(0)}
                  </div>
                  <textarea
                    value={composeText}
                    onChange={(e) => setComposeText(e.target.value)}
                    placeholder="What's buzzing?"
                    className="flex-1 bg-transparent text-theme-primary text-lg placeholder:text-theme-tertiary resize-none outline-none min-h-[120px]"
                    autoFocus
                    maxLength={25000}
                  />
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-theme">
                  <span className="text-xs text-theme-tertiary">{composeText.length}/25,000</span>
                  <span className="text-xs text-theme-tertiary">Everyone can reply</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Xbee Pro Modal */}
      <AnimatePresence>
        {showPro && (
          <motion.div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPro(false)}>
            <motion.div className="glass-card w-full max-w-md" initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()}>
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Crown className="w-6 h-6 text-amber-400" />
                    <h3 className="text-xl font-black text-theme-primary">Xbee Pro</h3>
                  </div>
                  <button onClick={() => setShowPro(false)}><X className="w-5 h-5 text-theme-secondary" /></button>
                </div>
                <div className="text-center mb-5">
                  <p className="text-3xl font-black text-gradient mb-1">$9.99/mo</p>
                  <p className="text-sm text-theme-tertiary">Cancel anytime. No commitment.</p>
                </div>
                <div className="space-y-3 mb-5">
                  {proFeatures.map(({ icon: Icon, label, desc }) => (
                    <div key={label} className="flex items-center gap-3 py-2">
                      <div className="p-2 rounded-lg bg-amber-400/10"><Icon className="w-4 h-4 text-amber-400" /></div>
                      <div>
                        <p className="text-sm font-bold text-theme-primary">{label}</p>
                        <p className="text-xs text-theme-tertiary">{desc}</p>
                      </div>
                      <Check className="w-4 h-4 text-emerald-400 ml-auto" />
                    </div>
                  ))}
                </div>
                <motion.button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold text-sm" whileTap={{ scale: 0.98 }}>
                  Upgrade to Pro
                </motion.button>
                <p className="text-[10px] text-center text-theme-tertiary mt-2">Secure payment via Stripe</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}