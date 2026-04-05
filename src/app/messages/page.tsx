'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Settings, PenSquare, Mail, X, UserPlus } from 'lucide-react';
import ChatList from '@/components/messages/ChatList';
import ChatWindow from '@/components/messages/ChatWindow';
import Avatar from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import { mockUsers } from '@/lib/mockData';

export default function MessagesPage() {
  const { conversations, currentUser, activeConvId, setActiveConvId } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewMsg, setShowNewMsg] = useState(false);
  const [newMsgSearch, setNewMsgSearch] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const filteredConvs = searchQuery.trim()
    ? conversations.filter(c => c.participants.some(p => p.displayName.toLowerCase().includes(searchQuery.toLowerCase())))
    : conversations;

  const activeConv = conversations.find(c => c.id === activeConvId);
  const otherUser = activeConv?.participants.find(p => p.id !== currentUser.id);

  // Filter users for new message (exclude those with existing conversations)
  const existingUserIds = new Set(conversations.flatMap(c => c.participants.map(p => p.id)));
  const newMsgUsers = mockUsers.filter(u =>
    u.id !== currentUser.id &&
    (newMsgSearch.trim() === '' || u.displayName.toLowerCase().includes(newMsgSearch.toLowerCase()) || u.username.toLowerCase().includes(newMsgSearch.toLowerCase()))
  );

  const startConversation = (userId: string) => {
    // Find existing conversation or use the first one as demo
    const existing = conversations.find(c => c.participants.some(p => p.id === userId));
    if (existing) {
      setActiveConvId(existing.id);
    } else {
      // Navigate to first conversation as placeholder
      if (conversations.length > 0) setActiveConvId(conversations[0].id);
    }
    setShowNewMsg(false);
    setNewMsgSearch('');
  };

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
              <motion.button className="p-2 rounded-full hover:bg-theme-hover text-theme-secondary" whileTap={{ scale: 0.9 }} onClick={() => setShowSettings(!showSettings)} title="Settings">
                <Settings className="w-5 h-5" />
              </motion.button>
              <motion.button className="p-2 rounded-full hover:bg-theme-hover text-theme-secondary" whileTap={{ scale: 0.9 }} onClick={() => setShowNewMsg(true)} title="New Message">
                <PenSquare className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Message Settings */}
          <AnimatePresence>
            {showSettings && (
              <motion.div className="px-4 pb-3" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <div className="glass-card p-3 space-y-2">
                  <p className="text-xs font-bold text-theme-secondary">Message Settings</p>
                  {['Message requests', 'Read receipts', 'Typing indicators', 'Auto-translate'].map((setting) => (
                    <div key={setting} className="flex items-center justify-between py-1.5">
                      <span className="text-sm text-theme-primary">{setting}</span>
                      <div className="w-9 h-5 rounded-full bg-xbee-primary relative cursor-pointer">
                        <div className="w-4 h-4 rounded-full bg-white absolute top-0.5 right-0.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="px-4 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-tertiary" />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search messages" className="xbee-input pl-10 py-2 rounded-full text-sm" />
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ChatList conversations={filteredConvs} activeId={activeConvId ?? undefined} onSelect={setActiveConvId} />
        </div>
      </div>

      {/* Chat Window */}
      <div className={cn('flex-1 flex flex-col', !activeConvId && 'max-lg:hidden')}>
        {activeConvId && otherUser ? (
          <ChatWindow otherUser={otherUser} conversation={activeConv} onBack={() => setActiveConvId(null)} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-xbee-primary/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-10 h-10 text-xbee-primary" />
              </div>
              <h2 className="text-2xl font-bold text-theme-primary mb-2">Select a message</h2>
              <p className="text-theme-secondary max-w-sm">Choose from your existing conversations or start a new one. All messages are end-to-end encrypted.</p>
              <motion.button className="xbee-button-primary mt-4" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowNewMsg(true)}>
                New Message
              </motion.button>
            </div>
          </div>
        )}
      </div>

      {/* New Message Modal */}
      <AnimatePresence>
        {showNewMsg && (
          <motion.div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[10vh] p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNewMsg(false)}>
            <motion.div className="glass-card w-full max-w-md max-h-[70vh] flex flex-col" initial={{ scale: 0.95, y: -20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: -20 }} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-4 py-3 border-b border-theme shrink-0">
                <h3 className="text-lg font-bold text-theme-primary">New Message</h3>
                <button onClick={() => setShowNewMsg(false)}><X className="w-5 h-5 text-theme-secondary" /></button>
              </div>
              <div className="px-4 py-3 border-b border-theme shrink-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-tertiary" />
                  <input value={newMsgSearch} onChange={(e) => setNewMsgSearch(e.target.value)} placeholder="Search people..." className="xbee-input pl-10 py-2 rounded-full text-sm w-full" autoFocus />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {newMsgUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-theme-tertiary">No users found</p>
                  </div>
                ) : (
                  newMsgUsers.map((user) => {
                    const hasExisting = existingUserIds.has(user.id);
                    return (
                      <motion.button
                        key={user.id}
                        className="flex items-center gap-3 w-full px-4 py-3 hover:bg-theme-hover transition-colors text-left"
                        onClick={() => startConversation(user.id)}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Avatar name={user.displayName} src={user.avatar} verified={user.verified} />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-theme-primary truncate">{user.displayName}</p>
                          <p className="text-xs text-theme-tertiary">@{user.username}</p>
                        </div>
                        {hasExisting && <span className="text-[10px] px-2 py-0.5 rounded-full bg-xbee-primary/10 text-xbee-primary font-bold">Existing</span>}
                      </motion.button>
                    );
                  })
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}