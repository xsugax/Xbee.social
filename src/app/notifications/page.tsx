'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart, Repeat2, MessageCircle, UserPlus, AtSign, Award,
  DollarSign, Flame, Bell, Settings, Sparkles
} from 'lucide-react';
import Link from 'next/link';
import Avatar from '@/components/ui/Avatar';
import { mockNotifications } from '@/lib/mockData';
import { formatTimeAgo, cn } from '@/lib/utils';
import { Notification } from '@/types';

type NotifTab = 'all' | 'mentions' | 'verified';

const notifIcons: Record<Notification['type'], { icon: React.ElementType; color: string }> = {
  like: { icon: Heart, color: 'text-pink-500 bg-pink-500/10' },
  repost: { icon: Repeat2, color: 'text-xbee-success bg-xbee-success/10' },
  reply: { icon: MessageCircle, color: 'text-xbee-primary bg-xbee-primary/10' },
  follow: { icon: UserPlus, color: 'text-xbee-primary bg-xbee-primary/10' },
  mention: { icon: AtSign, color: 'text-xbee-secondary bg-xbee-secondary/10' },
  community: { icon: MessageCircle, color: 'text-xbee-primary bg-xbee-primary/10' },
  monetization: { icon: DollarSign, color: 'text-xbee-success bg-xbee-success/10' },
  badge: { icon: Award, color: 'text-xbee-warning bg-xbee-warning/10' },
  streak: { icon: Flame, color: 'text-orange-500 bg-orange-500/10' },
};

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<NotifTab>('all');

  const filteredNotifs = activeTab === 'mentions'
    ? mockNotifications.filter(n => n.type === 'mention')
    : activeTab === 'verified'
    ? mockNotifications.filter(n => n.actor.verified)
    : mockNotifications;

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-30 glass">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-theme-primary">Notifications</h1>
          <motion.button
            className="p-2 rounded-full hover:bg-theme-hover text-theme-secondary"
            whileTap={{ scale: 0.9 }}
          >
            <Settings className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-theme">
          {(['all', 'mentions', 'verified'] as NotifTab[]).map((tab) => (
            <button
              key={tab}
              className="flex-1 py-3 relative transition-colors hover:bg-theme-hover"
              onClick={() => setActiveTab(tab)}
            >
              <span className={`text-sm font-medium capitalize ${
                activeTab === tab ? 'text-theme-primary font-bold' : 'text-theme-tertiary'
              }`}>
                {tab === 'verified' ? 'Verified' : tab}
              </span>
              {activeTab === tab && (
                <motion.div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-xbee-primary rounded-full"
                  layoutId="notifTab"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div>
        {filteredNotifs.map((notif, idx) => {
          const { icon: Icon, color } = notifIcons[notif.type];
          const notifHref = notif.type === 'follow'
            ? `/profile?user=${notif.actor.id}`
            : notif.postId
            ? `/profile?user=${notif.actor.id}`
            : undefined;

          const content = (
            <motion.div
              key={notif.id}
              className={cn(
                'flex items-start gap-3 px-4 py-3 border-b border-theme hover:bg-theme-hover/50 transition-colors cursor-pointer',
                !notif.read && 'bg-xbee-primary/5'
              )}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.03 }}
            >
              <div className={cn('p-2 rounded-full shrink-0', color)}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Avatar name={notif.actor.displayName} src={notif.actor.avatar} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm text-theme-primary">
                      <span className="font-bold">{notif.actor.displayName}</span>
                      {notif.actor.verified && (
                        <Sparkles className="w-3.5 h-3.5 text-xbee-primary inline ml-1" />
                      )}
                      {' '}{notif.content}
                    </p>
                    <span className="text-xs text-theme-tertiary">{formatTimeAgo(notif.createdAt)}</span>
                  </div>
                </div>
              </div>
              {!notif.read && (
                <div className="w-2.5 h-2.5 rounded-full bg-xbee-primary shrink-0 mt-2" />
              )}
            </motion.div>
          );

          return notifHref ? (
            <Link key={notif.id} href={notifHref}>
              {content}
            </Link>
          ) : (
            <React.Fragment key={notif.id}>{content}</React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
