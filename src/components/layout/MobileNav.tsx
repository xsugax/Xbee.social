'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Search, Bell, Mail, User, Feather, X, Bookmark, Users,
  DollarSign, Settings, Menu, MessageCircle, Sparkles, Shield, ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import PostComposer from '@/components/feed/PostComposer';

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

  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showMobileSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showMobileSearch]);

  const handleMobileSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && mobileSearchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(mobileSearchQuery.trim())}`);
      setShowMobileSearch(false);
      setMobileSearchQuery('');
    }
  };

  const handleComposePost = async (content: string, media?: import('@/types').MediaAttachment[]) => {
    await addPost(content, media);
    setShowCompose(false);
    if (pathname !== '/') router.push('/');
  };

  return (
    <>
      {/* Top bar with hamburger menu + search */}
      <div className="fixed top-0 left-0 right-0 z-50 glass border-b border-theme pt-[env(safe-area-inset-top)] lg:hidden">
        {showMobileSearch ? (
          <div className="flex items-center gap-2 px-3 py-1">
            <button className="min-h-11 min-w-11 rounded-lg hover:bg-theme-hover" aria-label="Close search" onClick={() => { setShowMobileSearch(false); setMobileSearchQuery(''); }}>
              <ArrowLeft className="w-5 h-5 text-theme-primary" />
            </button>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search people, posts..."
              value={mobileSearchQuery}
              onChange={(e) => setMobileSearchQuery(e.target.value)}
              onKeyDown={handleMobileSearch}
              className="flex-1 bg-theme-tertiary text-theme-primary text-sm px-4 py-2 rounded-full border border-theme placeholder:text-theme-tertiary focus:outline-none focus:ring-2 focus:ring-xbee-primary/50"
            />
          </div>
        ) : (
          <div className="flex items-center justify-between px-4 py-1">
            <motion.button
              className="min-h-11 min-w-11 rounded-lg hover:bg-theme-hover transition-colors"
              aria-label="Open navigation menu"
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
              {/* Search toggle */}
              <button className="min-h-11 min-w-11 rounded-lg hover:bg-theme-hover" onClick={() => setShowMobileSearch(true)} aria-label="Search">
                <Search className="w-5 h-5 text-theme-secondary" />
              </button>
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
        )}
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
              className="absolute left-0 top-0 bottom-0 w-[280px] bg-theme-primary border-r border-theme overflow-y-auto pt-[env(safe-area-inset-top)]"
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
        className="fixed bottom-[calc(5.25rem+env(safe-area-inset-bottom))] right-4 z-50 w-14 h-14 rounded-full bg-xbee-primary text-white shadow-lg shadow-xbee-primary/30 flex items-center justify-center lg:hidden"
        onClick={() => setShowCompose(true)}
        aria-label="Create a post"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Feather className="w-6 h-6" />
      </motion.button>

      {/* Compose Modal */}
      <AnimatePresence>
        {showCompose && (
          <motion.div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[8vh] p-4 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCompose(false)}>
            <motion.div className="glass-card w-full max-w-lg max-h-[84dvh] overflow-y-auto" initial={{ scale: 0.95, y: -20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: -20 }} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-4 py-3 border-b border-theme">
                <span className="text-sm font-semibold text-theme-primary">Create post</span>
                <button className="min-h-11 min-w-11 rounded-full hover:bg-theme-hover flex items-center justify-center" aria-label="Close composer" onClick={() => setShowCompose(false)}><X className="w-5 h-5 text-theme-secondary" /></button>
              </div>
              <PostComposer onPost={handleComposePost} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom nav bar */}
      <nav aria-label="Mobile navigation" className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-theme pb-[calc(0.5rem+env(safe-area-inset-bottom))] lg:hidden">
        <div className="flex items-center justify-around px-1 pt-1">
          {mobileNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} aria-label={item.label} aria-current={isActive ? 'page' : undefined} className={cn('relative flex min-h-12 min-w-[64px] flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1', isActive && 'bg-xbee-primary/10')}>
                <Icon
                  className={cn('w-5 h-5 transition-colors', isActive ? 'text-xbee-primary' : 'text-theme-secondary')}
                  strokeWidth={isActive ? 2.5 : 1.5}
                />
                <span className={cn('text-[10px] leading-3', isActive ? 'font-semibold text-xbee-primary' : 'text-theme-secondary')}>{item.label}</span>
                {item.badgeKey === 'notifications' && unreadCount > 0 && (
                  <span className="absolute top-0.5 left-[calc(50%+4px)] min-w-[16px] h-[16px] bg-xbee-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">{unreadCount}</span>
                )}
                {item.badgeKey === 'messages' && msgUnread > 0 && (
                  <span className="absolute top-0.5 left-[calc(50%+4px)] min-w-[16px] h-[16px] bg-xbee-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">{msgUnread}</span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
