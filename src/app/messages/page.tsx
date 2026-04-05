'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Settings, PenSquare, Mail } from 'lucide-react';
import ChatList from '@/components/messages/ChatList';
import ChatWindow from '@/components/messages/ChatWindow';
import { mockConversations, currentUser } from '@/lib/mockData';
import { cn } from '@/lib/utils';

export default function MessagesPage() {
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const activeConv = mockConversations.find(c => c.id === activeConvId);
  const otherUser = activeConv?.participants.find(p => p.id !== currentUser.id);

  return (
    <div className="flex h-screen max-lg:h-[calc(100vh-64px)]">
      {/* Chat List */}
      <div className={cn(
        'w-full lg:w-[380px] border-r border-theme flex flex-col',
        activeConvId && 'max-lg:hidden'
      )}>
        <div className="sticky top-0 glass z-10">
          <div className="flex items-center justify-between px-4 py-3">
            <h1 className="text-xl font-bold text-theme-primary">Messages</h1>
            <div className="flex items-center gap-1">
              <motion.button
                className="p-2 rounded-full hover:bg-theme-hover text-theme-secondary"
                whileTap={{ scale: 0.9 }}
              >
                <Settings className="w-5 h-5" />
              </motion.button>
              <motion.button
                className="p-2 rounded-full hover:bg-theme-hover text-theme-secondary"
                whileTap={{ scale: 0.9 }}
              >
                <PenSquare className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
          <div className="px-4 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-tertiary" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages"
                className="xbee-input pl-10 py-2 rounded-full text-sm"
              />
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ChatList
            conversations={mockConversations}
            activeId={activeConvId ?? undefined}
            onSelect={setActiveConvId}
          />
        </div>
      </div>

      {/* Chat Window */}
      <div className={cn(
        'flex-1 flex flex-col',
        !activeConvId && 'max-lg:hidden'
      )}>
        {activeConvId && otherUser ? (
          <ChatWindow
            otherUser={otherUser}
            conversation={activeConv}
            onBack={() => setActiveConvId(null)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-xbee-primary/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-10 h-10 text-xbee-primary" />
              </div>
              <h2 className="text-2xl font-bold text-theme-primary mb-2">Select a message</h2>
              <p className="text-theme-secondary max-w-sm">
                Choose from your existing conversations or start a new one. All messages are end-to-end encrypted.
              </p>
              <motion.button
                className="xbee-button-primary mt-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                New Message
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
