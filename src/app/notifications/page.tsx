'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Repeat2, MessageCircle, UserPlus, AtSign, Award,
  DollarSign, Flame, Bell, Settings, Sparkles, CheckCheck,
  Trash2, X, Filter, BellOff
} from 'lucide-react';
import Link from 'next/link';
import Avatar from '@/components/ui/Avatar';
import { useApp } from '@/context/AppContext';
import { formatTimeAgo, cn } from '@/lib/utils';
import { Notification } from '@/types';

type NotifTab = 'all' | 'mentions' | 'verified';

const notifIcons: Record<string, { icon: React.ElementType; color: string }> = {
  like: { icon: Heart, color: 'text-pink-500 bg-pink-500/10' },
  repost: { icon: Repeat2, color: 'text-xbee-success bg-xbee-success/10' },
  reply: { icon: MessageCircle, color: 'text-xbee-primary bg-xbee-primary/10' },
  follow: { icon: UserPlus, color: 'text-xbee-primary bg-xbee-primary/10' },
  mention: { icon: AtSign, color: 'text-xbee-secondary bg-xbee-secondary/10' },
  community: { icon: MessageCircle, color: 'text-xbee-primary bg-xbee-primary/10' },
  monetization: { icon: DollarSign, color: 'text-xbee-success bg-xbee-success/10' },
  badge: { icon: Award, color: 'text-xbee-warning bg-xbee-warning/10' },
  streak: { icon: Flame, color: 'text-orange-500 bg-orange-500/10' },
  comment: { icon: MessageCircle, color: 'text-xbee-primary bg-xbee-primary/10' },
  message: { icon: MessageCircle, color: 'text-blue-400 bg-blue-400/10' },
  trust: { icon: Award, color: 'text-emerald-400 bg-emerald-400/10' },
  trending: { icon: Flame, color: 'text-orange-500 bg-orange-500/10' },
};

export default function NotificationsPage() {
  const { notifications, markNotificationRead, unreadCount } = useApp();
  const [activeTab, setActiveTab] = useState<NotifTab>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const muteTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filteredNotifs = (() => {
    let filtered = activeTab === 'mentions'
      ? notifications.filter(n => n.type === 'mention')
      : activeTab === 'verified'
      ? notifications.filter(n => n.actor?.verified)
      : notifications;
    if (filterType) {
      filtered = filtered.filter(n => n.type === filterType);
    }
    return filtered;
  })();

  const markAllRead = () => {
    notifications.forEach(n => {
      if (!n.read) markNotificationRead(n.id);
    });
  };

  return (
    <div>
      <div className="sticky top-0 z-30 glass">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-xl font-bold text-theme-primary">Notifications</h1>
            {unreadCount > 0 && <p className="text-xs text-xbee-primary font-medium">{unreadCount} unread</p>}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <motion.button
                className="p-2 rounded-full hover:bg-theme-hover text-xbee-primary"
                whileTap={{ scale: 0.9 }}
                onClick={markAllRead}
                title="Mark all read"
              >
                <CheckCheck className="w-5 h-5" />
              </motion.button>
            )}
            <motion.button
              className="p-2 rounded-full hover:bg-theme-hover text-theme-secondary"
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Notification Settings Dropdown */}
        <AnimatePresence>
          {showSettings && (
            <motion.div className="px-4 pb-3 space-y-2" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <div className="glass-card p-3 space-y-2">
                <p className="text-xs font-bold text-theme-secondary">Quick Actions</p>
                <button className="flex items-center gap-2 w-full py-2 px-3 rounded-lg text-sm text-theme-primary hover:bg-theme-hover transition-colors" onClick={markAllRead}>
                  <CheckCheck className="w-4 h-4 text-xbee-primary" /> Mark all as read
                </button>
                <button className="flex items-center gap-2 w-full py-2 px-3 rounded-lg text-sm text-theme-primary hover:bg-theme-hover transition-colors" onClick={() => { setFilterType(filterType ? null : 'like'); setShowSettings(false); }}>
                  <Filter className="w-4 h-4 text-xbee-secondary" /> {filterType ? 'Clear filter' : 'Filter: Likes only'}
                </button>
                <button className="flex items-center gap-2 w-full py-2 px-3 rounded-lg text-sm text-theme-primary hover:bg-theme-hover transition-colors" onClick={() => {
                  setIsMuted(true);
                  setShowSettings(false);
                  if (muteTimerRef.current) clearTimeout(muteTimerRef.current);
                  muteTimerRef.current = setTimeout(() => setIsMuted(false), 3600_000);
                }}>
                  <BellOff className="w-4 h-4 text-theme-tertiary" /> {isMuted ? 'Muted (1 hour)' : 'Mute for 1 hour'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex border-b border-theme">
          {(['all', 'mentions', 'verified'] as NotifTab[]).map((tab) => (
            <button key={tab} className="flex-1 py-3 relative transition-colors hover:bg-theme-hover" onClick={() => { setActiveTab(tab); scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              <span className={`text-sm font-medium capitalize ${activeTab === tab ? 'text-theme-primary font-bold' : 'text-theme-tertiary'}`}>
                {tab === 'verified' ? 'Verified' : tab}
              </span>
              {activeTab === tab && <motion.div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-xbee-primary rounded-full" layoutId="notifTab" />}
            </button>
          ))}
        </div>
      </div>

      <div ref={scrollContainerRef}>
        {filteredNotifs.length === 0 ? (
          <div className="text-center py-16">
            <Bell className="w-12 h-12 text-theme-tertiary mx-auto mb-3 opacity-40" />
            <p className="text-theme-secondary font-medium">No notifications yet</p>
            <p className="text-sm text-theme-tertiary mt-1">When someone interacts with you, it will show up here</p>
          </div>
        ) : (
          filteredNotifs.map((notif, idx) => {
            const iconData = notifIcons[notif.type] || notifIcons['like'];
            const Icon = iconData.icon;
            const color = iconData.color;
            const notifHref = notif.type === 'follow' ? `/profile?user=${notif.actor?.id || ''}` :
              notif.type === 'message' ? '/messages' :
              (notif as any).actionUrl || (notif.postId ? `/profile?user=${notif.actor?.id || ''}` : undefined);

            const inner = (
              <motion.div
                className={cn(
                  'flex items-start gap-3 px-4 py-3 border-b border-theme hover:bg-theme-hover/50 transition-colors cursor-pointer',
                  !notif.read && 'bg-xbee-primary/5'
                )}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.02 }}
                onClick={() => { if (!notif.read) markNotificationRead(notif.id); }}
              >
                <div className={cn('p-2 rounded-full shrink-0', color)}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {notif.actor?.avatar && <Avatar name={notif.actor?.displayName || 'Xbee'} src={notif.actor?.avatar} size="sm" />}
                    <div className="min-w-0">
                      <p className="text-sm text-theme-primary">
                        <span className="font-bold">{notif.actor?.displayName || 'Xbee'}</span>
                        {notif.actor?.verified && <Sparkles className="w-3.5 h-3.5 text-xbee-primary inline ml-1" />}
                        {' '}{notif.content}
                      </p>
                      <span className="text-xs text-theme-tertiary">{formatTimeAgo(notif.createdAt)}</span>
                    </div>
                  </div>
                </div>
                {!notif.read && <div className="w-2.5 h-2.5 rounded-full bg-xbee-primary shrink-0 mt-2" />}
              </motion.div>
            );

            return notifHref ? (
              <Link key={notif.id} href={notifHref}>{inner}</Link>
            ) : (
              <React.Fragment key={notif.id}>{inner}</React.Fragment>
            );
          })
        )}
      </div>
    </div>
  );
}