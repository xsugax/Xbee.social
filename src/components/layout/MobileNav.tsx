'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Search, Bell, Mail, User, Feather, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import AccountSwitcher from '@/components/layout/AccountSwitcher';

const mobileNavItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/explore', label: 'Explore', icon: Search },
  { href: '/notifications', label: 'Notifications', icon: Bell, badgeKey: 'notifications' as const },
  { href: '/messages', label: 'Messages', icon: Mail, badgeKey: 'messages' as const },
];

export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { unreadCount, conversations, currentUser, addPost } = useApp();
  const msgUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  const [showCompose, setShowCompose] = useState(false);
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
      {/* Floating Compose FAB */}
      <motion.button
        className="fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full bg-xbee-primary text-white shadow-lg shadow-xbee-primary/30 flex items-center justify-center lg:hidden"
        onClick={() => setShowCompose(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Feather className="w-6 h-6" />
        <span className="sr-only">New post</span>
      </motion.button>

      {/* Mobile Compose Modal */}
      <AnimatePresence>
        {showCompose && (
          <motion.div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[8vh] p-4 lg:hidden" role="dialog" aria-modal="true" aria-label="Compose post" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCompose(false)}>
            <motion.div className="glass-card w-full max-w-lg" initial={{ scale: 0.95, y: -20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: -20 }} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-4 py-3 border-b border-theme">
                <button className="p-1.5 rounded-full hover:bg-theme-hover" onClick={() => setShowCompose(false)} aria-label="Close compose"><X className="w-5 h-5 text-theme-secondary" /></button>
                <motion.button className={cn('xbee-button-primary py-2 px-5 text-sm', !composeText.trim() && 'opacity-50 pointer-events-none')} onClick={handlePost} whileTap={{ scale: 0.95 }} disabled={!composeText.trim()}>Post</motion.button>
              </div>
              <div className="p-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-xbee-primary to-xbee-secondary flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden">
                    {currentUser.avatar ? <img src={currentUser.avatar} alt={`${currentUser.displayName}'s avatar`} className="w-full h-full object-cover" /> : currentUser.displayName.charAt(0)}
                  </div>
                  <textarea value={composeText} onChange={(e) => setComposeText(e.target.value)} placeholder="What's buzzing?" className="flex-1 bg-transparent text-theme-primary text-lg placeholder:text-theme-tertiary resize-none outline-none min-h-[120px]" autoFocus maxLength={25000} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-theme lg:hidden">
        <div className="flex items-center justify-around py-2 px-2">
          {mobileNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="relative p-3">
                <Icon
                  className={cn(
                    'w-6 h-6 transition-colors',
                    isActive ? 'text-xbee-primary' : 'text-theme-secondary'
                  )}
                  strokeWidth={isActive ? 2.5 : 1.5}
                />
                {item.badgeKey === 'notifications' && unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-[16px] h-[16px] bg-xbee-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
                    {unreadCount}
                  </span>
                )}
                {item.badgeKey === 'messages' && msgUnread > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-[16px] h-[16px] bg-xbee-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
                    {msgUnread}
                  </span>
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
