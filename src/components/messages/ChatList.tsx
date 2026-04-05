'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Pin, AlertTriangle } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import TrustBadge from '@/components/trust/TrustBadge';
import { Conversation } from '@/types';
import { formatTimeAgo, cn } from '@/lib/utils';
import { currentUser } from '@/lib/mockData';

interface ChatListProps {
  conversations: Conversation[];
  activeId?: string;
  onSelect: (id: string) => void;
}

export default function ChatList({ conversations, activeId, onSelect }: ChatListProps) {
  return (
    <div className="divide-y divide-theme">
      {conversations.map((conv, idx) => {
        const otherUser = conv.participants.find(p => p.id !== currentUser.id)!;
        const isActive = conv.id === activeId;
        const isFromMe = conv.lastMessage.senderId === currentUser.id;
        const hasScamWarning = conv.riskLevel === 'warning' || conv.scamAlerts.length > 0;

        return (
          <motion.div
            key={conv.id}
            className={cn(
              'flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors',
              isActive ? 'bg-theme-hover' : 'hover:bg-theme-hover/50',
              hasScamWarning && 'border-l-2 border-l-orange-400',
            )}
            onClick={() => onSelect(conv.id)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Avatar
              name={otherUser.displayName}
              verified={otherUser.verified}
              online={idx < 2}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-bold text-sm text-theme-primary truncate">
                    {otherUser.displayName}
                  </span>
                  <TrustBadge score={otherUser.trust.score} tier={otherUser.trust.tier} size="sm" verification={otherUser.verification} />
                  {conv.pinned && <Pin className="w-3 h-3 text-theme-tertiary shrink-0" />}
                  {hasScamWarning && <AlertTriangle className="w-3 h-3 text-orange-400 shrink-0" />}
                </div>
                <span className="text-xs text-theme-tertiary shrink-0">
                  {formatTimeAgo(conv.lastMessage.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <p className={cn(
                  'text-sm truncate',
                  conv.unreadCount > 0 ? 'text-theme-primary font-medium' : 'text-theme-tertiary',
                  hasScamWarning && 'text-orange-400',
                )}>
                  {isFromMe && <span className="text-theme-tertiary">You: </span>}
                  {hasScamWarning && !isFromMe ? '⚠️ ' : ''}{conv.lastMessage.content}
                </p>
                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {conv.safeMode && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 font-bold">SAFE</span>
                  )}
                  {conv.encrypted && (
                    <Shield className="w-3 h-3 text-xbee-success" />
                  )}
                  {conv.unreadCount > 0 && (
                    <span className={cn(
                      'min-w-[20px] h-5 text-white text-[11px] font-bold rounded-full flex items-center justify-center px-1',
                      hasScamWarning ? 'bg-orange-500' : 'bg-xbee-primary',
                    )}>
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
