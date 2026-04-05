'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Search, Bell, Mail, User, Feather } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';

const mobileNavItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/explore', label: 'Explore', icon: Search },
  { href: '/notifications', label: 'Notifications', icon: Bell, badgeKey: 'notifications' as const },
  { href: '/messages', label: 'Messages', icon: Mail, badgeKey: 'messages' as const },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { unreadCount, conversations } = useApp();
  const msgUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  const scrollToComposer = () => {
    const composer = document.querySelector('textarea[placeholder="What\'s buzzing?"]');
    if (composer) {
      (composer as HTMLTextAreaElement).focus();
      composer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <>
      {/* Floating Compose FAB */}
      <motion.button
        className="fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full bg-xbee-primary text-white shadow-lg shadow-xbee-primary/30 flex items-center justify-center lg:hidden"
        onClick={scrollToComposer}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Feather className="w-6 h-6" />
      </motion.button>

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
        </div>
      </nav>
    </>
  );
}
