'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, X, Send, Users, ArrowLeft, Search,
  Smile, UserPlus
} from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import { useApp } from '@/context/AppContext';
import { cn, formatTimeAgo } from '@/lib/utils';
import { User, Message } from '@/types';

const EMOJI_QUICK = ['😀','😂','❤️','🔥','👏','🎉','💡','🚀','✨','😍','🤔','👀','💪','🙌','😎','🤝','💯','⭐','🎯','✅','🐝','💛','🙃','😤','🫡','🥳','💀','🤡','🫶','👍','👎','👊','✌️'];

export default function QuickMsgBubble() {
  const {
    conversations, getMessages, sendMessage, addReply, addConversation,
    currentUser, allUsers, getConnectionStatus,
    sendConnectionRequest, connections, pendingSent
  } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'list' | 'chat' | 'new'>('list');
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [isTypingMock, setIsTypingMock] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeConv = activeConvId ? conversations.find(c => c.id === activeConvId) : null;
  const otherUser = activeConv ? activeConv.participants.find(p => p.id !== currentUser.id) : null;
  const messages = activeConvId ? getMessages(activeConvId) : [];
  const unreadTotal = conversations.reduce((s, c) => s + c.unreadCount, 0);

  // Filter conversations with actual messages
  const validConvs = useMemo(() =>
    conversations.filter(c => getMessages(c.id).length > 0 || c.lastMessage.content !== 'No messages yet'),
    [conversations, getMessages]
  );

  const searchedUsers = useMemo(() => {
    if (!userSearch.trim()) return [];
    const existingIds = new Set(conversations.flatMap(c => c.participants.map(p => p.id)));
    return allUsers
      .filter(u => u.id !== currentUser.id && !existingIds.has(u.id))
      .filter(u =>
        u.displayName.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.username.toLowerCase().includes(userSearch.toLowerCase())
      ).slice(0, 10);
  }, [userSearch, conversations, allUsers, currentUser.id]);

  const filteredConvs = useMemo(() => {
    if (!userSearch.trim()) return validConvs;
    const q = userSearch.toLowerCase();
    return validConvs.filter(c =>
      c.participants.some(p => p.id !== currentUser.id &&
        (p.displayName.toLowerCase().includes(q) || p.username.toLowerCase().includes(q)))
    );
  }, [validConvs, userSearch, currentUser.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, activeConvId]);

  useEffect(() => {
    if (view === 'chat' && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [view]);

  const handleOpenChat = (convId: string) => {
    setActiveConvId(convId);
    setView('chat');
    setInput('');
  };

  const handleSend = () => {
    if (!input.trim() || !activeConvId) return;
    sendMessage(activeConvId, input.trim());
    setInput('');
    setIsTypingMock(true);
    setTimeout(() => {
      setIsTypingMock(false);
      if (otherUser) {
        const replies = [
          "That's a great point! Let me think about it.",
          "I see what you mean! Totally agree.",
          "Interesting perspective — thanks for sharing!",
          "Let's chat more about this soon!",
          "Exactly what I was thinking! 🎯",
        ];
        const reply: Message = {
          id: `qmsg-${Date.now()}`,
          senderId: otherUser.id,
          content: replies[Math.floor(Math.random() * replies.length)],
          type: 'text',
          createdAt: new Date().toISOString(),
          read: false,
          encrypted: true,
        };
        addReply(activeConvId, reply);
      }
    }, 600 + Math.random() * 900);
  };

  const handleStartNewChat = (user: User) => {
    const existingConv = conversations.find(c =>
      c.participants.some(p => p.id === user.id)
    );
    if (existingConv) {
      handleOpenChat(existingConv.id);
      setUserSearch('');
      return;
    }
    // Create new conversation via addConversation
    const firstMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      content: 'Hey! 👋',
      type: 'text',
      createdAt: new Date().toISOString(),
      read: false,
      encrypted: true,
    };
    const newConv = addConversation([currentUser, user], firstMsg);
    setActiveConvId(newConv.id);
    setView('chat');
    setUserSearch('');
    // Simulate a reply
    setTimeout(() => {
      const r: Message = {
        id: `qmsg-${Date.now()}`,
        senderId: user.id,
        content: 'Hey! Great to connect! 😊',
        type: 'text',
        createdAt: new Date().toISOString(),
        read: false,
        encrypted: true,
      };
      addReply(newConv.id, r);
    }, 800);
  };

  const handleClose = () => {
    setIsOpen(false);
    setView('list');
    setActiveConvId(null);
    setInput('');
    setUserSearch('');
  };

  return (
    <>
      {/* FAB Bubble */}
      <motion.button
        className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full bg-xbee-primary shadow-glow flex items-center justify-center"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        animate={{ boxShadow: ['0 0 0 0 rgba(59,130,246,0.4)', '0 0 0 16px rgba(59,130,246,0)', '0 0 0 0 rgba(59,130,246,0.4)'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <div className="relative">
            <MessageCircle className="w-6 h-6 text-white" />
            {unreadTotal > 0 && (
              <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold px-1">
                {unreadTotal > 9 ? '9+' : unreadTotal}
              </span>
            )}
          </div>
        )}
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-40 right-6 z-50 w-[360px] max-w-[calc(100vw-32px)] h-[520px] max-h-[calc(100vh-200px)] glass-card overflow-hidden flex flex-col"
            initial={{ opacity: 0, y: 20, scale: 0.95, originX: 1, originY: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            {/* Header */}
            <div className="shrink-0 px-4 py-3 border-b border-theme flex items-center justify-between bg-theme-primary">
              {view === 'chat' ? (
                <div className="flex items-center gap-2">
                  <motion.button className="p-1 rounded-lg hover:bg-theme-hover" onClick={() => { setView('list'); setActiveConvId(null); setInput(''); }} whileTap={{ scale: 0.9 }}>
                    <ArrowLeft className="w-4 h-4 text-theme-secondary" />
                  </motion.button>
                  <div className="flex items-center gap-2">
                    {otherUser && (
                      <>
                        <Avatar name={otherUser.displayName} src={otherUser.avatar} size="xs" verified={otherUser.verified} />
                        <div>
                          <p className="text-sm font-bold text-theme-primary leading-tight">{otherUser.displayName}</p>
                          <p className="text-[10px] text-theme-tertiary">@{otherUser.username}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-xbee-primary" />
                  <span className="text-base font-black text-theme-primary">Quick Chat</span>
                  {unreadTotal > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-xbee-primary text-white font-bold">{unreadTotal}</span>
                  )}
                </div>
              )}
              <div className="flex items-center gap-1">
                {view === 'list' && (
                  <motion.button
                    className="p-1.5 rounded-lg hover:bg-theme-hover text-theme-secondary"
                    onClick={() => setView('new')}
                    whileTap={{ scale: 0.9 }}
                    title="New conversation"
                  >
                    <Users className="w-4 h-4" />
                  </motion.button>
                )}
                <motion.button className="p-1.5 rounded-lg hover:bg-theme-hover text-theme-secondary" onClick={handleClose} whileTap={{ scale: 0.9 }}>
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Search */}
            <div className="shrink-0 px-3 py-2 border-b border-theme">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-theme-tertiary" />
                <input
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder={view === 'new' ? 'Search users to message...' : 'Search conversations...'}
                  className="w-full bg-theme-tertiary rounded-full pl-9 pr-3 py-2 text-xs text-theme-primary placeholder:text-theme-tertiary outline-none focus:ring-1 focus:ring-xbee-primary/30"
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {view === 'list' && (
                <div>
                  {filteredConvs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-10 px-6 text-center">
                      <div className="w-12 h-12 rounded-2xl bg-theme-hover flex items-center justify-center mb-3">
                        <MessageCircle className="w-6 h-6 text-theme-tertiary opacity-40" />
                      </div>
                      <p className="text-sm font-bold text-theme-primary mb-1">No conversations yet</p>
                      <p className="text-xs text-theme-tertiary mb-4">Start a chat with someone from your network</p>
                      <motion.button className="px-4 py-2 rounded-full bg-xbee-primary text-white text-xs font-bold" onClick={() => setView('new')} whileTap={{ scale: 0.95 }}>
                        Start New Chat
                      </motion.button>
                    </div>
                  ) : (
                    filteredConvs.map((conv) => {
                      const other = conv.participants.find(p => p.id !== currentUser.id);
                      if (!other) return null;
                      const msgs = getMessages(conv.id);
                      const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1] : conv.lastMessage;
                      return (
                        <motion.button key={conv.id} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-theme-hover transition-colors text-left" onClick={() => handleOpenChat(conv.id)} whileTap={{ scale: 0.99 }}>
                          <Avatar name={other.displayName} src={other.avatar} size="sm" verified={other.verified} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-theme-primary truncate">{other.displayName}</span>
                              <span className="text-[10px] text-theme-tertiary shrink-0 ml-2">{formatTimeAgo(lastMsg.createdAt)}</span>
                            </div>
                            <p className={cn('text-xs truncate mt-0.5', conv.unreadCount > 0 ? 'text-theme-primary font-medium' : 'text-theme-tertiary')}>
                              {lastMsg.content.length > 40 ? lastMsg.content.slice(0, 40) + '...' : lastMsg.content}
                            </p>
                          </div>
                          {conv.unreadCount > 0 && (
                            <span className="min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-xbee-primary text-white text-[9px] font-bold shrink-0">{conv.unreadCount}</span>
                          )}
                        </motion.button>
                      );
                    })
                  )}
                </div>
              )}

              {view === 'chat' && (
                <div className="flex flex-col h-full">
                  <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-hide">
                    {messages.length === 0 && (
                      <div className="text-center py-6">
                        <MessageCircle className="w-8 h-8 text-theme-tertiary mx-auto mb-2 opacity-40" />
                        <p className="text-xs text-theme-tertiary">Start the conversation!</p>
                      </div>
                    )}
                    {messages.map((msg, idx) => {
                      const isMe = msg.senderId === currentUser.id;
                      const isSystem = msg.type === 'scam_warning' || msg.type === 'system';
                      if (isSystem) return (
                        <div key={msg.id} className="flex justify-center">
                          <div className="px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 max-w-[80%]">
                            <p className="text-[11px] text-orange-300 text-center">{msg.content}</p>
                          </div>
                        </div>
                      );
                      return (
                        <motion.div key={msg.id} className={cn('flex', isMe ? 'justify-end' : 'justify-start')} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }}>
                          <div className={cn('max-w-[80%] px-3 py-2 rounded-2xl', isMe ? 'bg-xbee-primary text-white rounded-br-md' : 'bg-theme-tertiary text-theme-primary rounded-bl-md')}>
                            <p className="text-[13px] leading-relaxed">{msg.content}</p>
                            <div className={cn('flex items-center justify-end mt-0.5', isMe ? 'text-blue-200' : 'text-theme-tertiary')}>
                              <span className="text-[9px]">{formatTimeAgo(msg.createdAt)}</span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                    {isTypingMock && (
                      <div className="flex justify-start">
                        <div className="bg-theme-tertiary px-3 py-2 rounded-2xl rounded-bl-md">
                          <div className="flex items-center gap-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-theme-secondary animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-1.5 h-1.5 rounded-full bg-theme-secondary animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-1.5 h-1.5 rounded-full bg-theme-secondary animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={bottomRef} />
                  </div>
                  <AnimatePresence>
                    {showEmoji && (
                      <motion.div className="shrink-0 px-3 py-2 border-t border-theme bg-theme-primary" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                        <div className="grid grid-cols-10 gap-0.5">
                          {EMOJI_QUICK.map((e) => (
                            <button key={e} className="p-1 hover:bg-theme-hover rounded text-base" onClick={() => { setInput(prev => prev + e); inputRef.current?.focus(); }}>{e}</button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="shrink-0 px-3 py-2 border-t border-theme bg-theme-primary">
                    <div className="flex items-center gap-2">
                      <motion.button className="p-1.5 rounded-full hover:bg-theme-hover text-theme-secondary shrink-0" onClick={() => setShowEmoji(!showEmoji)} whileTap={{ scale: 0.9 }}>
                        <Smile className="w-4 h-4" />
                      </motion.button>
                      <div className="flex-1 flex items-center bg-theme-tertiary rounded-full px-3 py-1.5">
                        <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }} placeholder="Type a message..." className="flex-1 bg-transparent text-xs text-theme-primary placeholder:text-theme-tertiary outline-none" />
                      </div>
                      <motion.button className={cn('p-1.5 rounded-full shrink-0', input.trim() ? 'text-xbee-primary' : 'text-theme-tertiary')} onClick={handleSend} whileTap={{ scale: 0.85 }} disabled={!input.trim()}>
                        <Send className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              )}

              {view === 'new' && (
                <div>
                  {searchedUsers.length === 0 && userSearch.trim() === '' && (
                    <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
                      <Users className="w-10 h-10 text-theme-tertiary opacity-40 mb-3" />
                      <p className="text-sm font-bold text-theme-primary mb-1">Start a new conversation</p>
                      <p className="text-xs text-theme-tertiary">Search for someone to chat with</p>
                    </div>
                  )}
                  {searchedUsers.length === 0 && userSearch.trim() !== '' && (
                    <div className="text-center py-8"><p className="text-xs text-theme-tertiary">No users found matching "{userSearch}"</p></div>
                  )}
                  {searchedUsers.map((user) => {
                    const connStatus = getConnectionStatus(user.id);
                    return (
                      <motion.button key={user.id} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-theme-hover transition-colors text-left" onClick={() => handleStartNewChat(user)} whileTap={{ scale: 0.99 }} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
                        <Avatar name={user.displayName} src={user.avatar} size="sm" verified={user.verified} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-theme-primary truncate">{user.displayName}</span>
                            <span className="text-[10px] text-theme-tertiary">@{user.username}</span>
                          </div>
                          <p className="text-[10px] text-theme-tertiary truncate">{user.bio?.slice(0, 60)}</p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-xbee-primary/10 text-xbee-primary font-medium shrink-0">
                          {connStatus === 'connected' ? 'Connected' : connStatus === 'pending_sent' ? 'Pending' : 'Message'}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
