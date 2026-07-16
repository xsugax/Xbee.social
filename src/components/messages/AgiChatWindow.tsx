'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Brain, Send, ArrowLeft, Globe, Crown, Network, TrendingUp, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Message, User } from '@/types';
import { AGI_BOT_ID } from '@/lib/agiBot';
import { xbeeBrain, userLearning } from '@/lib/xbeeBrain';

interface AgiChatWindowProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  currentUser: User;
  agiTyping: boolean;
  setAgiTyping: (v: boolean) => void;
  onBack: () => void;
}

const QUICK_PROMPTS = [
  'Write me a post',
  'Help me with code',
  'Translate something',
  'Give me ideas',
];

export default function AgiChatWindow({
  messages, setMessages, currentUser, agiTyping, setAgiTyping, onBack,
}: AgiChatWindowProps) {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, agiTyping]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: Message = {
      id: `agi-u-${Date.now()}`,
      senderId: currentUser.id,
      content: text,
      type: 'text',
      createdAt: new Date().toISOString(),
      read: true,
      encrypted: false,
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setAgiTyping(true);

    // Use the superhuman brain with web search + feeling analysis + master command support
    try {
      const result = await xbeeBrain.think(text, currentUser.id, currentUser.displayName);
      const botMsg: Message = {
        id: `agi-b-${Date.now()}`,
        senderId: AGI_BOT_ID,
        content: result.response,
        type: 'text',
        createdAt: new Date().toISOString(),
        read: true,
        encrypted: false,
      };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      // Fallback to fast think on error
      const result = xbeeBrain.thinkFast(text);
      const botMsg: Message = {
        id: `agi-b-${Date.now()}`,
        senderId: AGI_BOT_ID,
        content: result.response,
        type: 'text',
        createdAt: new Date().toISOString(),
        read: true,
        encrypted: false,
      };
      setMessages(prev => [...prev, botMsg]);
    }
    setAgiTyping(false);
  }, [input, currentUser, setMessages, setAgiTyping]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-theme glass shrink-0">
        <motion.button
          className="p-1.5 rounded-full hover:bg-theme-hover lg:hidden"
          onClick={onBack}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft className="w-5 h-5 text-theme-primary" />
        </motion.button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-xbee-primary via-xbee-secondary to-xbee-accent flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm text-theme-primary">Xbee AGI</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-xbee-primary/20 text-xbee-primary">AI</span>
          </div>
          <p className="text-xs text-emerald-400">Always online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map(msg => {
          const isMe = msg.senderId === currentUser.id;
          return (
            <motion.div
              key={msg.id}
              className={cn('flex', isMe ? 'justify-end' : 'justify-start')}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {!isMe && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-xbee-primary to-xbee-secondary flex items-center justify-center mr-2 shrink-0 mt-1">
                  <Brain className="w-3.5 h-3.5 text-white" />
                </div>
              )}
              <div
                className={cn(
                  'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap',
                  isMe
                    ? 'bg-xbee-primary text-white rounded-br-sm'
                    : 'bg-theme-hover text-theme-primary rounded-bl-sm',
                )}
              >
                {msg.content}
              </div>
            </motion.div>
          );
        })}
        {agiTyping && (
          <motion.div className="flex justify-start" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-xbee-primary to-xbee-secondary flex items-center justify-center mr-2 shrink-0">
              <Brain className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="bg-theme-hover rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-theme-tertiary animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-theme-tertiary animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-theme-tertiary animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts on first message */}
      {messages.length <= 1 && (
        <div className="px-4 py-2 border-t border-theme flex gap-2 overflow-x-auto scrollbar-hide">
          {QUICK_PROMPTS.map(prompt => (
            <button
              key={prompt}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium bg-xbee-primary/10 text-xbee-primary hover:bg-xbee-primary/20 transition-colors"
              onClick={() => setInput(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="border-t border-theme px-4 py-3 shrink-0">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Ask Xbee AGI anything..."
            className="flex-1 bg-theme-tertiary text-theme-primary rounded-full px-4 py-2.5 text-sm placeholder:text-theme-tertiary outline-none focus:ring-2 focus:ring-xbee-primary/30 transition-all"
          />
          <motion.button
            className={cn(
              'p-2.5 rounded-full transition-colors',
              input.trim() ? 'bg-xbee-primary text-white' : 'text-theme-tertiary bg-theme-hover',
            )}
            onClick={handleSend}
            whileTap={{ scale: 0.9 }}
            disabled={!input.trim()}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
