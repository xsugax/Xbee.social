'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Mic, Image, Sparkles, Shield, ArrowLeft,
  Phone, Video, MoreVertical, Bot, Languages, FileText,
  AlertTriangle, ShieldAlert, ShieldOff, ShieldCheck,
  Ghost, Clock, Camera, Timer, X
} from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import TrustBadge from '@/components/trust/TrustBadge';
import { Message, User, Conversation } from '@/types';
import { cn, formatTimeAgo } from '@/lib/utils';
import { currentUser, mockMessages } from '@/lib/mockData';
import Link from 'next/link';

interface ChatWindowProps {
  otherUser: User;
  conversation?: Conversation;
  onBack?: () => void;
}

const GHOST_TIMERS = [
  { label: '10s', seconds: 10 },
  { label: '1m', seconds: 60 },
  { label: '5m', seconds: 300 },
  { label: '1h', seconds: 3600 },
];

export default function ChatWindow({ otherUser, conversation, onBack }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [input, setInput] = useState('');
  const [showAI, setShowAI] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [safeModeEnabled, setSafeModeEnabled] = useState(conversation?.safeMode ?? false);
  const [ghostMode, setGhostMode] = useState(false);
  const [ghostTimer, setGhostTimer] = useState(10);
  const [showGhostPicker, setShowGhostPicker] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [dynamicSuggestions, setDynamicSuggestions] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const isHighRisk = conversation?.riskLevel === 'warning';
  const hasScamAlerts = (conversation?.scamAlerts?.length ?? 0) > 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      content: input,
      type: 'text',
      createdAt: new Date().toISOString(),
      read: false,
      encrypted: true,
      ...(ghostMode ? {
        ghost: {
          enabled: true,
          expiresIn: ghostTimer,
          expiresAt: new Date(Date.now() + ghostTimer * 1000).toISOString(),
        },
      } : {}),
    };
    setMessages([...messages, newMsg]);
    setInput('');

    setIsTyping(true);
    
    // Use AI endpoint for smart responses
    fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    })
      .then(res => res.json())
      .then(data => {
        setIsTyping(false);
        const reply: Message = {
          id: `msg-${Date.now() + 1}`,
          senderId: otherUser.id,
          content: data.response || "That sounds great! Let me think about it.",
          type: 'text',
          createdAt: new Date().toISOString(),
          read: false,
          encrypted: true,
        };
        setMessages(prev => [...prev, reply]);
        if (data.suggestions) {
          setDynamicSuggestions(data.suggestions);
        }
      })
      .catch(() => {
        setIsTyping(false);
        const replies = [
          "That's a great point! I'd love to explore that further. 💫",
          "Interesting perspective! Let me think on that and get back to you.",
          "Love this idea! Can we jam on it later this week? 🚀",
          "Thanks for sharing — really resonates with what I've been working on.",
          "100% agree. The industry is moving fast and we need to stay ahead.",
        ];
        const reply: Message = {
          id: `msg-${Date.now() + 1}`,
          senderId: otherUser.id,
          content: replies[Math.floor(Math.random() * replies.length)],
          type: 'text',
          createdAt: new Date().toISOString(),
          read: false,
          encrypted: true,
        };
        setMessages(prev => [...prev, reply]);
      });
  };

  const aiSuggestions = dynamicSuggestions.length > 0 ? dynamicSuggestions : [
    "Sounds good! Let's discuss further 🎉",
    "Tell me more about the trust algorithm",
    "How does Xbee's verification work?",
    "What AI features are built in?",
  ];

  const chatSummary = `${otherUser.displayName} and you discussed a project collaboration. Key topics: CRDTs, real-time features, demo scheduling. Action item: Sync tomorrow at 10am.`;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={cn(
        'glass border-b px-4 py-3 flex items-center justify-between shrink-0',
        isHighRisk ? 'border-orange-500/30' : 'border-theme',
      )}>
        <div className="flex items-center gap-3">
          {onBack && (
            <motion.button
              className="p-1.5 rounded-full hover:bg-theme-hover transition-colors lg:hidden"
              onClick={onBack}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowLeft className="w-5 h-5 text-theme-primary" />
            </motion.button>
          )}
          <Link href={`/profile?user=${otherUser.id}`}>
            <Avatar name={otherUser.displayName} src={otherUser.avatar} verified={otherUser.verified} online />
          </Link>
          <div>
            <div className="flex items-center gap-1.5">
              <Link href={`/profile?user=${otherUser.id}`} className="font-bold text-sm text-theme-primary hover:underline">{otherUser.displayName}</Link>
              <TrustBadge
                score={otherUser.trust.score}
                tier={otherUser.trust.tier}
                size="sm"
                showScore
                verification={otherUser.verification}
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-xbee-success">Online</span>
              <Shield className="w-3 h-3 text-xbee-success" />
              <span className="text-xs text-xbee-success">Encrypted</span>
              {isHighRisk && (
                <>
                  <span className="text-xs text-orange-400">•</span>
                  <AlertTriangle className="w-3 h-3 text-orange-400" />
                  <span className="text-xs text-orange-400">High Risk</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {/* Ghost Mode toggle */}
          <div className="relative">
            <motion.button
              className={cn(
                'p-2 rounded-full transition-colors',
                ghostMode ? 'bg-purple-500/20 text-purple-400' : 'hover:bg-theme-hover text-theme-secondary',
              )}
              onClick={() => setShowGhostPicker(!showGhostPicker)}
              whileTap={{ scale: 0.9 }}
              title="Ghost Mode"
            >
              <Ghost className="w-5 h-5" />
            </motion.button>

            {/* Ghost timer picker */}
            <AnimatePresence>
              {showGhostPicker && (
                <motion.div
                  className="absolute right-0 top-12 glass-card w-52 p-3 z-30"
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <Ghost className="w-4 h-4 text-purple-400" />
                      <span className="text-xs font-bold text-theme-primary">Ghost Mode</span>
                    </div>
                    <div className={cn(
                      'w-8 h-4.5 rounded-full relative cursor-pointer transition-colors',
                      ghostMode ? 'bg-purple-500' : 'bg-theme-tertiary',
                    )} onClick={() => setGhostMode(!ghostMode)}>
                      <div className={cn(
                        'w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform',
                        ghostMode ? 'translate-x-[16px]' : 'translate-x-0.5',
                      )} />
                    </div>
                  </div>
                  <p className="text-[10px] text-theme-tertiary mb-2">Messages auto-delete after:</p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {GHOST_TIMERS.map(({ label, seconds }) => (
                      <motion.button
                        key={seconds}
                        className={cn(
                          'py-1.5 rounded-lg text-[11px] font-bold transition-colors',
                          ghostTimer === seconds && ghostMode
                            ? 'bg-purple-500 text-white'
                            : 'bg-theme-hover text-theme-secondary hover:text-theme-primary',
                        )}
                        onClick={() => { setGhostTimer(seconds); setGhostMode(true); }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {label}
                      </motion.button>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-theme">
                    <Camera className="w-3 h-3 text-purple-400" />
                    <span className="text-[10px] text-purple-400">Screenshot detection active</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Safe Mode toggle */}
          <motion.button
            className={cn(
              'p-2 rounded-full transition-colors',
              safeModeEnabled ? 'bg-orange-500/20 text-orange-400' : 'hover:bg-theme-hover text-theme-secondary',
            )}
            onClick={() => setSafeModeEnabled(!safeModeEnabled)}
            whileTap={{ scale: 0.9 }}
            title={safeModeEnabled ? 'Safe Mode ON' : 'Safe Mode OFF'}
          >
            {safeModeEnabled ? <ShieldAlert className="w-5 h-5" /> : <ShieldOff className="w-5 h-5" />}
          </motion.button>
          <motion.button className="p-2 rounded-full hover:bg-theme-hover text-theme-secondary" whileTap={{ scale: 0.9 }}>
            <Phone className="w-5 h-5" />
          </motion.button>
          <motion.button className="p-2 rounded-full hover:bg-theme-hover text-theme-secondary" whileTap={{ scale: 0.9 }}>
            <Video className="w-5 h-5" />
          </motion.button>
          <motion.button className="p-2 rounded-full hover:bg-theme-hover text-theme-secondary" whileTap={{ scale: 0.9 }}>
            <MoreVertical className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Ghost Mode active banner */}
      <AnimatePresence>
        {ghostMode && (
          <motion.div
            className="px-4 py-2 bg-purple-500/10 border-b border-purple-500/20 flex items-center justify-between"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center gap-2">
              <Ghost className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-purple-400 font-medium">
                Ghost Mode — messages vanish after {GHOST_TIMERS.find(t => t.seconds === ghostTimer)?.label}
              </span>
            </div>
            <button onClick={() => setGhostMode(false)}>
              <X className="w-3.5 h-3.5 text-purple-400 hover:text-purple-300" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scam alert banner */}
      <AnimatePresence>
        {hasScamAlerts && !safeModeEnabled && (
          <motion.div
            className="px-4 py-3 bg-orange-500/10 border-b border-orange-500/20 flex items-start gap-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-bold text-orange-400">Scam Risk Detected</p>
              <p className="text-xs text-orange-300 mt-0.5">
                {conversation?.scamAlerts[0]?.message}
              </p>
              <button
                className="text-xs text-orange-400 hover:text-orange-300 underline mt-1"
                onClick={() => setSafeModeEnabled(true)}
              >
                Enable Safe Mode →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Safe mode banner */}
      <AnimatePresence>
        {safeModeEnabled && (
          <motion.div
            className="px-4 py-2 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center gap-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-emerald-400 font-medium">Safe Mode ON — Links are disabled, media is hidden, AI is monitoring</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Chat Summary */}
      <AnimatePresence>
        {showSummary && (
          <motion.div
            className="px-4 py-3 bg-xbee-secondary/5 border-b border-theme"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-start gap-2">
              <Bot className="w-4 h-4 text-xbee-secondary shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-bold text-xbee-secondary mb-1">AI Summary</p>
                <p className="text-xs text-theme-secondary leading-relaxed">{chatSummary}</p>
              </div>
              <button onClick={() => setShowSummary(false)}>
                <X className="w-3.5 h-3.5 text-theme-tertiary" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-xbee-success/10 border border-xbee-success/20">
            <Shield className="w-4 h-4 text-xbee-success" />
            <span className="text-xs text-xbee-success font-medium">Messages are end-to-end encrypted</span>
          </div>
        </div>

        {messages.map((msg, idx) => {
          const isMe = msg.senderId === currentUser.id;
          const isSystemWarning = msg.type === 'scam_warning';
          const hasScamFlag = !!msg.scamAlert;
          const isGhost = !!msg.ghost?.enabled;

          if (isSystemWarning) {
            return (
              <motion.div
                key={msg.id}
                className="flex justify-center"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
              >
                <div className="max-w-[85%] px-4 py-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                  <div className="flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-orange-300 leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              </motion.div>
            );
          }

          return (
            <motion.div
              key={msg.id}
              className={cn('flex', isMe ? 'justify-end' : 'justify-start')}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: idx * 0.03 }}
            >
              <div className="relative">
                {hasScamFlag && safeModeEnabled && (
                  <div className="absolute -top-2 left-0 right-0 flex justify-center z-10">
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-red-500/90 text-white font-bold">
                      ⚠ FLAGGED
                    </span>
                  </div>
                )}
                {isGhost && (
                  <div className="absolute -top-2 right-2 flex items-center z-10">
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-500/90 text-white font-bold flex items-center gap-0.5">
                      <Ghost className="w-2.5 h-2.5" /> {GHOST_TIMERS.find(t => t.seconds === msg.ghost!.expiresIn)?.label || `${msg.ghost!.expiresIn}s`}
                    </span>
                  </div>
                )}
                <div className={cn(
                  'max-w-[75%] px-4 py-2.5 rounded-2xl',
                  isMe
                    ? 'bg-xbee-primary text-white rounded-br-md'
                    : 'bg-theme-tertiary text-theme-primary rounded-bl-md',
                  hasScamFlag && 'border-2 border-orange-500/50',
                  hasScamFlag && safeModeEnabled && 'opacity-60 blur-[1px]',
                  isGhost && 'border border-purple-500/30',
                )}>
                  <p className="text-[15px] leading-relaxed">{msg.content}</p>
                  <div className={cn(
                    'flex items-center justify-end gap-1.5 mt-1',
                    isMe ? 'text-blue-200' : 'text-theme-tertiary'
                  )}>
                    {isGhost && <Timer className="w-3 h-3" />}
                    <span className="text-[11px]">{formatTimeAgo(msg.createdAt)}</span>
                  </div>
                </div>
                {hasScamFlag && !safeModeEnabled && (
                  <div className="mt-1 px-2 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-orange-400" />
                    <span className="text-[10px] text-orange-400">{msg.scamAlert?.message}</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="bg-theme-tertiary px-4 py-3 rounded-2xl rounded-bl-md">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-theme-secondary animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-theme-secondary animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-theme-secondary animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* AI Suggestions */}
      <AnimatePresence>
        {showAI && (
          <motion.div
            className="px-4 py-2 border-t border-theme"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Bot className="w-3.5 h-3.5 text-xbee-secondary" />
              <span className="text-[10px] font-bold text-xbee-secondary">AI Smart Replies</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
              {aiSuggestions.map((suggestion, i) => (
                <motion.button
                  key={i}
                  className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium bg-xbee-secondary/10 text-xbee-secondary hover:bg-xbee-secondary/20 transition-colors"
                  onClick={() => setInput(suggestion)}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className={cn(
        'border-t px-4 py-3 shrink-0',
        ghostMode ? 'border-purple-500/30 bg-purple-500/[0.02]' : 'border-theme',
      )}>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            <motion.button className="p-2 rounded-full hover:bg-theme-hover text-xbee-primary" whileTap={{ scale: 0.9 }}>
              <Image className="w-5 h-5" />
            </motion.button>
            <motion.button className="p-2 rounded-full hover:bg-theme-hover text-xbee-primary" whileTap={{ scale: 0.9 }}>
              <Mic className="w-5 h-5" />
            </motion.button>
          </div>
          <div className="relative flex-1">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder={ghostMode ? '👻 Ghost message...' : 'Type a message...'}
              className={cn(
                'w-full bg-theme-tertiary text-theme-primary rounded-full px-4 py-2.5 text-sm placeholder:text-theme-tertiary outline-none focus:ring-2 transition-all',
                ghostMode ? 'focus:ring-purple-500/30 border border-purple-500/20' : 'focus:ring-xbee-primary/30',
              )}
            />
          </div>
          <div className="flex items-center gap-0.5">
            <motion.button
              className={cn(
                'p-2 rounded-full transition-colors',
                showAI ? 'bg-xbee-secondary/20 text-xbee-secondary' : 'hover:bg-theme-hover text-theme-secondary'
              )}
              onClick={() => setShowAI(!showAI)}
              whileTap={{ scale: 0.9 }}
              title="AI Smart Replies"
            >
              <Sparkles className="w-5 h-5" />
            </motion.button>
            <motion.button
              className={cn(
                'p-2 rounded-full transition-colors',
                input.trim() ? 'text-xbee-primary hover:bg-xbee-primary/10' : 'text-theme-tertiary'
              )}
              onClick={handleSend}
              whileTap={{ scale: 0.9 }}
              disabled={!input.trim()}
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-2 px-2">
          <button className="flex items-center gap-1 text-xs text-theme-tertiary hover:text-xbee-primary transition-colors">
            <Languages className="w-3.5 h-3.5" /> Translate
          </button>
          <button
            className="flex items-center gap-1 text-xs text-theme-tertiary hover:text-xbee-secondary transition-colors"
            onClick={() => setShowSummary(!showSummary)}
          >
            <FileText className="w-3.5 h-3.5" /> Summarize chat
          </button>
          {otherUser.trust.score < 50 && (
            <span className="flex items-center gap-1 text-[10px] text-orange-400 ml-auto">
              <AlertTriangle className="w-3 h-3" /> AI monitoring this chat
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
