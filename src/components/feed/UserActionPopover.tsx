'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, UserPlus, UserCheck, UserMinus, Send,
  User as UserIcon, X, Heart, Repeat2, Bookmark, ExternalLink
} from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import TrustBadge from '@/components/trust/TrustBadge';
import { useApp } from '@/context/AppContext';
import { cn, formatNumber } from '@/lib/utils';
import { User } from '@/types';
import Link from 'next/link';

interface UserActionPopoverProps {
  user: User;
  children: React.ReactNode;
}

export default function UserActionPopover({ user, children }: UserActionPopoverProps) {
  const {
    currentUser, getConnectionStatus, sendConnectionRequest,
    removeConnection, connections, pendingSent, addConversation, sendMessage
  } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const connStatus = getConnectionStatus(user.id);
  const isConnected = connStatus === 'connected';
  const isPending = connStatus === 'pending_sent';

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  return (
    <div className="relative" ref={popoverRef}>
      <div onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}>
        {children}
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute left-0 top-full mt-1 z-50 w-72 glass-card overflow-hidden"
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* User preview */}
            <div className="p-4 border-b border-theme">
              <div className="flex items-center gap-3">
                <Link href={`/profile?user=${user.id}`} onClick={() => setIsOpen(false)}>
                  <Avatar name={user.displayName} src={user.avatar} size="md" verified={user.verified} />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/profile?user=${user.id}`} onClick={() => setIsOpen(false)} className="hover:underline">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-theme-primary truncate">{user.displayName}</span>
                      <TrustBadge score={user.trust.score} tier={user.trust.tier} size="sm" verification={user.verification} />
                    </div>
                  </Link>
                  <p className="text-xs text-theme-tertiary">@{user.username}</p>
                  <div className="flex gap-3 mt-1 text-[10px] text-theme-tertiary">
                    <span><strong className="text-theme-primary">{formatNumber(user.followers)}</strong> followers</span>
                    <span><strong className="text-theme-primary">{formatNumber(user.following)}</strong> following</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="p-2 space-y-0.5">
              {user.id !== currentUser.id && (
                <>
                  {!isConnected && !isPending && (
                    <motion.button
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-theme-hover text-left transition-colors"
                      onClick={() => { sendConnectionRequest(user.id); setIsOpen(false); }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="w-8 h-8 rounded-full bg-xbee-primary/10 flex items-center justify-center">
                        <UserPlus className="w-4 h-4 text-xbee-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-theme-primary">Connect with {user.displayName}</p>
                        <p className="text-[10px] text-theme-tertiary">Send a connection request</p>
                      </div>
                    </motion.button>
                  )}
                  {isPending && (
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-amber-500/10">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                        <UserCheck className="w-4 h-4 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-amber-400">Request pending</p>
                        <p className="text-[10px] text-amber-400/70">Waiting for response</p>
                      </div>
                    </div>
                  )}
                  {isConnected && (
                    <>
                      <motion.button
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-theme-hover text-left transition-colors"
                        onClick={() => {
                          // Navigate to messages
                          setIsOpen(false);
                          window.location.href = '/messages';
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="w-8 h-8 rounded-full bg-xbee-primary/10 flex items-center justify-center">
                          <MessageCircle className="w-4 h-4 text-xbee-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-theme-primary">Send a message</p>
                          <p className="text-[10px] text-theme-tertiary">Chat with {user.displayName}</p>
                        </div>
                      </motion.button>
                      <motion.button
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/10 text-left transition-colors"
                        onClick={() => { removeConnection(user.id); setIsOpen(false); }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                          <UserMinus className="w-4 h-4 text-red-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-red-400">Disconnect</p>
                          <p className="text-[10px] text-red-400/70">Remove connection</p>
                        </div>
                      </motion.button>
                    </>
                  )}
                </>
              )}

              {/* View profile */}
              <Link href={`/profile?user=${user.id}`} onClick={() => setIsOpen(false)}>
                <motion.div
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-theme-hover transition-colors cursor-pointer"
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-8 h-8 rounded-full bg-theme-hover flex items-center justify-center">
                    <ExternalLink className="w-4 h-4 text-theme-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-theme-primary">View Profile</p>
                    <p className="text-[10px] text-theme-tertiary">See all posts and activity</p>
                  </div>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
