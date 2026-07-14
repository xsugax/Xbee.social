'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Search, Bell, Mail, User, Feather, X, Bookmark, Users,
  DollarSign, Settings, Menu, MessageCircle, Sparkles, Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import AccountSwitcher from '@/components/layout/AccountSwitcher';

const mobileNavItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/explore', label: 'Explore', icon: Search },
  { href: '/notifications', label: 'Notifications', icon: Bell, badgeKey: 'notifications' as const },
  { href: '/messages', label: 'Messages', icon: Mail, badgeKey: 'messages' as const },
];

const drawerNavItems = [
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

export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { unreadCount, conversations, currentUser, addPost } = useApp();
  const msgUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  const [showCompose, setShowCompose] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [composeText, setComposeText] = useState('');

  const handlePost = () => {
    if (!composeText.trim()) return;
    addPost(composeText);
    setComposeText('');
    setShowCompose(false);
    if (pathname !== '/') router.push('/');
  };

  return (
    <>
      {/* Top bar with hamburger menu */}
      <div className="fixed top-0 left-0 right-0 z-50 glass border-b border-theme lg:hidden flex items-center justify-between px-4 py-2">
        <motion.button
          className="p-2 rounded-lg hover:bg-theme-hover transition-colors"
          onClick={() => setShowDrawer(true)}
          whileTap={{ scale: 0.9 }}
        >
          <Menu className="w-6 h-6 text-theme-primary" />
        </motion.button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
              <path d="M10 8L21 22.5L10 38H14L23 27L31 38H38L26.5 22L37 8H33L24.5 18.5L17 8H10Z" fill="white" />
            </svg>
          </div>
          <span className="text-base font-black text-gradient">Xbee</span>
        </div>
        <div className="flex items-center gap-1">
          {/* Notification badge small */}
          {unreadCount > 0 && (
            <Link href="/notifications" className="relative p-2">
              <Bell className="w-5 h-5 text-theme-secondary" />
              <span className="absolute top-0.5 right-0.5 min-w-[16px] h-[16px] bg-xbee-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                {unreadCount}
              </span>
            </Link>
          )}
        </div>
      </div>

      {/* Drawer overlay */}
      <AnimatePresence>
        {showDrawer && (
          <motion.div
            className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDrawer(false)}
          >
            <motion.div
              className="absolute left-0 top-0 bottom-0 w-[280px] bg-theme-primary border-r border-theme overflow-y-auto"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-theme">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
                      <path d="M10 8L21 22.5L10 38H14L23 27L31 38H38L26.5 22L37 8H33L24.5 18.5L17 8H10Z" fill="white" />
                    </svg>
                  </div>
                  <span className="text-lg font-black text-gradient">Xbee</span>
                </div>
                <button className="p-1.5 rounded-full hover:bg-theme-hover" onClick={() => setShowDrawer(false)}>
                  <X className="w-5 h-5 text-theme-secondary" />
                </button>
              </div>

              {/* User info */}
              <div className="px-4 py-3 border-b border-theme flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-xbee-primary to-xbee-secondary flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    currentUser.displayName.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-theme-primary truncate">{currentUser.displayName}</p>
                  <p className="text-xs text-theme-tertiary">@{currentUser.username}</p>
                </div>
              </div>

              {/* Nav items */}
              <nav className="py-2">
                {drawerNavItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setShowDrawer(false)}>
                      <div className={cn(
                        'flex items-center gap-3 px-4 py-3 transition-colors',
                        isActive ? 'bg-theme-hover font-bold text-xbee-primary' : 'text-theme-primary hover:bg-theme-hover'
                      )}>
                        <div className="relative">
                          <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.5} />
                          {item.badgeKey === 'notifications' && unreadCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] bg-xbee-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
                              {unreadCount}
                            </span>
                          )}
                          {item.badgeKey === 'messages' && msgUnread > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] bg-xbee-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
                              {msgUnread}
                            </span>
                          )}
                        </div>
                        <span className="text-sm">{item.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Compose FAB */}
      <motion.button
        className="fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full bg-xbee-primary text-white shadow-lg shadow-xbee-primary/30 flex items-center justify-center lg:hidden"
        onClick={() => setShowCompose(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Feather className="w-6 h-6" />
      </motion.button>

      {/* Compose Modal */}
      <AnimatePresence>
        {showCompose && (
          <motion.div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[8vh] p-4 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCompose(false)}>
            <motion.div className="glass-card w-full max-w-lg" initial={{ scale: 0.95, y: -20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: -20 }} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-4 py-3 border-b border-theme">
                <button className="p-1.5 rounded-full hover:bg-theme-hover" onClick={() => setShowCompose(false)}><X className="w-5 h-5 text-theme-secondary" /></button>
                <motion.button className={cn('xbee-button-primary py-2 px-5 text-sm', !composeText.trim() && 'opacity-50 pointer-events-none')} onClick={handlePost} whileTap={{ scale: 0.95 }} disabled={!composeText.trim()}>Post</motion.button>
              </div>
              <div className="p-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-xbee-primary to-xbee-secondary flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden">
                    {currentUser.avatar ? <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" /> : currentUser.displayName.charAt(0)}
                  </div>
                  <textarea value={composeText} onChange={(e) => setComposeText(e.target.value)} placeholder="What's buzzing?" className="flex-1 bg-transparent text-theme-primary text-lg placeholder:text-theme-tertiary resize-none outline-none min-h-[120px]" autoFocus maxLength={25000} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom nav bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-theme lg:hidden">
        <div className="flex items-center justify-around py-2 px-2">
          {mobileNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="relative p-3">
                <Icon
                  className={cn('w-6 h-6 transition-colors', isActive ? 'text-xbee-primary' : 'text-theme-secondary')}
                  strokeWidth={isActive ? 2.5 : 1.5}
                />
                {item.badgeKey === 'notifications' && unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-[16px] h-[16px] bg-xbee-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">{unreadCount}</span>
                )}
                {item.badgeKey === 'messages' && msgUnread > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-[16px] h-[16px] bg-xbee-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">{msgUnread}</span>
                )}
              </Link>
            );
          })}
          <div className="relative p-1">
            <AccountSwitcher compact />
          </div>
        </div>
      </nav>
    </>
  );
}
