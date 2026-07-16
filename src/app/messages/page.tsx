'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Settings, PenSquare, Mail, X, UserPlus, Loader2, Inbox, Check, X as XIcon, UserCheck, Send, ArrowLeft } from 'lucide-react';
import ChatList from '@/components/messages/ChatList';
import ChatWindow from '@/components/messages/ChatWindow';
import Avatar from '@/components/ui/Avatar';
import { cn, formatTimeAgo } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import { useAuth, profileToUser } from '@/context/AuthContext';
import { getSupabase } from '@/lib/supabase';
import { User, Message } from '@/types';
import { AGI_BOT_ID, agiBotUser, createAgiConversation, getAgiWelcomeMessage } from '@/lib/agiBot';
import AgiChatWindow from '@/components/messages/AgiChatWindow';

export default function MessagesPage() {
  const {
    conversations, currentUser, activeConvId, setActiveConvId, loadConversations,
    messageRequests, sendMessageRequest, acceptMessageRequest, dismissMessageRequest,
    messageRequestUnread, canSendMessage, connections, getConnectionStatus,
    sendConnectionRequest, allUsers, addConversation, sendMessage, addReply
  } = useApp();
  const { isSupabaseConfigured, user: authUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewMsg, setShowNewMsg] = useState(false);
  const [newMsgSearch, setNewMsgSearch] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const [liveUsers, setLiveUsers] = useState<User[]>([]);
  const [searchingUsers, setSearchingUsers] = useState(false);
  const [startingConvo, setStartingConvo] = useState<string | null>(null);

  // AGI companion state
  const [agiMessages, setAgiMessages] = useState<Message[]>([getAgiWelcomeMessage()]);
  const [agiTyping, setAgiTyping] = useState(false);
  const agiConversation = {
    ...createAgiConversation(currentUser),
    lastMessage: agiMessages[agiMessages.length - 1],
  };

  // Search users for new message
  useEffect(() => {
    if (!showNewMsg || !newMsgSearch.trim()) { setLiveUsers([]); return; }
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setSearchingUsers(true);
      try {
        const supabase = getSupabase();
        const q = `%${newMsgSearch.trim()}%`;
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .or(`username.ilike.${q},display_name.ilike.${q}`)
          .neq('id', currentUser.id)
          .limit(15);
        if (!controller.signal.aborted && data) {
          setLiveUsers(data.map((p: any) => profileToUser(p)));
        }
      } catch {}
      if (!controller.signal.aborted) setSearchingUsers(false);
    }, 300);
    return () => { controller.abort(); clearTimeout(timeout); };
  }, [newMsgSearch, showNewMsg, isSupabaseConfigured, currentUser.id]);

  const allConvs = [agiConversation, ...conversations];

  const filteredConvs = searchQuery.trim()
    ? allConvs.filter(c => c.participants.some(p => p.displayName.toLowerCase().includes(searchQuery.toLowerCase())))
    : allConvs;

  const isAgiActive = activeConvId === 'conv-xbee-agi';
  const activeConv = isAgiActive ? agiConversation : conversations.find(c => c.id === activeConvId);
  const otherUser = isAgiActive ? agiBotUser : activeConv?.participants.find(p => p.id !== currentUser.id);

  // Users to show in new message modal — all users except self and AGI
  const newMsgUsers = newMsgSearch.trim()
    ? allUsers.filter(u =>
        u.id !== currentUser.id && u.id !== AGI_BOT_ID && (
          u.displayName.toLowerCase().includes(newMsgSearch.toLowerCase()) ||
          u.username.toLowerCase().includes(newMsgSearch.toLowerCase())
        )
      ).slice(0, 20)
    : [];

  // ─── OPEN OR CREATE A CONVERSATION ────────────────────────────
  const openConversationWith = (targetUser: User) => {
    const existingConv = conversations.find(c =>
      c.participants.some(p => p.id === targetUser.id)
    );
    if (existingConv) {
      setActiveConvId(existingConv.id);
    } else {
      // Create a fresh conversation with this user
      const greeting: Message = {
        id: `msg-${Date.now()}-greet`,
        senderId: targetUser.id,
        content: `Connected with ${targetUser.displayName} 👋 Say hello!`,
        type: 'text',
        createdAt: new Date().toISOString(),
        read: false,
        encrypted: true,
      };
      const newConv = addConversation([currentUser, targetUser], greeting);
      setActiveConvId(newConv.id);
    }
    setShowNewMsg(false);
    setNewMsgSearch('');
    setStartingConvo(null);
  };

  // ─── HANDLE CLICK ON USER ─────────────────────────────────────
  const handleUserClick = (user: User) => {
    const isConnected = canSendMessage(user.id);
    setStartingConvo(user.id);
    if (isConnected) {
      openConversationWith(user);
    } else {
      // Not connected — send connection request + message request
      sendConnectionRequest(user.id);
      sendMessageRequest(user.id, `Hi! Let's connect on Xbee! 👋`);
      // Open a conversation anyway so they can chat after acceptance
      openConversationWith(user);
    }
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
              <motion.button
                className={cn('p-2 rounded-full transition-colors relative', messageRequestUnread > 0 ? 'text-xbee-primary bg-xbee-primary/10' : 'hover:bg-theme-hover text-theme-secondary')}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowRequests(!showRequests)}
                title="Message Requests"
              >
                <Inbox className="w-5 h-5" />
                {messageRequestUnread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] bg-xbee-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                    {messageRequestUnread}
                  </span>
                )}
              </motion.button>
              <motion.button className="p-2 rounded-full hover:bg-theme-hover text-theme-secondary" whileTap={{ scale: 0.9 }} onClick={() => setShowSettings(!showSettings)} title="Settings">
                <Settings className="w-5 h-5" />
              </motion.button>
              <motion.button className="p-2 rounded-full hover:bg-theme-hover text-theme-secondary" whileTap={{ scale: 0.9 }} onClick={() => setShowNewMsg(true)} title="New Message">
                <PenSquare className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Message Requests Panel */}
          <AnimatePresence>
            {showRequests && (
              <motion.div className="border-t border-theme" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <div className="px-4 py-2 flex items-center gap-2 bg-xbee-primary/5">
                  <Inbox className="w-4 h-4 text-xbee-primary" />
                  <span className="text-xs font-bold text-xbee-primary">
                    Message Requests {messageRequestUnread > 0 && `(${messageRequestUnread})`}
                  </span>
                </div>
                {messageRequests.filter(r => !r.responded).length === 0 ? (
                  <div className="px-4 py-6 text-center">
                    <p className="text-xs text-theme-tertiary">No pending message requests</p>
                  </div>
                ) : (
                  messageRequests.filter(r => !r.responded).map(req => (
                    <div key={req.id} className="px-4 py-3 border-b border-theme bg-amber-500/5">
                      <div className="flex items-center gap-3">
                        <Avatar name={req.from.displayName} src={req.from.avatar} verified={req.from.verified} />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-theme-primary truncate">{req.from.displayName}</p>
                          <p className="text-xs text-theme-tertiary line-clamp-2">&ldquo;{req.content}&rdquo;</p>
                          <p className="text-[10px] text-theme-tertiary mt-0.5">
                            {connections.has(req.from.id) ? 'You are connected' : 'Not connected'}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <motion.button
                            className="p-2 rounded-full bg-xbee-success/20 text-xbee-success hover:bg-xbee-success/30 transition-colors"
                            whileTap={{ scale: 0.9 }}
                            onClick={() => acceptMessageRequest(req.id)}
                            title="Accept"
                          >
                            <Check className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            className="p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                            whileTap={{ scale: 0.9 }}
                            onClick={() => dismissMessageRequest(req.id)}
                            title="Dismiss"
                          >
                            <XIcon className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>

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
        {isAgiActive ? (
          <AgiChatWindow
            messages={agiMessages}
            setMessages={setAgiMessages}
            currentUser={currentUser}
            agiTyping={agiTyping}
            setAgiTyping={setAgiTyping}
            onBack={() => setActiveConvId(null)}
          />
        ) : activeConvId && otherUser ? (
          <ChatWindow otherUser={otherUser} conversation={activeConv} onBack={() => setActiveConvId(null)} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-xbee-primary/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-10 h-10 text-xbee-primary" />
              </div>
              <h2 className="text-2xl font-bold text-theme-primary mb-2">Select a message</h2>
              <p className="text-theme-secondary max-w-sm">Choose from your existing conversations or start a new one. Connected users chat instantly — everyone else gets a message request.</p>
              <motion.button className="xbee-button-primary mt-4" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setShowNewMsg(true); }}>
                New Message
              </motion.button>
            </div>
          </div>
        )}
      </div>

      {/* New Message Modal */}
      <AnimatePresence>
        {showNewMsg && (
          <motion.div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[10vh] p-4" role="dialog" aria-modal="true" aria-label="New message" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNewMsg(false)}>
            <motion.div className="glass-card w-full max-w-md max-h-[75vh] flex flex-col" initial={{ scale: 0.95, y: -20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: -20 }} onClick={(e) => e.stopPropagation()}>
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
                {!newMsgSearch.trim() ? (
                  <div className="text-center py-8 px-4">
                    <p className="text-sm text-theme-tertiary">Search for a person to message</p>
                    <div className="mt-4 flex items-center gap-2 justify-center text-xs text-theme-tertiary">
                      <UserCheck className="w-3.5 h-3.5 text-xbee-success" />
                      <span>Connected users open instantly</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 justify-center text-xs text-theme-tertiary">
                      <UserPlus className="w-3.5 h-3.5 text-xbee-primary" />
                      <span>New users get a connect + message request</span>
                    </div>
                  </div>
                ) : searchingUsers ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-5 h-5 animate-spin text-theme-tertiary mx-auto mb-2" />
                    <p className="text-sm text-theme-tertiary">Searching...</p>
                  </div>
                ) : newMsgUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-theme-tertiary">No users found</p>
                  </div>
                ) : (
                  <div>
                    {newMsgUsers.map((user) => {
                      const connStatus = getConnectionStatus(user.id);
                      const isConnected = connStatus === 'connected';
                      const isPending = connStatus === 'pending_sent';
                      return (
                        <motion.button
                          key={user.id}
                          className="flex items-center gap-3 w-full px-4 py-3 hover:bg-theme-hover transition-colors text-left"
                          onClick={() => handleUserClick(user)}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <Avatar name={user.displayName} src={user.avatar} verified={user.verified} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-sm text-theme-primary truncate">{user.displayName}</p>
                            </div>
                            <p className="text-xs text-theme-tertiary">@{user.username}</p>
                            <p className="text-[10px] text-theme-tertiary mt-0.5 line-clamp-1">{user.bio?.slice(0, 60) || 'No bio'}</p>
                          </div>
                          {startingConvo === user.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-xbee-primary shrink-0" />
                          ) : isConnected ? (
                            <span className="text-[10px] px-2.5 py-1 rounded-full bg-xbee-success/10 text-xbee-success font-bold shrink-0 whitespace-nowrap">
                              Chat now
                            </span>
                          ) : isPending ? (
                            <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 font-bold shrink-0 whitespace-nowrap">
                              Pending
                            </span>
                          ) : (
                            <span className="text-[10px] px-2.5 py-1 rounded-full bg-xbee-primary/10 text-xbee-primary font-bold shrink-0 whitespace-nowrap flex items-center gap-1">
                              <UserPlus className="w-3 h-3" /> Connect & Message
                            </span>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
